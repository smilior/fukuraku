# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #3: Supabase Auth（Google OAuth のみ）実装・動作確認
- Issue #26: Vercel Preview Deployments 設定完了
- Issue #31: staging ブランチ・検証環境セットアップ完了

## 環境一覧（確定）
| 環境 | URL | ブランチ | 用途 |
|------|-----|---------|------|
| ローカル | http://localhost:3000 | - | 開発 |
| 検証 | https://fukuraku-git-staging-smiliors-projects.vercel.app | staging | QA・認証テスト |
| 本番 | https://fukuraku.vercel.app | main | 本番 |

## 自動デプロイフロー（確認済み）
- main push → https://fukuraku.vercel.app に自動デプロイ
- staging push → https://fukuraku-git-staging-smiliors-projects.vercel.app に自動デプロイ
- feature/* push & PR → 一意の Preview URL 自動生成

## 次セッションの再開ポイント
Issue #29「Stripe テスト/本番モード切り替え設定」から着手

## 未解決・持ち越し
- Stripe 実キーは Issue #29 で設定
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- next-pwa（PWA対応）は後続 Issue で対応
