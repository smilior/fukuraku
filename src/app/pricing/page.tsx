'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { PlanKey } from '@/lib/stripe'

const plans: {
  key: PlanKey
  name: string
  price: string
  unit: string
  desc: string
  features: string[]
  highlight: boolean
  badge?: string
}[] = [
  {
    key: 'basic',
    name: 'ベーシック',
    price: '980',
    unit: '円/月',
    desc: '副業をしっかり管理したい方に',
    features: ['収入・経費の記録（年100件）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '20万円ライン表示'],
    highlight: false,
  },
  {
    key: 'pro',
    name: 'プロ',
    price: '1,480',
    unit: '円/月',
    desc: '制限なしで全機能を使いたい方に',
    features: ['収入・経費の記録（無制限）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '確定申告サマリー', '優先サポート'],
    highlight: true,
    badge: 'おすすめ',
  },
  {
    key: 'season',
    name: 'シーズンパス',
    price: '2,980',
    unit: '円（1〜3月限定）',
    desc: '確定申告シーズンだけ使いたい方に',
    features: ['プロの全機能（3ヶ月間）', '確定申告サポート資料', '優先サポート'],
    highlight: false,
    badge: '期間限定',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<PlanKey | null>(null)

  async function handleCheckout(plan: PlanKey) {
    setLoading(plan)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('エラーが発生しました。もう一度お試しください。')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">料金プラン</h1>
          <p className="text-gray-500 mt-2">いつでもキャンセル可能。まずは無料プランから。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.key}
              className={plan.highlight ? 'border-green-500 border-2 shadow-lg' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.badge && (
                    <Badge className={plan.highlight ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}>
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">{plan.desc}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-xs text-gray-500 ml-1">{plan.unit}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  variant={plan.highlight ? 'default' : 'outline'}
                  size="sm"
                  disabled={loading !== null}
                  onClick={() => handleCheckout(plan.key)}
                >
                  {loading === plan.key ? '処理中...' : '購入する'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 戻る
          </button>
        </div>
      </div>
    </div>
  )
}
