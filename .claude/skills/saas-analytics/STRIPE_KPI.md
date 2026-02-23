# Stripe KPI 計算（MRR・チャーン率・ARPU）

## 重要 KPI の定義

```typescript
// src/lib/kpi/definitions.ts

/**
 * 副楽 SaaS KPI 定義
 *
 * Phase 1（MVP）の目標値を定義
 */

export const KPI_TARGETS = {
  // === 収益指標 ===

  /** MRR（月次経常収益）目標 */
  mrr: {
    month3: 50_000,     // 3ヶ月目: 5万円（約50人 * 980円）
    month6: 150_000,    // 6ヶ月目: 15万円
    month12: 500_000,   // 12ヶ月目: 50万円
    description: 'Monthly Recurring Revenue',
  },

  /** ARPU（ユーザー当たり平均収益） */
  arpu: {
    target: 980,  // プロプラン月額
    description: '有料ユーザー1人あたりの平均月額収益',
  },

  // === ユーザー指標 ===

  /** 月間アクティブユーザー */
  mau: {
    month3: 200,
    month6: 500,
    month12: 2000,
    description: 'Monthly Active Users',
  },

  /** 無料→有料転換率 */
  conversionRate: {
    target: 0.05,   // 5%
    stretch: 0.10,  // 10%（ストレッチ目標）
    description: 'フリーユーザーからプロプランへの転換率',
  },

  /** チャーン率（月次解約率） */
  churnRate: {
    target: 0.05,    // 5%未満
    warning: 0.08,   // 8%で警告
    critical: 0.10,  // 10%で危機
    description: '有料ユーザーの月次解約率',
  },

  // === プロダクト指標 ===

  /** レシートOCR利用回数/ユーザー/月 */
  ocrUsagePerUser: {
    target: 10,  // 月10回以上
    description: 'アクティブユーザーの月間OCR利用回数',
  },

  /** オンボーディング完了率 */
  onboardingCompletion: {
    target: 0.70,  // 70%
    description: '登録後にオンボーディングを完了したユーザーの割合',
  },

  // === 確定申告シーズン特別 KPI（1-3月） ===

  season: {
    /** シーズン中のサインアップ目標 */
    signups: {
      january: 100,
      february: 200,
      march: 300,
    },
    /** シーズン中の有料転換率（通常より高い） */
    conversionRate: 0.15,  // 15%
    /** シーズン中のサポートレスポンスタイム */
    supportResponseTime: '24時間以内',
  },
} as const
```

## Stripe KPI 計算の実装

```typescript
// src/lib/kpi/stripe-metrics.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * MRR（月次経常収益）の計算
 */
export async function calculateMRR(): Promise<{
  mrr: number
  activeSubscriptions: number
  growth: number
  growthRate: number
}> {
  // アクティブなサブスクリプションを取得
  const subscriptions = await stripe.subscriptions.list({
    status: 'active',
    limit: 100,
  })

  let totalMRR = 0
  for (const sub of subscriptions.data) {
    for (const item of sub.items.data) {
      const price = item.price
      if (price.recurring?.interval === 'month') {
        totalMRR += (price.unit_amount ?? 0)
      } else if (price.recurring?.interval === 'year') {
        totalMRR += Math.floor((price.unit_amount ?? 0) / 12)
      }
    }
  }

  // MRR を円単位（Stripe は最小通貨単位で保存）
  const mrrInYen = totalMRR

  return {
    mrr: mrrInYen,
    activeSubscriptions: subscriptions.data.length,
    growth: 0,  // 初月は 0
    growthRate: 0,
  }
}

/**
 * チャーン率の計算
 */
export async function calculateChurnRate(
  periodStart: Date,
  periodEnd: Date
): Promise<{
  churnRate: number
  churned: number
  total: number
  status: 'healthy' | 'warning' | 'critical'
}> {
  // 期間中にキャンセルされたサブスクリプション
  const canceledSubs = await stripe.subscriptions.list({
    status: 'canceled',
    created: {
      gte: Math.floor(periodStart.getTime() / 1000),
      lte: Math.floor(periodEnd.getTime() / 1000),
    },
    limit: 100,
  })

  // 期間開始時点のアクティブサブスクリプション数
  // (近似値: 現在のアクティブ + キャンセル済み)
  const activeSubs = await stripe.subscriptions.list({
    status: 'active',
    limit: 100,
  })

  const churned = canceledSubs.data.length
  const totalAtStart = activeSubs.data.length + churned
  const churnRate = totalAtStart > 0 ? churned / totalAtStart : 0

  let status: 'healthy' | 'warning' | 'critical' = 'healthy'
  if (churnRate >= 0.10) status = 'critical'
  else if (churnRate >= 0.08) status = 'warning'

  return { churnRate, churned, total: totalAtStart, status }
}

/**
 * ARPU（ユーザー当たり平均収益）の計算
 */
export async function calculateARPU(): Promise<{
  arpu: number
  totalRevenue: number
  totalUsers: number
}> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // 今月の収益
  const charges = await stripe.charges.list({
    created: {
      gte: Math.floor(monthStart.getTime() / 1000),
    },
    limit: 100,
  })

  const totalRevenue = charges.data
    .filter(c => c.status === 'succeeded')
    .reduce((sum, c) => sum + c.amount, 0)

  // アクティブサブスクリプション数
  const subs = await stripe.subscriptions.list({
    status: 'active',
    limit: 100,
  })

  const totalUsers = subs.data.length
  const arpu = totalUsers > 0 ? Math.floor(totalRevenue / totalUsers) : 0

  return { arpu, totalRevenue, totalUsers }
}

/**
 * 無料→有料転換率の計算
 */
export async function calculateConversionRate(
  totalFreeUsers: number,
  periodDays: number = 30
): Promise<{
  conversionRate: number
  newPaidUsers: number
  totalFreeUsers: number
}> {
  const periodStart = new Date()
  periodStart.setDate(periodStart.getDate() - periodDays)

  // 期間中に新しく作成されたサブスクリプション
  const newSubs = await stripe.subscriptions.list({
    created: {
      gte: Math.floor(periodStart.getTime() / 1000),
    },
    limit: 100,
  })

  const newPaidUsers = newSubs.data.length
  const conversionRate = totalFreeUsers > 0 ? newPaidUsers / totalFreeUsers : 0

  return { conversionRate, newPaidUsers, totalFreeUsers }
}
```

## KPI ダッシュボード API

```typescript
// src/app/api/admin/kpi/route.ts
import { NextResponse } from 'next/server'
import { calculateMRR, calculateChurnRate, calculateARPU } from '@/lib/kpi/stripe-metrics'
import { KPI_TARGETS } from '@/lib/kpi/definitions'

// 管理者のみアクセス可能なKPI API
export async function GET() {
  // TODO: 管理者認証チェック

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [mrr, churn, arpu] = await Promise.all([
    calculateMRR(),
    calculateChurnRate(monthStart, now),
    calculateARPU(),
  ])

  return NextResponse.json({
    period: {
      start: monthStart.toISOString(),
      end: now.toISOString(),
    },
    metrics: {
      mrr: {
        current: mrr.mrr,
        target: KPI_TARGETS.mrr.month3,
        activeSubscriptions: mrr.activeSubscriptions,
        growthRate: mrr.growthRate,
      },
      churnRate: {
        current: churn.churnRate,
        target: KPI_TARGETS.churnRate.target,
        status: churn.status,
        churned: churn.churned,
      },
      arpu: {
        current: arpu.arpu,
        target: KPI_TARGETS.arpu.target,
      },
    },
    // 確定申告シーズン判定
    isTaxSeason: now.getMonth() >= 0 && now.getMonth() <= 2, // 1-3月
  })
}
```

## KPI データのエクスポート

```typescript
// src/app/api/admin/export-kpi/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // 管理者認証チェック（省略）

  // 過去12ヶ月のKPIデータをCSV形式でエクスポート
  const headers = [
    '年月', 'MRR', 'アクティブ会員数', 'チャーン率',
    'ARPU', 'MAU', '新規登録数', '転換率',
    'OCR利用回数', 'オンボーディング完了率',
  ]

  // TODO: DB から月次KPIデータを取得
  const rows: string[][] = []

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=fukuraku-kpi-${new Date().toISOString().slice(0, 7)}.csv`,
    },
  })
}
```

## GA4 Data API の活用（高度な分析）

```typescript
// src/lib/analytics/ga4-api.ts

/**
 * GA4 Data API を使った高度な分析
 *
 * 注意: GA4 Data API の利用には Google Cloud プロジェクトと
 * サービスアカウントの設定が必要
 *
 * セットアップ手順:
 * 1. Google Cloud Console でプロジェクト作成
 * 2. GA4 Data API を有効化
 * 3. サービスアカウントを作成し、GA4 プロパティに閲覧者権限を付与
 * 4. サービスアカウントのJSONキーをダウンロード
 * 5. 環境変数に設定: GOOGLE_APPLICATION_CREDENTIALS
 */

// 使用頻度が高くなった場合に実装を検討
// 初期段階では GA4 Dashboard を直接確認で十分
```
