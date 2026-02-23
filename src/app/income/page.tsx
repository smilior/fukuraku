import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { IncomeRow } from '@/types/database'

interface PageProps {
  searchParams: Promise<{ month?: string }>
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}/${month}/${day}`
}

function generateMonthOptions(): { value: string; label: string }[] {
  const options = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`
    options.push({ value, label })
  }
  return options
}

export default async function IncomePage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { month } = await searchParams

  let query = supabase
    .from('incomes')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (month) {
    const [year, mon] = month.split('-')
    const startDate = `${year}-${mon}-01`
    const endDate = new Date(Number(year), Number(mon), 0)
    const endDateStr = `${year}-${mon}-${String(endDate.getDate()).padStart(2, '0')}`
    query = query.gte('date', startDate).lte('date', endDateStr)
  }

  const { data: incomes, error } = await query

  if (error) {
    console.error('Failed to fetch incomes:', error)
  }

  const rows = (incomes ?? []) as IncomeRow[]
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const monthOptions = generateMonthOptions()

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
              ← ダッシュボードへ
            </Link>
            <h1 className="text-2xl font-bold">収入記録</h1>
          </div>
          <Link href="/income/new">
            <Button>+ 収入を追加</Button>
          </Link>
        </div>

        {/* Month filter */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-gray-600">月別フィルタ:</span>
          <div className="flex flex-wrap gap-2">
            <Link href="/income">
              <Badge
                variant={!month ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                すべて
              </Badge>
            </Link>
            {monthOptions.map((opt) => (
              <Link key={opt.value} href={`/income?month=${opt.value}`}>
                <Badge
                  variant={month === opt.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                >
                  {opt.label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {month ? `${month.replace('-', '年')}月の合計` : '合計収入'}
              （{rows.length}件）
            </span>
            <span className="text-xl font-bold text-green-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Table */}
        {rows.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">収入記録がありません</p>
            <Link href="/income/new">
              <Button variant="outline">+ 収入を追加する</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>取引先</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="text-right">源泉徴収（10.21%）</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((income) => {
                  const withholdingAmount = Math.floor(income.amount * 0.1021)
                  return (
                    <TableRow key={income.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(income.date)}
                      </TableCell>
                      <TableCell>{income.source}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{income.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell className="text-right text-gray-500 text-sm">
                        {formatCurrency(withholdingAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/income/${income.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            編集
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
