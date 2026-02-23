# サブスクライフサイクル状態遷移テスト

## 状態遷移図

```
[未登録] → checkout.session.completed → [trialing]
[trialing] → trial終了 → [active]
[active] → subscription.deleted → [canceled]
[active] → payment_failed × 3 → [past_due] → [canceled]
[canceled] → 再購読 → [active]
[active] → プランアップグレード → [active(pro)]
[active] → プランダウングレード → [active(basic)]
```

## 状態管理のテスト

```typescript
// tests/subscription-lifecycle.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getSubscriptionStatus,
  processSubscriptionEvent,
} from '@/lib/subscriptions'
import { createTestUser, cleanupTestUser } from './helpers'

describe('サブスクリプション状態遷移', () => {
  let userId: string

  beforeEach(async () => {
    userId = await createTestUser()
  })

  afterEach(async () => {
    await cleanupTestUser(userId)
  })

  it('新規登録 → trialing 状態', async () => {
    await processSubscriptionEvent({
      type: 'customer.subscription.created',
      userId,
      status: 'trialing',
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      planId: 'basic',
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.status).toBe('trialing')
    expect(status.planId).toBe('basic')
    expect(status.trialEnd).toBeDefined()
  })

  it('trialing → active（トライアル終了後の支払い成功）', async () => {
    // trialing 状態にセット
    await processSubscriptionEvent({
      type: 'customer.subscription.updated',
      userId,
      status: 'active',
      planId: 'basic',
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.status).toBe('active')
    expect(status.trialEnd).toBeNull()
  })

  it('active → past_due（支払い失敗）', async () => {
    await processSubscriptionEvent({
      type: 'invoice.payment_failed',
      userId,
      status: 'past_due',
      planId: 'basic',
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.status).toBe('past_due')
    // 機能はまだ使えるが警告表示
    expect(status.hasAccess).toBe(true)
    expect(status.paymentWarning).toBe(true)
  })

  it('active → canceled（解約）', async () => {
    await processSubscriptionEvent({
      type: 'customer.subscription.deleted',
      userId,
      status: 'canceled',
      planId: 'free',
      canceledAt: new Date(),
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.status).toBe('canceled')
    expect(status.planId).toBe('free')
    expect(status.hasAccess).toBe(false)
  })

  it('basic → pro アップグレード', async () => {
    // basic active から開始
    await processSubscriptionEvent({
      type: 'customer.subscription.updated',
      userId,
      status: 'active',
      planId: 'pro',
      previousPlanId: 'basic',
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.planId).toBe('pro')
    expect(status.status).toBe('active')
  })

  it('pro → basic ダウングレード（次回更新時）', async () => {
    await processSubscriptionEvent({
      type: 'customer.subscription.updated',
      userId,
      status: 'active',
      planId: 'basic',
      previousPlanId: 'pro',
      // ダウングレードは即時ではなく次回更新時に適用
      scheduledChange: true,
    })

    const status = await getSubscriptionStatus(userId)
    expect(status.planId).toBe('pro') // まだproのまま
    expect(status.scheduledPlanId).toBe('basic') // 次回更新でbasicに
  })
})
```

## 日付・期間のテスト（vi.useFakeTimers活用）

```typescript
import { vi, describe, it, expect, afterEach } from 'vitest'
import { isTrialExpired, getDaysUntilRenewal } from '@/lib/subscriptions'

describe('サブスク日付ロジック', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('トライアル残り3日で警告', () => {
    vi.useFakeTimers()
    const now = new Date('2025-01-10T00:00:00Z')
    vi.setSystemTime(now)

    const trialEnd = new Date('2025-01-13T00:00:00Z') // 3日後
    expect(isTrialExpired(trialEnd)).toBe(false)
    expect(getDaysUntilRenewal(trialEnd)).toBe(3)
  })

  it('トライアル期限切れを検出', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-20T00:00:00Z'))

    const trialEnd = new Date('2025-01-13T00:00:00Z') // 7日前
    expect(isTrialExpired(trialEnd)).toBe(true)
  })
})
```
