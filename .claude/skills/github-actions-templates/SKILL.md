---
name: github-actions-templates
description: Create production-ready GitHub Actions workflows for automated testing, building, and deploying applications. Use when setting up CI/CD with GitHub Actions, automating development workflows, or creating reusable workflow templates.
---

# GitHub Actions Templates

テスト・ビルド・デプロイを自動化するGitHub Actionsワークフローテンプレート集。

## 前提条件・制約
- アクションは `@master` / `@latest` を避け、バージョン固定（`@v4` 等）を使用
- 機密情報はGitHub Secretsで管理（ハードコーディング禁止）
- 本番デプロイには `environment: production` で承認ゲートを設定

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | テスト・Docker・K8s・マトリックス + 再利用可能ワークフロー | [WORKFLOWS.md](./WORKFLOWS.md) |
| 2 | セキュリティスキャン・承認付きデプロイ・ベストプラクティス10選 | [SECURITY.md](./SECURITY.md) |
