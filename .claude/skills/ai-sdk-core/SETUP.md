# セットアップ・基本設定

## インストール

```bash
npm install ai @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google zod
```

## AI SDK バージョン情報

**AI SDK:**
- Stable: ai@6.0.26 (Jan 2026)
- Skip v6.0.40 - Breaking streaming change (reverted in v6.0.41)
- Legacy v5: ai@5.0.117 (ai-v5 tag)
- Zod 3.x/4.x both supported

**Latest Models (2026):**
- OpenAI: GPT-5.2, GPT-5.1, GPT-5, o3, o3-mini, o4-mini
- Anthropic: Claude Sonnet 4.5, Opus 4.1, Haiku 4.5
- Google: Gemini 2.5 Pro/Flash/Lite

```bash
npm view ai version
npm view ai dist-tags
```

## 最新 AI モデル一覧（2025-2026）

### OpenAI

**GPT-5.2** (Dec 2025):
- 400k context window, 128k output tokens
- Enhanced reasoning capabilities
- Available in API platform

**GPT-5.1** (Nov 2025):
- Improved speed and efficiency over GPT-5
- "Warmer" and more intelligent responses

**GPT-5** (Aug 2025):
- 45% less hallucination than GPT-4o
- State-of-the-art in math, coding, visual perception

**o3 Reasoning Models** (Dec 2025):
- o3, o3-pro, o3-mini - Advanced reasoning
- o4-mini - Fast reasoning

```typescript
import { openai } from '@ai-sdk/openai';
const gpt52 = openai('gpt-5.2');
const gpt51 = openai('gpt-5.1');
const gpt5 = openai('gpt-5');
const o3 = openai('o3');
const o3mini = openai('o3-mini');
```

### Anthropic

**Claude 4 Family** (May-Oct 2025):
- **Opus 4** (May 22): Best for complex reasoning, $15/$75 per million tokens
- **Sonnet 4** (May 22): Balanced performance, $3/$15 per million tokens
- **Opus 4.1** (Aug 5): Enhanced agentic tasks, real-world coding
- **Sonnet 4.5** (Sept 29): Most capable for coding, agents, computer use
- **Haiku 4.5** (Oct 15): Small, fast, low-latency model

```typescript
import { anthropic } from '@ai-sdk/anthropic';
const sonnet45 = anthropic('claude-sonnet-4-5-20250929');  // Latest
const opus41 = anthropic('claude-opus-4-1-20250805');
const haiku45 = anthropic('claude-haiku-4-5-20251015');
```

### Google

**Gemini 2.5 Family** (Mar-Sept 2025):
- **Pro** (March 2025): Most intelligent, #1 on LMArena at launch
- **Pro Deep Think** (May 2025): Enhanced reasoning mode
- **Flash** (May 2025): Fast, cost-effective
- **Flash-Lite** (Sept 2025): Updated efficiency

```typescript
import { google } from '@ai-sdk/google';
const pro = google('gemini-2.5-pro');
const flash = google('gemini-2.5-flash');
const lite = google('gemini-2.5-flash-lite');
```

## コア関数リファレンス

### テキスト生成
- **generateText()** - テキスト補完（ツール付き）
- **streamText()** - リアルタイムストリーミング

### 構造化出力（v6 Output API）
- **Output.object()** - Zod スキーマ付きオブジェクト（generateObject の置き換え）
- **Output.array()** - 型付き配列
- **Output.choice()** - 列挙型選択
- **Output.json()** - 非構造化 JSON

## マルチモーダル機能

### 音声合成（Text-to-Speech）

```typescript
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateSpeech({
  model: openai.speech('tts-1-hd'),
  voice: 'alloy',
  text: 'Hello, how can I help you today?',
});

// result.audio は ArrayBuffer
const audioBuffer = result.audio;
```

**対応プロバイダー:** OpenAI (tts-1, tts-1-hd, gpt-4o-mini-tts), ElevenLabs, LMNT, Hume

### 文字起こし（Speech-to-Text）

```typescript
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: audioFile, // File, Blob, ArrayBuffer, or URL
});

console.log(result.text);     // 文字起こしテキスト
console.log(result.segments); // タイムスタンプ付きセグメント
```

**対応プロバイダー:** OpenAI (whisper-1), ElevenLabs, Deepgram, AssemblyAI, Groq, Rev.ai

### 画像生成

```typescript
import { generateImage } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic city at sunset',
  size: '1024x1024',
  n: 1,
});

const imageUrl = result.images[0].url;
const imageBase64 = result.images[0].base64;
```

**対応プロバイダー:** OpenAI (dall-e-2, dall-e-3), Google (imagen-3.0), Fal AI, Flux, Luma AI, Replicate

### エンベディング

```typescript
import { embed, embedMany, cosineSimilarity } from 'ai';
import { openai } from '@ai-sdk/openai';

// 単一エンベディング
const result = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'Hello world',
});
console.log(result.embedding); // number[]

// 複数エンベディング（並列処理）
const results = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['Hello', 'World', 'AI'],
  maxParallelCalls: 5,
});

// 類似度比較
const similarity = cosineSimilarity(
  results.embeddings[0],
  results.embeddings[1]
);
```

**対応プロバイダー:** OpenAI, Google, Cohere, Voyage AI, Mistral, Amazon Bedrock

### マルチモーダルプロンプト（ファイル・画像・PDF）

```typescript
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const result = await generateText({
  model: google('gemini-2.5-pro'),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'Summarize this document' },
      { type: 'file', data: pdfBuffer, mimeType: 'application/pdf' },
    ],
  }],
});

// 画像の場合
const result = await generateText({
  model: openai('gpt-5'),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'What is in this image?' },
      { type: 'image', image: imageBuffer },
    ],
  }],
});
```

## workers-ai-provider バージョン互換性

**重要:** `workers-ai-provider@2.x` は AI SDK v5 が必要（v4 不可）

```bash
# 正しい - AI SDK v5 と workers-ai-provider v2
npm install ai@^5.0.0 workers-ai-provider@^2.0.0 zod@^3.25.0

# 間違い - AI SDK v4 はエラーになる
npm install ai@^4.0.0 workers-ai-provider@^2.0.0
# Error: "AI SDK 4 only supports models that implement specification version v1"
```

**Zod バージョン:** AI SDK v5 は `zod@^3.25.0` 以降が必要

## Cloudflare Workers スタートアップ修正

**問題:** AI SDK v5 + Zod が起動時間 270ms 超（Workers 400ms 制限を超過）

```typescript
// 悪い例: トップレベルインポートがオーバーヘッドを引き起こす
import { createWorkersAI } from 'workers-ai-provider';
const workersai = createWorkersAI({ binding: env.AI });

// 良い例: ハンドラー内で遅延初期化
app.post('/chat', async (c) => {
  const { createWorkersAI } = await import('workers-ai-provider');
  const workersai = createWorkersAI({ binding: c.env.AI });
  // ...
});
```

**追加対策:**
- トップレベルの Zod スキーマを最小化
- 複雑なスキーマをルートハンドラー内に移動
- Wrangler で起動時間を監視

## ストリームレスポンスメソッド

API からストリーミングレスポンスを返す際は正しいメソッドを使用:

| メソッド | 出力形式 | ユースケース |
|--------|---------|-----------|
| `toTextStreamResponse()` | プレーンテキストチャンク | シンプルなテキストストリーミング |
| `toUIMessageStreamResponse()` | SSE with JSON events | **Chat UI**（text-start, text-delta, text-end, finish） |

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
```

**注意:** `toDataStreamResponse()` は AI SDK v5 に存在しない（よくある誤解）

## 言語モデルミドルウェア

```typescript
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';

const wrappedModel = wrapLanguageModel({
  model: anthropic('claude-sonnet-4-5-20250929'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});

// <think>...</think> タグから推論を自動抽出
```

## テレメトリー（OpenTelemetry）

```typescript
const result = await generateText({
  model: openai('gpt-5'),
  prompt: 'Hello',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-chat-function',
    metadata: { userId: '123' },
    recordInputs: true,
    recordOutputs: true,
  },
});
```

## 公式ドキュメント

- AI SDK v6: https://ai-sdk.dev/docs
- AI SDK Core: https://ai-sdk.dev/docs/ai-sdk-core/overview
- Output API: https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data
- All Errors (31): https://ai-sdk.dev/docs/reference/ai-sdk-errors
- Providers (69+): https://ai-sdk.dev/providers/overview
- Speech: https://ai-sdk.dev/docs/ai-sdk-core/speech
- Transcription: https://ai-sdk.dev/docs/ai-sdk-core/transcription
- Image Generation: https://ai-sdk.dev/docs/ai-sdk-core/image-generation
- Embeddings: https://ai-sdk.dev/docs/ai-sdk-core/embeddings
- GitHub: https://github.com/vercel/ai
