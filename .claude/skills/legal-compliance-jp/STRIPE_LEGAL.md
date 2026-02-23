# Stripe決済・データ取扱いの法的注意点

## 資金決済法への対応

Stripeを通じた決済処理において、資金決済法に関連する注意点：

**副楽の場合：**
- サブスクリプション型のサービス提供は「前払式支払手段」には該当しない
- ただし、ポイントやクレジットを導入する場合は資金決済法の規制対象になる可能性
- プリペイド方式は導入しないことを推奨

---

## クレジットカード情報の非保持化

改正割賦販売法により、加盟店はクレジットカード情報の非保持化が義務付けられています。

**Stripe利用時の対応：**
- Stripe.js / Stripe Elements を使用することで、カード情報はStripeのサーバーに
  直接送信され、副楽のサーバーを経由しない
- PCI DSS準拠はStripe側が対応（Level 1）
- 自社サーバーにカード番号を保存しない
- Stripe Customer IDのみを保存する

**実装上の注意点：**
```typescript
// Stripe Elements を使った安全な決済フォーム
// - CardElement はStripeのiframeで描画される
// - カード情報は副楽のサーバーを経由しない
// - トークン化されたPaymentMethodのみを受け取る

// サーバー側でSubscriptionを作成する際のフロー
// 1. クライアント: Stripe.js でPaymentMethodを作成
// 2. サーバー: Stripe APIでCustomer作成 + Subscription作成
// 3. サーバー: Subscription IDをDBに保存（カード情報は保存しない）
```

---

## 返金ポリシーの設計

Stripe経由の返金に関する法的留意点：

**返金ポリシー設計の指針：**
- デジタルサービスは原則返金不可と明記
- ただし、以下のケースでは返金を検討：
  - サービスに重大な不具合があった場合
  - 二重課金が発生した場合
  - サービス停止が長期間に及んだ場合
- 返金処理はStripe Dashboardまたは Stripe API経由で実施
- 返金手数料：Stripeは返金額に応じた手数料は返還されない（2024年時点）

**Stripeの返金に関する技術的注意：**
- 返金処理は Stripe Refund API を使用
- 部分返金も可能
- 返金処理のWebhookイベント（`charge.refunded`）をハンドリング
- 返金履歴をDBに記録

---

## インボイス制度への対応

2023年10月開始のインボイス制度（適格請求書等保存方式）への対応：

**個人開発者（免税事業者）の場合：**
- 売上が1,000万円以下の場合は消費税の免税事業者
- ユーザーが事業者（経費として計上したい場合）にはインボイスの発行が求められる可能性
- 免税事業者の場合、適格請求書発行事業者の登録は任意だが、BtoBの需要がある場合は検討

**Stripeでのインボイス発行：**
- Stripe Invoicing 機能を使ってインボイスを自動発行可能
- 適格請求書の記載要件（登録番号、税率、税額の明記等）に対応
- Stripe Billing Portal でユーザーが領収書・インボイスをダウンロード可能

---

## Stripe Webhook の実装とセキュリティ

**必須Webhookイベント：**

| イベント | 用途 |
|---------|------|
| `checkout.session.completed` | 初回決済完了、プラン有効化 |
| `customer.subscription.updated` | プラン変更の反映 |
| `customer.subscription.deleted` | 解約処理 |
| `invoice.payment_succeeded` | 月次課金成功 |
| `invoice.payment_failed` | 課金失敗（ユーザー通知） |
| `charge.refunded` | 返金処理の反映 |

**Webhook署名検証（セキュリティ必須）：**
```typescript
// app/api/webhooks/stripe/route.ts

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook Error", { status: 400 });
  }

  // イベント処理
  switch (event.type) {
    case "customer.subscription.updated":
      // プラン変更をDBに反映
      break;
    case "customer.subscription.deleted":
      // 解約をDBに反映
      break;
    case "invoice.payment_failed":
      // ユーザーに課金失敗を通知
      break;
  }

  return new Response("OK", { status: 200 });
}
```

**ローカル開発でのWebhookテスト：**
```bash
# Stripe CLIのインストール
brew install stripe/stripe-cli/stripe

# ローカルにWebhookを転送
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# テストイベントの送信
stripe trigger checkout.session.completed
```

---

## Stripeの顧客データ管理

**Customer Portal の設定：**
- ユーザーが自分でプラン変更・解約できるStripe Customer Portalを設定
- 請求書・領収書のダウンロードをユーザー自身で可能に
- 支払い方法の変更もPortal上で完結

**Customer Portalへのリンク生成：**
```typescript
// app/api/billing/portal/route.ts

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // DBからStripe Customer IDを取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user!.id)
    .single();

  // Customer Portalセッション作成
  const session = await stripe.billingPortal.sessions.create({
    customer: profile!.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_URL}/settings`,
  });

  return Response.json({ url: session.url });
}
```

---

## 法令チェックリスト（Stripe・決済関連）

- [ ] 割賦販売法：クレジットカード情報の非保持化（Stripe Elements使用）
- [ ] 資金決済法：プリペイド方式を導入していないことを確認
- [ ] 特商法表示：支払方法・支払時期・解約方法を明記
- [ ] インボイス制度：適格請求書発行の要否を判断
- [ ] Stripe Webhook の署名検証を実装済みか
- [ ] 二重課金防止の実装（Idempotency Keyの使用）
- [ ] 返金ポリシーをLP・利用規約に明記
