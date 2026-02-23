# ベストプラクティスと Git Safety Protocol

## ベストプラクティス

- 1コミット = 1つの論理的な変更
- 現在形で書く：「add」（「added」はNG）
- 命令形で書く：「fix bug」（「fixes bug」はNG）
- Issueを参照する：`Closes #123`、`Refs #456`
- descriptionは72文字以内に収める

## Git Safety Protocol（厳守）

- **絶対にgit configを変更しない**
- **明示的な指示なしに破壊的コマンドを実行しない**（`--force`、`reset --hard`、`checkout .`、`restore .`、`clean -f`、`branch -D`）
- **明示的な指示なしにフックをスキップしない**（`--no-verify`）
- **main/masterへのforce pushは絶対にしない**
- **pre-commit hookが失敗した場合**: --amendは使わず、問題を修正してから **新しいコミット** を作成する
- シークレット（`.env`、`credentials.json`、秘密鍵）を含むファイルは絶対にコミットしない

## コミットが失敗した場合の対処

```bash
# hookが失敗した場合
# 1. 問題を修正する（lintエラー、テスト失敗等）
# 2. 再ステージ
git add path/to/fixed/file
# 3. 新しいコミットを作成（amendは使わない）
git commit -m "<type>[scope]: <description>"
```
