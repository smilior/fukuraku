# Git 実践ワークフロー集

## Workflow 1: PRのためにfeatureブランチを整理

```bash
git checkout feature/user-auth

# インタラクティブリベースで履歴をクリーンに
git rebase -i main
# - "fix typo"系コミットをsquash
# - コミットメッセージをreword
# - 不要なコミットをdrop

# force-with-leaseで安全にpush（--forceは使わない）
git push --force-with-lease origin feature/user-auth
```

## Workflow 2: ホットフィックスを複数リリースに適用

```bash
# mainにfixを作成
git checkout main
git commit -m "fix: critical security patch"

# 各releaseブランチにcherry-pick
git checkout release/2.0
git cherry-pick abc123

git checkout release/1.9
git cherry-pick abc123

# コンフリクトが発生した場合
git cherry-pick --continue
# または中止
git cherry-pick --abort
```

## Workflow 3: バグ導入コミットを特定

```bash
git bisect start
git bisect bad HEAD
git bisect good v2.1.0

# Gitが中間コミットをcheckout → テスト実行
# テスト失敗
git bisect bad
# テスト成功
git bisect good
# バグコミットが特定されるまで繰り返す
```

## Workflow 4: 複数ブランチの並行開発

```bash
# 緊急バグ修正用のworktreeを作成
git worktree add ../myapp-hotfix hotfix/critical-bug

# 別ディレクトリでhotfixを作業
cd ../myapp-hotfix
git commit -m "fix: resolve critical bug"
git push origin hotfix/critical-bug

# メインの作業に戻る
cd ~/projects/myapp
git fetch origin
git cherry-pick hotfix/critical-bug

# 完了後にworktreeを削除
git worktree remove ../myapp-hotfix
```

## Workflow 5: ミスからの回復

```bash
# 誤ってreset --hardしてしまった場合
git reset --hard HEAD~5  # 誤操作！

# reflogで失ったコミットを探す
git reflog
# abc123 HEAD@{0}: reset: moving to HEAD~5
# def456 HEAD@{1}: commit: my important changes

# 失ったコミットを復元
git reset --hard def456

# またはブランチとして作成
git branch recovery def456
```
