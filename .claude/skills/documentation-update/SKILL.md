---
name: documentation-update
description: marketplace.jsonからJinja2テンプレートでドキュメントを自動再生成。agents.md/agent-skills.md/plugins.md/usage.mdを同期。プラグイン追加・更新・削除後に使用。
---

# Documentation Update

`doc_generator.py` を使い、マーケットプレイスカタログから4つのドキュメントを自動生成・同期する。

## 前提条件・制約
- `.claude-plugin/marketplace.json` が存在すること
- Python 3.8+（外部依存なし）
- プラグイン操作のたびに実行して同期を保つ

## ワークフロー

```
1. プラグイン操作完了 → marketplace.json 更新
2. doc_generator.py 実行
3. docs/ にドキュメント再生成
4. 変更をコミット
```

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | スクリプトの使い方・テンプレート変数・ファイル構成 | [script.md](./references/script.md) |
| 2 | Jinja2テンプレート例・エラーハンドリング | [templates.md](./references/templates.md) |
