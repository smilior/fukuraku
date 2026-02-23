# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #4: オンボーディング画面（3ステップウィザード）実装・完了
- Issue #5: ダッシュボードUI・20万円バー実装・完了
  - 20万円プログレスバー（年間所得 / 20万円）
  - 今月の収入・経費・差引所得カード
  - Recharts 年間月別棒グラフ（yearly-chart.tsx as Client Component）
  - 直近取引リスト（収入+経費合算 top5）
  - クイックアクション（+収入 / +経費 / カメラ準備中）
- Issue #6: 収入記録画面CRUD実装・完了
  - /income（一覧・月別フィルタ）
  - /income/new（追加フォーム・源泉徴収10.21%自動計算・Switch）
  - /income/[id]/edit（編集・Dialog削除確認）
- Issue #7: 経費記録画面CRUD実装・完了
  - /expense（一覧・月別フィルタ）
  - /expense/new（追加フォーム）
  - /expense/[id]/edit（編集・削除確認）
- shadcn/ui: badge, dialog, select, switch, table, textarea 追加インストール
- recharts@3.7.0 追加

## Milestone 1 (Week 1-2) 完了状況
すべてのIssueが完了 → 次は Milestone 2 (Week 3-4: MVP完成) へ

## 環境一覧（確定）
| 環境 | URL | ブランチ |
|------|-----|---------|
| ローカル | http://localhost:3000 | - |
| 検証 | https://fukuraku-git-staging-smiliors-projects.vercel.app | staging |
| 本番 | https://fukuraku.vercel.app | main |

## 次セッションの再開ポイント
`gh issue list --milestone "Week 3-4: MVP完成"` で次Issueを確認してから着手

## 未解決・持ち越し
- ローカルWebhookテスト: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- Stripe 本番モードキー（sk_live_）は有料ユーザー発生時に切り替え
- `Database` 型に `Relationships: []` が必須（postgrest-js v2）— テーブル追加時も必須
