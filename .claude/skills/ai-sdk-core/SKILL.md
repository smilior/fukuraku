---
name: ai-sdk-core
description: |
  Build backend AI with Vercel AI SDK v6 stable. Covers Output API (replaces generateObject/streamObject), speech synthesis, transcription, embeddings, MCP tools with security guidance. Includes v4→v5 migration and 15 error solutions with workarounds.

  Use when: implementing AI SDK v5/v6, migrating versions, troubleshooting AI_APICallError, Workers startup issues, Output API errors, Gemini caching issues, Anthropic tool errors, MCP tools, or stream resumption failures.
user-invocable: true
---

# AI SDK Core

Vercel AI SDK v6 を使ったバックエンドAI実装。Output API、音声合成、MCP、エラー対処を網羅。

## 前提条件・制約

- AI SDK v6 安定版（ai@6.0.26）を使用すること（v6.0.40 はスキップ）
- `generateObject()` / `streamObject()` は非推奨。Output API を使うこと
- Cloudflare Workers では起動時間に注意（270ms 超過の問題あり）

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | インストール・最新モデル一覧・マルチモーダル・Workers互換性 | [SETUP.md](./SETUP.md) |
| 2 | Output API全タイプ・v6新機能（Agent・Human-in-Loop・MCP） | [OUTPUT_API.md](./OUTPUT_API.md) |
| 3 | ストリーミング・MCP セキュリティ・useChat既知問題とワークアラウンド | [STREAMING.md](./STREAMING.md) |
| 4 | エラー対処15パターン（AI_APICallError〜tool-result配置問題） | [ERROR_HANDLING.md](./ERROR_HANDLING.md) |
| 5 | v4→v5→v6 マイグレーションガイド・破壊的変更チェックリスト | [MIGRATION.md](./MIGRATION.md) |
