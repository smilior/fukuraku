# Playwright E2E 決済フローテスト

## テスト対象フロー

1. **チェックアウトフロー**: プラン選択 → Stripe Checkout → 完了画面
2. **アップグレードフロー**: フリー → Basic → Pro
3. **解約フロー**: 解約申請 → Billingポータル → 確認
4. **支払い失敗フロー**: カード拒否 → 再試行 → アカウント制限

## playwright.config.ts（サブスクテスト用）

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Stripe テストカード番号

| シナリオ | カード番号 |
|---------|----------|
| 支払い成功 | `4242 4242 4242 4242` |
| 認証必要（3DS） | `4000 0025 0000 3155` |
| カード拒否 | `4000 0000 0000 9995` |
| 残高不足 | `4000 0000 0000 9995` |
| 有効期限切れ | `4000 0000 0000 0069` |

## チェックアウトE2Eテスト

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Stripeチェックアウト', () => {
  test.beforeEach(async ({ page }) => {
    // テストユーザーでログイン
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'testpassword')
    await page.click('[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('Basicプランへのアップグレード', async ({ page }) => {
    await page.goto('/pricing')

    // Basicプランを選択
    await page.click('[data-plan="basic"] button')

    // Stripe Checkoutページへリダイレクト
    await page.waitForURL(/checkout\.stripe\.com/)

    // テストカード情報入力
    const emailField = page.frameLocator('iframe[name="__privateStripeFrame"]')
      .first()
      .locator('[name="email"]')

    // Stripe Checkout内のiframeを操作
    await page.locator('#email').fill('test@example.com')
    await page.locator('#cardNumber').fill('4242424242424242')
    await page.locator('#cardExpiry').fill('12/30')
    await page.locator('#cardCvc').fill('123')
    await page.locator('[data-testid="hosted-payment-submit-button"]').click()

    // 完了ページへリダイレクト
    await page.waitForURL('/dashboard?payment=success')
    await expect(page.locator('[data-testid="plan-badge"]')).toHaveText('Basic')
  })

  test('支払い失敗のハンドリング', async ({ page }) => {
    await page.goto('/pricing')
    await page.click('[data-plan="basic"] button')
    await page.waitForURL(/checkout\.stripe\.com/)

    // 拒否されるカードを入力
    await page.locator('#cardNumber').fill('4000000000009995')
    await page.locator('#cardExpiry').fill('12/30')
    await page.locator('#cardCvc').fill('123')
    await page.locator('[data-testid="hosted-payment-submit-button"]').click()

    // エラーメッセージを確認
    await expect(page.locator('[data-testid="payment-error"]'))
      .toBeVisible()
    await expect(page.locator('[data-testid="payment-error"]'))
      .toContainText('カードが拒否されました')
  })
})
```

## Billingポータルテスト

```typescript
// tests/e2e/billing-portal.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Billingポータル', () => {
  test('解約フロー', async ({ page }) => {
    // プラン設定ページへ
    await page.goto('/settings/billing')

    // Billingポータルを開く
    await page.click('[data-testid="manage-billing-btn"]')
    await page.waitForURL(/billing\.stripe\.com/)

    // Stripeポータルでサブスク解約
    await page.click('text=サブスクリプションをキャンセル')
    await page.click('[data-testid="cancel-subscription-confirm"]')

    // アプリに戻る
    await page.goto('/settings/billing')
    await expect(page.locator('[data-testid="plan-status"]'))
      .toContainText('解約済み')
  })
})
```

## Webhook → UI 反映のE2Eテスト

```typescript
// tests/e2e/webhook-ui.spec.ts
import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

test('Webhookイベント後にUIが更新される', async ({ page }) => {
  await page.goto('/dashboard')

  // 支払い失敗イベントをStripe CLIでトリガー
  execSync('stripe trigger invoice.payment_failed')

  // UIが更新されるまで待機
  await expect(page.locator('[data-testid="payment-warning"]'))
    .toBeVisible({ timeout: 10000 })
  await expect(page.locator('[data-testid="payment-warning"]'))
    .toContainText('支払いが失敗しました')
})
```

## CI/CD設定（GitHub Actions）

```yaml
# .github/workflows/e2e-subscription.yml
name: E2E Subscription Tests

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'src/app/api/webhooks/**'
      - 'src/lib/stripe/**'
      - 'src/lib/plan-gate**'

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_SECRET_KEY }}
      STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_TEST_WEBHOOK_SECRET }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      # Stripe CLIのインストール
      - name: Install Stripe CLI
        run: |
          curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public \
            | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg > /dev/null
          echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] \
            https://packages.stripe.dev/stripe-cli-debian-local stable main" \
            | sudo tee -a /etc/apt/sources.list.d/stripe.list
          sudo apt update && sudo apt install stripe

      # Webhook転送を起動
      - name: Start Stripe webhook listener
        run: stripe listen --forward-to localhost:3000/api/webhooks/stripe &

      - run: npx playwright test tests/e2e/
```
