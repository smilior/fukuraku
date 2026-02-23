# Webhook イベント処理テスト

## テスト対象イベント一覧

| Stripe イベント | 処理内容 |
|----------------|---------|
| `checkout.session.completed` | サブスク開始・DB更新 |
| `customer.subscription.created` | プラン割り当て |
| `customer.subscription.updated` | プラン変更・更新日更新 |
| `customer.subscription.deleted` | 解約・フリープランへ降格 |
| `invoice.payment_succeeded` | 支払い成功・期間延長 |
| `invoice.payment_failed` | 支払い失敗・猶予期間開始 |
| `customer.subscription.trial_will_end` | トライアル終了3日前通知 |

## Webhookハンドラのユニットテスト

```typescript
// tests/webhook.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Stripe from 'stripe'
import { POST } from '@/app/api/webhooks/stripe/route'
import { updateSubscriptionStatus } from '@/lib/db/subscriptions'

vi.mock('@/lib/db/subscriptions')

const stripe = new Stripe('sk_test_dummy')

function createMockRequest(event: Stripe.Event) {
  const body = JSON.stringify(event)
  const sig = 'test_signature'

  vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event)

  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers: {
      'stripe-signature': sig,
      'content-type': 'application/json',
    },
    body,
  })
}

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('checkout.session.completed でサブスクをアクティブ化', async () => {
    const event: Stripe.Event = {
      id: 'evt_test_001',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_001',
          customer: 'cus_test_001',
          subscription: 'sub_test_001',
          payment_status: 'paid',
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event

    const req = createMockRequest(event)
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(updateSubscriptionStatus).toHaveBeenCalledWith({
      customerId: 'cus_test_001',
      subscriptionId: 'sub_test_001',
      status: 'active',
    })
  })

  it('customer.subscription.deleted で解約処理', async () => {
    const event: Stripe.Event = {
      id: 'evt_test_002',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_test_001',
          customer: 'cus_test_001',
          status: 'canceled',
          canceled_at: Math.floor(Date.now() / 1000),
        } as Stripe.Subscription,
      },
    } as Stripe.Event

    const req = createMockRequest(event)
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(updateSubscriptionStatus).toHaveBeenCalledWith({
      customerId: 'cus_test_001',
      subscriptionId: 'sub_test_001',
      status: 'canceled',
    })
  })

  it('invoice.payment_failed で支払い失敗を記録', async () => {
    const event: Stripe.Event = {
      id: 'evt_test_003',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_test_001',
          customer: 'cus_test_001',
          subscription: 'sub_test_001',
          attempt_count: 1,
        } as Stripe.Invoice,
      },
    } as Stripe.Event

    const req = createMockRequest(event)
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(updateSubscriptionStatus).toHaveBeenCalledWith({
      customerId: 'cus_test_001',
      subscriptionId: 'sub_test_001',
      status: 'past_due',
    })
  })

  it('無効な署名は 400 を返す', async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Stripe.errors.StripeSignatureVerificationError(
        'Invalid signature',
        ''
      )
    })

    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid' },
      body: '{}',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

## Webhookルートの実装パターン

```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  // イベント処理
  switch (event.type) {
    case 'checkout.session.completed':
      // ...
      break
    case 'customer.subscription.deleted':
      // ...
      break
    case 'invoice.payment_failed':
      // ...
      break
  }

  return new Response('OK', { status: 200 })
}
```
