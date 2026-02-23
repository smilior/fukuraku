# リリース前セキュリティチェックリスト

## 1. データベースセキュリティ

```markdown
## DB セキュリティチェックリスト

- [ ] すべてのテーブルで RLS が有効化されている
- [ ] 各テーブルに適切な SELECT/INSERT/UPDATE/DELETE ポリシーが設定されている
- [ ] service_role キーがクライアントサイドで使用されていない
- [ ] Supabase Dashboard の API Settings で anon キーの権限が最小限
- [ ] テスト用データが本番 DB に残っていない
- [ ] DB バックアップが有効化されている（Supabase Pro プラン）
- [ ] Point-in-Time Recovery が設定されている（推奨）
```

---

## 2. 認証・認可

```markdown
## 認証セキュリティチェックリスト

- [ ] Supabase Auth の Email 確認が有効
- [ ] パスワードの最低文字数が 8 文字以上
- [ ] OAuth Redirect URL が本番ドメインのみに制限されている
- [ ] JWT の有効期限が適切（推奨: 1時間）
- [ ] リフレッシュトークンのローテーションが有効
- [ ] ログアウト時にセッションが適切に破棄される
- [ ] パスワードリセットフローが安全に実装されている
```

---

## 3. 環境変数・シークレット

```markdown
## 環境変数チェックリスト

- [ ] .env.local が .gitignore に含まれている
- [ ] OPENAI_API_KEY が NEXT_PUBLIC_ プレフィックスなしで設定されている
- [ ] SUPABASE_SERVICE_ROLE_KEY がサーバーサイドのみで使用されている
- [ ] STRIPE_SECRET_KEY がサーバーサイドのみで使用されている
- [ ] Vercel の環境変数で Sensitive フラグが設定されている
- [ ] 不要な環境変数が削除されている
- [ ] API キーの有効期限とスコープが適切
- [ ] ソースコードにハードコードされた秘密情報がない
```

---

## 4. 通信セキュリティ

```markdown
## 通信セキュリティチェックリスト

- [ ] HTTPS リダイレクトが設定されている（Vercel は自動）
- [ ] HSTS ヘッダーが設定されている
- [ ] CSP ヘッダーが設定されている
- [ ] X-Frame-Options: DENY が設定されている
- [ ] X-Content-Type-Options: nosniff が設定されている
- [ ] Referrer-Policy が設定されている
- [ ] Permissions-Policy が設定されている
- [ ] Stripe Webhook の署名検証が実装されている
```

---

## 5. XSS・インジェクション対策

```markdown
## XSS/インジェクション チェックリスト

- [ ] dangerouslySetInnerHTML が使用されていない（やむを得ない場合はサニタイズ）
- [ ] ユーザー入力がすべて Zod で検証されている
- [ ] Supabase クエリがパラメータ化されている（生 SQL 不使用）
- [ ] ファイルアップロードの MIME タイプとサイズが検証されている
- [ ] URL パラメータが適切にバリデーションされている
```

---

## 6. アプリケーションロジック

```markdown
## ビジネスロジック セキュリティチェックリスト

- [ ] 20万円ライン判定のテストが網羅的に書かれている
- [ ] 金額計算で浮動小数点の誤差対策がされている（整数計算推奨）
- [ ] 確定申告期限のハードコードされた日付が正しい
- [ ] 免責事項が適切に表示されている
- [ ] Rate Limiting が OCR API に設定されている
- [ ] ファイルアップロードサイズの制限が設定されている
```

---

## 7. プライバシー・コンプライアンス

```markdown
## プライバシーチェックリスト

- [ ] プライバシーポリシーが公開されている
- [ ] 利用規約が公開されている
- [ ] Cookie バナーが設置されている（GA4 使用時）
- [ ] データ削除機能が実装されている
- [ ] OpenAI へのデータ送信がプライバシーポリシーに明記されている
- [ ] Stripe の PCI DSS 準拠を確認
- [ ] 個人情報の利用目的が明示されている
```

---

## 8. インフラ・デプロイ

```markdown
## インフラセキュリティチェックリスト

- [ ] Vercel のプレビューデプロイにパスワード保護が設定されている（オプション）
- [ ] GitHub リポジトリが private に設定されている
- [ ] GitHub の Dependabot alerts が有効
- [ ] Supabase のプロジェクトリージョンが ap-northeast-1（東京）
- [ ] エラーメッセージに内部情報が含まれていない
- [ ] ソースマップが本番環境で公開されていない
```

---

## 9. 自動セキュリティスキャンの設定

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # 毎週月曜日

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --production

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main

      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'fukuraku'
          path: '.'
          format: 'HTML'

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-report
          path: reports/
```

---

## 10. 実装推奨順序

1. **RLS の有効化と全ポリシー設定**（最優先）
2. **Middleware の認証チェック実装**
3. **セキュリティヘッダーの設定**（next.config.ts）
4. **環境変数の整理と .gitignore 確認**
5. **入力値検証（Zod スキーマ）の実装**
6. **Rate Limiting の実装**
7. **監査ログの実装**
8. **セキュリティ監査チェックリストの全項目確認**
9. **自動セキュリティスキャンの CI/CD 設定**
