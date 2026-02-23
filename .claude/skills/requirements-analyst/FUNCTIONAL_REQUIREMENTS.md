# Functional Requirements & SRS Templates

## Software Requirements Specification (SRS) Template

```markdown
# ソフトウェア要求仕様書（SRS）

**プロジェクト名**: [Project Name]
**バージョン**: 1.0
**作成日**: [YYYY-MM-DD]
**作成者**: Requirements Analyst AI

---

## 1. はじめに

### 1.1 目的
本ドキュメントは[プロジェクト名]のソフトウェア要求を定義します。

### 1.2 スコープ
- **対象範囲**: [範囲]
- **対象外**: [対象外項目]

### 1.3 定義・略語
- **[用語1]**: [定義]
- **[用語2]**: [定義]

### 1.4 参照文書
- ビジネス要求書 v1.0
- UI/UXデザインガイドライン

---

## 2. システム概要

### 2.1 システムの目的
[目的の説明]

### 2.2 ユーザー
- **エンドユーザー**: [説明]（想定人数: [数]）
- **管理者**: [説明]（想定人数: [数]）

### 2.3 対象環境
- **ブラウザ**: Chrome 100+, Firefox 100+, Safari 15+
- **デバイス**: デスクトップ、タブレット、スマートフォン
- **ネットワーク**: インターネット接続必須

---

## 3. 機能要件

### 3.1 [機能グループ1]
- FR-001: [機能説明]
- FR-002: [機能説明]

### 3.2 [機能グループ2]
- FR-011: [機能説明]
- FR-012: [機能説明]

---

## 4. 非機能要件

### 4.1 パフォーマンス
- NFR-001: ページ表示 <2秒（90パーセンタイル）
- NFR-002: 同時接続ユーザー数 [数]人

### 4.2 可用性
- NFR-011: 稼働率 99.9%
- NFR-012: RTO 1時間、RPO 15分

### 4.3 セキュリティ
- NFR-021: TLS 1.3通信
- NFR-022: OWASP Top 10対策
- NFR-023: GDPR準拠

### 4.4 保守性
- NFR-031: ゼロダウンタイムデプロイ
- NFR-032: ログ集約・監視

---

## 5. 外部インターフェース

### 5.1 ユーザーインターフェース
- レスポンシブデザイン（モバイルファースト）
- アクセシビリティ（WCAG 2.1 AA準拠）

### 5.2 ソフトウェアインターフェース
- **[外部API1]**: [説明]
- **[外部API2]**: [説明]

### 5.3 通信インターフェース
- **プロトコル**: HTTPS（TLS 1.3）
- **データフォーマット**: JSON

---

## 6. システム特性

### 6.1 信頼性
- エラー率 <0.1%
- データ整合性 100%

### 6.2 ユーザビリティ
- 新規ユーザーが5分以内に操作完了可能

### 6.3 移植性
- Dockerコンテナ対応
- AWS/GCP/Azure対応

---

## 7. その他の要件

### 7.1 法的要件
- [該当する法規制]

### 7.2 標準準拠
- RESTful API設計
- [該当する標準規格]

---

## 付録A: 用語集
- **[用語1]**: [定義]

## 付録B: 変更履歴

| バージョン | 日付   | 変更内容 | 作成者                  |
| ---------- | ------ | -------- | ----------------------- |
| 1.0        | [日付] | 初版作成 | Requirements Analyst AI |
```

---

## Functional Requirements Template

```markdown
# 機能要件書

**プロジェクト名**: [Project Name]
**作成日**: [YYYY-MM-DD]
**バージョン**: 1.0

> **NOTE**: すべての受入基準はEARS形式（Easy Approach to Requirements Syntax）で記述します。
> 詳細は `steering/rules/ears-format.md` を参照してください。

---

## FR-[番号]: [機能名]

**優先度**: Must Have / Should Have / Could Have / Won't Have
**カテゴリー**: [カテゴリー名]

### 説明
[機能の詳細説明]

### 詳細要件

1. **入力**
   - [入力項目1]
   - [入力項目2]

2. **処理**
   - [処理内容1]
   - [処理内容2]

3. **出力**
   - [出力項目1]
   - [出力項目2]

### 受入基準（EARS形式）

#### AC-1: [イベント駆動要件]

**Pattern**: Event-Driven (WHEN)
```

WHEN [event], the [System/Service] SHALL [response]

```

**Test Verification**:
- [ ] Unit test: [テスト内容]
- [ ] Integration test: [テスト内容]

---

#### AC-2: [状態駆動要件]
**Pattern**: State-Driven (WHILE)
```

WHILE [state], the [System/Service] SHALL [response]

```

**Test Verification**:
- [ ] Unit test: [テスト内容]
- [ ] Integration test: [テスト内容]

---

#### AC-3: [エラー処理要件]
**Pattern**: Unwanted Behavior (IF...THEN)
```

IF [error condition], THEN the [System/Service] SHALL [response]

```

**Test Verification**:
- [ ] Error handling test: [テスト内容]
- [ ] E2E test: [テスト内容]

---

### 制約条件
- [制約1]
- [制約2]

### 依存関係
- [依存する要件ID]

---
```

---

## Workflow Engine Integration (v2.1.0)

**Requirements Analyst** は **Stage 1: Requirements** を担当します。

### ワークフロー連携

```bash
# 要件定義開始時（Stage 1へ遷移）
musubi-workflow next requirements

# 要件定義完了時（Stage 2へ遷移）
musubi-workflow next design
```

### ステージ完了チェックリスト

要件定義ステージを完了する前に確認：

- [ ] SRS（Software Requirements Specification）が作成済み
- [ ] 機能要件がEARS形式で定義済み
- [ ] 非機能要件が定義済み
- [ ] ユーザーストーリーが作成済み
- [ ] 要件のトレーサビリティIDが付与済み
- [ ] ステークホルダーの承認を取得

### フィードバックループ

後続ステージで要件の問題が発見された場合：

```bash
# 設計で問題発見 → 要件に戻る
musubi-workflow feedback design requirements -r "要件の曖昧さを解消"

# テストで問題発見 → 要件に戻る
musubi-workflow feedback testing requirements -r "受入基準の修正が必要"
```

---

## Phase 6: 段階的成果物生成

```
🤖 確認ありがとうございます。以下の成果物を順番に生成します。

【生成予定の成果物】（英語版と日本語版の両方）
1. ソフトウェア要求仕様書（SRS）
2. 機能要件書
3. 非機能要件書
4. ユーザーストーリー
5. トレーサビリティマトリクス

合計: 10ファイル（5ドキュメント × 2言語）
生成を開始してよろしいですか？
👤 ユーザー: [回答待ち]
```

承認後、**各ドキュメントを順番に生成**:

**Step 1: SRS（英語版）**
```
🤖 [1/10] ソフトウェア要求仕様書（SRS）英語版を生成しています...
📝 ./docs/requirements/srs/srs-[project-name]-v1.0.md
✅ 保存が完了しました
```

**Step 2: 機能要件書（英語版）**
```
🤖 [2/10] 機能要件書英語版を生成しています...
📝 ./docs/requirements/functional/functional-requirements-[project-name]-20251112.md
✅ 保存が完了しました
```

**Step 3: 非機能要件書（英語版）**
```
🤖 [3/10] 非機能要件書英語版を生成しています...
📝 ./docs/requirements/non-functional/non-functional-requirements-20251112.md
✅ 保存が完了しました
```

**大きなSRS(>300行)の場合:**
```
🤖 [4/10] 詳細要件仕様書(SRS)を生成しています...
⚠️ SRSドキュメントが500行になるため、2パートに分割して生成します。

📝 Part 1/2: requirements/srs/software-requirements-specification.md (機能要件&非機能要件)
✅ 保存が完了しました (300行)

📝 Part 2/2: requirements/srs/software-requirements-specification.md (制約条件&トレーサビリティ)
✅ 保存が完了しました (230行)
```

**Step 4-5: ユーザーストーリー・トレーサビリティ（英語版）**
```
🤖 [5/10] トレーサビリティマトリクス英語版を生成しています...
📝 ./docs/requirements/traceability-matrix-20251112.md
✅ 保存が完了しました

[5/10] 完了。英語版ドキュメントの生成が完了しました。次に日本語版を生成します。
```

**Step 6-10: 日本語版（同じ順序で生成）**

```
🤖 ✨ すべての成果物の生成が完了しました！

【次のステップ】
1. 成果物を確認して、フィードバックをお願いします
2. 次のフェーズには以下のエージェントをお勧めします:
   - System Architect（システムアーキテクチャ設計）
   - Database Schema Designer（データベース設計）
   - API Designer（API設計）
```

---

## Phase 7: Steering更新 (Project Memory Update)

**更新対象ファイル:**
- `steering/product.md` (英語版)
- `steering/product.ja.md` (日本語版)

**更新内容:**
- **Core Features**: 今回定義した機能要件（Functional Requirements）の概要
- **User Stories**: 主要なユーザーストーリーのサマリー
- **Non-Functional Requirements**: 主要な非機能要件
- **Target Users**: ユーザーストーリーから抽出したペルソナ情報
- **Business Context**: プロジェクトの目的とビジネス価値

**更新例:**

```markdown
## Core Features (Updated: 2025-01-12)

### Authentication & Authorization
- User registration with email verification
- OAuth 2.0 integration (Google, GitHub)
- Role-based access control (Admin, User, Guest)

### Product Management
- Product catalog with search and filtering
- Inventory management
- Price management with discount support

## Key Non-Functional Requirements

### Performance
- Response time: < 200ms (95th percentile)
- Concurrent users: 10,000+

### Security
- TLS 1.3 encryption
- OWASP Top 10 compliance
- GDPR compliance

### Availability
- Uptime: 99.9%
- RTO: 1 hour, RPO: 15 minutes
```

---

## File Naming Conventions

- **SRS**: `srs-{project-name}-v{version}.md` / `.ja.md`
- **機能要件**: `functional-requirements-{feature-name}-{YYYYMMDD}.md` / `.ja.md`
- **出力パス**: `./docs/requirements/functional/`, `./docs/requirements/srs/`

## Document Creation Rules (細分化ルール)

1. **一度に1ファイルずつ作成** - すべての成果物を一度に生成しない
2. **ドキュメントが300行を超える場合、複数のパートに分割**
3. **各セクション/章を別ファイルとして即座に保存**
4. **禁止事項**:
   - 複数の大きなドキュメントを一度に生成
   - ユーザー確認なしでファイルを連続生成
   - 300行を超えるドキュメントを分割せず作成
