# カスタムイベントトラッキング

## カスタムイベント送信ヘルパー

```typescript
// src/lib/analytics.ts

/**
 * GA4 カスタムイベント送信ヘルパー
 *
 * 使用方法:
 * import { trackEvent } from '@/lib/analytics'
 * trackEvent('receipt_uploaded', { method: 'camera' })
 */

type AnalyticsEventName =
  | 'receipt_uploaded'          // レシートアップロード
  | 'receipt_ocr_completed'     // OCR処理完了
  | 'receipt_ocr_failed'        // OCR処理失敗
  | 'expense_created'           // 経費登録
  | 'income_created'            // 収入登録
  | 'tax_calculation_viewed'    // 確定申告計算表示
  | 'filing_status_checked'     // 20万円ライン判定表示
  | 'plan_upgrade_clicked'      // 有料プラン申し込みクリック
  | 'plan_upgrade_completed'    // 有料プラン決済完了
  | 'plan_downgrade_clicked'    // ダウングレードクリック
  | 'signup_completed'          // 新規登録完了
  | 'onboarding_step'           // オンボーディングステップ
  | 'feature_used'              // 機能利用
  | 'export_data'               // データエクスポート
  | 'error_occurred'            // エラー発生

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

export function trackEvent(eventName: AnalyticsEventName, params?: EventParams) {
  if (typeof window === 'undefined') return
  if (!window.gtag) return

  window.gtag('event', eventName, {
    ...params,
    timestamp: new Date().toISOString(),
  })
}

// よく使うイベントの便利関数
export const analytics = {
  // レシートアップロード
  trackReceiptUpload(method: 'camera' | 'gallery' | 'file') {
    trackEvent('receipt_uploaded', { method })
  },

  // OCR処理完了
  trackOcrComplete(duration_ms: number, items_count: number) {
    trackEvent('receipt_ocr_completed', { duration_ms, items_count })
  },

  // OCR処理失敗
  trackOcrFailure(error_type: string) {
    trackEvent('receipt_ocr_failed', { error_type })
  },

  // 経費登録
  trackExpenseCreated(category: string, amount: number) {
    trackEvent('expense_created', { category, amount })
  },

  // 収入登録
  trackIncomeCreated(source: string, amount: number) {
    trackEvent('income_created', { source, amount })
  },

  // 20万円ライン判定
  trackFilingStatusChecked(required: boolean, net_income: number) {
    trackEvent('filing_status_checked', { required, net_income })
  },

  // プランアップグレード
  trackPlanUpgradeClicked(from_plan: string, to_plan: string) {
    trackEvent('plan_upgrade_clicked', { from_plan, to_plan })
  },

  // プランアップグレード完了
  trackPlanUpgradeCompleted(plan: string, amount: number) {
    trackEvent('plan_upgrade_completed', { plan, amount })
  },

  // オンボーディングステップ
  trackOnboardingStep(step: number, step_name: string) {
    trackEvent('onboarding_step', { step, step_name })
  },

  // 機能利用
  trackFeatureUsed(feature_name: string) {
    trackEvent('feature_used', { feature_name })
  },

  // エラー発生
  trackError(error_type: string, error_message: string) {
    trackEvent('error_occurred', { error_type, error_message })
  },
}
```

## トラッキング対象イベント一覧

| イベント名 | トリガー | パラメータ | 分析目的 |
|-----------|---------|-----------|---------|
| `receipt_uploaded` | レシート画像アップロード | method (camera/gallery/file) | OCR機能の利用状況 |
| `receipt_ocr_completed` | OCR処理完了 | duration_ms, items_count | OCR性能モニタリング |
| `expense_created` | 経費登録 | category, amount | 経費カテゴリの傾向 |
| `income_created` | 収入登録 | source, amount | 収入源の傾向 |
| `filing_status_checked` | 20万円ライン判定表示 | required, net_income | 機能利用と判定結果の分布 |
| `plan_upgrade_clicked` | プランアップグレードクリック | from_plan, to_plan | コンバージョンファネル |
| `plan_upgrade_completed` | 決済完了 | plan, amount | 収益イベント |
| `signup_completed` | 新規登録完了 | provider (email/google) | 登録チャネルの分析 |
| `onboarding_step` | オンボーディング各ステップ | step, step_name | オンボーディング離脱箇所 |

## コンバージョンファネル設定

```typescript
// src/lib/analytics-funnels.ts

/**
 * 副楽の主要ファネル定義
 */

// ファネル 1: 新規登録→初回レシートOCR
export const ONBOARDING_FUNNEL = [
  'signup_completed',       // Step 1: 登録完了
  'onboarding_step',        // Step 2: オンボーディング開始
  'receipt_uploaded',        // Step 3: 初回レシートアップロード
  'receipt_ocr_completed',  // Step 4: OCR結果確認
  'expense_created',        // Step 5: 経費として保存
] as const

// ファネル 2: 無料→有料転換
export const CONVERSION_FUNNEL = [
  'filing_status_checked',   // Step 1: 確定申告判定を確認
  'plan_upgrade_clicked',    // Step 2: プランページ閲覧
  'plan_upgrade_completed',  // Step 3: 決済完了
] as const

// ファネル 3: レシート処理フロー
export const RECEIPT_FUNNEL = [
  'receipt_uploaded',        // Step 1: アップロード
  'receipt_ocr_completed',   // Step 2: OCR完了
  'expense_created',         // Step 3: 経費登録
] as const
```

## コンポーネントへのイベント実装例

```typescript
// src/components/ReceiptUploader.tsx
'use client'

import { useState, useCallback } from 'react'
import { analytics } from '@/lib/analytics'

export function ReceiptUploader() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrStartTime, setOcrStartTime] = useState<number>(0)

  const handleFileSelect = useCallback(async (file: File, method: 'camera' | 'gallery' | 'file') => {
    // イベント: レシートアップロード
    analytics.trackReceiptUpload(method)

    setIsProcessing(true)
    setOcrStartTime(Date.now())

    try {
      const formData = new FormData()
      formData.append('receipt', file)

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      const duration = Date.now() - ocrStartTime

      // イベント: OCR処理完了
      analytics.trackOcrComplete(duration, result.items?.length ?? 0)

      return result
    } catch (error) {
      // イベント: OCR処理失敗
      analytics.trackOcrFailure(error instanceof Error ? error.message : 'unknown')
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [ocrStartTime])

  // ... コンポーネントのレンダリング
}
```

```typescript
// src/components/PricingCard.tsx
'use client'

import { analytics } from '@/lib/analytics'

interface PricingCardProps {
  currentPlan: string
  targetPlan: string
  price: number
}

export function PricingCard({ currentPlan, targetPlan, price }: PricingCardProps) {
  async function handleUpgradeClick() {
    // イベント: プランアップグレードクリック
    analytics.trackPlanUpgradeClicked(currentPlan, targetPlan)

    // Stripe Checkout セッション作成 API を呼び出し
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: targetPlan }),
    })

    const { url } = await response.json()
    window.location.href = url
  }

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-bold">{targetPlan}</h3>
      <p className="text-3xl font-bold mt-2">{price.toLocaleString()}円/月</p>
      <button
        onClick={handleUpgradeClick}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        {targetPlan}に申し込む
      </button>
    </div>
  )
}
```

## Stripe Webhook でのコンバージョン追跡

```typescript
// src/app/api/webhooks/stripe/route.ts（抜粋）

import { createServiceClient } from '@/lib/supabase/service'

// checkout.session.completed イベントの処理
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createServiceClient()

  // ユーザーのサブスクリプション情報を更新
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: session.client_reference_id,
      stripe_subscription_id: session.subscription as string,
      status: 'active',
      plan: 'pro',
      current_period_start: new Date().toISOString(),
    })

  // サーバーサイドイベント（GA4 Measurement Protocol）
  // クライアント側で plan_upgrade_completed を送信できない場合に使用
  await sendServerSideEvent(session.client_reference_id!, 'plan_upgrade_completed', {
    plan: 'pro',
    amount: session.amount_total ?? 0,
    currency: session.currency ?? 'jpy',
  })
}

// GA4 Measurement Protocol（サーバーサイドイベント送信）
async function sendServerSideEvent(
  userId: string,
  eventName: string,
  params: Record<string, unknown>
) {
  const measurementId = process.env.GA_MEASUREMENT_ID
  const apiSecret = process.env.GA_API_SECRET

  if (!measurementId || !apiSecret) return

  await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: userId,
        user_id: userId,
        events: [{
          name: eventName,
          params: {
            ...params,
            engagement_time_msec: 1,
          },
        }],
      }),
    }
  )
}
```
