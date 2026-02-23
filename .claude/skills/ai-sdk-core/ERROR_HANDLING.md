# エラー対処 15 パターン

## 1. AI_APICallError

**原因:** API リクエスト失敗（ネットワーク、認証、レート制限）

```typescript
import { AI_APICallError } from 'ai';

try {
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof AI_APICallError) {
    console.error('API call failed:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Response:', error.responseBody);

    if (error.statusCode === 401) {
      // 無効な API キー
    } else if (error.statusCode === 429) {
      // レート制限 - バックオフを実装
    } else if (error.statusCode >= 500) {
      // プロバイダー問題 - リトライ
    }
  }
}
```

**予防策:** スタートアップ時に API キーを検証、指数バックオフでリトライ、レート制限を監視

---

## 2. AI_NoObjectGeneratedError

**原因:** モデルがスキーマに一致する有効なオブジェクトを生成できなかった

```typescript
import { AI_NoObjectGeneratedError } from 'ai';

try {
  const result = await generateObject({
    model: openai('gpt-4-turbo'),
    schema: z.object({ /* complex schema */ }),
    prompt: 'Generate data',
  });
} catch (error) {
  if (error instanceof AI_NoObjectGeneratedError) {
    console.error('No valid object generated');
    // 解決策: スキーマを簡略化、プロンプトにコンテキスト追加、例を提供、別モデルを試す
  }
}
```

**予防策:** シンプルなスキーマから始めて複雑にする、例を含める、GPT-4 を使用

---

## 3. Worker スタートアップ制限（270ms+）

**原因:** Cloudflare Workers で AI SDK v5 + Zod の初期化オーバーヘッドが制限超過

```typescript
// 悪い例: トップレベルインポートが起動オーバーヘッドを引き起こす
import { createWorkersAI } from 'workers-ai-provider';
const workersai = createWorkersAI({ binding: env.AI });

// 良い例: ハンドラー内で遅延初期化
export default {
  async fetch(request, env) {
    const { createWorkersAI } = await import('workers-ai-provider');
    const workersai = createWorkersAI({ binding: env.AI });
    // workersai を使用
  }
}
```

**予防策:** AI SDK インポートをルートハンドラー内に移動、トップレベルの Zod スキーマを最小化、起動時間を監視（400ms 未満が必要）

---

## 4. streamText がサイレントに失敗

**原因:** `createDataStreamResponse` でストリームエラーが飲み込まれる

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

---

## 5. AI_LoadAPIKeyError

**原因:** API キーが見つからないか無効

```typescript
import { AI_LoadAPIKeyError } from 'ai';

try {
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof AI_LoadAPIKeyError) {
    console.error('API key error:', error.message);
    // 確認事項: .env ファイルの存在と読み込み、正しい変数名（OPENAI_API_KEY）、キー形式（sk- で始まる）
  }
}
```

---

## 6. AI_InvalidArgumentError

**原因:** 関数に無効なパラメーターが渡された

```typescript
import { AI_InvalidArgumentError } from 'ai';

try {
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    maxOutputTokens: -1,  // 無効！
    prompt: 'Hello',
  });
} catch (error) {
  if (error instanceof AI_InvalidArgumentError) {
    console.error('Invalid argument:', error.message);
    // パラメーターの型と値を確認
  }
}
```

---

## 7. AI_NoContentGeneratedError

**原因:** モデルがコンテンツを生成しなかった（安全フィルター等）

```typescript
import { AI_NoContentGeneratedError } from 'ai';

try {
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: 'Some prompt',
  });
} catch (error) {
  if (error instanceof AI_NoContentGeneratedError) {
    // 考えられる原因: 安全フィルター、コンテンツポリシー、モデル設定問題
    return { text: 'Unable to generate response. Please try different input.' };
  }
}
```

---

## 8. AI_TypeValidationError

**原因:** 生成出力の Zod スキーマバリデーション失敗

```typescript
import { AI_TypeValidationError } from 'ai';

try {
  const result = await generateObject({
    model: openai('gpt-4-turbo'),
    schema: z.object({
      age: z.number().min(0).max(120),  // 厳格なバリデーション
    }),
    prompt: 'Generate person',
  });
} catch (error) {
  if (error instanceof AI_TypeValidationError) {
    console.error('Validation failed:', error.message);
    // 解決策: スキーマ制約を緩和、プロンプトにガイダンス追加、.optional() を使用
  }
}
```

**予防策:** 緩いスキーマから始めて段階的に厳格化、不確実なフィールドに `.optional()` を使用

---

## 9. AI_RetryError

**原因:** すべてのリトライが失敗した

```typescript
import { AI_RetryError } from 'ai';

try {
  const result = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: 'Hello',
    maxRetries: 3,  // デフォルトは 2
  });
} catch (error) {
  if (error instanceof AI_RetryError) {
    console.error('All retries failed');
    console.error('Last error:', error.lastError);
    // 根本原因を調査: 継続的なネットワーク問題、プロバイダー障害、無効な設定
  }
}
```

---

## 10. レート制限エラー

**原因:** プロバイダーのレート制限（RPM/TPM）を超過

```typescript
// 指数バックオフを実装
async function generateWithBackoff(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateText({
        model: openai('gpt-4-turbo'),
        prompt,
      });
    } catch (error) {
      if (error instanceof AI_APICallError && error.statusCode === 429) {
        const delay = Math.pow(2, i) * 1000;  // 指数バックオフ
        console.log(`Rate limited, waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Rate limit retries exhausted');
}
```

---

## 11. TypeScript と Zod のパフォーマンス問題

**原因:** 複雑な Zod スキーマが TypeScript 型チェックを遅くする

```typescript
// トップレベルの深いネストスキーマを避ける代わりに:
function generateData() {
  const schema = z.object({ /* complex schema */ });
  return generateObject({ model: openai('gpt-4-turbo'), schema, prompt: '...' });
}

// または再帰スキーマに z.lazy() を使用:
type Category = { name: string; subcategories?: Category[] };
const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(CategorySchema).optional(),
  })
);
```

**公式ドキュメント:** https://ai-sdk.dev/docs/troubleshooting/common-issues/slow-type-checking

---

## 12. 無効な JSON レスポンス（プロバイダー固有）

**原因:** 一部のモデルが無効な JSON を返すことがある

```typescript
const result = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: mySchema,
  prompt: 'Generate data',
  mode: 'json',  // JSON モードを強制（GPT-4 対応）
  maxRetries: 3,  // 無効な JSON の場合はリトライ
});
```

**GitHub Issue:** #4302 (Imagen 3.0 Invalid JSON)

---

## 13. Gemini の暗黙的キャッシングがツール使用時に無効化

**エラー:** エラーなし、しかしキャッシュ無効化によりAPIコストが高くなる
**原因:** Google Gemini Flash のコスト節約暗黙キャッシングは、ツールが定義されていると（使用されなくても）機能しない
**出典:** [GitHub Issue #11513](https://github.com/vercel/ai/issues/11513)

```typescript
// 必要な時だけツールを条件付きで追加
const needsTools = await analyzePrompt(userInput);

const result = await generateText({
  model: google('gemini-3-flash'),
  tools: needsTools ? { weather: weatherTool } : undefined,
  prompt: userInput,
});
```

**影響:** 高 - 繰り返しコンテキストの API コストが大幅増加

---

## 14. Anthropic ツールエラー結果が JSON パースクラッシュを引き起こす

**エラー:** `SyntaxError: "[object Object]" is not valid JSON`
**原因:** Anthropic プロバイダー組み込みツール（web_fetch 等）がエラーオブジェクトを返し、SDK が JSON.parse を試みる
**出典:** [GitHub Issue #11856](https://github.com/vercel/ai/issues/11856)

```typescript
try {
  const result = await generateText({
    model: anthropic('claude-sonnet-4-5-20250929'),
    tools: { web_fetch: { type: 'anthropic_defined', name: 'web_fetch' } },
    prompt: userPrompt,
  });
} catch (error) {
  if (error.message.includes('is not valid JSON')) {
    // ツールがエラー結果を返した（ブロックされた URL や権限問題の可能性）
    console.error('Tool execution failed - likely blocked URL or permission issue');
    // ツールなしでリトライするか、カスタムツールを使用
  }
  throw error;
}
```

**影響:** 高 - Anthropic 組み込みツール使用時の本番クラッシュ

---

## 15. アシスタントメッセージ内の Tool-Result（Anthropic）

**エラー:** Anthropic API エラー - アシスタントメッセージ内の `tool-result` は許可されない
**原因:** サーバー実行ツールが誤ってアシスタントメッセージに `tool-result` パーツを配置する
**出典:** [GitHub Issue #11855](https://github.com/vercel/ai/issues/11855)

```typescript
// ワークアラウンド: 送信前にメッセージをフィルター
const filteredMessages = messages.map(msg => {
  if (msg.role === 'assistant') {
    return {
      ...msg,
      content: msg.content.filter(part => part.type !== 'tool-result'),
    };
  }
  return msg;
});

const result = await generateText({
  model: anthropic('claude-sonnet-4-5-20250929'),
  tools: { database: databaseTool },
  messages: filteredMessages,
  prompt: 'Get user data',
});
```

**影響:** 高 - Anthropic プロバイダーでサーバー実行ツールパターンが壊れる
**Status:** 既知の問題、PR #11854 提出済み

---

**その他のエラー:** https://ai-sdk.dev/docs/reference/ai-sdk-errors （計31種類）
