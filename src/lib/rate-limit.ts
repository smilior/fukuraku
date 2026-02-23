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
    if (entry.resetAt < now) store.delete(key)
  }
}

const TYPE_CONFIG = {
  ocr:     { maxRequests: 10, windowMs: 60_000 },
  stripe:  { maxRequests: 5,  windowMs: 60_000 },
  account: { maxRequests: 3,  windowMs: 3_600_000 },
} as const

export async function rateLimit(
  identifier: string,
  { maxRequests, windowMs }: { maxRequests?: number; windowMs?: number } = {},
  type: 'ocr' | 'stripe' | 'account' = 'ocr',
): Promise<{ success: boolean; remaining: number }> {
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
