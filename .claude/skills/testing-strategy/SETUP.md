# テスト環境セットアップ

## 1. テストピラミッド設計方針

### 1.1 テスト比率の目標

```
        /\
       /  \        E2E テスト（10%）
      /    \       主要ユーザーフロー、クリティカルパス
     /------\
    /        \     Integration テスト（30%）
   /          \    API Routes、Supabase連携、Webhook
  /------------\
 /              \  Unit テスト（60%）
/                \ 計算ロジック、バリデーション、型変換、ユーティリティ
------------------
```

### 1.2 各レイヤーの責務

| レイヤー | テスト対象 | ツール | 実行速度 |
|---------|-----------|-------|---------|
| Unit | 計算ロジック、バリデーション、ユーティリティ関数 | Vitest | < 1秒/テスト |
| Integration | API Routes、Server Actions、DB連携、コンポーネント連携 | Vitest + RTL + Supabase Mock | < 5秒/テスト |
| E2E | ログインフロー、レシートOCR、決済フロー、確定申告フロー | Playwright | < 30秒/テスト |

### 1.3 テスト対象の優先順位

1. **最優先**: 確定申告計算ロジック（金額の間違いは致命的）
2. **高優先**: 20万円ライン判定、所得税・住民税計算
3. **高優先**: Supabase RLS の動作検証
4. **中優先**: レシートOCR の精度
5. **中優先**: Stripe 決済フロー
6. **低優先**: UI コンポーネントの表示

---

## 2. Vitest セットアップ

### 2.1 パッケージインストール

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2.2 vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // テスト環境
    environment: 'jsdom',

    // セットアップファイル
    setupFiles: ['./vitest.setup.ts'],

    // グローバル API（describe, it, expect を import なしで使用）
    globals: true,

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/lib/**/*.ts',
        'src/lib/**/*.tsx',
        'src/components/**/*.tsx',
        'src/app/**/*.ts',
        'src/app/**/*.tsx',
      ],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
        'src/**/types.ts',
        'src/**/*.d.ts',
      ],
      thresholds: {
        // カバレッジ閾値
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },

    // テストファイルのパターン
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // タイムアウト
    testTimeout: 10000,

    // スナップショットの設定
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2.3 vitest.setup.ts

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup()
})

// Next.js の router モック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: vi.fn(),
}))

// Next.js の Image コンポーネントモック
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// 環境変数のモック
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
```

### 2.4 package.json のスクリプト

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "vitest run && playwright test"
  }
}
```

---

## 3. テストカバレッジ目標

### 3.1 モジュール別のカバレッジ目標

| モジュール | Line | Branch | Function | 理由 |
|-----------|------|--------|----------|------|
| lib/tax-calculation | 95% | 95% | 100% | 計算間違いは致命的 |
| lib/validations | 90% | 85% | 100% | バリデーション漏れは脆弱性 |
| lib/openai | 70% | 60% | 80% | 外部API依存のため |
| app/api | 80% | 75% | 90% | 認証・認可のテストが重要 |
| components | 60% | 50% | 70% | UIは手動テストも併用 |

### 3.2 カバレッジレポートの確認方法

```bash
# カバレッジレポートの生成
npm run test:coverage

# HTML レポートの表示
open coverage/index.html

# CI では lcov レポートを GitHub Actions にアップロード
```
