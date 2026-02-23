# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #3: Supabase Auth（Google OAuth）実装完了
  - shadcn/ui 初期化・認証ページ作成・middleware→proxy.ts 修正
  - Google OAuth のみに絞る（メール/パスワード削除）
- Issue #26: Vercel Preview Deployments 設定完了
  - vercel link（GitHub smilior/fukuraku 接続）
  - Preview・Production 環境変数設定（Supabase dev キー）
  - Production デプロイ: https://fukuraku.vercel.app
  - PR#30 で Preview URL 自動生成を動作確認済み

## 次セッションの再開ポイント
Issue #29「Stripe テスト/本番モード切り替え設定」から着手

## 未解決・持ち越し
- Supabase prod の OAuth redirect URL に Vercel本番URLを追加する必要あり
  → `uri_allow_list` に `https://fukuraku.vercel.app/**` を追加
  → Google Cloud Console の Authorized origins にも追加
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- Stripe 実キーは Issue #29 で設定
