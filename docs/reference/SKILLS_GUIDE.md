# 副楽 構築に必要なSKILLS完全ガイド

**アプリ名:** 副楽（副業サラリーマン専用 確定申告アプリ）
**技術スタック:** Next.js 15 + Supabase + GPT-4o Vision + Stripe + Vercel
**作成日:** 2026-02-23
**分析方法:** Claude Code Agent Team（frontend-analyst / backend-analyst 並列分析 + team-lead統合）
**エージェント分析完了:** 2026-02-23（全スキルファイル直接精査済み）

---

## スキルマップ全体像

```
開発フェーズ別スキル活用ロードマップ

Before Week 1    Week 1          Week 2          Week 3          Week 4          Week 5-6        Week 7-8
     │              │               │               │               │               │               │
requirements  nextjs-on-vercel  ui-ux-pro-max  ai-sdk-core  stripe-subs    ui-ux-expert    vercel-react
-analyst      tailwind-design  ui-ux-expert   (OCR/仕訳)   (決済実装)    (アクセシ     -best-practices
              nextjs-turso-    vercel-react                             ビリティ)     (パフォーマンス
              better-auth*     best-practices                                          最終最適化)
              drizzle-orm*
              ui-ux-pro-max

*Supabase向けに一部アダプト必要
```

---

## 🔴 Critical Skills（必須・コア機能に直結）

### 1. `nextjs-on-vercel`

| 項目 | 内容 |
|------|------|
| **優先度** | 🔴 Critical |
| **使用タイミング** | **Week 1 Day 1** — 最初に使う |
| **スキルの提供物** | Next.js + Bun環境構築、Vercel自動デプロイ設定 |

**副楽への活用ポイント:**
- プロジェクトのスキャフォールディング（Next.js 15 App Router）
- Vercel自動デプロイパイプライン（GitHub連携）
- Bunによる高速開発環境（`bun dev`, `bun build`）
- `next-pwa` 統合のベース構築

**使い方:**
```bash
# スキル呼び出しで即座にセットアップ
/nextjs-on-vercel
```

> **frontend-analyst 補足:** ui-ux-pro-maxの実行にはPython3が必要（`search.py`スクリプト）。事前に `python3 --version` で確認すること。

**注意点:**
- Supabaseの環境変数（`SUPABASE_URL`, `SUPABASE_ANON_KEY`）はVercelに別途登録が必要
- `next-pwa`はVercelのEdge Runtimeと相性確認が必要
- スキルはBun前提だが、副楽ではpnpmも選択肢。パッケージマネージャーを事前に確定すること
- Vercel Hobbyプランは商用利用不可 → 有料ユーザーが発生した時点でProへアップグレード必要

---

### 2. `stripe-subscriptions`

| 項目 | 内容 |
|------|------|
| **優先度** | 🔴 Critical |
| **使用タイミング** | **Week 4** — MVP完成直前 |
| **スキルの提供物** | Stripe Checkout, Customer Portal, Webhook, Feature Flags, Plan Gating |

**副楽への活用ポイント:**

| 機能 | 活用内容 |
|------|----------|
| Stripe Checkout | 月額980円（ベーシック）/ 1,480円（プロ）プラン決済画面 |
| Customer Portal | ユーザーがプラン変更・解約できる管理画面 |
| Webhook処理 | 支払い成功/失敗時にSupabaseのsubscription状態を同期 |
| Feature Flags | 無料/有料プランによる機能制限（AI仕訳、PDF生成など） |
| Plan Gating | 月5件入力制限（無料）/ 無制限（有料）の制御 |

**副楽のプラン設計との対応:**
```
無料プラン：月5件まで入力可, AI仕訳×, PDF×
ベーシック：月額980円, AI仕訳○, PDF○
プロ：月額1,480円, 銀行連携○, AIチャット○
シーズンパス：2,980円/3ヶ月（1月〜3月限定）
```

**注意点:**
- スキルの前提条件として `Neon + Drizzle + Pino Logging` を想定しているが、副楽はSupabase使用。DB接続部分は読み替え必須
- Webhook URL設定はVercelのAPI Routeで実装（`/api/webhooks/stripe`）
- Stripe Dashboard での製品・料金設定（価格ID取得）が事前に必要
- Vercel Flags SDKによるプランゲーティングは非常に有用。導入を強く推奨

---

### 3. `ai-sdk-core`

| 項目 | 内容 |
|------|------|
| **優先度** | 🔴 Critical |
| **使用タイミング** | **Week 3** — 副楽最大の差別化機能実装 |
| **スキルの提供物** | AI SDK v6 Output API, マルチモーダル, 構造化出力, エラーハンドリング15パターン |

**副楽への活用ポイント:**

**コア機能：レシートOCR → AI自動仕訳**
```typescript
// レシート画像 → 構造化データ抽出
import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: openai('gpt-4o'),  // Vision対応モデル
  output: Output.object({
    schema: z.object({
      store_name: z.string(),
      date: z.string(),
      total_amount: z.number(),
      items: z.array(z.object({ name: z.string(), price: z.number() })),
      suggested_category: z.enum(['通信費', '交通費', '消耗品費', '交際費', '書籍研究費', '外注費', 'その他']),
      confidence: z.number().min(0).max(1),
    })
  }),
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: '副業サラリーマンのレシートです。経費カテゴリを推定してください。' },
      { type: 'image', image: receiptImageBuffer },
    ],
  }],
});
```

**AIアドバイス機能（v1.1以降）:**
- 「この経費は計上できる？」チャット機能
- 節税アドバイスの自動生成

**重要な実装ポイント:**
- **v6 Output API**（旧 `generateObject` は非推奨）を使用
- **v6.0.40は使用禁止**（ストリーミング破壊的変更あり。v6.0.41で修正済）
- Supabase Edge Function内での実装を推奨（サーバーサイドでAPIキー保護）
- **Deno互換性要確認**: Supabase Edge FunctionsはDeno環境。AI SDK v6のDeno対応は要検証。代替としてNext.js API Routes（Vercel Functions）での実装も有力
- コスト管理：レシート1枚≈0.2円、月100枚≈20円

**スキルが提供するエラー対策（重要）:**
| エラー | 副楽での発生シーン |
|--------|----------------------|
| `AI_APICallError` | OpenAI API障害時のリカバリー |
| `AI_TypeValidationError` | レシート解析結果の型不一致 |
| `AI_NoObjectGeneratedError` | 不鮮明なレシート画像 |
| Rate Limit (429) | 繁忙期（確定申告シーズン）の大量アクセス |

---

### 4. `requirements-analyst`

| 項目 | 内容 |
|------|------|
| **優先度** | 🔴 Critical |
| **使用タイミング** | **Before Week 1** — 開発開始前の要件定義フェーズ |
| **スキルの提供物** | EARS形式要件, ユーザーストーリー, 受入れ条件, SRS文書 |

**副楽への活用ポイント:**

現状の `product-plan.md` は事業計画書レベルだが、開発前に以下が必要：

```
/requirements-analyst で生成すべき成果物：

1. ユーザーストーリー（EARS形式）
   例: "副業サラリーマンとして、レシートを撮影するだけで
       経費が自動記録されること。なぜなら手入力の手間を
       最小化したいから。受入れ基準：3秒以内に仕訳提案
       が表示されること"

2. 機能要件定義書
   - 20万円アラートの計算ロジック仕様
   - AI仕訳の信頼度閾値設定（何%以上なら自動保存）
   - CSVエクスポートのカラム定義

3. 非機能要件
   - パフォーマンス: レシート解析 < 3秒
   - セキュリティ: Supabase RLS設定
   - 可用性: 確定申告シーズン（1〜3月）の負荷対策
```

**使い方:**
```
/requirements-analyst

「副業サラリーマン専用確定申告アプリ『副楽』の
レシートOCR機能の要件をEARS形式で定義してください」
```

---

## 🟡 High Priority Skills（重要・品質向上に直結）

### 5. `ui-ux-pro-max`

| 項目 | 内容 |
|------|------|
| **優先度** | 🟡 High |
| **使用タイミング** | **Week 1〜2** — UI設計・実装フェーズ全般 |
| **スキルの提供物** | 50スタイル, 21カラーパレット, 50フォントペア, Rechartsチャート推奨, shadcn/ui パターン |

**副楽への活用ポイント:**

**ダッシュボード画面（最重要）:**
```bash
# Fintechダッシュボード向けデザイン参照
python3 .shared/ui-ux-pro-max/scripts/search.py "fintech" --domain color
python3 .shared/ui-ux-pro-max/scripts/search.py "dashboard" --domain product
python3 .shared/ui-ux-pro-max/scripts/search.py "progress bar" --domain chart

# Next.js + shadcn/ui向けスタック固有ガイドライン
python3 .shared/ui-ux-pro-max/scripts/search.py "saas" --stack nextjs
python3 .shared/ui-ux-pro-max/scripts/search.py "minimal" --domain style
```

**活用する各画面:**

| 画面 | 参照するドメイン | 活用内容 |
|------|-----------------|----------|
| ダッシュボード | `product: SaaS`, `chart: trend` | 20万円バー、月別棒グラフ |
| レシート撮影 | `ux: animation`, `ux: loading` | AI解析中のローディングUX |
| オンボーディング | `ux: accessibility`, `product: mobile` | スライドUI、ステップ進捗 |
| LP（ランディングページ） | `landing: hero`, `landing: pricing` | Hero構成、料金比較表 |
| 設定画面 | `style: minimalism` | シンプルなリスト設計 |

**副楽に合うデザインスタイル:**
- `minimalism` — 副業初心者に分かりやすいシンプルUI
- `bento grid` — ダッシュボードのカード配置
- `dark mode` — 長時間使用への配慮（オプション）

> **frontend-analyst 補足:** 各画面完成時に **プリデリバリーチェックリスト** を実行すること（emoji不使用、cursor-pointer確認、コントラスト比確認等）。`--stack shadcn` フラグで shadcn/ui 固有のガイドラインも取得可能。

---

### 6. `tailwind-design-system`

| 項目 | 内容 |
|------|------|
| **優先度** | 🟡 High |
| **使用タイミング** | **Week 1** — プロジェクト初期設定時 |
| **スキルの提供物** | Tailwind v4 CSS-first設定, デザイントークン, コンポーネントバリアント |

**副楽への活用ポイント:**

```css
/* 副楽専用デザイントークン（globals.css） */
@import "tailwindcss";

@theme {
  /* 副楽ブランドカラー（Fintechに適したシリアスな緑系） */
  --color-primary: oklch(55% 0.15 145);        /* 申告OK緑 */
  --color-warning: oklch(75% 0.18 85);          /* 15万円警戒黄 */
  --color-danger: oklch(58% 0.22 27);           /* 20万円超赤 */
  --color-background: oklch(98% 0.01 264);

  /* 20万円バーの専用トークン */
  --color-tax-safe: oklch(55% 0.15 145);
  --color-tax-warning: oklch(75% 0.18 85);
  --color-tax-alert: oklch(58% 0.22 27);

  /* フォント（信頼感を演出） */
  --font-sans: 'Noto Sans JP', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;  /* 金額表示 */
}
```

**コンポーネント設計:**
- `TaxProgressBar` — 20万円バーの再利用可能コンポーネント
- `IncomeCard` / `ExpenseCard` — 収支カード
- `ReceiptCapture` — カメラ撮影UI

> **frontend-analyst 補足:** shadcn/uiは現在Tailwind **v3がメイン**。v4採用時は `pnpm dlx shadcn@latest init`（`shadcn-ui`ではなく`shadcn`）を使用すること。

---

### 7. `vercel-react-best-practices`

| 項目 | 内容 |
|------|------|
| **優先度** | 🟡 High |
| **使用タイミング** | **Week 1〜8（通年）** — コーディング中常に参照 |
| **スキルの提供物** | 57ルール（8カテゴリ）、Waterfall排除、Bundle最適化、SSR/RSC最適化 |

**副楽への活用ポイント:**

**最重要ルール（副楽固有の優先順）:**

| ルール | 副楽での適用場面 | 影響度 |
|--------|-------------------|--------|
| `async-parallel` | 収入・経費・グラフデータを並列fetch | CRITICAL |
| `bundle-dynamic-imports` | Recharts（グラフ）を遅延ロード | CRITICAL |
| `server-auth-actions` | レシートOCR API Routeの認証 | HIGH |
| `client-` | ダッシュボードのリアルタイム更新 | MEDIUM |
| `bundle-defer-third-party` | Stripeスクリプトの遅延ロード | MEDIUM |

**PWA特有の考慮事項:**
- `rendering-` ルール → `next-pwa` のService Worker最適化
- `server-cache-react` → 確定申告データの適切なキャッシュ戦略

---

## 🟢 Partial Use Skills（部分活用・アダプト必要）

### 8. `nextjs-turso-better-auth-starter`

| 項目 | 内容 |
|------|------|
| **優先度** | 🟢 Partial |
| **使用タイミング** | **Week 1** — 認証フロー実装時（パターン参照のみ） |
| **スキルの提供物** | Next.js + Auth スキャフォールド（Google OAuth, Email認証） |

**副楽への活用ポイント:**

> ⚠️ **重要な注意:** このスキルは `Turso + Drizzle + Better Auth` スタックを前提とするが、副楽は **`Supabase Auth`** を使用。完全適用は不可。

**参照できる部分:**
- Google OAuth設定フロー（SupabaseのOAuth設定に応用）
- Next.js 15 middleware でのセッションチェックパターン
- shadcn/ui v4 + Tailwind v4 の設定パターン
- オンボーディング画面のコンポーネント構成

**副楽での代替実装:**
```typescript
// Supabase Auth（Better AuthではなくSupabase使用）
import { createServerClient } from '@supabase/ssr'

// Supabase RLS（Drizzle ROWセキュリティではなくSupabase RLS使用）
// users テーブル: auth.uid() = user_id
```

---

### 9. `drizzle-orm`

| 項目 | 内容 |
|------|------|
| **優先度** | 🟢 Partial |
| **使用タイミング** | **Week 1** — DBスキーマ設計時（パターン参照のみ） |
| **スキルの提供物** | 型安全ORM、スキーマ設計、マイグレーション、クエリパターン |

**副楽への活用ポイント:**

> ⚠️ **重要な注意:** 副楽は **Supabase PostgreSQL** を使用し、Supabase公式クライアント（`@supabase/supabase-js`）でアクセス。Drizzle ORMは直接使用しない。

**参照できる部分:**
- DBスキーマ設計のベストプラクティス（正規化、命名規則）
- PostgreSQL型の使い方（`timestamp`, `varchar`, `decimal`）

**副楽のDBスキーマ（Supabase + Drizzleパターン応用）:**
```sql
-- Supabaseで定義するテーブル（Drizzle設計思想を参考に）
CREATE TABLE incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  source VARCHAR(255),
  category VARCHAR(50),
  is_withholding_tax BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Drizzle相当の型安全保護
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_incomes" ON incomes
  FOR ALL USING (auth.uid() = user_id);
```

---

## ⚪ Reference / Optional Skills

### 10. `ui-ux-expert`

| 項目 | 内容 |
|------|------|
| **優先度** | ⚪ Medium（Week 5〜6で使用） |
| **使用タイミング** | **Week 5-6** — ベータリリース前のUXレビュー |
| **スキルの提供物** | WCAG 2.2対応, アクセシビリティ監査, usabilityテスト, デザインシステム |

**副楽への活用ポイント:**
- **WCAG 2.2 AA準拠** — 年配層の副業ユーザーへの配慮
- PWAのタッチターゲット最小サイズ（44x44px）確認
- 20万円バーのカラーコントラスト比（4.5:1以上）
- フォームのエラーメッセージの明確化（税務用語の分かりやすい説明）

---

### 11. `ui-ux-designer`

| 項目 | 内容 |
|------|------|
| **優先度** | ⚪ Low（`ui-ux-pro-max`で代替可能） |
| **使用タイミング** | 必要に応じて |
| **スキルの提供物** | UI/UX設計専門知識、インタラクション設計 |

**注意:** `ui-ux-pro-max` で大部分をカバーできるため、スキルの重複使用は非推奨。

---

## ❌ Not Applicable（副楽には不要）

| スキル | 不要な理由 |
|--------|-----------|
| `subscription-proposer` | ビジネスモデルは既に確定済み |
| `pptx` / `pptx-nanobanana` | スライド作成はスコープ外 |
| `find-skills` | メタスキル（スキル探索用） |
| `skill-creator` | メタスキル（スキル作成用） |
| `keybindings-help` | IDE設定用、開発には不要 |

---

## スキル活用 週次ロードマップ

```
┌─────────────────────────────────────────────────────────────────────┐
│                   副楽 8週間開発スキル計画                          │
├──────────┬─────────────────────────────────────────────────────────┤
│ Week 1   │ /nextjs-on-vercel  → プロジェクト生成                       │
│          │ /requirements-analyst → 要件定義ドキュメント                  │
│          │ tailwind-design-system → デザイントークン設定                  │
│          │ ui-ux-pro-max → Fintech UI設計（ダッシュボード）               │
│          │ nextjs-turso-better-auth* → 認証パターン参照                  │
├──────────┼─────────────────────────────────────────────────────────┤
│ Week 2   │ ui-ux-pro-max → 全画面UI実装（収入・経費・オンボーディング）     │
│          │ vercel-react-best-practices → コンポーネント設計レビュー       │
│          │ drizzle-orm* → DBスキーマ設計参照                            │
├──────────┼─────────────────────────────────────────────────────────┤
│ Week 3   │ ai-sdk-core → レシートOCR実装（GPT-4o Vision）                │
│          │ vercel-react-best-practices → APIルート最適化                │
├──────────┼─────────────────────────────────────────────────────────┤
│ Week 4   │ stripe-subscriptions → フリーミアム決済実装                   │
│          │ vercel-react-best-practices → PWA Bundle最適化              │
├──────────┼─────────────────────────────────────────────────────────┤
│ Week 5-6 │ ui-ux-expert → アクセシビリティ監査・WCAG対応                │
│          │ requirements-analyst → ベータフィードバック要件整理            │
├──────────┼─────────────────────────────────────────────────────────┤
│ Week 7-8 │ vercel-react-best-practices → 最終パフォーマンス最適化         │
│          │ ui-ux-pro-max → LP（ランディングページ）デザイン                │
└──────────┴─────────────────────────────────────────────────────────┘
* = 副楽スタック（Supabase）向けにアダプト必要
```

---

## エージェント推奨：実践ワークフロー

*frontend-analyst / backend-analyst による実装順序の推奨*

### Day 1-2：デザインシステム確立
```bash
# 1. プロジェクト生成
/nextjs-on-vercel

# 2. デザインリサーチ（Python3必須）
python3 .shared/ui-ux-pro-max/scripts/search.py "fintech" --domain color
python3 .shared/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --domain product
python3 .shared/ui-ux-pro-max/scripts/search.py "minimal" --domain style
python3 .shared/ui-ux-pro-max/scripts/search.py "saas" --stack nextjs

# 3. デザイントークン定義
# → tailwind-design-system のパターンで globals.css に @theme 設定
```

### Week 1-2：各画面実装時の並行参照
```
実装中に常にチェック：
- vercel-react-best-practices CRITICAL ルール（async-parallel, bundle-dynamic-imports）
- ui-ux-expert の UXパターン（7大パターン参照）
- tailwind-design-system のコンポーネントバリアント（CVAパターン）
```

### Week 3：AI仕訳実装（最重要）
```
⚠️ Deno互換性の判断が必要：
  Option A: Supabase Edge Function（Deno）でAI SDK → 互換性要確認
  Option B: Next.js API Route（Vercel Functions）でAI SDK → 確実に動作
→ ai-sdk-core の Multi-Modal Prompts + Output API で実装
→ EARS形式エラーケース: "IF OCR解析が失敗, THEN 手動入力フォームにフォールバック"
```

### Week 4：MVP仕上げチェックリスト
```
□ stripe-subscriptions でフリーミアム決済実装
□ ui-ux-pro-max のプリデリバリーチェックリスト実行
□ ui-ux-expert の Pre-Implementation Checklist（Phase 1-3）
□ vercel-react-best-practices でBundle最適化
□ Tailwind v3/v4 選択確定（shadcn/ui互換性確認）
```

---

## スキル間の依存関係

```
requirements-analyst
       │
       ▼
nextjs-on-vercel ──────────────────────────────────────┐
       │                                               │
       ├──▶ tailwind-design-system                     │
       │          │                                    │
       │          ▼                                    │
       ├──▶ ui-ux-pro-max ──▶ ui-ux-expert             │
       │                                               │
       ├──▶ ai-sdk-core (Week 3)                       │
       │     └── GPT-4o Vision: レシートOCR             │
       │                                               │
       ├──▶ stripe-subscriptions (Week 4)              │
       │     └── フリーミアムプラン制御                   │
       │                                               │
       └──▶ vercel-react-best-practices (通年) ◀───────┘
                 └── 全コンポーネントに適用
```

---

## コスト・リスク評価

| スキル | 学習コスト | 実装難易度 | ビジネスインパクト |
|--------|-----------|-----------|----------------|
| `nextjs-on-vercel` | 低 | 低 | 基盤（必須） |
| `stripe-subscriptions` | 中 | 中 | 収益化の根幹 |
| `ai-sdk-core` | 中 | 高 | 最大差別化機能 |
| `requirements-analyst` | 低 | 低 | 手戻り防止 |
| `ui-ux-pro-max` | 低 | 低 | UX品質向上 |
| `tailwind-design-system` | 中 | 中 | 一貫性・保守性 |
| `vercel-react-best-practices` | 中 | 中 | パフォーマンス |
| `nextjs-turso-better-auth*` | 中 | 中（アダプト要） | 認証実装参考 |
| `drizzle-orm*` | 低 | 低（参照のみ） | DBスキーマ設計参考 |

---

## 副楽固有の技術的注意事項

### Supabaseとスキルの整合性

多くのスキルはSupabaseを直接サポートしているが、一部のスキルはNeon/Tursoを前提としている：

```
スキルのDB前提          副楽の実態           対応方法
─────────────────────────────────────────────────────
stripe-subscriptions   Neon + Drizzle       Supabaseクライアントで代替
nextjs-turso-starter   Turso + Better Auth  Supabase Authで代替
drizzle-orm            Drizzle ORM          Supabaseクライアント + 設計参照のみ
```

### ai-sdk-coreの実装場所

```
推奨: Supabase Edge Function（Deno）
理由: APIキー保護、コスト管理、Next.js App RouterのTimeout制限回避

代替: Next.js API Route
注意: OpenAI APIキーをサーバーサイドに限定すること（絶対にクライアントに露出させない）
```

### 確定申告シーズン（1〜3月）の特別考慮

- `vercel-react-best-practices` の `server-cache-react` → 税務データのキャッシュ戦略
- `stripe-subscriptions` のシーズンパス（2,980円/3ヶ月）の実装パターン
- `ai-sdk-core` の Rate Limit対策 → 確定申告期直前は需要が急増

---

## まとめ：優先度別スキルリスト

### 必ず使うスキル（4個）
1. **`nextjs-on-vercel`** — Week 1、プロジェクト基盤
2. **`ai-sdk-core`** — Week 3、AI仕訳（最大差別化）
3. **`stripe-subscriptions`** — Week 4、フリーミアム収益化
4. **`requirements-analyst`** — Week 0、要件定義

### 使うべきスキル（3個）
5. **`ui-ux-pro-max`** — Week 1-2、全UI設計
6. **`tailwind-design-system`** — Week 1、デザイントークン
7. **`vercel-react-best-practices`** — 通年、パフォーマンス

### 参照・アダプトするスキル（2個）
8. **`nextjs-turso-better-auth-starter`** — Week 1、認証パターン参照（Supabase向けアダプト）
9. **`drizzle-orm`** — Week 1、DBスキーマ設計参照のみ

### 後期に使うスキル（1個）
10. **`ui-ux-expert`** — Week 5-6、アクセシビリティ・WCAG対応

---

*本ドキュメントはClaude Code Agent Team（frontend-analyst / backend-analyst 並列分析 + team-lead統合）により作成。*
*更新日: 2026-02-23*
