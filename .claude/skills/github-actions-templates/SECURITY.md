# セキュリティスキャン & 承認付きデプロイ

## セキュリティスキャン

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@v0.18.0  # ⚠️ バージョン固定推奨（@masterは避ける）
        with:
          scan-type: "fs"
          scan-ref: "."
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: "trivy-results.sarif"

      - name: Run Snyk Security Scan
        uses: snyk/actions/node@v0.4.0  # ⚠️ バージョン固定推奨
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

> **セキュリティ注意**: `@master` や `@latest` タグの使用は避け、常にバージョン固定（`@v3` 等）を使用すること。サプライチェーン攻撃のリスクを軽減できる。

## 承認付き本番デプロイ

```yaml
name: Deploy to Production

on:
  push:
    tags: ["v*"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com

    steps:
      - uses: actions/checkout@v4

      - name: Deploy application
        run: |
          echo "Deploying to production..."
          # Deployment commands here

      - name: Notify Slack
        if: success()
        uses: slackapi/slack-github-action@v1.27.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Deployment to production completed successfully!"
            }
```

> `environment: production` を設定することで、GitHubの承認ゲートが有効になる。

## ベストプラクティス10選

1. **アクションのバージョンを固定する** (`@v4` など、`@latest` / `@master` を避ける)
2. **依存関係をキャッシュする** — ビルド時間を短縮
3. **機密情報はSecretsを使う** — ハードコーディング禁止
4. **PRにステータスチェックを実装する**
5. **マトリックスビルドで複数バージョン対応**
6. **適切なパーミッションを設定する** (最小権限原則)
7. **再利用可能なワークフローで重複を排除**
8. **本番デプロイには承認ゲートを実装**
9. **失敗時の通知ステップを追加**
10. **機密ワークロードにはセルフホストランナーを使用**
