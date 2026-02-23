# 副楽 — Lessons Learned

## Next.js 16 の変更点

### middleware.ts → proxy.ts
- **問題**: Next.js 16 では `middleware.ts` が廃止され `proxy.ts` に変更された
- **エラー**: `Both middleware file and proxy file are detected. Please use proxy.ts only.`
- **対処**: ルートミドルウェアは `src/proxy.ts` に `export async function proxy(...)` で定義する
- **関連ファイル**: `src/proxy.ts`（正）, `src/middleware.ts`（廃止）

## Supabase Management API

### Google OAuth 設定
- Supabase Dashboard を使わず CLI + Management API 経由で設定可能
- アクセストークンは macOS Keychain に base64 エンコードで保存されている
  ```bash
  TOKEN=$(security dump-keychain | grep go-keyring-base64 | sed 's/.*go-keyring-base64://' | base64 -d)
  ```
- エンドポイント: `PATCH https://api.supabase.com/v1/projects/{ref}/config/auth`

## Next.js dev server

### lock ファイル問題
- プロセスを強制終了すると `.next/dev/lock` が残ることがある
- 対処: `rm -f .next/dev/lock` してから再起動
