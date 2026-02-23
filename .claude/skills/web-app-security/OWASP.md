# OWASP Top 10 対策（Next.js + Supabase）

## A01: Broken Access Control（アクセス制御の不備）

**リスク**: 他のユーザーの確定申告データや収入情報にアクセスされる

**対策 1: Supabase RLS**（[RLS.md](./RLS.md) 参照）

**対策 2: Next.js Middleware による認証チェック**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要なパスの定義
  const protectedPaths = ['/dashboard', '/receipts', '/income', '/expenses', '/tax', '/settings']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**対策 3: API Route での認証検証**

```typescript
// app/api/incomes/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS が適用されるため、自動的に user のデータのみ取得される
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

---

## A02: Cryptographic Failures（暗号化の不備）

**リスク**: 確定申告データや個人情報が平文で送受信・保存される

**対策 1: HTTPS の強制**

```typescript
// next.config.ts
const nextConfig = {
  // Vercel にデプロイする場合、HTTPS は自動的に強制される
  // カスタムドメインの場合も Vercel が SSL 証明書を自動管理
  async redirects() {
    return [
      // HTTP から HTTPS へのリダイレクト（セルフホスト時のみ必要）
      // Vercel では不要
    ]
  },
}
```

**対策 2: Secure Cookie の設定**

```typescript
// Supabase Auth のクッキー設定
// @supabase/ssr が自動的に以下を設定:
// - Secure: true（HTTPS のみ）
// - HttpOnly: true（JavaScript からアクセス不可）
// - SameSite: Lax（CSRF 対策）
```

**対策 3: 機密データの暗号化**

```typescript
// マイナンバーなどの特に機密性の高い情報を保存する場合
// Supabase の pgcrypto 拡張を使用

-- SQL: pgcrypto の有効化
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 暗号化して保存（AES-256）
INSERT INTO sensitive_data (user_id, encrypted_value)
VALUES (
  auth.uid(),
  pgp_sym_encrypt('機密データ', current_setting('app.encryption_key'))
);

-- 復号して取得
SELECT pgp_sym_decrypt(
  encrypted_value::bytea,
  current_setting('app.encryption_key')
) FROM sensitive_data WHERE user_id = auth.uid();
```

---

## A03: Injection（インジェクション）

**リスク**: SQL インジェクションにより全ユーザーのデータが漏洩

**対策: Supabase クライアントのパラメータ化クエリ**

```typescript
// GOOD: Supabase クライアントは自動的にパラメータ化される
const { data } = await supabase
  .from('expenses')
  .select('*')
  .eq('category', userInput)  // 自動的にエスケープされる
  .gte('amount', minAmount)

// BAD: 生の SQL をユーザー入力で組み立てない
// const { data } = await supabase.rpc('search', {
//   query: `SELECT * FROM expenses WHERE category = '${userInput}'`  // 危険!
// })

// GOOD: RPC を使う場合もパラメータを使用
const { data } = await supabase.rpc('search_expenses', {
  search_category: userInput,  // パラメータとして渡す
  min_amount: minAmount,
})
```

```sql
-- RPC 関数もパラメータ化して定義
CREATE OR REPLACE FUNCTION search_expenses(
  search_category TEXT,
  min_amount NUMERIC
)
RETURNS SETOF expenses
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM expenses
  WHERE user_id = auth.uid()
    AND category = search_category
    AND amount >= min_amount;
$$;
```

**XSS 対策（React / Next.js）**

```typescript
// GOOD: React は JSX 内のテキストを自動エスケープする
function ExpenseItem({ description }: { description: string }) {
  return <p>{description}</p>  // 自動エスケープされる
}

// BAD: dangerouslySetInnerHTML は使わない
// function ExpenseItem({ description }: { description: string }) {
//   return <p dangerouslySetInnerHTML={{ __html: description }} />  // XSS 脆弱性!
// }

// ユーザー入力の検証（サーバーサイド）
import { z } from 'zod'

const expenseSchema = z.object({
  description: z.string().max(500).trim(),
  amount: z.number().positive().max(100_000_000),
  category: z.enum([
    '通信費', '交通費', '消耗品費', '接待交際費',
    '地代家賃', '水道光熱費', '雑費', 'その他'
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export function validateExpense(input: unknown) {
  return expenseSchema.safeParse(input)
}
```

---

## A04: Insecure Design（安全でない設計）

**リスク**: 20万円ラインの判定ロジックに不備があり、誤った申告案内をする

**対策: ビジネスロジックの厳密な検証**

```typescript
// lib/tax-calculation.ts

/**
 * 20万円ライン判定
 * 副業の所得（収入 - 経費）が20万円を超える場合、確定申告が必要
 * 注意: 給与所得が1箇所のみで年末調整済みの場合に適用
 */
export function requiresTaxFiling(
  totalIncome: number,
  totalExpenses: number
): { required: boolean; netIncome: number; reason: string } {
  // 入力値の検証
  if (totalIncome < 0) {
    throw new Error('収入は0以上である必要があります')
  }
  if (totalExpenses < 0) {
    throw new Error('経費は0以上である必要があります')
  }
  if (totalExpenses > totalIncome) {
    // 赤字の場合は申告不要（ただし損失の繰越をしたい場合は申告が有利）
    return {
      required: false,
      netIncome: totalIncome - totalExpenses,
      reason: '副業が赤字のため確定申告は不要です（ただし損失の繰越をしたい場合は申告が有利です）',
    }
  }

  const netIncome = totalIncome - totalExpenses
  const THRESHOLD = 200_000  // 20万円

  if (netIncome > THRESHOLD) {
    return {
      required: true,
      netIncome,
      reason: `副業所得が${netIncome.toLocaleString()}円で20万円を超えるため、確定申告が必要です`,
    }
  }

  return {
    required: false,
    netIncome,
    reason: `副業所得が${netIncome.toLocaleString()}円で20万円以下のため、確定申告は不要です（ただし住民税の申告は必要です）`,
  }
}

// 免責事項の表示を必須とする
export const TAX_DISCLAIMER = `
※ この判定は一般的な条件に基づく目安です。
※ 給与所得が2箇所以上ある場合、医療費控除を受ける場合など、
  他の要因で確定申告が必要になることがあります。
※ 正確な判断は税理士にご相談ください。
※ 当サービスは税務相談を行うものではありません。
`
```

---

## A07: Identification and Authentication Failures（認証の不備）

**対策: Supabase Auth の安全な設定**

```typescript
// lib/supabase/auth-config.ts
// Supabase Dashboard での設定項目

/**
 * Supabase Auth 設定チェックリスト:
 *
 * 1. Email 認証
 *    - Confirm email: ON（メール確認必須）
 *    - Secure email change: ON
 *    - Double confirm changes: ON
 *
 * 2. パスワードポリシー
 *    - Minimum password length: 8以上（推奨12以上）
 *
 * 3. OAuth プロバイダー（Google/GitHub）
 *    - Redirect URLs を本番ドメインのみに限定
 *    - テスト用 localhost は開発環境のみ
 *
 * 4. JWT 設定
 *    - JWT expiry: 3600（1時間）
 *    - Refresh token rotation: ON
 *    - Reuse interval: 10秒
 *
 * 5. Rate Limiting（Supabase 側で自動設定）
 *    - Email sign-ups: 制限あり
 *    - Token refresh: 制限あり
 */

// パスワード強度チェック（クライアントサイド UX 向上用）
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('8文字以上にしてください')

  if (password.length >= 12) score++

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  else feedback.push('大文字と小文字を含めてください')

  if (/\d/.test(password)) score++
  else feedback.push('数字を含めてください')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('記号を含めてください')

  return { score, feedback }
}
```

**セッション管理**

```typescript
// Server Component でのセッション検証
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() は JWT を検証するため getSession() より安全
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return { user, supabase }
}
```

---

## A09: Security Logging and Monitoring Failures（セキュリティログの不足）

**対策: Supabase Logs と監査ログの活用**

```typescript
// lib/audit-log.ts
// セキュリティ関連イベントの記録

import { createServiceClient } from '@/lib/supabase/service'

type AuditEvent =
  | 'login_success'
  | 'login_failure'
  | 'password_change'
  | 'data_export'
  | 'data_delete_request'
  | 'receipt_upload'
  | 'tax_calculation'
  | 'subscription_change'
  | 'suspicious_activity'

interface AuditLogEntry {
  user_id: string | null
  event: AuditEvent
  details: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

export async function createAuditLog(entry: AuditLogEntry) {
  const supabase = createServiceClient()

  await supabase.from('audit_logs').insert({
    user_id: entry.user_id,
    event: entry.event,
    details: entry.details,
    ip_address: entry.ip_address,
    user_agent: entry.user_agent,
    created_at: new Date().toISOString(),
  })
}

// 使用例: ログイン成功時
// await createAuditLog({
//   user_id: user.id,
//   event: 'login_success',
//   details: { provider: 'email' },
//   ip_address: request.headers.get('x-forwarded-for') || undefined,
// })
```

```sql
-- audit_logs テーブルの作成
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: service_role のみアクセス可能（クライアントからは読み書き不可）
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- ポリシーを作成しないことで、クライアントからのアクセスを完全にブロック

-- インデックス
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_event ON public.audit_logs(event);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 90日以上前のログを自動削除する関数（オプション）
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
$$;
```
