---
name: testing-strategy
description: 副楽（副業確定申告SaaS）のテスト戦略。Vitest + React Testing Library + Playwright E2E。確定申告計算ロジック、AI仕訳精度、Stripe決済フローのテスト実装ガイド。
user-invocable: true
---

# 副楽 テスト戦略・実装ガイド

副楽（副業確定申告SaaS）の品質を担保するためのテスト戦略と具体的な実装パターンです。
Vitest によるユニット/インテグレーションテスト、Playwright による E2E テストを網羅しています。

## 前提条件・制約

- 確定申告計算ロジックのテストは最優先（金額の誤りは致命的）
- カバレッジ閾値: lines/functions/statements 70%、branches 60%
- E2E テストは unit/integration テスト合格後に実行（needs: unit-and-integration）

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | テストピラミッド設計・Vitest/Playwright セットアップ・カバレッジ目標 | [SETUP.md](./SETUP.md) |
| 2 | ユニットテスト（計算ロジック・バリデーション・Supabase モック・OCR精度） | [UNIT_TESTS.md](./UNIT_TESTS.md) |
| 3 | Playwright E2E テスト（認証・OCR・Stripe決済・確定申告フロー） | [E2E_TESTS.md](./E2E_TESTS.md) |
| 4 | GitHub Actions CI/CD ワークフロー・ブランチ保護設定 | [CI_CD.md](./CI_CD.md) |
