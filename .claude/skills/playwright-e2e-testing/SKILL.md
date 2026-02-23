---
name: playwright-e2e-testing
description: Playwright E2Eテストフレームワーク。クロスブラウザ自動化、Page Object Model、認証、ネットワークモック、CI/CD統合をカバー。
allowed-tools: Bash
---

# Playwright E2E Testing

クロスブラウザE2Eテストの実装ガイド。

## 前提条件・制約
- テストは `tests/` ディレクトリに配置、設定は `playwright.config.ts` で管理
- CI環境では `forbidOnly: true`, `retries: 2`, `workers: 1` を設定
- セレクターは role/label/test-id を優先（CSS/XPathは最終手段）

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | インストール・設定・プロジェクト構成 | [SETUP.md](./SETUP.md) |
| 2 | Locator戦略・ユーザー操作・アサーション | [FUNDAMENTALS.md](./FUNDAMENTALS.md) |
| 3 | Page Object Model パターン | [POM.md](./POM.md) |
| 4 | 認証・セッション・ストレージ管理 | [AUTH.md](./AUTH.md) |
| 5 | ネットワークモック・インターセプト | [NETWORK.md](./NETWORK.md) |
| 6 | 並列実行・Visual Testing・デバッグ | [ADVANCED.md](./ADVANCED.md) |
| 7 | GitHub Actions・CI/CD統合 | [CI.md](./CI.md) |
