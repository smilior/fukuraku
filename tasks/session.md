# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
- Issue #3: Supabase Auth（Google OAuth + Email）実装完了
  - shadcn/ui 初期化 + components (button, input, label, card, separator)
  - src/middleware.ts 作成（proxy.ts は Next.js に認識されなかったため正しい名前で作成）
  - src/app/(auth)/login/page.tsx: Google OAuth + メール/パスワード ログイン
  - src/app/(auth)/signup/page.tsx: Google OAuth + メール/パスワード 新規登録
  - src/app/auth/callback/route.ts: OAuth PKCE コード交換
  - src/app/dashboard/page.tsx + logout-button.tsx: プレースホルダー + ログアウト
  - src/app/page.tsx: 認証状態に応じて /dashboard or /login にリダイレクト
  - layout.tsx: メタデータを副楽用に更新、lang="ja"

## 次セッションの再開ポイント
Issue #26「Vercel Preview Deployments」から着手

## 未解決・持ち越し
- Supabase Dashboard で Google OAuth Provider を有効化が必要（手動作業）
  1. Supabase Dashboard → Authentication → Providers → Google を ON
  2. Google Cloud Console で OAuth Client ID を取得
  3. Authorized redirect URI: https://<project>.supabase.co/auth/v1/callback
- proxy.ts は削除候補（middleware.ts が正しく動作している）
- prod マイグレーションは本番運用開始時に実施
