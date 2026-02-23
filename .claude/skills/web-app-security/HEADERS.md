# Next.js セキュリティヘッダー・API保護

## 1. next.config.ts でのヘッダー設定

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // すべてのルートに適用
        source: '/(.*)',
        headers: [
          // Content-Security-Policy: XSS攻撃の軽減
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js の動作に必要
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              // 画像: 自サイト + Supabase Storage + Stripe
              "img-src 'self' data: blob: https://*.supabase.co",
              // フォント
              "font-src 'self'",
              // API接続先
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com",
              // Stripe の iframe
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              // フォーム送信先
              "form-action 'self'",
              // ベース URI
              "base-uri 'self'",
              // オブジェクト
              "object-src 'none'",
            ].join('; '),
          },
          // X-Frame-Options: クリックジャッキング対策
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options: MIME タイプスニッフィング対策
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer-Policy: リファラー情報の制御
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions-Policy: ブラウザ機能の制限
          {
            key: 'Permissions-Policy',
            value: [
              'camera=(self)',         // レシート撮影に必要
              'microphone=()',         // マイク不要
              'geolocation=()',        // 位置情報不要
              'browsing-topics=()',    // Topics API 無効
              'payment=(self)',        // Stripe 決済に必要
            ].join(', '),
          },
          // Strict-Transport-Security: HTTPS強制
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 2. CSP の注意事項

```typescript
/**
 * CSP（Content Security Policy）の運用上の注意:
 *
 * 1. 開発環境では 'unsafe-eval' が必要（Next.js Hot Reload）
 *    本番環境では可能な限り除外する
 *
 * 2. 新しい外部サービスを追加する際は CSP を更新すること
 *    例: 新しい Analytics ツール、CDN など
 *
 * 3. CSP違反レポートの設定（オプション）
 *    report-uri ディレクティブでレポートを収集できる
 *
 * 4. nonce ベースの CSP（より厳格な設定）
 *    Next.js App Router では Middleware で nonce を生成し、
 *    Script コンポーネントに渡す方式が推奨
 */

// Middleware での nonce 生成（より厳格な CSP を実装する場合）
// middleware.ts に追加
import { randomBytes } from 'crypto'

// nonce ベースの CSP を使う場合の例
function generateNonce(): string {
  return randomBytes(16).toString('base64')
}
```

---

## 3. OpenAI API キーの安全な管理

### 3.1 環境変数の設定

```bash
# .env.local（ローカル開発用 / git にコミットしない）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx

# NEXT_PUBLIC_ プレフィックスを付けない = サーバーサイドのみで利用可能
# NEXT_PUBLIC_OPENAI_API_KEY は絶対に使わない
```

### 3.2 .gitignore の設定

```gitignore
# .gitignore に必須のエントリ
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 3.3 Vercel 環境変数の設定

```
Vercel Dashboard での設定手順:
1. プロジェクト設定 > Environment Variables
2. 以下を追加:
   - OPENAI_API_KEY: sk-proj-xxxx（Production/Preview/Development すべて）
   - SUPABASE_SERVICE_ROLE_KEY: eyJxxxx（Production/Preview のみ）
   - STRIPE_SECRET_KEY: sk_live_xxxx（Production のみ）
   - STRIPE_WEBHOOK_SECRET: whsec_xxxx（Production のみ）

重要: Sensitive にチェックを入れると、設定後は値を表示できなくなる（推奨）
```

### 3.4 サーバーサイドのみでの API キー使用パターン

```typescript
// GOOD: Server Component / API Route でのみ使用
// app/api/ocr/route.ts
import OpenAI from 'openai'

// この変数はサーバーサイドでのみアクセス可能
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  // サーバーサイドで処理
  const body = await request.json()
  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: body.messages,
  })
  return Response.json(result)
}

// GOOD: Server Action でも OK
// app/actions/ocr.ts
'use server'

export async function processReceipt(formData: FormData) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  // ...
}
```

```typescript
// BAD: クライアントコンポーネントでは API キーにアクセスできない/すべきではない
// components/ReceiptUploader.tsx
'use client'

// process.env.OPENAI_API_KEY は undefined になる（NEXT_PUBLIC_ がないため）
// これは意図された動作 = セキュリティ上正しい

export function ReceiptUploader() {
  async function handleUpload(file: File) {
    // クライアントから自分のAPI Route を呼ぶ
    const formData = new FormData()
    formData.append('receipt', file)

    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    // ...
  }
  // ...
}
```

### 3.5 API キーのローテーション

```markdown
## API キーローテーション手順

1. OpenAI Dashboard で新しいキーを生成
2. Vercel Dashboard で環境変数を更新
3. 新しいデプロイを実行（環境変数の反映）
4. 動作確認後、旧キーを OpenAI Dashboard で無効化
5. .env.local も更新

推奨頻度: 90日ごと、またはチームメンバーの変更時
```

---

## 4. API エンドポイントのセキュリティ

### 4.1 Supabase Auth トークンの検証

```typescript
// lib/api-auth.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function validateAuth(request: NextRequest) {
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

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { authenticated: false as const, error: 'Unauthorized' }
  }

  return { authenticated: true as const, user, supabase }
}

// 使用例
export async function GET(request: NextRequest) {
  const auth = await validateAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }
  // auth.user と auth.supabase が使える
}
```

### 4.2 Rate Limiting の実装

```typescript
// lib/rate-limit.ts
// 確定申告シーズン（1-3月）はトラフィックが集中するため、Rate Limiting は必須

// Vercel Edge Config / Upstash Redis を使った Rate Limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Upstash Redis の設定
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// API エンドポイント別の Rate Limit 設定
export const rateLimiters = {
  // OCR API: ユーザーあたり 1分に10回まで
  ocr: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'ratelimit:ocr',
  }),

  // 認証: IP あたり 1時間に20回まで
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    prefix: 'ratelimit:auth',
  }),

  // 一般 API: ユーザーあたり 1分に60回まで
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'ratelimit:general',
  }),
}

// Rate Limit ミドルウェア
export async function checkRateLimit(
  identifier: string,
  limiterType: keyof typeof rateLimiters = 'general'
) {
  const limiter = rateLimiters[limiterType]
  const { success, limit, reset, remaining } = await limiter.limit(identifier)

  return {
    success,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  }
}

// 使用例: OCR API Route
// app/api/ocr/route.ts
export async function POST(request: NextRequest) {
  const auth = await validateAuth(request)
  if (!auth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate Limit チェック
  const rateLimit = await checkRateLimit(auth.user.id, 'ocr')
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimit.headers }
    )
  }

  // OCR 処理...
}
```

### 4.3 CORS 設定

```typescript
// next.config.ts に追加
// Next.js App Router では API Routes は同一オリジンからのリクエストのみ
// デフォルトで許可されるため、追加設定は基本不要

// Supabase 側の CORS 設定:
// Supabase Dashboard > API Settings > Allowed Origins
// 本番: https://fukuraku.com のみ
// 開発: http://localhost:3000 を追加

// Stripe Webhook など外部からのリクエストを受ける場合
// app/api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
  // Stripe の署名検証で認証する（CORS ではなく）
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  try {
    const body = await request.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    // Webhook 処理...
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}
```

### 4.4 入力値の検証（Zod）

```typescript
// lib/validations.ts
import { z } from 'zod'

// 収入データの検証スキーマ
export const incomeSchema = z.object({
  source: z.string().min(1, '収入源を入力してください').max(200),
  amount: z
    .number()
    .positive('金額は正の数を入力してください')
    .max(999_999_999, '金額が大きすぎます'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式が不正です'),
  description: z.string().max(1000).optional(),
})

// 経費データの検証スキーマ
export const expenseSchema = z.object({
  description: z.string().min(1, '内容を入力してください').max(500),
  amount: z
    .number()
    .positive('金額は正の数を入力してください')
    .max(999_999_999, '金額が大きすぎます'),
  category: z.enum([
    '通信費', '交通費', '消耗品費', '接待交際費',
    '地代家賃', '水道光熱費', '新聞図書費', '旅費交通費',
    '外注工賃', '雑費',
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付形式が不正です'),
  receipt_id: z.string().uuid().optional(),
})

// ファイルアップロードの検証
export const receiptUploadSchema = z.object({
  file: z.object({
    size: z.number().max(10 * 1024 * 1024, 'ファイルサイズは10MB以下にしてください'),
    type: z.enum(
      ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'],
      { message: '対応形式: JPEG, PNG, WebP, HEIC, PDF' }
    ),
  }),
})

// API Route での使用例
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = incomeSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.flatten() },
      { status: 400 }
    )
  }

  // validation.data は型安全に使用できる
  const { source, amount, date } = validation.data
  // ...
}
```
