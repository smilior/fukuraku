---
name: documentation-templates
description: ドキュメントテンプレート集。README・APIドキュメント・コードコメント・Changelog・ADR・AI対応ドキュメントの構造ガイドライン。
allowed-tools: Read, Glob, Grep
---

# Documentation Templates

効率的なドキュメント作成のためのテンプレートと構造ガイドライン。

## 前提条件・制約
- テンプレートは出発点。プロジェクトのニーズに合わせて適宜カスタマイズすること
- 構造原則: スキャン可能・例を先に・段階的詳細・最新維持

## 詳細ドキュメント

| ドキュメント種別 | 内容 | 参照先 |
|---------------|------|-------|
| README | 必須セクション・テンプレート | [readme.md](./references/readme.md) |
| API・コードコメント | エンドポイント・JSDoc/TSDoc | [api-comments.md](./references/api-comments.md) |
| Changelog・ADR | Keep a Changelog形式・意思決定記録 | [changelog-adr.md](./references/changelog-adr.md) |
| AI対応ドキュメント | llms.txt・RAGインデックス向け設計 | [ai-docs.md](./references/ai-docs.md) |
