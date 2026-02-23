/**
 * Rate limiter with Upstash Redis support and in-memory fallback.
 * Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars to enable Redis.
 * Without those vars, falls back to in-memory (suitable for dev / single-instance).
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// --- Upstash Redis rate limiters (created lazily if env vars are set) ---
let ratelimitOcr: Ratelimit | null = null
let ratelimitStripe: Ratelimit | null = null
let ratelimitAccount: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = Redis.fromEnv()
  ratelimitOcr = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'rl:ocr',
  })
  ratelimitStripe = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'rl:stripe',
  })
  ratelimitAccount = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'rl:account',
  })
}

// --- In-memory fallback ---
interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

let lastCleanup = Date.now()
function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}

const TYPE_CONFIG = {
  ocr: { maxRequests: 10, windowMs: 60_000 },
  stripe: { maxRequests: 5, windowMs: 60_000 },
  account: { maxRequests: 3, windowMs: 3_600_000 },
} as const

export async function rateLimit(
  identifier: string,
  { maxRequests, windowMs }: { maxRequests?: number; windowMs?: number } = {},
  type: 'ocr' | 'stripe' | 'account' = 'ocr',
): Promise<{ success: boolean; remaining: number }> {
  // Try Upstash first
  const upstashLimiter = type === 'ocr' ? ratelimitOcr : type === 'stripe' ? ratelimitStripe : ratelimitAccount
  if (upstashLimiter) {
    const { success, remaining } = await upstashLimiter.limit(identifier)
    return { success, remaining }
  }

  // Fallback to in-memory
  cleanup()

  const config = TYPE_CONFIG[type]
  const max = maxRequests ?? config.maxRequests
  const window = windowMs ?? config.windowMs

  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || entry.resetAt < now) {
    store.set(identifier, { count: 1, resetAt: now + window })
    return { success: true, remaining: max - 1 }
  }

  entry.count++
  if (entry.count > max) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: max - entry.count }
}
