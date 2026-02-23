'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { IncomeCategory } from '@/types/database'

const INCOME_CATEGORIES: IncomeCategory[] = [
  'フリーランス',
  'アフィリエイト',
  '転売・せどり',
  'YouTube・動画',
  '株・投資',
  '不動産',
  'その他',
]

export default function NewIncomePage() {
  const router = useRouter()
  const supabase = createClient()

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [source, setSource] = useState('')
  const [category, setCategory] = useState<IncomeCategory>('フリーランス')
  const [memo, setMemo] = useState('')
  const [hasWithholding, setHasWithholding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const amountNumber = parseInt(amount.replace(/,/g, ''), 10) || 0
  const withholdingAmount = Math.floor(amountNumber * 0.1021)

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!amount || amountNumber <= 0) {
      newErrors.amount = '金額を入力してください'
    }
    if (!date) {
      newErrors.date = '日付を入力してください'
    }
    if (!source.trim()) {
      newErrors.source = '取引先名を入力してください'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('incomes').insert({
        user_id: user.id,
        amount: amountNumber,
        date,
        source: source.trim(),
        category,
        memo: memo.trim() || null,
      })

      if (error) {
        console.error('Failed to create income:', error)
        setErrors({ submit: '保存に失敗しました。もう一度お試しください。' })
        return
      }

      router.push('/income')
    } catch (err) {
      console.error('Unexpected error:', err)
      setErrors({ submit: '予期しないエラーが発生しました。' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href="/income" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← 収入一覧へ
          </Link>
          <h1 className="text-2xl font-bold">収入を追加</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">収入情報を入力</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="amount">金額（円）</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  placeholder="例: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <Label htmlFor="date">日付</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Source */}
              <div className="space-y-1.5">
                <Label htmlFor="source">取引先名</Label>
                <Input
                  id="source"
                  type="text"
                  placeholder="例: 株式会社〇〇"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                {errors.source && (
                  <p className="text-sm text-red-500">{errors.source}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="category">カテゴリ</Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as IncomeCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Memo */}
              <div className="space-y-1.5">
                <Label htmlFor="memo">メモ（任意）</Label>
                <Textarea
                  id="memo"
                  placeholder="備考があれば入力してください"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Withholding tax */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Switch
                    id="withholding"
                    checked={hasWithholding}
                    onCheckedChange={setHasWithholding}
                  />
                  <Label htmlFor="withholding" className="cursor-pointer">
                    源泉徴収あり
                  </Label>
                </div>
                {hasWithholding && amountNumber > 0 && (
                  <div className="ml-1 p-3 bg-gray-50 rounded-md border text-sm">
                    <span className="text-gray-600">源泉徴収額（10.21%）: </span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                      }).format(withholdingAmount)}
                    </span>
                  </div>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500">{errors.submit}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? '保存中...' : '保存する'}
                </Button>
                <Link href="/income" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
