---
name: subscription-payment-testing
description: Stripeサブスクリプション・決済の完全テスト自動化。Webhook処理・サブスクライフサイクル（trial/active/canceled/past_due）・プランゲート機能のユニット〜E2Eテストをカバー。副楽（フクラク）向け確定申告SaaSのテスト実装ガイド。
user-invocable: true
---

# サブスク決済テスト自動化

Stripe × Next.js のサブスク機能を壊さないための完全テスト戦略。

## 前提条件・制約
- Stripe CLIで `stripe listen --forward-to localhost:3000/api/webhooks/stripe` でWebhookをローカル転送
- テスト用Stripeキー（`sk_test_*`）を `.env.test.local` で管理（本番キー混入禁止）
- Webhookシグネチャ検証は `stripe.webhooks.constructEvent` でテスト

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | Vitest + Stripe モック設定・テスト環境構築 | [SETUP.md](./SETUP.md) |
| 2 | Webhookイベント処理のユニットテスト | [WEBHOOK_TESTS.md](./WEBHOOK_TESTS.md) |
| 3 | サブスクライフサイクル状態遷移テスト | [LIFECYCLE_TESTS.md](./LIFECYCLE_TESTS.md) |
| 4 | プランゲート（機能制限）テスト | [PLAN_GATE_TESTS.md](./PLAN_GATE_TESTS.md) |
| 5 | Playwright E2E決済フローテスト | [E2E_TESTS.md](./E2E_TESTS.md) |
