# 副楽 本番デプロイ前チェックリスト

## 環境変数
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — 本番 Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 本番 anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — 本番 service role key
- [ ] `STRIPE_SECRET_KEY` — 本番 Stripe secret (`sk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` — 本番 webhook secret (`whsec_`)
- [ ] `STRIPE_PRICE_BASIC` / `STRIPE_PRICE_PRO` / `STRIPE_PRICE_SEASON` — 本番 Price ID
- [ ] `OPENAI_API_KEY` — OpenAI API key

## Supabase
- [ ] 本番プロジェクトにマイグレーション適用済み
- [ ] RLS 有効化済み（全テーブル）
- [ ] Storage バケット `receipts` 作成済み
- [ ] Auth: Google OAuth redirect URI 設定済み
- [ ] Auth: サイト URL を本番ドメインに設定

## Stripe
- [ ] 本番モード有効化（テストモードではない）
- [ ] Webhook エンドポイント登録: `https://fukuraku.smilior.com/api/stripe/webhook`
- [ ] Webhook イベント: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Billing Portal 設定済み

## Vercel
- [ ] カスタムドメイン設定済み
- [ ] Environment Variables 設定済み（Production）
- [ ] Edge Config / Preview 環境分離確認

## セキュリティ
- [ ] CSP ヘッダー設定済み（next.config.ts）
- [ ] HSTS ヘッダー設定済み
- [ ] API Rate Limiting 動作確認
- [ ] 認証フロー（サインアップ → ログイン → ログアウト）確認
- [ ] RLS: 他ユーザーのデータにアクセスできないこと確認
- [ ] .env.local が .gitignore に含まれていること確認

## 機能テスト
- [ ] サインアップ（メール + Google OAuth）
- [ ] オンボーディングフロー
- [ ] 収入 CRUD（作成・一覧・編集・削除）
- [ ] 経費 CRUD（作成・一覧・編集・削除）
- [ ] レシート OCR（撮影 → AI読取 → 経費保存）
- [ ] 確定申告サマリー表示
- [ ] CSV エクスポート
- [ ] Stripe 決済フロー（チェックアウト → プランアップグレード）
- [ ] Stripe Billing Portal
- [ ] プロフィール編集
- [ ] アカウント削除
- [ ] PWA オフラインページ

## パフォーマンス
- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility >= 90
- [ ] Lighthouse Best Practices >= 90
- [ ] Lighthouse SEO >= 90
- [ ] モバイルでの動作確認

## 法務
- [ ] 利用規約ページ（/terms）公開済み
- [ ] プライバシーポリシーページ（/privacy）公開済み
- [ ] 特定商取引法に基づく表記（/legal）公開済み
