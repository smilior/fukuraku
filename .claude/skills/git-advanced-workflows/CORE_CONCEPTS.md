# Git 高度な操作 コアコンセプト

## 1. インタラクティブリベース

コミット履歴編集のスイスアーミーナイフ。

**操作種別：**
- `pick`: そのまま保持
- `reword`: コミットメッセージを変更
- `edit`: コミット内容を修正
- `squash`: 前のコミットと結合（メッセージも統合）
- `fixup`: squashと同様だがメッセージは破棄
- `drop`: コミットを削除

```bash
# 直近5コミットをリベース
git rebase -i HEAD~5

# 現在ブランチの全コミットをリベース
git rebase -i $(git merge-base HEAD main)

# 特定コミットからリベース
git rebase -i abc123
```

## 2. Cherry-Pick

ブランチ全体をマージせず、特定コミットだけを適用する。

```bash
# 単一コミットをcherry-pick
git cherry-pick abc123

# コミット範囲（開始は含まない）
git cherry-pick abc123..def456

# ステージのみ（コミットしない）
git cherry-pick -n abc123

# コミットメッセージを編集しながら
git cherry-pick -e abc123
```

## 3. Git Bisect

バイナリサーチでバグ導入コミットを特定する。

```bash
git bisect start
git bisect bad           # 現在のコミットをbadにマーク
git bisect good v1.0.0   # 既知のgoodコミットを指定

# Gitが中間コミットをcheckout → テストして good/bad をマーク
git bisect good  # または bad
# バグが見つかるまで繰り返す

git bisect reset  # 完了後にリセット
```

## 4. Worktrees

stashや切り替えなしで複数ブランチを同時に作業。

```bash
git worktree list

# 新しいworktreeを追加
git worktree add ../project-feature feature/new-feature

# 新しいブランチを作成しながら追加
git worktree add -b bugfix/urgent ../project-hotfix main

# worktreeを削除
git worktree remove ../project-feature

# 古いworktreeを整理
git worktree prune
```

## 5. Reflog

全ての参照移動を記録する安全ネット（削除済みコミットも）。

```bash
git reflog
git reflog show feature/branch

# 削除済みコミットを復元
git reflog        # ハッシュを探す
git checkout abc123
git branch recovered-branch

# 削除済みブランチを復元
git reflog
git branch deleted-branch abc123
```
