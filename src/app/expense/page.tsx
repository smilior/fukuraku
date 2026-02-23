import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExpenseRow, ExpenseCategory } from '@/types/database'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  '通信費': '通信費',
  '消耗品費': '消耗品費',
  '接待交際費': '接待交際費',
  '交通費': '交通費',
  '広告宣伝費': '広告宣伝費',
  '外注費': '外注費',
  '研修費': '研修費',
  '地代家賃': '地代家賃',
  'その他': 'その他',
}

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

export default async function ExpensePage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { month } = await searchParams

  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (month) {
    // month = 'YYYY-MM'
    const [year, mon] = month.split('-')
    const startDate = `${year}-${mon}-01`
    const nextMonth = new Date(Number(year), Number(mon), 1)
    const endDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`
    query = query.gte('date', startDate).lt('date', endDate)
  }

  const { data: expensesData, error } = await query

  if (error) {
    console.error('Failed to fetch expenses:', error)
  }

  const rows: ExpenseRow[] = (expensesData as ExpenseRow[] | null) ?? []
  const total = rows.reduce((sum, e) => sum + e.amount, 0)

  // Generate month options for the last 12 months
  const monthOptions: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`
    monthOptions.push({ value, label })
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">経費記録</h1>
          <Link href="/expense/new">
            <Button>+ 経費を追加</Button>
          </Link>
        </div>

        {/* Month filter */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="month-select" className="text-sm font-medium text-gray-700">月絞り込み:</label>
          <form method="GET" className="flex items-center gap-2">
            <select
              id="month-select"
              name="month"
              defaultValue={month ?? ''}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:border-ring"
            >
              <option value="">すべて</option>
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline" size="sm">
              絞り込む
            </Button>
          </form>
          {month && (
            <Link href="/expense" className="text-sm text-blue-600 hover:underline">
              クリア
            </Link>
          )}
        </div>

        {/* Summary card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              {month
                ? `${month.replace('-', '年')}月 合計`
                : '全期間 合計'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ¥{total.toLocaleString('ja-JP')}
            </p>
            <p className="text-sm text-gray-500 mt-1">{rows.length}件</p>
          </CardContent>
        </Card>

        {/* Expense table */}
        {rows.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>経費が登録されていません。</p>
            <Link href="/expense/new">
              <Button variant="outline" className="mt-4">
                最初の経費を追加
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">日付</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">カテゴリ</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">説明</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">金額</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{expense.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {CATEGORY_LABELS[expense.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ¥{expense.amount.toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/expense/${expense.id}/edit`}
                        className="text-blue-600 hover:underline mr-3 text-xs"
                      >
                        編集
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
