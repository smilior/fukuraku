# テスト環境セットアップ

## 必要パッケージ

```bash
npm install -D vitest @vitest/coverage-v8 stripe
npm install -D @playwright/test
```

## vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      STRIPE_SECRET_KEY: 'sk_test_dummy',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_dummy',
    },
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/stripe/**', 'src/app/api/webhooks/**'],
      thresholds: { lines: 80 },
    },
  },
})
```

## tests/setup.ts（Stripeモック）

```typescript
import { vi } from 'vitest'

// Stripe SDKをモック
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      customers: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
      subscriptions: {
        create: vi.fn(),
        retrieve: vi.fn(),
        update: vi.fn(),
        cancel: vi.fn(),
      },
      webhooks: {
        constructEvent: vi.fn(),
      },
      checkout: {
        sessions: {
          create: vi.fn(),
        },
      },
    })),
  }
})
```

## .env.test.local

```env
STRIPE_SECRET_KEY=<your-stripe-test-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
STRIPE_PRICE_FREE=price_free
STRIPE_PRICE_BASIC=price_1XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PRO=price_1YYYYYYYYYYYYYYYYYYYYYYYY
NEXT_PUBLIC_URL=http://localhost:3000
```

## ローカルWebhook転送

```bash
# Stripe CLIインストール後
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 特定イベントのみ転送
stripe listen \
  --events customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed \
  --forward-to localhost:3000/api/webhooks/stripe

# テストイベントを手動トリガー
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
```

## テストコマンド

```bash
# 全テスト
npx vitest run

# ウォッチモード
npx vitest

# カバレッジ付き
npx vitest run --coverage

# 特定ファイル
npx vitest run tests/webhook.test.ts
```
