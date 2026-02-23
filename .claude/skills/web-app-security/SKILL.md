---
name: web-app-security
description: 副楽（副業確定申告SaaS）向けWebアプリセキュリティ実装ガイド。Supabase RLS、OWASP Top 10、個人情報保護法（APPI）対応、Next.js セキュリティヘッダー設定を含む。
user-invocable: true
---

# 副楽 Webアプリケーション セキュリティ実装ガイド

確定申告データ・個人情報・決済情報を安全に扱うための設定と実装パターンを網羅しています。
Supabase RLS、OWASP Top 10 対策、個人情報保護法（APPI）対応、Next.js セキュリティヘッダーを含みます。

## 前提条件・制約

- RLS はすべてのテーブルで必ず有効化する（anon キー経由でのデータ漏洩防止）
- service_role キーはサーバーサイド（API Routes / Server Components）のみで使用
- NEXT_PUBLIC_ プレフィックスを秘密鍵（OpenAI, Stripe, Supabase service role）に付けない

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | Supabase RLS 有効化・テーブル別ポリシー・Storage RLS・バイパス対策 | [RLS.md](./RLS.md) |
| 2 | OWASP Top 10 対策（A01〜A09）・Middleware・認証・監査ログ | [OWASP.md](./OWASP.md) |
| 3 | 個人情報保護法（APPI）対応・データ削除・保持期間・OpenAI送信ポリシー・インシデント対応 | [COMPLIANCE.md](./COMPLIANCE.md) |
| 4 | Next.js セキュリティヘッダー・CSP・Rate Limiting・CORS・Zod入力検証・API キー管理 | [HEADERS.md](./HEADERS.md) |
| 5 | リリース前セキュリティチェックリスト（DB・認証・通信・XSS・プライバシー・インフラ） | [CHECKLIST.md](./CHECKLIST.md) |
