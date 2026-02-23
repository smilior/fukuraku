# ストリーミング・リアルタイム AI

## ストリーミングの基本

```typescript
import { streamText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';

// テキストストリーミング
const result = streamText({
  model: openai('gpt-5'),
  prompt: 'Tell me about AI',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

## ストリームレスポンスメソッド（v5）

API からストリーミングレスポンスを返す際は正しいメソッドを使用:

| メソッド | 出力形式 | ユースケース |
|--------|---------|-----------|
| `toTextStreamResponse()` | プレーンテキストチャンク | シンプルなテキストストリーミング |
| `toUIMessageStreamResponse()` | SSE with JSON events | **Chat UI**（text-start, text-delta, text-end, finish） |

**Chat UI には必ず `toUIMessageStreamResponse()` を使う:**

```typescript
const result = streamText({
  model: workersai('@cf/qwen/qwen3-30b-a3b-fp8'),
  messages,
  system: 'You are helpful.',
});

// Chat UI 用 - SSE with JSON events を返す
return result.toUIMessageStreamResponse({
  headers: { 'Access-Control-Allow-Origin': '*' },
});

// シンプルなテキスト用
return result.toTextStreamResponse();
```

**注意:** `toDataStreamResponse()` は AI SDK v5 に存在しない（よくある誤解）

## Output API によるオブジェクトストリーミング

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

## MCP ツール（セキュリティ注意）

**SECURITY WARNING**: MCP ツールは本番環境で重大なリスクがある。

### 動的 MCP ツール（リスクあり）

```typescript
import { experimental_createMCPClient } from 'ai';

const mcpClient = await experimental_createMCPClient({
  transport: { type: 'stdio', command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem'] },
});

const tools = await mcpClient.tools();
```

**リスク:**
- ツール定義がエージェントのプロンプトの一部になる
- 警告なしに変更される可能性がある
- 侵害された MCP サーバーが悪意あるプロンプトを注入できる
- 新しいツールがユーザー権限をエスカレートできる

### 静的 MCP ツール（推奨）

```typescript
// Step 1: インストール
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

**既知の問題:** MCP ツールはストリーミングモードで実行されない場合がある。`streamText()` ではなく `generateText()` を使用すること。

## ストリームエラー対処

### streamText がサイレントに失敗（修正済み）

**Status:** RESOLVED - ai@4.1.22 で修正（Feb 2025）

```typescript
// onError コールバックを使用（推奨）
const stream = streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Hello',
  onError({ error }) {
    console.error('Stream error:', error);
  },
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

```typescript
// 手動 try-catch（フォールバック）
try {
  const stream = streamText({
    model: openai('gpt-4-turbo'),
    prompt: 'Hello',
  });

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
} catch (error) {
  console.error('Stream error:', error);
}
```

## 既知の問題とワークアラウンド

### useChat ステールクロージャ（メモ化オプション）

**問題:** `useMemo` で `useChat` のオプションをメモ化すると、`onData` や `onFinish` コールバックがステールクロージャになり、更新された状態変数を参照できない。

**出典:** [GitHub Issue #11686](https://github.com/vercel/ai/issues/11686)

```typescript
// 問題のある例
const [count, setCount] = useState(0);

const chatOptions = useMemo(() => ({
  onFinish: (message) => {
    console.log('Count:', count); // 常に 0！更新されない
  },
}), []); // 空の依存配列 = ステールクロージャ
```

**ワークアラウンド 1 - コールバックをメモ化しない:**
```typescript
const { messages, append } = useChat({
  onFinish: (message) => {
    console.log('Count:', count); // 現在の count を参照できる
  },
});
```

**ワークアラウンド 2 - useRef を使用:**
```typescript
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]);

const chatOptions = useMemo(() => ({
  onFinish: (message) => {
    console.log('Count:', countRef.current); // 常に最新
  },
}), []);
```

### タブ切り替え時のストリーム再開失敗

**問題:** AI ストリーム中にブラウザタブを切り替えたり、アプリをバックグラウンドにすると、戻ったときにストリームが再開されない。

**出典:** [GitHub Issue #11865](https://github.com/vercel/ai/issues/11865)

**影響:** 高 - 長時間実行ストリームの大きなUX問題

```typescript
// ワークアラウンド 1 - onError ハンドラー
const { messages, append, reload } = useChat({
  api: '/api/chat',
  onError: (error) => {
    if (error.message.includes('stream') || error.message.includes('aborted')) {
      reload();
    }
  },
});
```

```typescript
// ワークアラウンド 2 - ページ可視性変更を検出
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant' && !lastMessage.content) {
        reload();
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [messages, reload]);
```

**Status:** 既知の制限、自動再接続機能なし
