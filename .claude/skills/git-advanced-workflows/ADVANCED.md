# 高度なテクニック・ベストプラクティス・リカバリーコマンド

## Rebase vs Merge 使い分け

**Rebaseが適切な場面：**
- pushする前のローカルコミットを整理
- featureブランチをmainと同期させる
- レビューしやすいリニアな履歴を作る

**Mergeが適切な場面：**
- mainへの完成済みfeatureの統合
- 共同作業の正確な履歴を保持する
- 他のメンバーが使っているpublicブランチ

```bash
# featureブランチをmainの変更で更新（rebase）
git checkout feature/my-feature
git fetch origin
git rebase origin/main

# コンフリクト解決後
git add .
git rebase --continue

# または mergeの場合
git merge origin/main
```

## Autosquashワークフロー

fixupコミットをrebase時に自動的にsquashする。

```bash
git commit -m "feat: add user authentication"

# 後でそのコミットを修正
git commit --fixup HEAD  # または特定のハッシュ

# autosquashでリベース
git rebase -i --autosquash main
# fixupコミットが自動的にマークされる
```

## コミットの分割

1つのコミットを複数の論理的なコミットに分割する。

```bash
git rebase -i HEAD~3
# 分割したいコミットを 'edit' にマーク

# コミットをリセット（変更は保持）
git reset HEAD^

# 論理的な単位で分けてステージ・コミット
git add file1.py
git commit -m "feat: add validation"

git add file2.py
git commit -m "feat: add error handling"

git rebase --continue
```

## 部分的なCherry-Pick

コミットから特定ファイルのみを適用する。

```bash
git show --name-only abc123

# 特定ファイルだけをcheckout
git checkout abc123 -- path/to/file1.py path/to/file2.py

git commit -m "cherry-pick: apply specific changes from abc123"
```

## ベストプラクティス

1. **`--force-with-lease`を使う** — `--force`より安全、他の人の作業を上書きしない
2. **ローカルコミットのみリベース** — push済み・共有済みコミットはリベースしない
3. **わかりやすいコミットメッセージ** — 未来の自分への贈り物
4. **アトミックなコミット** — 1コミット = 1つの論理的変更
5. **force pushの前にテスト** — 履歴書き換えが壊れていないか確認
6. **reflogを把握する** — 90日間の安全ネット
7. **危険な操作の前にバックアップブランチを作る**

```bash
# 安全なforce push
git push --force-with-lease origin feature/branch

# リスクのある操作の前にバックアップ
git branch backup-branch
git rebase -i main
# 問題が起きた場合
git reset --hard backup-branch
```

## よくある落とし穴

- **publicブランチのリベース** → 他のメンバーの履歴が壊れる
- **--leaseなしのforce push** → チームメイトの作業を上書きするリスク
- **リベース中の作業消失** → コンフリクトを慎重に解決、リベース後にテスト
- **worktreeの放置** → ディスクスペースを消費するので `git worktree prune`
- **実験前のバックアップ忘れ** → 常にsafetyブランチを作成
- **dirty workingディレクトリでのbisect** → beforeにcommitかstash

## リカバリーコマンド集

```bash
# 進行中の操作を中止
git rebase --abort
git merge --abort
git cherry-pick --abort
git bisect reset

# 特定コミットからファイルを復元
git restore --source=abc123 path/to/file

# 直前のコミットを取り消し（変更を保持）
git reset --soft HEAD^

# 直前のコミットを取り消し（変更を破棄）
git reset --hard HEAD^

# 削除済みブランチを復元（90日以内）
git reflog
git branch recovered-branch abc123
```
