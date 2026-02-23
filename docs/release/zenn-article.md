# 副業確定申告アプリを8週間で個人開発した話 — Next.js + Supabase + AI SDK

> **プラットフォーム:** Zenn
> **想定読者:** 個人開発に興味があるエンジニア、Next.js/Supabase/AI SDKを使ったSaaS開発に関心がある人
> **投稿タイミング:** リリース日の午前中（火曜〜木曜が理想）
> **タグ:** #nextjs #supabase #openai #typescript #個人開発

---

## はじめに

副業の確定申告に毎年30時間かかっていたので、レシートを撮るだけでAIが経費を自動分類するアプリを8週間で作りました。

**副楽（ふくらく）** https://fukuraku.smilior.com

この記事では、技術選定から実装の詳細、ハマったポイント、運用コストまで、個人開発のリアルを共有します。

## 作ったもの

副業サラリーマン専用の確定申告支援アプリです。

**主な機能:**
- レシートAI読み取り（OCR + 自動分類）
- 収入・経費のダッシュボード管理
- 副業所得20万円ライン自動監視
- CSV出力
- PWA対応

**対象ユーザー:** 副業をしている会社員（年間副業収入20〜100万円程度）

## 技術選定

### 全体アーキテクチャ

```
[ブラウザ/PWA]
    ↓
[Next.js 16 App Router] ← Vercel
    ├── Server Components (UI)
    ├── Server Actions (データ操作)
    ├── Route Handlers (API)
    │   ├── /api/ai/ocr → Vercel AI SDK → OpenAI GPT-4o Vision
    │   └── /api/webhooks/stripe → Stripe Webhook
    └── Middleware (認証チェック, セキュリティヘッダー)
         ↓
[Supabase] ← Tokyo Region
    ├── Auth (Google OAuth + Email)
    ├── PostgreSQL (RLS有効)
    └── Storage (レシート画像)
```

### なぜこのスタックを選んだか

| 技術 | 選定理由 | 比較検討 |
|------|---------|---------|
| Next.js 16 (App Router) | Server Components + Vercelの一体感 | Remix（エコシステムが弱い）、SvelteKit（Reactが使いたかった） |
| Supabase | Auth + DB + Storage がオールインワン。東京リージョンあり | Firebase（RDBMSが欲しかった）、PlanetScale（Auth/Storageが別途必要） |
| Vercel AI SDK | ストリーミング対応、structuredOutput | LangChain（オーバースペック） |
| Stripe | 日本円対応、サブスク管理が楽 | Paddle（日本のサポートが弱い） |
| Tailwind CSS + shadcn/ui | 個人開発で最速のUI構築 | Material UI（重い）、Chakra UI（Tailwindと混ぜにくい） |

**個人開発で最も重視したこと: 管理コストの低さ。** すべて「サービスが管理してくれる」ものを選びました。自前でサーバーを管理する必要がないので、開発に集中できます。

## 実装のポイント

### 1. レシートOCR（AI SDK + OpenAI Vision）

レシートの読み取りは、Vercel AI SDKの`generateObject`を使ってOpenAI GPT-4o Visionに画像を送り、構造化されたJSONで結果を取得しています。

```typescript
// 簡略化したコード
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const receiptSchema = z.object({
  date: z.string().describe("YYYY-MM-DD形式の日付"),
  storeName: z.string().describe("店名"),
  totalAmount: z.number().describe("合計金額（税込）"),
  items: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    category: z.enum([
      "通信費", "消耗品費", "交通費", "書籍費",
      "会議費", "地代家賃", "水道光熱費", "雑費"
    ]),
  })),
});

const result = await generateObject({
  model: openai("gpt-4o"),
  schema: receiptSchema,
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "このレシートの情報を読み取ってください。副業の経費として適切なカテゴリに分類してください。" },
        { type: "image", image: base64Image },
      ],
    },
  ],
});
```

**精度を上げるためのコツ:**
- プロンプトに「副業サラリーマンの経費」という文脈を与える
- Zodスキーマのdescribeで各フィールドの期待値を明示する
- 画像は1024px以下にリサイズしてから送信（コスト削減 + 精度は変わらない）

結果: **読取精度94%。** 画像の前処理（傾き補正等）は不要でした。

### 2. Supabase RLS（Row Level Security）

全テーブルにRLSを設定し、ユーザーが他のユーザーのデータにアクセスできないようにしています。

```sql
-- expenses テーブルのRLSポリシー
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own expenses"
ON expenses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

**ハマったポイント:** `auth.uid()`の返り値は`uuid`型ですが、テーブルのカラムが`text`型だと比較が失敗します。型を揃えることが重要です。

### 3. Stripe サブスクリプション

Stripe Billingでサブスクリプション決済を実装。Webhookでイベントを受け取り、DBのプラン情報を更新しています。

```typescript
// Webhook処理の概要
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

  switch (event.type) {
    case "checkout.session.completed":
      // 有料プランへのアップグレード処理
      break;
    case "customer.subscription.deleted":
      // プランのダウングレード処理
      break;
  }
}
```

### 4. セキュリティ対策

個人開発でも手を抜かなかったセキュリティ対策:

- **CSP（Content Security Policy）ヘッダー**: XSS対策
- **レート制限**: API呼び出しの頻度制限
- **入力値検証**: Zodによるサーバーサイドバリデーション
- **RLS**: ユーザーデータの完全分離
- **環境変数の管理**: シークレットは全てVercelの環境変数で管理

## ハマったポイント

### 1. Supabase RLSのデバッグ（3時間ロス）

RLSポリシーが想定通りに動かず、データが取得できない問題に3時間ハマりました。

**原因:** `auth.uid()`の返り値（uuid）とテーブルカラム（text）の型不一致。

**解決策:** テーブルのカラム型を`uuid`に統一。また、Supabase DashboardのSQL Editorでポリシーの挙動を直接テストするようにしました。

### 2. OpenAI Vision APIのコスト管理

高解像度のレシート画像をそのまま送信すると、1リクエストあたり$0.01以上かかることがありました。

**解決策:** 画像を1024px以下にリサイズしてから送信。1リクエストあたり約$0.003に抑制。月100枚で$0.30程度。

### 3. Next.js 16 Turbopackのビルドエラー

開発中にTurbopackで発生するビルドエラーに何度か遭遇しました。

**解決策:** 一部のimportパスの修正と、dynamic importの調整で解決。Turbopackはまだ一部のエッジケースで問題が出ることがあるので、本番ビルドではwebpackを使っています。

## 運用コスト

| サービス | 月額 | 備考 |
|---------|------|------|
| Vercel Pro | $20 | ホスティング + Edge Functions |
| Supabase Pro | $25 | DB + Auth + Storage（東京リージョン） |
| OpenAI API | ~$5 | GPT-4o Vision（月200リクエスト想定） |
| ドメイン | ~$1 | smilior.com のサブドメイン |
| **合計** | **~$51（約7,500円）** | |

**損益分岐点:** 月額980円のベーシックプランで8人の有料ユーザーが集まれば黒字。個人開発の良いところは、この損益分岐点の低さです。

## 開発スケジュール（8週間）

| 週 | 内容 |
|----|------|
| Week 1 | プロジェクト設計、Supabase/Vercel環境構築、DBスキーマ設計 |
| Week 2 | 認証（Google OAuth + Email）、ダッシュボード、CRUD |
| Week 3 | レシートOCR実装、Stripe決済、PWA対応 |
| Week 4 | LP作成、法的ページ（利用規約・プライバシーポリシー） |
| Week 5 | セキュリティ対策（RLS強化、CSP、レート制限） |
| Week 6 | UX改善、OCR精度チューニング、バグ修正 |
| Week 7 | E2Eテスト、マーケティングコンテンツ作成 |
| Week 8 | 最終テスト、本番環境安定性確認、リリース |

本業をやりながらの開発なので、平日は1〜2時間、休日は4〜6時間程度のペースでした。

## 学んだこと

### 1. 自分の課題を解決するアプリは開発モチベーションが続く

「誰かのために作る」より「自分が困っているから作る」方が圧倒的にモチベーションが持続します。機能の優先度も「自分が使うかどうか」で判断できる。

### 2. Supabase + Vercelは個人開発の最適解の一つ

Auth・DB・Storage・ホスティングのすべてがマネージドサービスでカバーできるので、インフラ管理の時間がほぼゼロ。開発に集中できます。

### 3. AI SDKのおかげでAI機能の実装が想像以上に簡単

Vercel AI SDKの`generateObject`を使えば、Zodスキーマで型安全にAIのレスポンスを取得できます。画像の前処理なしで94%の精度が出たのは正直驚きました。

### 4. 個人開発はマーケティングが一番難しい

コードを書くことより、ユーザーに知ってもらうことの方がはるかに難しい。SEO、SNS運用、コミュニティ活動を並行して進める必要があります。

## まとめ

- **8週間**で副業サラリーマン向けの確定申告アプリを個人開発
- **月額$51**で本格的なSaaSを運用
- **Next.js + Supabase + AI SDK**の組み合わせは個人開発に最適
- **AIの精度は想像以上に高い**（プロンプト調整だけで94%）

副楽は無料プランがあります。副業をしていて経費管理に困っている方は、ぜひ試してみてください。

https://fukuraku.smilior.com

質問・フィードバックはコメント欄か、X（[@fukuraku_app](https://twitter.com/fukuraku_app)）までお気軽にどうぞ。
