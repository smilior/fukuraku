# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #3: Supabase Auth（Google OAuth のみ）実装・動作確認
- Issue #26: Vercel Preview Deployments 設定完了
- Issue #31: staging ブランチ・検証環境セットアップ完了
- Issue #29: Stripe テスト/本番モード切り替え設定完了
  - テストモード商品・価格ID作成（ベーシック/プロ/シーズンパス）
  - 本番Webhookエンドポイント登録（fukuraku.vercel.app/api/stripe/webhook）
  - .env.local と Vercel 環境変数を実キーで更新

## 環境一覧（確定）
| 環境 | URL | ブランチ |
|------|-----|---------|
| ローカル | http://localhost:3000 | - |
| 検証 | https://fukuraku-git-staging-smiliors-projects.vercel.app | staging |
| 本番 | https://fukuraku.vercel.app | main |

## 次セッションの再開ポイント
Issue #4「オンボーディング画面」から着手（Milestone 1 残り）

## 未解決・持ち越し
- ローカルWebhookテスト: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  を実行してから開発すること（Webhook実装はIssue #8相当）
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- Stripe 本番モードキー（sk_live_）は有料ユーザー発生時に切り替え
