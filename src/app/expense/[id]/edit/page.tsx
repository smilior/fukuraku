'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { ExpenseCategory, ExpenseRow } from '@/types/database'

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  '通信費',
  '消耗品費',
  '接待交際費',
  '交通費',
  '広告宣伝費',
  '外注費',
  '研修費',
  '地代家賃',
  'その他',
]

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState<ExpenseCategory | ''>('')
  const [description, setDescription] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    async function fetchExpense() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: rawData, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error || !rawData) {
        console.error('Failed to fetch expense:', error)
        setNotFound(true)
        setLoading(false)
        return
      }

      const data = rawData as ExpenseRow
      setAmount(String(data.amount))
      setDate(data.date)
      setCategory(data.category ?? '')
      setDescription(data.description)
      setMemo(data.memo ?? '')
      setLoading(false)
    }

    fetchExpense()
  }, [id, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!description.trim()) return

    setSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('expenses')
        .update({
          date,
          amount: Number(amount),
          category: category || null,
          description: description.trim(),
          memo: memo.trim() || null,
        })
        .eq('id', id)

      if (error) {
        console.error('Failed to update expense:', error)
        toast.error('保存に失敗しました。再試行してください')
        setSaving(false)
        return
      }

      toast.success('経費を更新しました')
      router.push('/expense')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('予期しないエラーが発生しました')
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.from('expenses').delete().eq('id', id)

      if (error) {
        console.error('Failed to delete expense:', error)
        toast.error('削除に失敗しました。再試行してください')
        setDeleting(false)
        setShowDeleteConfirm(false)
        return
      }

      toast.success('経費を削除しました')
      router.push('/expense')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('予期しないエラーが発生しました')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-lg mx-auto text-center py-16">
          <p className="text-gray-500 mb-4">経費が見つかりませんでした。</p>
          <Link href="/expense">
            <Button variant="outline">一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">経費を編集</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">経費情報を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 金額 */}
              <div className="space-y-1.5">
                <Label htmlFor="amount">金額（円）</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="例: 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* 日付 */}
              <div className="space-y-1.5">
                <Label htmlFor="date">日付</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* カテゴリ */}
              <div className="space-y-1.5">
                <Label htmlFor="category">カテゴリ（任意）</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory | '')}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="">選択しない</option>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 説明 */}
              <div className="space-y-1.5">
                <Label htmlFor="description">説明</Label>
                <Input
                  id="description"
                  type="text"
                  required
                  placeholder="例: インターネット代"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* メモ */}
              <div className="space-y-1.5">
                <Label htmlFor="memo">メモ（任意）</Label>
                <textarea
                  id="memo"
                  rows={3}
                  placeholder="補足情報があれば入力してください"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? '保存中...' : '保存'}
                </Button>
                <Link href="/expense">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>

            {/* Delete section */}
            <div className="mt-8 pt-6 border-t">
              {!showDeleteConfirm ? (
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  この経費を削除
                </Button>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
                  <p className="text-sm font-medium text-red-800">
                    本当に削除しますか？この操作は元に戻せません。
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={deleting}
                      onClick={handleDelete}
                    >
                      {deleting ? '削除中...' : '削除する'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
