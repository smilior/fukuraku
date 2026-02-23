---
name: git-commit
description: 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mentions "/commit". Supports: (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping'
license: MIT
allowed-tools: Bash
---

# Git Commit with Conventional Commits

差分を分析してConventional Commits仕様に沿ったコミットメッセージを自動生成する。

## 前提条件・制約
- シークレット（.env、秘密鍵）は絶対にコミットしない
- force push・--no-verifyは明示的な指示がない限り使用禁止
- pre-commit hook失敗時は --amendではなく新しいコミットを作成

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | Conventional Commits フォーマット・タイプ一覧 | [CONVENTIONAL_COMMITS.md](./CONVENTIONAL_COMMITS.md) |
| 2 | 差分分析・ステージ・コミット実行ワークフロー | [WORKFLOW.md](./WORKFLOW.md) |
| 3 | Git Safety Protocol・ベストプラクティス | [SAFETY.md](./SAFETY.md) |
