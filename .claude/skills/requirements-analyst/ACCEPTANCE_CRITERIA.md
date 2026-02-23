# Acceptance Criteria & Validation

## Requirements Validation Checklist

### 完全性

- [ ] すべての機能が要件として定義されているか？
- [ ] すべての非機能要件が定義されているか？
- [ ] 例外処理・エラーケースが考慮されているか？

### 一貫性

- [ ] 要件間に矛盾がないか？
- [ ] 用語が統一されているか？
- [ ] 優先度が明確か？

### 実現可能性

- [ ] 技術的に実現可能か？
- [ ] 予算内で収まるか？
- [ ] 期限内に開発可能か？

### テスト可能性

- [ ] 受入基準が明確か？
- [ ] 定量的に測定可能か？
- [ ] テストシナリオを作成できるか？

### 追跡可能性

- [ ] 要件IDが付与されているか？
- [ ] ビジネス要求との紐付けが明確か？
- [ ] 実装・テストにリンクできるか？

---

## Guiding Principles

1. **明確性**: 曖昧さを排除し、具体的に記述
2. **完全性**: すべての要件をカバー
3. **一貫性**: 矛盾のない要件定義
4. **実現可能性**: 技術的・財務的に達成可能
5. **テスト可能性**: 検証可能な受入基準
6. **追跡可能性**: 要件IDで管理

### 禁止事項

- 曖昧な表現（「使いやすい」「速い」など）
- 実装方法の指定（要件は「What」を定義、「How」は定義しない）
- 検証不可能な要件
- 優先度のない要件
- ステークホルダー合意なしの要件変更

---

## Documentation Language Policy

**CRITICAL: 英語版と日本語版の両方を必ず作成**

### Document Creation

1. **Primary Language**: Create all documentation in **English** first
2. **Translation**: **REQUIRED** - After completing the English version, **ALWAYS** create a Japanese translation
3. **Both versions are MANDATORY** - Never skip the Japanese version
4. **File Naming Convention**:
   - English version: `filename.md`
   - Japanese version: `filename.ja.md`

### Document Reference Rules

1. **Always reference English documentation** when reading or analyzing existing documents
2. 他のエージェントが作成した成果物を読み込む場合は、必ず英語版（`.md`）を参照する
3. **ファイルパスを指定する際は、常に `.md` を使用（`.ja.md` は使用しない）**

```
✅ 正しい: docs/requirements/srs/srs-project-v1.0.md
❌ 間違い: docs/requirements/srs/srs-project-v1.0.ja.md
```

### 禁止事項

- 英語版のみを作成して日本語版をスキップする
- すべての英語版を作成してから後で日本語版をまとめて作成する
- ユーザーに日本語版が必要か確認する（常に必須）

---

## File Output Requirements

### 出力ディレクトリ

- **ベースパス**: `./docs/requirements/`
- **機能要件**: `./docs/requirements/functional/`
- **非機能要件**: `./docs/requirements/non-functional/`
- **ユーザーストーリー**: `./docs/requirements/user-stories/`
- **仕様書**: `./docs/requirements/srs/`

### 必須出力ファイル

**重要: 各ドキュメントは英語版と日本語版の両方を必ず作成してください**

1. **ソフトウェア要求仕様書（SRS）** - 2ファイル必須
   - `srs-{project-name}-v{version}.md`
   - `srs-{project-name}-v{version}.ja.md`

2. **機能要件書** - 2ファイル必須
   - `functional-requirements-{feature-name}-{YYYYMMDD}.md`
   - `functional-requirements-{feature-name}-{YYYYMMDD}.ja.md`

3. **非機能要件書** - 2ファイル必須
   - `non-functional-requirements-{YYYYMMDD}.md`
   - `non-functional-requirements-{YYYYMMDD}.ja.md`

4. **トレーサビリティマトリクス** - 2ファイル必須
   - `traceability-matrix-{YYYYMMDD}.md`
   - `traceability-matrix-{YYYYMMDD}.ja.md`

**合計必須ファイル数: 8ファイル** (各ドキュメント × 2言語)

---

## Progress Report Updates

### 更新タイミング

1. **Phase 4開始時（成果物生成）**: `docs/progress-report.md` の「現在進行中のステップ」セクション更新
2. **各ファイル作成後**: 進捗率を更新、完了したファイルを成果物リストに追加
3. **Phase完了時**: 「現在進行中のステップ」から「完了したステップ」に移動

### 更新テンプレート

```markdown
### [YYYY-MM-DD HH:MM] - Requirements Analyst AI

- タスク: [タスク説明]
- ステータス: 🔄 進行中 / ✅ 完了
- 成果物:
  - `[file-name-1]`
  - `[file-name-2]`
- 備考: [重要な注記]
```

### ユーザー確認メッセージ例

```
✅ {filename} 作成完了（セクション X/Y）。
📊 進捗: XX% 完了

次のファイルを作成しますか？
a) はい、次のファイル「{next filename}」を作成
b) いいえ、ここで一時停止
c) 別のファイルを先に作成（ファイル名を指定してください）
```

---

## Project Memory (Steering System)

**CRITICAL: Always check steering files before starting any task**

Before beginning work, **ALWAYS** read the following files if they exist in the `steering/` directory:

**IMPORTANT: Always read the ENGLISH versions (.md) - they are the reference/source documents.**

- **`steering/structure.md`** (English) - Architecture patterns, directory organization, naming conventions
- **`steering/tech.md`** (English) - Technology stack, frameworks, development tools, technical constraints
- **`steering/product.md`** (English) - Business context, product purpose, target users, core features

**Why This Matters:**
- Ensures your work aligns with existing architecture patterns
- Uses the correct technology stack and frameworks
- Understands business context and product goals
- Maintains consistency with other agents' work
- Reduces need to re-explain project context in every session

**When steering files don't exist:**
- You can proceed with the task without them
- Consider suggesting the user run `@steering` to bootstrap project memory
