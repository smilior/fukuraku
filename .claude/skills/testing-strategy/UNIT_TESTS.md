# ユニットテスト実装ガイド

## 1. 確定申告計算ロジックのユニットテスト

### 1.1 20万円ライン判定テスト

```typescript
// src/lib/__tests__/tax-calculation.test.ts
import { describe, it, expect } from 'vitest'
import { requiresTaxFiling, TAX_DISCLAIMER } from '@/lib/tax-calculation'

describe('requiresTaxFiling - 20万円ライン判定', () => {
  describe('申告が必要なケース', () => {
    it('副業所得が200,001円（20万円超）の場合、申告が必要', () => {
      const result = requiresTaxFiling(300_000, 99_999)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(200_001)
      expect(result.reason).toContain('確定申告が必要')
    })

    it('副業所得がちょうど200,001円の場合、申告が必要', () => {
      const result = requiresTaxFiling(200_001, 0)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(200_001)
    })

    it('副業所得が100万円の場合、申告が必要', () => {
      const result = requiresTaxFiling(1_500_000, 500_000)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(1_000_000)
    })

    it('経費を引いても20万円超なら申告が必要', () => {
      const result = requiresTaxFiling(500_000, 250_000)
      expect(result.required).toBe(true)
      expect(result.netIncome).toBe(250_000)
    })
  })

  describe('申告が不要なケース', () => {
    it('副業所得が20万円ちょうどの場合、申告不要', () => {
      const result = requiresTaxFiling(200_000, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(200_000)
      expect(result.reason).toContain('申告は不要')
      expect(result.reason).toContain('住民税')
    })

    it('副業所得が0円の場合、申告不要', () => {
      const result = requiresTaxFiling(0, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(0)
    })

    it('副業所得が199,999円の場合、申告不要', () => {
      const result = requiresTaxFiling(199_999, 0)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(199_999)
    })

    it('経費を引いて20万円以下になる場合、申告不要', () => {
      const result = requiresTaxFiling(500_000, 350_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(150_000)
    })
  })

  describe('赤字のケース', () => {
    it('経費が収入を上回る場合（赤字）、申告不要', () => {
      const result = requiresTaxFiling(100_000, 200_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(-100_000)
      expect(result.reason).toContain('赤字')
      expect(result.reason).toContain('損失の繰越')
    })

    it('収入0で経費がある場合、赤字', () => {
      const result = requiresTaxFiling(0, 50_000)
      expect(result.required).toBe(false)
      expect(result.netIncome).toBe(-50_000)
    })
  })

  describe('境界値テスト', () => {
    it('所得199,999円は申告不要', () => {
      expect(requiresTaxFiling(199_999, 0).required).toBe(false)
    })

    it('所得200,000円は申告不要', () => {
      expect(requiresTaxFiling(200_000, 0).required).toBe(false)
    })

    it('所得200,001円は申告必要', () => {
      expect(requiresTaxFiling(200_001, 0).required).toBe(true)
    })

    it('1円の違いで判定が変わる境界', () => {
      const belowThreshold = requiresTaxFiling(300_000, 100_000) // 20万円ちょうど
      const aboveThreshold = requiresTaxFiling(300_001, 100_000) // 200,001円

      expect(belowThreshold.required).toBe(false)
      expect(aboveThreshold.required).toBe(true)
    })
  })

  describe('エラーケース', () => {
    it('収入が負の値の場合、エラーをスロー', () => {
      expect(() => requiresTaxFiling(-1, 0)).toThrow('収入は0以上')
    })

    it('経費が負の値の場合、エラーをスロー', () => {
      expect(() => requiresTaxFiling(100_000, -1)).toThrow('経費は0以上')
    })
  })

  describe('免責事項', () => {
    it('免責事項が税理士への相談を促している', () => {
      expect(TAX_DISCLAIMER).toContain('税理士')
    })

    it('免責事項が目安であることを明記している', () => {
      expect(TAX_DISCLAIMER).toContain('目安')
    })
  })
})
```

### 1.2 所得税計算テスト

```typescript
// src/lib/__tests__/income-tax-calculation.test.ts
import { describe, it, expect } from 'vitest'
import { calculateIncomeTax, TAX_BRACKETS } from '@/lib/income-tax-calculation'

describe('calculateIncomeTax - 所得税計算', () => {
  describe('税率テーブルの検証', () => {
    it('課税所得195万円以下は税率5%', () => {
      const result = calculateIncomeTax(1_950_000)
      expect(result.taxRate).toBe(0.05)
      expect(result.taxAmount).toBe(97_500) // 195万 * 5%
    })

    it('課税所得330万円以下は税率10%', () => {
      const result = calculateIncomeTax(3_300_000)
      // 195万 * 5% + (330万-195万) * 10%
      expect(result.taxAmount).toBe(97_500 + 135_000)
    })

    it('課税所得695万円以下は税率20%', () => {
      const result = calculateIncomeTax(6_950_000)
      expect(result.taxRate).toBe(0.20)
    })

    it('課税所得900万円以下は税率23%', () => {
      const result = calculateIncomeTax(9_000_000)
      expect(result.taxRate).toBe(0.23)
    })

    it('課税所得1800万円以下は税率33%', () => {
      const result = calculateIncomeTax(18_000_000)
      expect(result.taxRate).toBe(0.33)
    })

    it('課税所得4000万円以下は税率40%', () => {
      const result = calculateIncomeTax(40_000_000)
      expect(result.taxRate).toBe(0.40)
    })

    it('課税所得4000万円超は税率45%', () => {
      const result = calculateIncomeTax(50_000_000)
      expect(result.taxRate).toBe(0.45)
    })
  })

  describe('復興特別所得税', () => {
    it('所得税額の2.1%が復興特別所得税として加算される', () => {
      const result = calculateIncomeTax(3_000_000)
      expect(result.reconstructionTax).toBe(
        Math.floor(result.incomeTaxBeforeReconstruction * 0.021)
      )
    })

    it('合計税額 = 所得税 + 復興特別所得税', () => {
      const result = calculateIncomeTax(5_000_000)
      expect(result.totalTax).toBe(
        result.incomeTaxBeforeReconstruction + result.reconstructionTax
      )
    })
  })

  describe('副業所得のみの計算（簡易版）', () => {
    it('副業所得30万円の場合の税額', () => {
      // 副業所得のみの場合（本業の給与所得は考慮しない簡易計算）
      const result = calculateIncomeTax(300_000)
      // 基礎控除(48万円)以下なので税額0
      expect(result.totalTax).toBe(0)
    })

    it('副業所得100万円の場合（基礎控除48万円適用後）', () => {
      // 課税所得 = 100万 - 48万 = 52万
      const taxableIncome = 1_000_000 - 480_000
      const result = calculateIncomeTax(taxableIncome)
      expect(result.taxAmount).toBe(Math.floor(taxableIncome * 0.05))
    })
  })

  describe('エッジケース', () => {
    it('課税所得0円の場合、税額0円', () => {
      const result = calculateIncomeTax(0)
      expect(result.totalTax).toBe(0)
    })

    it('課税所得1円の場合', () => {
      const result = calculateIncomeTax(1)
      expect(result.totalTax).toBeGreaterThanOrEqual(0)
    })

    it('高額所得（1億円）でも正しく計算できる', () => {
      const result = calculateIncomeTax(100_000_000)
      expect(result.totalTax).toBeGreaterThan(0)
      expect(result.taxRate).toBe(0.45)
    })
  })
})
```

### 1.3 住民税計算テスト

```typescript
// src/lib/__tests__/resident-tax-calculation.test.ts
import { describe, it, expect } from 'vitest'
import { calculateResidentTax } from '@/lib/resident-tax-calculation'

describe('calculateResidentTax - 住民税計算', () => {
  it('住民税は一律10%（都道府県民税4% + 市区町村民税6%）', () => {
    const result = calculateResidentTax(500_000)
    expect(result.rate).toBe(0.10)
    expect(result.prefecturalTax).toBe(500_000 * 0.04)
    expect(result.municipalTax).toBe(500_000 * 0.06)
    expect(result.totalTax).toBe(500_000 * 0.10)
  })

  it('均等割が加算される', () => {
    const result = calculateResidentTax(500_000)
    // 均等割: 都道府県1,000円 + 市区町村3,000円 + 森林環境税1,000円 = 5,000円
    expect(result.equalPerCapitaLevy).toBe(5_000)
  })

  it('副業所得20万円以下でも住民税は必要', () => {
    // 所得税は不要でも住民税の申告は必要
    const result = calculateResidentTax(150_000)
    expect(result.totalTax).toBeGreaterThan(0)
    expect(result.note).toContain('住民税の申告')
  })

  it('所得0円の場合は住民税0円', () => {
    const result = calculateResidentTax(0)
    expect(result.incomeLevyTax).toBe(0)
  })
})
```

### 1.4 経費カテゴリ分類テスト

```typescript
// src/lib/__tests__/expense-categorization.test.ts
import { describe, it, expect } from 'vitest'
import { categorizeExpense, EXPENSE_CATEGORIES } from '@/lib/expense-categorization'

describe('categorizeExpense - 経費カテゴリ自動分類', () => {
  describe('通信費', () => {
    it.each([
      ['NTTドコモ', '通信費'],
      ['AWS利用料', '通信費'],
      ['さくらインターネット', '通信費'],
      ['Zoom Pro', '通信費'],
    ])('%s は %s に分類される', (description, expectedCategory) => {
      expect(categorizeExpense(description)).toBe(expectedCategory)
    })
  })

  describe('交通費', () => {
    it.each([
      ['JR東日本', '交通費'],
      ['東京メトロ', '交通費'],
      ['タクシー代', '交通費'],
      ['Suica チャージ', '交通費'],
    ])('%s は %s に分類される', (description, expectedCategory) => {
      expect(categorizeExpense(description)).toBe(expectedCategory)
    })
  })

  describe('消耗品費', () => {
    it.each([
      ['Amazon キーボード', '消耗品費'],
      ['ヨドバシカメラ USBケーブル', '消耗品費'],
      ['文房具', '消耗品費'],
    ])('%s は %s に分類される', (description, expectedCategory) => {
      expect(categorizeExpense(description)).toBe(expectedCategory)
    })
  })

  describe('新聞図書費', () => {
    it.each([
      ['技術書 React入門', '新聞図書費'],
      ['Udemy講座', '新聞図書費'],
      ['日経新聞', '新聞図書費'],
    ])('%s は %s に分類される', (description, expectedCategory) => {
      expect(categorizeExpense(description)).toBe(expectedCategory)
    })
  })

  describe('分類できないケース', () => {
    it('不明な内容は「その他」に分類される', () => {
      expect(categorizeExpense('xxx')).toBe('その他')
    })
  })

  describe('カテゴリ一覧', () => {
    it('すべてのカテゴリが定義されている', () => {
      const expectedCategories = [
        '通信費', '交通費', '消耗品費', '接待交際費',
        '地代家賃', '水道光熱費', '新聞図書費', '旅費交通費',
        '外注工賃', '雑費', 'その他',
      ]
      expectedCategories.forEach(cat => {
        expect(EXPENSE_CATEGORIES).toContain(cat)
      })
    })
  })
})
```

### 1.5 バリデーションテスト

```typescript
// src/lib/__tests__/validations.test.ts
import { describe, it, expect } from 'vitest'
import { incomeSchema, expenseSchema, receiptUploadSchema } from '@/lib/validations'

describe('incomeSchema - 収入データのバリデーション', () => {
  it('有効なデータを受け入れる', () => {
    const result = incomeSchema.safeParse({
      source: 'フリーランス開発',
      amount: 500_000,
      date: '2025-12-01',
      description: '案件A',
    })
    expect(result.success).toBe(true)
  })

  it('収入源が空の場合、エラー', () => {
    const result = incomeSchema.safeParse({
      source: '',
      amount: 100_000,
      date: '2025-12-01',
    })
    expect(result.success).toBe(false)
  })

  it('金額が負の場合、エラー', () => {
    const result = incomeSchema.safeParse({
      source: 'テスト',
      amount: -1,
      date: '2025-12-01',
    })
    expect(result.success).toBe(false)
  })

  it('金額が0の場合、エラー', () => {
    const result = incomeSchema.safeParse({
      source: 'テスト',
      amount: 0,
      date: '2025-12-01',
    })
    expect(result.success).toBe(false)
  })

  it('金額が上限（999,999,999）を超える場合、エラー', () => {
    const result = incomeSchema.safeParse({
      source: 'テスト',
      amount: 1_000_000_000,
      date: '2025-12-01',
    })
    expect(result.success).toBe(false)
  })

  it('日付形式が不正な場合、エラー', () => {
    const result = incomeSchema.safeParse({
      source: 'テスト',
      amount: 100_000,
      date: '2025/12/01',
    })
    expect(result.success).toBe(false)
  })

  it('description はオプショナル', () => {
    const result = incomeSchema.safeParse({
      source: 'テスト',
      amount: 100_000,
      date: '2025-12-01',
    })
    expect(result.success).toBe(true)
  })
})

describe('expenseSchema - 経費データのバリデーション', () => {
  it('有効なデータを受け入れる', () => {
    const result = expenseSchema.safeParse({
      description: 'サーバー代',
      amount: 1_000,
      category: '通信費',
      date: '2025-12-01',
    })
    expect(result.success).toBe(true)
  })

  it('無効なカテゴリはエラー', () => {
    const result = expenseSchema.safeParse({
      description: 'テスト',
      amount: 1_000,
      category: '無効なカテゴリ',
      date: '2025-12-01',
    })
    expect(result.success).toBe(false)
  })

  it('receipt_id はオプショナル', () => {
    const result = expenseSchema.safeParse({
      description: 'テスト',
      amount: 1_000,
      category: '通信費',
      date: '2025-12-01',
    })
    expect(result.success).toBe(true)
  })

  it('receipt_id がUUID形式でない場合、エラー', () => {
    const result = expenseSchema.safeParse({
      description: 'テスト',
      amount: 1_000,
      category: '通信費',
      date: '2025-12-01',
      receipt_id: 'not-a-uuid',
    })
    expect(result.success).toBe(false)
  })
})

describe('receiptUploadSchema - ファイルアップロードのバリデーション', () => {
  it('JPEG ファイルを受け入れる', () => {
    const result = receiptUploadSchema.safeParse({
      file: { size: 1_000_000, type: 'image/jpeg' },
    })
    expect(result.success).toBe(true)
  })

  it('PNG ファイルを受け入れる', () => {
    const result = receiptUploadSchema.safeParse({
      file: { size: 1_000_000, type: 'image/png' },
    })
    expect(result.success).toBe(true)
  })

  it('PDF ファイルを受け入れる', () => {
    const result = receiptUploadSchema.safeParse({
      file: { size: 1_000_000, type: 'application/pdf' },
    })
    expect(result.success).toBe(true)
  })

  it('10MBを超えるファイルはエラー', () => {
    const result = receiptUploadSchema.safeParse({
      file: { size: 11 * 1024 * 1024, type: 'image/jpeg' },
    })
    expect(result.success).toBe(false)
  })

  it('非対応のファイル形式はエラー', () => {
    const result = receiptUploadSchema.safeParse({
      file: { size: 1_000_000, type: 'application/zip' },
    })
    expect(result.success).toBe(false)
  })
})
```

---

## 2. Supabase モックパターン

### 2.1 Supabase クライアントモック

```typescript
// src/__mocks__/supabase.ts
import { vi } from 'vitest'

// チェーン可能なクエリビルダーモック
function createQueryBuilder(data: unknown[] = [], error: Error | null = null) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: data[0] ?? null, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data: data[0] ?? null, error }),
    then: vi.fn((resolve) => resolve({ data, error })),
  }

  // Promise のように振る舞う
  Object.defineProperty(builder, 'then', {
    value: (resolve: (value: { data: unknown; error: unknown }) => void) => {
      return Promise.resolve(resolve({ data, error }))
    },
  })

  return builder
}

// Supabase Auth モック
const authMock = {
  getUser: vi.fn().mockResolvedValue({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { name: 'テストユーザー' },
      },
    },
    error: null,
  }),
  getSession: vi.fn().mockResolvedValue({
    data: {
      session: {
        access_token: 'test-access-token',
        user: { id: 'test-user-id', email: 'test@example.com' },
      },
    },
    error: null,
  }),
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  onAuthStateChange: vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  }),
}

// Storage モック
const storageMock = {
  from: vi.fn().mockReturnValue({
    upload: vi.fn().mockResolvedValue({ data: { path: 'receipts/test.jpg' }, error: null }),
    download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
    remove: vi.fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: vi.fn().mockReturnValue({
      data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/receipts/test.jpg' },
    }),
    createSignedUrl: vi.fn().mockResolvedValue({
      data: { signedUrl: 'https://test.supabase.co/storage/v1/object/sign/receipts/test.jpg' },
      error: null,
    }),
  }),
}

// Supabase クライアントモック本体
export function createMockSupabaseClient(overrides?: {
  data?: Record<string, unknown[]>
  errors?: Record<string, Error>
}) {
  return {
    from: vi.fn((table: string) => {
      const data = overrides?.data?.[table] ?? []
      const error = overrides?.errors?.[table] ?? null
      return createQueryBuilder(data, error)
    }),
    auth: authMock,
    storage: storageMock,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  }
}

// テストヘルパー: 未認証状態をシミュレート
export function mockUnauthenticated() {
  authMock.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: 'Not authenticated', status: 401 },
  })
  authMock.getSession.mockResolvedValue({
    data: { session: null },
    error: null,
  })
}

// テストヘルパー: 認証済み状態をシミュレート
export function mockAuthenticated(user?: {
  id?: string
  email?: string
  name?: string
}) {
  const userId = user?.id ?? 'test-user-id'
  const email = user?.email ?? 'test@example.com'
  const name = user?.name ?? 'テストユーザー'

  authMock.getUser.mockResolvedValue({
    data: {
      user: {
        id: userId,
        email,
        user_metadata: { name },
      },
    },
    error: null,
  })
}

export { authMock, storageMock }
```

### 2.2 Supabase モックの使用例

```typescript
// src/app/api/incomes/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabaseClient, mockAuthenticated, mockUnauthenticated } from '@/__mocks__/supabase'

// Supabase クライアント生成をモック
const mockClient = createMockSupabaseClient({
  data: {
    incomes: [
      { id: '1', user_id: 'test-user-id', source: 'フリーランス', amount: 500_000, date: '2025-12-01' },
      { id: '2', user_id: 'test-user-id', source: 'ブログ', amount: 30_000, date: '2025-12-15' },
    ],
  },
})

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(() => mockClient),
}))

describe('GET /api/incomes', () => {
  beforeEach(() => {
    mockAuthenticated()
    vi.clearAllMocks()
  })

  it('認証済みユーザーの収入一覧を返す', async () => {
    // API Route のハンドラを import してテスト
    const { GET } = await import('@/app/api/incomes/route')
    const request = new Request('http://localhost:3000/api/incomes')
    const response = await GET(request)

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toHaveLength(2)
    expect(body[0].source).toBe('フリーランス')
  })

  it('未認証の場合401を返す', async () => {
    mockUnauthenticated()

    const { GET } = await import('@/app/api/incomes/route')
    const request = new Request('http://localhost:3000/api/incomes')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })
})
```

---

## 3. AI 仕訳精度の回帰テスト

### 3.1 テスト用レシートデータセット

```typescript
// src/lib/__tests__/fixtures/receipt-test-data.ts

export interface ReceiptTestCase {
  id: string
  description: string
  imageFile: string  // テスト用画像ファイルパス
  expected: {
    store_name: string
    date: string
    total_amount: number
    category: string
    items?: Array<{ name: string; amount: number }>
  }
}

export const RECEIPT_TEST_CASES: ReceiptTestCase[] = [
  {
    id: 'receipt-001',
    description: 'コンビニレシート（消耗品）',
    imageFile: 'fixtures/receipts/convenience-store.jpg',
    expected: {
      store_name: 'セブンイレブン',
      date: '2025-12-01',
      total_amount: 648,
      category: '消耗品費',
    },
  },
  {
    id: 'receipt-002',
    description: '交通系ICカードチャージ',
    imageFile: 'fixtures/receipts/suica-charge.jpg',
    expected: {
      store_name: 'JR東日本',
      date: '2025-12-05',
      total_amount: 5_000,
      category: '交通費',
    },
  },
  {
    id: 'receipt-003',
    description: 'Amazon注文確認（技術書）',
    imageFile: 'fixtures/receipts/amazon-book.jpg',
    expected: {
      store_name: 'Amazon',
      date: '2025-12-10',
      total_amount: 3_520,
      category: '新聞図書費',
    },
  },
  {
    id: 'receipt-004',
    description: 'カフェの領収書（接待交際費）',
    imageFile: 'fixtures/receipts/cafe-meeting.jpg',
    expected: {
      store_name: 'スターバックス',
      date: '2025-12-12',
      total_amount: 1_850,
      category: '接待交際費',
    },
  },
  {
    id: 'receipt-005',
    description: 'AWS利用明細',
    imageFile: 'fixtures/receipts/aws-invoice.jpg',
    expected: {
      store_name: 'Amazon Web Services',
      date: '2025-12-01',
      total_amount: 2_340,
      category: '通信費',
    },
  },
]
```

### 3.2 OCR 精度テスト

```typescript
// src/lib/__tests__/receipt-ocr-accuracy.test.ts
import { describe, it, expect } from 'vitest'
import { RECEIPT_TEST_CASES } from './fixtures/receipt-test-data'

// OCR結果の精度評価ヘルパー
function calculateAccuracy(expected: string, actual: string): number {
  if (expected === actual) return 1.0
  const maxLength = Math.max(expected.length, actual.length)
  if (maxLength === 0) return 1.0

  let matches = 0
  const minLength = Math.min(expected.length, actual.length)
  for (let i = 0; i < minLength; i++) {
    if (expected[i] === actual[i]) matches++
  }
  return matches / maxLength
}

// 金額の許容誤差
function isAmountAccurate(expected: number, actual: number, tolerance: number = 0): boolean {
  return Math.abs(expected - actual) <= tolerance
}

describe('レシートOCR精度テスト', () => {
  // 注意: このテストは実際の OCR API を呼ぶため、
  // CI/CD では OPENAI_API_KEY が必要
  // ローカルでは `npm test -- --run receipt-ocr-accuracy` で個別実行

  describe.skipIf(!process.env.OPENAI_API_KEY)('OCR API 統合テスト', () => {
    it.each(RECEIPT_TEST_CASES)(
      '$description の OCR 結果が正確',
      async ({ imageFile, expected }) => {
        // 実際のOCR処理を呼び出し
        const { processReceiptImage } = await import('@/lib/openai/receipt-ocr')
        const imageBase64 = '' // テスト用画像の読み込み

        const result = await processReceiptImage(imageBase64)
        const parsed = JSON.parse(result!)

        // 金額の精度: 完全一致
        expect(isAmountAccurate(expected.total_amount, parsed.total_amount)).toBe(true)

        // 店舗名の精度: 90%以上の一致
        const nameAccuracy = calculateAccuracy(expected.store_name, parsed.store_name)
        expect(nameAccuracy).toBeGreaterThanOrEqual(0.9)

        // 日付: 完全一致
        expect(parsed.date).toBe(expected.date)
      },
      30_000 // タイムアウト30秒（API呼び出しのため）
    )
  })

  describe('OCR 結果のパースロジック', () => {
    it('有効な JSON レスポンスを正しくパースできる', () => {
      const { parseOcrResponse } = require('@/lib/openai/receipt-ocr')

      const response = JSON.stringify({
        store_name: 'テスト店',
        date: '2025-12-01',
        total_amount: 1000,
        items: [{ name: '商品A', amount: 500 }, { name: '商品B', amount: 500 }],
        category_suggestion: '消耗品費',
      })

      const result = parseOcrResponse(response)
      expect(result.store_name).toBe('テスト店')
      expect(result.total_amount).toBe(1000)
      expect(result.items).toHaveLength(2)
    })

    it('不正な JSON の場合、エラーを返す', () => {
      const { parseOcrResponse } = require('@/lib/openai/receipt-ocr')
      expect(() => parseOcrResponse('invalid json')).toThrow()
    })

    it('必須フィールドが欠けている場合、エラーを返す', () => {
      const { parseOcrResponse } = require('@/lib/openai/receipt-ocr')
      const incomplete = JSON.stringify({ store_name: 'テスト店' })
      expect(() => parseOcrResponse(incomplete)).toThrow()
    })
  })
})
```

### 3.3 カテゴリ分類精度テスト

```typescript
// src/lib/__tests__/category-accuracy.test.ts
import { describe, it, expect } from 'vitest'
import { categorizeExpense } from '@/lib/expense-categorization'
import { RECEIPT_TEST_CASES } from './fixtures/receipt-test-data'

describe('カテゴリ自動分類の精度', () => {
  it('テストデータセットで80%以上の正解率', () => {
    let correct = 0
    const total = RECEIPT_TEST_CASES.length

    RECEIPT_TEST_CASES.forEach(testCase => {
      const predicted = categorizeExpense(testCase.expected.store_name)
      if (predicted === testCase.expected.category) {
        correct++
      }
    })

    const accuracy = correct / total
    expect(accuracy).toBeGreaterThanOrEqual(0.8)
    console.log(`カテゴリ分類精度: ${(accuracy * 100).toFixed(1)}% (${correct}/${total})`)
  })
})
```

---

## 4. テスト作成ガイドライン

```markdown
## テスト命名規約

- describe: テスト対象の関数名やコンポーネント名
- it/test: 「〜の場合、〜になる」形式

例:
describe('requiresTaxFiling - 20万円ライン判定')
  it('副業所得が20万円超の場合、申告が必要')

## テストファイルの配置

- ユニットテスト: src/lib/__tests__/xxx.test.ts
- コンポーネントテスト: src/components/__tests__/xxx.test.tsx
- API テスト: src/app/api/xxx/__tests__/route.test.ts
- E2E テスト: e2e/xxx.spec.ts

## テスト作成の優先順位

1. 金額計算ロジック（間違いが致命的）
2. バリデーションロジック
3. 認証・認可ロジック
4. API エンドポイント
5. ユーザーフロー（E2E）
6. UI コンポーネント
```
