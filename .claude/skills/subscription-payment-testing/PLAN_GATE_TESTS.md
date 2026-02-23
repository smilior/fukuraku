# プランゲート（機能制限）テスト

## プラン定義（副楽の例）

| 機能 | free | basic | pro |
|------|------|-------|-----|
| 年間レシート登録数 | 10件 | 100件 | 無制限 |
| AI領収書読み取り | × | ○ | ○ |
| CSV/PDF出力 | × | ○ | ○ |
| 複数年度管理 | × | × | ○ |
| 優先サポート | × | × | ○ |

## プランゲート関数のユニットテスト

```typescript
// tests/plan-gate.test.ts
import { describe, it, expect } from 'vitest'
import {
  canUploadReceipt,
  canUseAiOcr,
  canExportData,
  canManageMultipleYears,
  getUploadLimit,
} from '@/lib/plan-gate'

describe('プランゲート: フリープラン', () => {
  const plan = 'free'

  it('レシート10件まで登録可能', () => {
    expect(getUploadLimit(plan)).toBe(10)
    expect(canUploadReceipt(plan, 9)).toBe(true)
    expect(canUploadReceipt(plan, 10)).toBe(false) // 上限達成
  })

  it('AI-OCRは使用不可', () => {
    expect(canUseAiOcr(plan)).toBe(false)
  })

  it('データエクスポートは使用不可', () => {
    expect(canExportData(plan)).toBe(false)
  })
})

describe('プランゲート: Basicプラン', () => {
  const plan = 'basic'

  it('レシート100件まで登録可能', () => {
    expect(getUploadLimit(plan)).toBe(100)
    expect(canUploadReceipt(plan, 99)).toBe(true)
    expect(canUploadReceipt(plan, 100)).toBe(false)
  })

  it('AI-OCRが使用可能', () => {
    expect(canUseAiOcr(plan)).toBe(true)
  })

  it('複数年度管理は使用不可', () => {
    expect(canManageMultipleYears(plan)).toBe(false)
  })
})

describe('プランゲート: Proプラン', () => {
  const plan = 'pro'

  it('レシート無制限登録', () => {
    expect(getUploadLimit(plan)).toBe(Infinity)
    expect(canUploadReceipt(plan, 9999)).toBe(true)
  })

  it('全機能が使用可能', () => {
    expect(canUseAiOcr(plan)).toBe(true)
    expect(canExportData(plan)).toBe(true)
    expect(canManageMultipleYears(plan)).toBe(true)
  })
})
```

## APIルートのプランゲートテスト

```typescript
// tests/api-plan-gate.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST as uploadReceipt } from '@/app/api/receipts/route'
import { getSession } from '@/lib/auth'
import { getUserPlan, getReceiptCount } from '@/lib/db'

vi.mock('@/lib/auth')
vi.mock('@/lib/db')

describe('レシートアップロードAPIのプランゲート', () => {
  it('フリープランで上限超過時は 403 を返す', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'user_001' })
    vi.mocked(getUserPlan).mockResolvedValue('free')
    vi.mocked(getReceiptCount).mockResolvedValue(10) // 上限に達している

    const req = new Request('http://localhost/api/receipts', {
      method: 'POST',
      body: new FormData(),
    })

    const res = await uploadReceipt(req)
    expect(res.status).toBe(403)

    const body = await res.json()
    expect(body.code).toBe('PLAN_LIMIT_EXCEEDED')
    expect(body.limit).toBe(10)
    expect(body.upgradeUrl).toBeDefined()
  })

  it('未認証は 401 を返す', async () => {
    vi.mocked(getSession).mockResolvedValue(null)

    const req = new Request('http://localhost/api/receipts', {
      method: 'POST',
    })

    const res = await uploadReceipt(req)
    expect(res.status).toBe(401)
  })

  it('Basicプランは 100件まで登録可能', async () => {
    vi.mocked(getSession).mockResolvedValue({ userId: 'user_002' })
    vi.mocked(getUserPlan).mockResolvedValue('basic')
    vi.mocked(getReceiptCount).mockResolvedValue(50)

    const form = new FormData()
    form.append('file', new Blob(['receipt'], { type: 'image/jpeg' }), 'r.jpg')

    const req = new Request('http://localhost/api/receipts', {
      method: 'POST',
      body: form,
    })

    const res = await uploadReceipt(req)
    expect(res.status).toBe(200)
  })
})
```

## プランゲート実装パターン

```typescript
// src/lib/plan-gate.ts
export const PLAN_LIMITS = {
  free: { receipts: 10, aiOcr: false, export: false, multiYear: false },
  basic: { receipts: 100, aiOcr: true, export: true, multiYear: false },
  pro: { receipts: Infinity, aiOcr: true, export: true, multiYear: true },
} as const

export type Plan = keyof typeof PLAN_LIMITS

export const canUploadReceipt = (plan: Plan, currentCount: number) =>
  currentCount < PLAN_LIMITS[plan].receipts

export const canUseAiOcr = (plan: Plan) => PLAN_LIMITS[plan].aiOcr
export const canExportData = (plan: Plan) => PLAN_LIMITS[plan].export
export const canManageMultipleYears = (plan: Plan) => PLAN_LIMITS[plan].multiYear
export const getUploadLimit = (plan: Plan) => PLAN_LIMITS[plan].receipts
```
