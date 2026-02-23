'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { IncomeCategory, IncomeRow } from '@/types/database'

const INCOME_CATEGORIES: IncomeCategory[] = [
  'フリーランス',
  'アフィリエイト',
  '転売・せどり',
  'YouTube・動画',
  '株・投資',
  '不動産',
  'その他',
]

export default function EditIncomePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [source, setSource] = useState('')
  const [category, setCategory] = useState<IncomeCategory | ''>('')
  const [memo, setMemo] = useState('')
  const [hasWithholding, setHasWithholding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notFound, setNotFound] = useState(false)

  const amountNumber = parseInt(amount.replace(/,/g, ''), 10) || 0
  const withholdingAmount = Math.floor(amountNumber * 0.1021)

  useEffect(() => {
    async function fetchIncome() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data, error } = await supabase
          .from('incomes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error || !data) {
          console.error('Failed to fetch income:', error)
          setNotFound(true)
          return
        }

        const income = data as IncomeRow
        setAmount(String(income.amount))
        setDate(income.date)
        setSource(income.source)
        setCategory(income.category ?? '')
        setMemo(income.memo ?? '')
      } catch (err) {
        console.error('Unexpected error fetching income:', err)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncome()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
      const { error } = await supabase
        .from('incomes')
        .update({
          amount: amountNumber,
          date,
          source: source.trim(),
          category: category || null,
          memo: memo.trim() || null,
        })
        .eq('id', id)

      if (error) {
        console.error('Failed to update income:', error)
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

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('incomes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Failed to delete income:', error)
        setErrors({ submit: '削除に失敗しました。もう一度お試しください。' })
        setDeleteDialogOpen(false)
        return
      }

      router.push('/income')
    } catch (err) {
      console.error('Unexpected error:', err)
      setErrors({ submit: '予期しないエラーが発生しました。' })
      setDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">収入記録が見つかりませんでした。</p>
        <Link href="/income">
          <Button variant="outline">収入一覧へ戻る</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link href="/income" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← 収入一覧へ
          </Link>
          <h1 className="text-2xl font-bold">収入を編集</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">収入情報を編集</CardTitle>
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
                <Label htmlFor="category">カテゴリ（任意）</Label>
                <Select
                  value={category || '__none__'}
                  onValueChange={(val) => setCategory(val === '__none__' ? '' : val as IncomeCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">選択しない</SelectItem>
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

        {/* Delete section */}
        <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50">
          <h2 className="text-sm font-semibold text-red-700 mb-2">この収入記録を削除</h2>
          <p className="text-xs text-red-600 mb-3">
            削除したデータは復元できません。
          </p>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                削除する
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>収入記録を削除しますか？</DialogTitle>
                <DialogDescription>
                  この操作は取り消せません。収入記録を完全に削除します。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  キャンセル
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? '削除中...' : '削除する'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
