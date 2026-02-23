---
name: git-advanced-workflows
description: Master advanced Git workflows including rebasing, cherry-picking, bisect, worktrees, and reflog to maintain clean history and recover from any situation. Use when managing complex Git histories, collaborating on feature branches, or troubleshooting repository issues.
---

# Git Advanced Workflows

リベース・cherry-pick・bisect・worktreeなど高度なGit操作で、クリーンな履歴管理とミスからの復旧を行う。

## 前提条件・制約
- push済み・共有済みコミットはリベースしない
- force pushは `--force-with-lease` を使用（`--force` 禁止）
- 危険な操作の前に必ずバックアップブランチを作成

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | rebase・cherry-pick・bisect・worktree・reflog の基本 | [CORE_CONCEPTS.md](./CORE_CONCEPTS.md) |
| 2 | PR整理・hotfix適用・バグ特定・並行開発・ミス回復 | [WORKFLOWS.md](./WORKFLOWS.md) |
| 3 | 高度なテクニック・ベストプラクティス・リカバリーコマンド集 | [ADVANCED.md](./ADVANCED.md) |
