# Stripe ID 一覧

## アカウント
- Account ID: `acct_1SaZnGRQRbdjVDUh`（Smilior Lab サンドボックス）

## テストモード商品・価格 ID

| プラン | 商品ID | 価格ID | 金額 | 種別 |
|--------|--------|--------|------|------|
| ベーシック | `prod_U1vuZuTEZDDA4M` | `price_1T3s2xRQRbdjVDUhZtGWsPYo` | ¥980/月 | recurring |
| プロ | `prod_U1vuR6FsKcsBOR` | `price_1T3s2yRQRbdjVDUhv8h7DkjO` | ¥1,480/月 | recurring |
| シーズンパス | `prod_U1vuqRwfLOtwUU` | `price_1T3s2aRQRbdjVDUhS6rbBtp4` | ¥2,980 | one-time |

## Webhook エンドポイント（テストモード）

| 環境 | URL | Webhook ID |
|------|-----|-----------|
| 本番 | `https://fukuraku.smilior.com/api/stripe/webhook` | `we_1T3s3fRQRbdjVDUhf59RlLlb` |
| ローカル | `http://localhost:3000/api/stripe/webhook`（stripe listen 経由） | - |

## Webhook イベント
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 本番モード切り替え手順
1. Stripe Dashboard で本番モードの商品・価格を作成
2. 本番の `sk_live_` / `pk_live_` キーを取得
3. Vercel の Production 環境変数を `sk_live_` / `pk_live_` に更新
4. 本番 Webhook エンドポイントを本番モードで再登録
5. `STRIPE_PRICE_BASIC` / `STRIPE_PRICE_PRO` / `STRIPE_PRICE_SEASON` を本番 price_ID に更新

> **注意**: テストモードと本番モードで price_ID は別になる。env 変数の切り替えだけで対応可能。
