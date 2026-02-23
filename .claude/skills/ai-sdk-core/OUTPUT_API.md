# Output API（generateObject/streamObject 代替）

## 重要: generateObject/streamObject は非推奨

`generateObject()` と `streamObject()` は **DEPRECATED**（将来削除予定）。
代わりに Output API を使用すること。

## Before/After 比較

**Before（v5 - 非推奨）:**
```typescript
// 非推奨 - 将来削除される
import { generateObject } from 'ai';

const result = await generateObject({
  model: openai('gpt-5'),
  schema: z.object({ name: z.string(), age: z.number() }),
  prompt: 'Generate a person',
});
```

**After（v6 - これを使う）:**
```typescript
// 新しい Output API
import { generateText, Output } from 'ai';

const result = await generateText({
  model: openai('gpt-5'),
  output: Output.object({ schema: z.object({ name: z.string(), age: z.number() }) }),
  prompt: 'Generate a person',
});

// 型付きオブジェクトへのアクセス
console.log(result.object); // { name: "Alice", age: 30 }
```

## Output タイプ一覧

```typescript
import { generateText, Output } from 'ai';

// Zod スキーマ付きオブジェクト
output: Output.object({ schema: myZodSchema })

// 型付きオブジェクトの配列
output: Output.array({ schema: personSchema })

// 列挙型・選択肢から選択
output: Output.choice({ choices: ['positive', 'negative', 'neutral'] })

// プレーンテキスト（明示的）
output: Output.text()

// 非構造化 JSON（スキーマバリデーションなし）
output: Output.json()
```

## ストリーミングと Output API

```typescript
import { streamText, Output } from 'ai';

const result = streamText({
  model: openai('gpt-5'),
  output: Output.object({ schema: personSchema }),
  prompt: 'Generate a person',
});

// 部分的なオブジェクトをストリーム
for await (const partialObject of result.objectStream) {
  console.log(partialObject); // { name: "Ali..." } -> { name: "Alice", age: ... }
}

// 最終オブジェクトを取得
const finalObject = await result.object;
```

## v6 新機能

### 1. Agent 抽象化

`ToolLoopAgent` クラスによるエージェント構築の統一インターフェース:
- 実行フロー、ツールループ、状態管理を完全制御
- 手動ツール呼び出しオーケストレーションを置き換え

### 2. ツール実行承認（Human-in-the-Loop）

選択的承認を使用してUXを向上させる。すべてのツール呼び出しに承認が必要なわけではない。

```typescript
tools: {
  payment: tool({
    // 入力に基づく動的承認
    needsApproval: async ({ amount }) => amount > 1000,
    inputSchema: z.object({ amount: z.number() }),
    execute: async ({ amount }) => { /* process payment */ },
  }),

  readFile: tool({
    needsApproval: false, // 安全な操作は承認不要
    inputSchema: z.object({ path: z.string() }),
    execute: async ({ path }) => fs.readFile(path),
  }),

  deleteFile: tool({
    needsApproval: true, // 破壊的操作は常に承認必要
    inputSchema: z.object({ path: z.string() }),
    execute: async ({ path }) => fs.unlink(path),
  }),
}
```

**ベストプラクティス:**
- パラメーターによってリスクが変わる操作に動的承認を使用（例: 支払い金額）
- 破壊的操作（削除、変更、購入）は常に承認を必要とする
- 安全な読み取り操作には承認不要
- システム指示に追加: "ツール実行が承認されない場合、再試行しないこと"
- 承認リクエストのタイムアウトを実装してスタック状態を防ぐ
- 繰り返し操作のユーザー設定を保存

**参考リンク:**
- [Next.js Human-in-the-Loop Guide](https://ai-sdk.dev/cookbook/next/human-in-the-loop)
- [Cloudflare Agents Human-in-the-Loop](https://developers.cloudflare.com/agents/guides/human-in-the-loop/)

### 3. RAG 向けリランキング

```typescript
import { rerank } from 'ai';

const result = await rerank({
  model: cohere.reranker('rerank-v3.5'),
  query: 'user question',
  documents: searchResults,
  topK: 5,
});
```

### 4. MCP ツール（Model Context Protocol）

セキュリティ警告: MCP ツールは本番環境で重大なリスクがある。詳細は [STREAMING.md](./STREAMING.md) を参照。

```typescript
import { experimental_createMCPClient } from 'ai';

const mcpClient = await experimental_createMCPClient({
  transport: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem'] },
});

const tools = await mcpClient.tools();

const result = await generateText({
  model: openai('gpt-5'),
  tools,
  prompt: 'List files in the current directory',
});
```

**既知の問題:** MCP ツールはストリーミングモードで実行されない場合がある。MCP ツールには `streamText()` の代わりに `generateText()` を使用すること。

**MCP セキュリティ考慮事項:**

リスク:
- ツール定義がエージェントのプロンプトの一部になる
- 警告なしに変更される可能性がある
- 侵害された MCP サーバーが悪意あるプロンプトを注入できる
- 新しいツールがユーザー権限をエスカレートできる（例: 読み取り専用サーバーに削除を追加）

**解決策 - 静的ツール生成を使用:**

```typescript
// 危険: 動的ツールは制御なしに変更される
const mcpClient = await experimental_createMCPClient({ /* ... */ });
const tools = await mcpClient.tools(); // いつでも変更される可能性！

// 安全: 静的なバージョン管理されたツール定義を生成
// Step 1: mcp-to-ai-sdk をインストール
npm install -g mcp-to-ai-sdk

// Step 2: 静的ツールを生成（一度だけ、バージョン管理）
npx mcp-to-ai-sdk generate stdio 'npx -y @modelcontextprotocol/server-filesystem'

// Step 3: 静的ツールをインポート
import { tools } from './generated-mcp-tools';

const result = await generateText({
  model: openai('gpt-5'),
  tools, // 静的、レビュー済み、バージョン管理済み
  prompt: 'Use tools',
});
```

**ベストプラクティス:** 静的ツールを生成し、レビューし、バージョン管理にコミットし、意図的にのみ更新すること。
