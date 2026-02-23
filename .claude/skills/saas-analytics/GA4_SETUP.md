# GA4 Next.js App Router 統合

## GA4 プロパティの作成

```markdown
## GA4 セットアップ手順

1. Google Analytics にログイン
2. 「管理」> 「プロパティを作成」
3. プロパティ名: 「副楽」
4. タイムゾーン: 日本
5. 通貨: 日本円（JPY）
6. データストリーム > ウェブ を追加
7. URL: https://fukuraku.com
8. 測定 ID（G-XXXXXXXXXX）をコピー
```

## GA4 の Next.js 統合（App Router）

```typescript
// src/components/GoogleAnalytics.tsx
'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  )
}
```

```typescript
// src/app/layout.tsx
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
```

## ページビュートラッキング（App Router 対応）

```typescript
// src/components/PageViewTracker.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function PageViewTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  )
}
```

## GA4 の型定義

```typescript
// src/types/gtag.d.ts
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'consent',
      targetId: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: Array<Record<string, unknown>>
  }
}

export {}
```

## Cookie 同意バナー

```typescript
// src/components/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'fukuraku_cookie_consent'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setShowBanner(false)

    // GA4 の同意モードを更新
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
    })
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setShowBanner(false)

    // GA4 の同意モードを更新（拒否）
    window.gtag?.('consent', 'update', {
      analytics_storage: 'denied',
    })
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          当サイトではサービス改善のためにCookieを使用しています。
          詳しくは<a href="/privacy" className="underline">プライバシーポリシー</a>をご確認ください。
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            拒否
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            同意する
          </button>
        </div>
      </div>
    </div>
  )
}
```

## GA4 デフォルト同意モードの設定

```typescript
// src/components/GoogleAnalytics.tsx に追加
// デフォルトで同意なし（Cookie同意後に更新される）
<Script id="ga-consent-default" strategy="beforeInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
    });
  `}
</Script>
```

## Vercel Analytics 統合

```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Vercel Analytics で確認できる指標

```markdown
## Vercel Analytics 確認項目

### Web Vitals（パフォーマンス）
- LCP (Largest Contentful Paint): 目標 2.5秒以下
- FID (First Input Delay): 目標 100ms以下
- CLS (Cumulative Layout Shift): 目標 0.1以下
- TTFB (Time to First Byte): 目標 200ms以下
- INP (Interaction to Next Paint): 目標 200ms以下

### トラフィック
- ページビュー数
- ユニークビジター数
- 人気ページ
- リファラー

### Speed Insights
- ルートごとのパフォーマンス
- デバイスタイプ別パフォーマンス
- 地域別パフォーマンス
```

## カスタムパフォーマンスメトリクスの計測

```typescript
// src/lib/performance.ts

export function measureCustomMetric(name: string, value: number) {
  if (typeof window === 'undefined') return

  if (window.performance && window.performance.mark) {
    window.performance.mark(`${name}-start`)
    window.performance.measure(name, `${name}-start`)
  }
}

// OCR処理時間の計測
export function measureOcrDuration(startTime: number): number {
  const duration = Date.now() - startTime
  measureCustomMetric('ocr-processing-time', duration)
  return duration
}

// ページロード時間の計測
export function measurePageLoad(routeName: string) {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming
        console.log(`[Performance] ${routeName}:`, {
          domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
          loadComplete: navEntry.loadEventEnd - navEntry.startTime,
          ttfb: navEntry.responseStart - navEntry.requestStart,
        })
      }
    }
  })

  observer.observe({ type: 'navigation', buffered: true })
}
```
