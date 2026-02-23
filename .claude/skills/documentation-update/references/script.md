# doc_generator.py スクリプトリファレンス

## 処理フロー

1. `marketplace.json` を読み込み・バリデーション
2. プラグインファイルをスキャン（エージェント/コマンドのフロントマター抽出）
3. テンプレートコンテキストを準備
4. Jinja2テンプレートでレンダリング → `docs/` に出力

## 使い方

```bash
# 全ドキュメント生成
python doc_generator.py

# 特定ファイルのみ
python doc_generator.py --file agents

# ドライラン（ファイル書き込みなし）
python doc_generator.py --dry-run

# カスタムパス指定
python doc_generator.py \
  --marketplace .claude-plugin/marketplace.json \
  --templates path/to/assets \
  --output docs
```

## テンプレートコンテキスト変数

```python
{
  "marketplace": { "name": "...", "plugins": [...] },
  "plugins_by_category": { "category": [plugin1, ...] },
  "all_agents": [{ "plugin": "...", "name": "...", "model": "..." }],
  "all_skills": [{ "plugin": "...", "name": "...", "path": "..." }],
  "all_commands": [{ "plugin": "...", "name": "...", "file": "..." }],
  "stats": { "total_plugins": N, "total_agents": N, "total_skills": N }
}
```

## ファイル構成

```
skills/documentation-update/
├── SKILL.md
├── doc_generator.py
└── assets/
    ├── agents.md.j2
    ├── agent-skills.md.j2
    ├── plugins.md.j2
    └── usage.md.j2
```

## 要件

- Python 3.8+（外部依存なし、標準ライブラリのみ）
- `.claude-plugin/marketplace.json` への読み取り権限
- `docs/` への書き込み権限
