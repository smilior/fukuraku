/**
 * Supabase クライアント（ブラウザ用）
 * クライアントコンポーネント / Client-side でのみ使用
 * - anon キーを使用（RLS が適用される）
 * - service_role キーは絶対に使わない
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
