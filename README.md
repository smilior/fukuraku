# 副楽（ふくらく）

> 副業サラリーマン専用 確定申告アプリ

レシートを撮るだけ。20万円超えたら教えます。申告もラクラク。

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)

---

## 概要

「副楽」は、**副業収入がある会社員**のために特化した確定申告サポートアプリです。

freee・マネーフォワードは機能が多すぎて、副業サラリーマンには使いにくい。副楽は「副業の雑所得申告」だけに絞り、**3ステップで記録完了**を実現します。

### ターゲット

- 副業収入がある会社員（推計 180〜250万人）
- 確定申告が必要かどうか判断できていない層
- freee等の会計ソフトを「難しい」と感じている層

---

## 主な機能

| 機能 | 説明 |
|------|------|
| 📸 **レシートOCR** | GPT-4o Visionでレシートを自動読み取り・仕訳提案 |
| 🚨 **20万円アラート** | 副業所得がリアルタイムで20万円ラインを超えたら通知 |
| 📊 **収支ダッシュボード** | 月別収入・経費・所得を一目で確認 |
| 📝 **確定申告サマリー** | 年間収支・控除後所得を申告フォーマットで整理 |
| 💳 **フリーミアム** | 無料10件 → Basic 980円/月 → Pro 1,480円/月 |

---

## 技術スタック

```
フロントエンド  Next.js 16+ (App Router) + shadcn/ui + Tailwind CSS
バックエンド    Next.js API Routes + Supabase (PostgreSQL + Auth)
AI             GPT-4o Vision (レシートOCR) + Vercel AI SDK
決済           Stripe Subscriptions + Webhook
インフラ        Vercel (ホスティング) + Supabase (DB/Auth)
状態管理        Zustand
PWA            next-pwa
```

---

## プラン設計

| プラン | 価格 | レシート登録 | AI-OCR | CSV出力 |
|--------|------|------------|--------|---------|
| 無料 | ¥0 | 10件/年 | × | × |
| ベーシック | ¥980/月 | 100件/年 | ○ | ○ |
| プロ | ¥1,480/月 | 無制限 | ○ | ○ |
| シーズンパス | ¥2,980 | 無制限 | ○ | ○ |

> シーズンパス：確定申告シーズン（1〜3月）限定プラン

---

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [product-plan.md](./docs/product/product-plan.md) | MVPスコープ・画面仕様・8週間ロードマップ |
| [事業計画書](./docs/business/事業計画書_副業確定申告アプリ.md) | ビジネスモデル・KPI・財務計画 |
| [ビジネスモデル・GTM戦略](./docs/business/03_ビジネスモデル_GTM戦略.md) | GTM戦略・財務計画 |
| [市場分析](./docs/business/market_analysis.md) | 競合分析・市場規模 |
| [LP モックアップ](./docs/mockups/landing.html) | ランディングページのHTMLプロトタイプ |

---

## ライセンス

Private — All rights reserved.
