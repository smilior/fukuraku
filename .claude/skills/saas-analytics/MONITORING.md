# アラート設定・確定申告シーズン監視

## Slack アラートの実装

```typescript
// src/lib/alerts.ts

/**
 * KPI アラートの定義と通知
 */

interface Alert {
  type: 'warning' | 'critical'
  metric: string
  message: string
  currentValue: number | string
  threshold: number | string
}

// Slack Webhook URL（環境変数から取得）
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

export async function sendAlert(alert: Alert) {
  // コンソールログ（常に記録）
  console.log(`[ALERT][${alert.type}] ${alert.metric}: ${alert.message}`)

  // Slack 通知
  if (SLACK_WEBHOOK_URL) {
    const color = alert.type === 'critical' ? '#FF0000' : '#FFA500'

    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [{
          color,
          title: `副楽 KPI アラート: ${alert.metric}`,
          text: alert.message,
          fields: [
            { title: '現在値', value: String(alert.currentValue), short: true },
            { title: '閾値', value: String(alert.threshold), short: true },
          ],
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    })
  }

  // メール通知（オプション: 重大アラートのみ）
  if (alert.type === 'critical') {
    // TODO: SendGrid / Resend でメール送信
  }
}
```

## 定期チェックによるアラート

```typescript
// src/lib/alerts/kpi-checker.ts
import { calculateMRR, calculateChurnRate } from '@/lib/kpi/stripe-metrics'
import { sendAlert } from '@/lib/alerts'
import { KPI_TARGETS } from '@/lib/kpi/definitions'

/**
 * KPI アラートチェック
 * Vercel Cron Job で日次実行を想定
 */
export async function checkKPIAlerts() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // MRR チェック
  const mrr = await calculateMRR()

  // MRR が前月比 20% 以上減少した場合
  if (mrr.growthRate < -0.20) {
    await sendAlert({
      type: 'critical',
      metric: 'MRR急落',
      message: `MRR が前月比 ${(mrr.growthRate * 100).toFixed(1)}% 減少しています`,
      currentValue: `${mrr.mrr.toLocaleString()}円`,
      threshold: '前月比 -20%',
    })
  }

  // チャーン率チェック
  const churn = await calculateChurnRate(monthStart, now)

  if (churn.status === 'critical') {
    await sendAlert({
      type: 'critical',
      metric: 'チャーン率',
      message: `チャーン率が ${(churn.churnRate * 100).toFixed(1)}% に達しています（目標: ${KPI_TARGETS.churnRate.target * 100}%未満）`,
      currentValue: `${(churn.churnRate * 100).toFixed(1)}%`,
      threshold: `${KPI_TARGETS.churnRate.critical * 100}%`,
    })
  } else if (churn.status === 'warning') {
    await sendAlert({
      type: 'warning',
      metric: 'チャーン率',
      message: `チャーン率が ${(churn.churnRate * 100).toFixed(1)}% に上昇しています`,
      currentValue: `${(churn.churnRate * 100).toFixed(1)}%`,
      threshold: `${KPI_TARGETS.churnRate.warning * 100}%`,
    })
  }

  // 確定申告シーズン（1-3月）の追加チェック
  if (now.getMonth() >= 0 && now.getMonth() <= 2) {
    await checkTaxSeasonAlerts()
  }
}

async function checkTaxSeasonAlerts() {
  // シーズン中の特別モニタリング
  // - サーバーレスポンスタイムの監視
  // - OCR API のエラー率監視
  // - サインアップ数の目標達成チェック
}
```

## Vercel Cron Job の設定

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/kpi-check",
      "schedule": "0 9 * * *"
    }
  ]
}
```

```typescript
// src/app/api/cron/kpi-check/route.ts
import { NextResponse } from 'next/server'
import { checkKPIAlerts } from '@/lib/alerts/kpi-checker'

export async function GET(request: Request) {
  // Vercel Cron からの呼び出しを検証
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await checkKPIAlerts()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('KPI check failed:', error)
    return NextResponse.json(
      { error: 'KPI check failed' },
      { status: 500 }
    )
  }
}
```

## Stripe Webhook イベントのアラート

```typescript
// src/app/api/webhooks/stripe/route.ts（アラート部分抜粋）

import { sendAlert } from '@/lib/alerts'

// 支払い失敗時のアラート
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await sendAlert({
    type: 'warning',
    metric: '支払い失敗',
    message: `ユーザー ${invoice.customer_email} の支払いが失敗しました`,
    currentValue: invoice.customer_email ?? 'unknown',
    threshold: 'N/A',
  })
}

// サブスクリプション解約時の記録
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const churn = await calculateChurnRate(monthStart, now)

  if (churn.status !== 'healthy') {
    await sendAlert({
      type: churn.status === 'critical' ? 'critical' : 'warning',
      metric: 'サブスクリプション解約',
      message: `今月のチャーン率: ${(churn.churnRate * 100).toFixed(1)}%（${churn.churned}件解約 / ${churn.total}件）`,
      currentValue: `${(churn.churnRate * 100).toFixed(1)}%`,
      threshold: `${5}%`,
    })
  }
}
```

## 確定申告シーズン特別モニタリング（1-3月）

### シーズン準備チェックリスト

```markdown
## 確定申告シーズン準備（12月中に完了）

### インフラ
- [ ] Vercel のプラン確認（トラフィック増加に対応可能か）
- [ ] Supabase のプラン確認（DB接続数、ストレージ容量）
- [ ] OpenAI API の利用上限確認・引き上げ
- [ ] Rate Limiting の閾値調整（シーズン中は緩和）
- [ ] CDN キャッシュ設定の最適化

### モニタリング
- [ ] アラート閾値の調整（シーズン用）
- [ ] エラー監視の強化
- [ ] レスポンスタイムモニタリングの設定
- [ ] OCR API のエラー率ダッシュボード作成

### コンテンツ
- [ ] 確定申告ガイド記事の更新
- [ ] FAQ の更新
- [ ] 期限リマインダーメール設定（2月中旬、3月初旬）

### サポート
- [ ] サポート対応フローの確認
- [ ] よくある質問の回答テンプレート準備
```

### シーズン中のダッシュボード

```typescript
// src/lib/kpi/season-dashboard.ts

/**
 * 確定申告シーズン専用ダッシュボード
 * 1月1日〜3月15日（申告期限）の間、特別に監視
 */

export interface SeasonMetrics {
  // ユーザー獲得
  dailySignups: number
  totalSeasonSignups: number
  signupTarget: number
  signupProgress: number  // 0-1

  // 機能利用
  dailyOcrCount: number
  dailyExpenseCreated: number
  dailyFilingChecks: number

  // システム健全性
  ocrErrorRate: number
  averageResponseTime: number
  activeUsers: number

  // 収益
  seasonMRR: number
  seasonConversions: number

  // 残り日数
  daysUntilDeadline: number
}

export function calculateDaysUntilDeadline(): number {
  const now = new Date()
  const year = now.getFullYear()
  // 確定申告期限: 3月15日（土日の場合は翌営業日）
  const deadline = new Date(year, 2, 15) // 3月15日

  // 期限が過ぎている場合は翌年
  if (now > deadline) {
    deadline.setFullYear(year + 1)
  }

  const diffMs = deadline.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// シーズン中のリアルタイムモニタリング
export function isInTaxSeason(): boolean {
  const now = new Date()
  const month = now.getMonth() // 0-indexed
  const day = now.getDate()

  // 1月1日〜3月15日
  if (month === 0) return true // 1月
  if (month === 1) return true // 2月
  if (month === 2 && day <= 15) return true // 3月1-15日

  return false
}
```
