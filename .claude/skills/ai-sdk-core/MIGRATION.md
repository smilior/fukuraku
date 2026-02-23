# v4→v5→v6 マイグレーション

## v4→v5 破壊的変更の概要

AI SDK v5 は大規模な破壊的変更を導入した。v4 から移行する場合はこのガイドに従うこと。

### 1. パラメーター名の変更
- `maxTokens` → `maxOutputTokens`
- `providerMetadata` → `providerOptions`

### 2. ツール定義
- `parameters` → `inputSchema`
- ツールプロパティ: `args` → `input`, `result` → `output`

### 3. メッセージ型
- `CoreMessage` → `ModelMessage`
- `Message` → `UIMessage`
- `convertToCoreMessages` → `convertToModelMessages`

### 4. ツールエラーハンドリング
- `ToolExecutionError` クラス削除
- `tool-error` コンテンツパーツになった
- 自動リトライが可能に

### 5. マルチステップ実行
- `maxSteps` → `stopWhen`
- `stepCountIs()` または `hasToolCall()` を使用

### 6. メッセージ構造
- シンプルな `content` 文字列 → `parts` 配列
- パーツ: text, file, reasoning, tool-call, tool-result

### 7. ストリーミングアーキテクチャ
- 単一チャンク → start/delta/end ライフサイクル
- 並行ストリームのユニーク ID

### 8. ツールストリーミング
- デフォルトで有効に
- `toolCallStreaming` オプション削除

### 9. パッケージ再編成
- `ai/rsc` → `@ai-sdk/rsc`
- `ai/react` → `@ai-sdk/react`
- `LangChainAdapter` → `@ai-sdk/langchain`

## 移行例

**Before (v4):**
```typescript
import { generateText } from 'ai';

const result = await generateText({
  model: openai.chat('gpt-4-turbo'),
  maxTokens: 500,
  providerMetadata: { openai: { user: 'user-123' } },
  tools: {
    weather: {
      description: 'Get weather',
      parameters: z.object({ location: z.string() }),
      execute: async (args) => { /* args.location */ },
    },
  },
  maxSteps: 5,
});
```

**After (v5):**
```typescript
import { generateText, tool, stopWhen, stepCountIs } from 'ai';

const result = await generateText({
  model: openai('gpt-4-turbo'),
  maxOutputTokens: 500,
  providerOptions: { openai: { user: 'user-123' } },
  tools: {
    weather: tool({
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => { /* input.location */ },
    }),
  },
  stopWhen: stepCountIs(5),
});
```

## v4→v5 移行チェックリスト

- [ ] `maxTokens` を `maxOutputTokens` に更新
- [ ] `providerMetadata` を `providerOptions` に更新
- [ ] ツールの `parameters` を `inputSchema` に変換
- [ ] ツールの execute 関数を更新: `args` → `input`
- [ ] `maxSteps` を `stopWhen(stepCountIs(n))` に置き換え
- [ ] メッセージ型を更新: `CoreMessage` → `ModelMessage`
- [ ] `ToolExecutionError` ハンドリングを削除
- [ ] パッケージインポートを更新 (`ai/rsc` → `@ai-sdk/rsc`)
- [ ] ストリーミング動作をテスト（アーキテクチャ変更）
- [ ] TypeScript 型を更新

## 自動マイグレーション

AI SDK は移行ツールを提供:

```bash
npx ai migrate
```

ほとんどの破壊的変更を自動的に更新する。変更内容は慎重にレビューすること。

**公式マイグレーションガイド:** https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0

## v5→v6 の変更

### Output API（v6 の主要変更）

`generateObject()` と `streamObject()` が非推奨になり、Output API が導入された:

```typescript
// v5（非推奨）
const result = await generateObject({
  model: openai('gpt-5'),
  schema: mySchema,
  prompt: 'Generate data',
});

// v6（新しい Output API）
import { generateText, Output } from 'ai';

const result = await generateText({
  model: openai('gpt-5'),
  output: Output.object({ schema: mySchema }),
  prompt: 'Generate data',
});
console.log(result.object); // 型付きオブジェクト
```

### v6 での新しい Output タイプ

```typescript
output: Output.object({ schema: myZodSchema })    // オブジェクト
output: Output.array({ schema: personSchema })     // 配列
output: Output.choice({ choices: ['a', 'b', 'c'] }) // 列挙型
output: Output.text()                               // プレーンテキスト
output: Output.json()                               // 非構造化 JSON
```

### v5 ツール呼び出しの変更

**破壊的変更:**
- `parameters` → `inputSchema`（Zod スキーマ）
- ツールプロパティ: `args` → `input`、`result` → `output`
- `ToolExecutionError` 削除（`tool-error` コンテンツパーツになった）
- `maxSteps` パラメーター削除 → `stopWhen(stepCountIs(n))` を使用

**v5 の新機能:**
- 動的ツール（コンテキストに基づいて実行時にツールを追加）
- Agent クラス（ツール付きのマルチステップ実行）

## バージョン確認

```bash
# 現在のバージョン確認
npm view ai version
npm view ai dist-tags

# 特定バージョンのインストール
npm install ai@6.0.26   # 推奨安定版
# v6.0.40 はスキップ（Breaking streaming change、v6.0.41 で revert）
```
