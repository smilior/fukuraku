---
name: saas-analytics
description: SaaSメトリクス計測・KPIダッシュボード実装ガイド。GA4のNext.js統合、Stripe KPI（MRR/チャーン率）、確定申告シーズンモニタリング、月次レビュー自動化。
user-invocable: true
---

# 副楽 SaaS メトリクス・KPI ダッシュボード実装ガイド

副楽（副業確定申告SaaS）のビジネスメトリクス計測とKPIモニタリングの実装ガイド。
GA4によるユーザー行動分析、Stripe KPIトラッキング、確定申告シーズン対策を網羅。

## 前提条件・制約

- Next.js App Router プロジェクト
- Stripe による課金管理
- Vercel でのホスティング（Cron Job 使用）

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | GA4セットアップ・ページビュー・Cookie同意・Vercel Analytics | [GA4_SETUP.md](./GA4_SETUP.md) |
| 2 | Stripe KPI計算（MRR・チャーン率・ARPU）・ダッシュボードAPI | [STRIPE_KPI.md](./STRIPE_KPI.md) |
| 3 | カスタムイベント定義・ファネル設定・コンポーネント実装例 | [EVENT_TRACKING.md](./EVENT_TRACKING.md) |
| 4 | Slackアラート・Vercel Cron Job・確定申告シーズン特別監視 | [MONITORING.md](./MONITORING.md) |
| 5 | 月次レビューチェックリスト・KPIスプレッドシート・実装優先順位 | [REVIEW_CHECKLIST.md](./REVIEW_CHECKLIST.md) |
