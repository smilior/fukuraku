# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #4: オンボーディング画面（3ステップウィザード）実装・完了
  - `supabase/migrations/20260223100000_add_onboarding_fields.sql` — 4カラム追加、dev に適用済み
  - `src/types/database.ts` — 新カラム追加＋Relationships/Views/Functions/Enums/CompositeTypes追加（postgrest-js v2 必須）
  - `src/lib/supabase/middleware.ts` — /onboarding を protectedPaths に追加
  - `src/app/onboarding/page.tsx` — 新規作成（3ステップウィザード）
  - `src/app/dashboard/page.tsx` — onboarding_completed チェック追加
  - `src/components/ui/progress.tsx` — shadcn/ui Progress インストール

## 環境一覧（確定）
| 環境 | URL | ブランチ |
|------|-----|---------|
| ローカル | http://localhost:3000 | - |
| 検証 | https://fukuraku-git-staging-smiliors-projects.vercel.app | staging |
| 本番 | https://fukuraku.vercel.app | main |

## 次セッションの再開ポイント
Milestone 1 残りの Issue を確認して次を着手すること。
`gh api repos/smilior/fukuraku/milestones` で次の優先Issueを確認する。

## 未解決・持ち越し
- ローカルWebhookテスト: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  を実行してから開発すること（Webhook実装はIssue #8相当）
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- Stripe 本番モードキー（sk_live_）は有料ユーザー発生時に切り替え
- `Database` 型に `Relationships: []` が必須（postgrest-js v2）— 今後テーブル追加時も必ず記述すること
