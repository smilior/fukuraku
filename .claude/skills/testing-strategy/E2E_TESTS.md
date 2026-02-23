# Playwright E2E テスト実装ガイド

## 1. Playwright セットアップ

### 1.1 インストール

```bash
npm install -D @playwright/test
npx playwright install
```

### 1.2 playwright.config.ts

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

---

## 2. 認証ヘルパー

```typescript
// e2e/helpers/auth.ts
import { Page } from '@playwright/test'

export async function loginAsTestUser(page: Page) {
  await page.goto('/login')

  // テスト用アカウントでログイン
  await page.getByLabel('メールアドレス').fill(process.env.E2E_TEST_EMAIL || 'test@example.com')
  await page.getByLabel('パスワード').fill(process.env.E2E_TEST_PASSWORD || 'test-password-123')
  await page.getByRole('button', { name: 'ログイン' }).click()

  // ダッシュボードにリダイレクトされるまで待機
  await page.waitForURL('/dashboard')
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'メニュー' }).click()
  await page.getByRole('menuitem', { name: 'ログアウト' }).click()
  await page.waitForURL('/login')
}
```

---

## 3. 認証フロー E2E テスト

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser, logout } from './helpers/auth'

test.describe('認証フロー', () => {
  test('メールアドレスとパスワードでログインできる', async ({ page }) => {
    await loginAsTestUser(page)

    // ダッシュボードが表示される
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
    // ユーザー名が表示される
    await expect(page.getByText('テストユーザー')).toBeVisible()
  })

  test('ログアウトできる', async ({ page }) => {
    await loginAsTestUser(page)
    await logout(page)

    // ログインページにリダイレクトされる
    await expect(page).toHaveURL('/login')
  })

  test('未認証状態でダッシュボードにアクセスするとログインページにリダイレクトされる', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('無効なパスワードでログインするとエラーが表示される', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByLabel('パスワード').fill('wrong-password')
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible()
  })
})
```

---

## 4. レシート OCR フロー E2E テスト

```typescript
// e2e/receipt-ocr.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './helpers/auth'
import path from 'path'

test.describe('レシート OCR フロー', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('レシート画像をアップロードして OCR 結果を確認できる', async ({ page }) => {
    await page.goto('/receipts/new')

    // ファイルアップロード
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-receipt.jpg'))

    // OCR処理中のローディング表示
    await expect(page.getByText('レシートを読み取り中')).toBeVisible()

    // OCR結果の表示を待機（最大30秒）
    await expect(page.getByText('読み取り結果')).toBeVisible({ timeout: 30_000 })

    // OCR結果が表示される
    await expect(page.getByLabel('店舗名')).not.toBeEmpty()
    await expect(page.getByLabel('金額')).not.toBeEmpty()
    await expect(page.getByLabel('日付')).not.toBeEmpty()
  })

  test('OCR結果を編集して経費として保存できる', async ({ page }) => {
    await page.goto('/receipts/new')

    // ファイルアップロード
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test-receipt.jpg'))

    // OCR結果の表示を待機
    await expect(page.getByText('読み取り結果')).toBeVisible({ timeout: 30_000 })

    // 金額を修正
    await page.getByLabel('金額').clear()
    await page.getByLabel('金額').fill('1500')

    // カテゴリを選択
    await page.getByLabel('カテゴリ').selectOption('通信費')

    // 保存
    await page.getByRole('button', { name: '経費として保存' }).click()

    // 成功メッセージ
    await expect(page.getByText('経費を保存しました')).toBeVisible()
  })

  test('非対応のファイル形式をアップロードするとエラーが表示される', async ({ page }) => {
    await page.goto('/receipts/new')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'invalid-file.txt'))

    await expect(page.getByText('対応形式')).toBeVisible()
  })
})
```

---

## 5. Stripe 決済フロー E2E テスト

```typescript
// e2e/stripe-payment.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './helpers/auth'

test.describe('Stripe 決済フロー', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('プラン選択画面が表示される', async ({ page }) => {
    await page.goto('/pricing')

    // 無料プランと有料プランが表示される
    await expect(page.getByText('フリープラン')).toBeVisible()
    await expect(page.getByText('プロプラン')).toBeVisible()
    await expect(page.getByText('980')).toBeVisible() // 月額980円
  })

  test('有料プランを選択すると Stripe Checkout にリダイレクトされる', async ({ page }) => {
    await page.goto('/pricing')

    // プロプランの「申し込む」ボタンをクリック
    await page.getByRole('button', { name: 'プロプランに申し込む' }).click()

    // Stripe Checkout ページにリダイレクトされる
    // テスト環境では Stripe のテストモードURLに遷移
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10_000 })
  })

  test('Stripe テストカードで決済完了後、成功ページに戻る', async ({ page }) => {
    await page.goto('/pricing')
    await page.getByRole('button', { name: 'プロプランに申し込む' }).click()

    // Stripe Checkout ページで入力
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10_000 })

    // テストカード番号の入力
    const cardFrame = page.frameLocator('iframe[name*="card"]').first()
    await cardFrame.getByPlaceholder('1234 1234 1234 1234').fill('4242424242424242')
    await cardFrame.getByPlaceholder('MM / YY').fill('12/30')
    await cardFrame.getByPlaceholder('CVC').fill('123')

    // メールアドレス入力
    await page.getByLabel('メールアドレス').fill('test@example.com')

    // 支払いボタン
    await page.getByRole('button', { name: /支払う|Subscribe|Pay/ }).click()

    // 成功ページにリダイレクト
    await page.waitForURL(/\/payment\/success/, { timeout: 30_000 })
    await expect(page.getByText('お支払いが完了しました')).toBeVisible()
  })
})
```

---

## 6. 確定申告フロー E2E テスト

```typescript
// e2e/tax-filing.spec.ts
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './helpers/auth'

test.describe('確定申告フロー', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page)
  })

  test('収入を登録できる', async ({ page }) => {
    await page.goto('/income/new')

    await page.getByLabel('収入源').fill('フリーランス開発')
    await page.getByLabel('金額').fill('500000')
    await page.getByLabel('日付').fill('2025-06-15')

    await page.getByRole('button', { name: '保存' }).click()
    await expect(page.getByText('収入を保存しました')).toBeVisible()
  })

  test('経費を登録できる', async ({ page }) => {
    await page.goto('/expenses/new')

    await page.getByLabel('内容').fill('サーバー代（AWS）')
    await page.getByLabel('金額').fill('2340')
    await page.getByLabel('カテゴリ').selectOption('通信費')
    await page.getByLabel('日付').fill('2025-06-01')

    await page.getByRole('button', { name: '保存' }).click()
    await expect(page.getByText('経費を保存しました')).toBeVisible()
  })

  test('20万円ライン判定が正しく表示される', async ({ page }) => {
    await page.goto('/dashboard')

    // 所得サマリーが表示される
    await expect(page.getByText('副業所得')).toBeVisible()

    // 20万円ラインの判定結果が表示される
    const filingStatus = page.locator('[data-testid="filing-status"]')
    await expect(filingStatus).toBeVisible()
    // 判定結果のテキストが表示されている
    await expect(filingStatus).toHaveText(/(確定申告が必要|確定申告は不要)/)
  })

  test('確定申告サマリーページで計算結果を確認できる', async ({ page }) => {
    await page.goto('/tax/summary')

    // 各項目が表示される
    await expect(page.getByText('総収入')).toBeVisible()
    await expect(page.getByText('総経費')).toBeVisible()
    await expect(page.getByText('所得金額')).toBeVisible()
    await expect(page.getByText('所得税')).toBeVisible()
    await expect(page.getByText('住民税')).toBeVisible()

    // 免責事項が表示される
    await expect(page.getByText('税理士')).toBeVisible()
  })
})
```

---

## 7. テストデータのシード

```typescript
// e2e/helpers/seed-test-data.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!
)

export async function seedTestData(userId: string) {
  // テスト用の収入データ
  await supabase.from('incomes').insert([
    { user_id: userId, source: 'フリーランス開発', amount: 500_000, date: '2025-06-01' },
    { user_id: userId, source: 'ブログ収入', amount: 30_000, date: '2025-07-01' },
    { user_id: userId, source: 'YouTube', amount: 15_000, date: '2025-08-01' },
  ])

  // テスト用の経費データ
  await supabase.from('expenses').insert([
    { user_id: userId, description: 'AWS利用料', amount: 2_340, category: '通信費', date: '2025-06-01' },
    { user_id: userId, description: 'ドメイン代', amount: 1_500, category: '通信費', date: '2025-06-15' },
    { user_id: userId, description: '技術書', amount: 3_520, category: '新聞図書費', date: '2025-07-01' },
  ])
}

export async function cleanupTestData(userId: string) {
  await supabase.from('expenses').delete().eq('user_id', userId)
  await supabase.from('incomes').delete().eq('user_id', userId)
  await supabase.from('tax_calculations').delete().eq('user_id', userId)
}
```

---

## 8. テスト実行コマンド一覧

```bash
# E2E テストの実行
npm run test:e2e

# E2E テストの UI モード
npm run test:e2e:ui

# 特定の E2E テストのみ
npx playwright test e2e/auth.spec.ts

# 全テスト実行（CI と同じ）
npm run test:all

# 全ユニット/インテグレーションテストの実行
npm test

# 特定のテストファイルのみ
npm test -- src/lib/__tests__/tax-calculation.test.ts

# 特定の describe/it のみ
npm test -- -t "20万円ライン判定"

# カバレッジ付きで実行
npm run test:coverage

# UI でテスト結果を確認
npm run test:ui
```
