# Git Commit ワークフロー

## Step 1: 差分を分析する

```bash
# ステージ済みの差分を確認
git diff --staged

# 未ステージの差分を確認
git diff

# ステータス確認
git status --porcelain
```

## Step 2: ファイルをステージする（必要な場合）

```bash
# 特定ファイルをステージ
git add path/to/file1 path/to/file2

# パターンでステージ
git add *.test.*
git add src/components/*

# インタラクティブなステージング
git add -p
```

**秘密情報（.env, credentials.json, 秘密鍵）は絶対にコミットしない。**

## Step 3: コミットメッセージを生成する

差分から以下を判断する：

- **Type**: どの種類の変更か？
- **Scope**: どのモジュール・エリアに影響するか？
- **Description**: 変更内容を1行で要約（現在形・命令形・72文字以内）

## Step 4: コミットを実行する

```bash
# 1行のコミット
git commit -m "<type>[scope]: <description>"

# 本文・フッター付きのコミット
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body>

<optional footer>
EOF
)"
```
