# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-XX-XX

### Added

- **レシートAI読み取り（OCR）**: スマホでレシートを撮影するだけで、GPT-4o VisionがAI日付・金額・店名・品目を読み取り、経費カテゴリを自動分類（精度94%）
- **収入・経費ダッシュボード**: 副業の収入と経費を一覧管理。月別の推移をグラフで表示
- **20万円ライン自動監視**: 副業所得（収入-経費）をリアルタイム計算し、確定申告が必要になる20万円ラインに近づくとアラート通知
- **収入管理**: 副業の収入を登録・編集・削除。源泉徴収の有無も記録可能
- **経費管理**: 経費の登録・編集・削除。経費カテゴリの手動変更も可能
- **CSV出力**: 経費データをCSV形式でエクスポート。確定申告書への転記に対応
- **確定申告サマリー**: 年間の収入・経費・所得の概要と、確定申告の要否判定
- **認証**: Google OAuth + メールアドレス認証（Supabase Auth）
- **料金プラン**: フリー（無料・月10件）/ ベーシック（月額980円・月100件）/ プロ（月額1,480円・無制限）/ シーズンパス（2,980円・1〜3月限定）
- **Stripe決済**: サブスクリプション管理、Customer Portal対応
- **PWA対応**: スマートフォンにインストール可能。オフライン対応画面あり
- **ランディングページ**: サービス紹介、料金プラン、FAQ
- **法的ページ**: 利用規約、プライバシーポリシー、特定商取引法に基づく表示
- **SEO対策**: サイトマップ、robots.txt、Metadata API によるOGP設定
- **セキュリティ**: Supabase RLS（Row Level Security）、CSPヘッダー、レート制限、入力値バリデーション
- **CI/CD**: GitHub Actions によるテスト自動化、Lighthouse CI、staging自動同期
- **マーケティング自動化**: 毎朝9時にX投稿案を自動生成するGitHub Actions CRON

### Technical Details

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, PostgreSQL, Storage) - Tokyo Region
- **AI**: Vercel AI SDK + OpenAI GPT-4o Vision API
- **Payment**: Stripe Billing
- **Hosting**: Vercel
- **State Management**: Zustand
- **Testing**: Vitest + Playwright
