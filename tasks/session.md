# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #2: Supabase スキーマ・クライアント初期化
  - supabase init / @supabase/supabase-js・ssr インストール
  - migrations/20260223044150_initial_schema.sql（4テーブル + RLS + トリガー）
  - src/types/database.ts / src/lib/supabase/{client,server,middleware}.ts
  - src/proxy.ts（Next.js 16 は middleware.ts → proxy.ts）
- Issue #27: Supabase dev/prod 分離
  - fukuraku-dev（ref: lbwjnplwjzzbjdmutshd）作成・マイグレーション適用済み
  - fukuraku-prod（ref: mjmxibsponmvucyqdpvc）作成・マイグレーション未適用
  - .env.local に dev 接続情報設定済み

## 次セッションの再開ポイント
Issue #3「Supabase Auth（Google OAuth + Email）」から着手

## 未解決・持ち越し
- Supabase Access Token をチャットに貼ってしまった → 新トークン発行済み・旧トークン削除を確認すること
- prod マイグレーションは本番運用開始時に実施（`supabase link --project-ref mjmxibsponmvucyqdpvc && supabase db push`）
