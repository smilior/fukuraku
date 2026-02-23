'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { ExpenseCategory } from '@/types/database'

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

export default function NewExpensePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState<ExpenseCategory | ''>('')
  const [description, setDescription] = useState('')
  const [memo, setMemo] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!description.trim()) return

    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        date,
        amount: Number(amount),
        category: category || null,
        description: description.trim(),
        memo: memo.trim() || null,
      })

      if (error) {
        console.error('Failed to insert expense:', error)
        toast.error('保存に失敗しました。再試行してください')
        setSaving(false)
        return
      }

      toast.success('経費を追加しました')
      router.push('/expense')
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('予期しないエラーが発生しました')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">経費を追加</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">経費情報を入力</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
