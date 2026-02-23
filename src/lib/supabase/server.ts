/**
 * Supabase クライアント（サーバー用）
 * Server Components / API Routes / Server Actions でのみ使用
 * - anon キーを使用（RLS が適用される）
 * - 認証ユーザーのセッションを Cookie から読み取る
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components からの呼び出し時は set が失敗することがある（無視してよい）
          }
        },
      },
    }
  )
}

/**
 * Supabase 管理クライアント（service_role キー使用）
 * Stripe Webhook など、RLS をバイパスする必要がある処理のみで使用
 * 絶対にクライアントサイドで呼ばない
 */
export function createServiceClient() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js') as typeof import('@supabase/supabase-js')
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
