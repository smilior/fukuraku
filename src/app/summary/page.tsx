/**
 * 確定申告サマリー画面
 * Server Component — データ取得・集計・表示をすべてサーバーサイドで行う
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { IncomeRow, ExpenseRow, IncomeCategory, ExpenseCategory } from '@/types/database'

const INCOME_CATEGORIES: IncomeCategory[] = [
  'フリーランス',
  'アフィリエイト',
  '転売・せどり',
  'YouTube・動画',
  '株・投資',
  '不動産',
  'その他',
]

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

const FILING_THRESHOLD = 200_000 // 20万円

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

/** 源泉徴収額を計算（10.21%） */
function calcWithholding(amount: number): number {
  return Math.floor(amount * 0.1021)
}

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

export default async function SummaryPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 年度パラメータ（デフォルト: 当年）
  const params = await searchParams
  const currentYear = new Date().getFullYear()
  const selectedYear = (() => {
    const y = parseInt(params.year ?? '', 10)
    return Number.isFinite(y) && y >= 2015 && y <= currentYear ? y : currentYear
  })()

  const yearStart = `${selectedYear}-01-01`
  const yearEnd = `${selectedYear}-12-31`

  // 収入・経費を並行取得
  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', yearStart)
      .lte('date', yearEnd)
      .order('date', { ascending: true }),
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', yearStart)
      .lte('date', yearEnd)
      .order('date', { ascending: true }),
  ])

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  // 年間集計
  const totalIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const netIncome = totalIncome - totalExpense
  const totalWithholding = incomes.reduce(
    (s, r) => s + calcWithholding(r.amount),
    0
  )

  // 申告要否
  const needsFiling = netIncome > FILING_THRESHOLD

  // カテゴリ別集計（収入）
  const incomeByCat = INCOME_CATEGORIES.map((cat) => {
    const rows = incomes.filter((r) => r.category === cat)
    return {
      category: cat,
      count: rows.length,
      total: rows.reduce((s, r) => s + r.amount, 0),
    }
  }).filter((c) => c.count > 0)

  // カテゴリ別集計（経費）
  const expenseByCat = EXPENSE_CATEGORIES.map((cat) => {
    const rows = expenses.filter((r) => r.category === cat)
    return {
      category: cat,
      count: rows.length,
      total: rows.reduce((s, r) => s + r.amount, 0),
    }
  }).filter((c) => c.count > 0)

  // セレクト用年リスト（2015 〜 当年）
  const yearOptions = Array.from(
    { length: currentYear - 2015 + 1 },
    (_, i) => currentYear - i
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-green-700">
            副楽
          </Link>
          <span className="text-sm text-gray-500">確定申告サマリー</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 年度切り替え */}
        <div className="flex items-center gap-3">
          <form method="GET" className="flex items-center gap-2">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700">
              申告年度
            </label>
            <select
              id="year-select"
              name="year"
              defaultValue={selectedYear}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={undefined}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-8 px-3 transition-colors"
            >
              表示
            </button>
          </form>
        </div>

        {/* 申告要否バナー */}
        <div
          className={`rounded-lg px-5 py-4 font-semibold text-sm ${
            needsFiling
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
          role="alert"
        >
          {needsFiling ? (
            <span>確定申告が必要です（{selectedYear}年の所得: {formatCurrency(netIncome)}）</span>
          ) : (
            <span>確定申告は不要です（20万円以下）（{selectedYear}年の所得: {formatCurrency(netIncome)}）</span>
          )}
        </div>

        {/* 年間サマリーカード 3枚 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">総収入</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{incomes.length}件</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">総経費</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{expenses.length}件</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">差引所得</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  netIncome >= 0 ? 'text-gray-800' : 'text-red-500'
                }`}
              >
                {formatCurrency(netIncome)}
              </p>
              <p
                className={`text-xs mt-1 ${
                  needsFiling ? 'text-red-400' : 'text-gray-400'
                }`}
              >
                {needsFiling ? '申告要' : '申告不要'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 源泉徴収合計 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">源泉徴収合計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalWithholding)}
              </span>
              <span className="text-sm text-gray-500">
                （各収入 × 10.21% の合計）
              </span>
            </div>
          </CardContent>
        </Card>

        {/* カテゴリ別収入テーブル */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">カテゴリ別収入</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {incomeByCat.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center px-6">
                {selectedYear}年の収入データがありません
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">カテゴリ</TableHead>
                    <TableHead className="text-right">件数</TableHead>
                    <TableHead className="text-right pr-6">金額合計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeByCat.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell className="pl-6">{row.category}</TableCell>
                      <TableCell className="text-right">{row.count}件</TableCell>
                      <TableCell className="text-right pr-6 text-green-600 font-medium">
                        {formatCurrency(row.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="pl-6 font-semibold">合計</TableCell>
                    <TableCell className="text-right font-semibold">
                      {incomes.length}件
                    </TableCell>
                    <TableCell className="text-right pr-6 font-semibold text-green-600">
                      {formatCurrency(totalIncome)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* カテゴリ別経費テーブル */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">カテゴリ別経費</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {expenseByCat.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center px-6">
                {selectedYear}年の経費データがありません
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">カテゴリ</TableHead>
                    <TableHead className="text-right">件数</TableHead>
                    <TableHead className="text-right pr-6">金額合計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseByCat.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell className="pl-6">{row.category}</TableCell>
                      <TableCell className="text-right">{row.count}件</TableCell>
                      <TableCell className="text-right pr-6 text-red-500 font-medium">
                        {formatCurrency(row.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="pl-6 font-semibold">合計</TableCell>
                    <TableCell className="text-right font-semibold">
                      {expenses.length}件
                    </TableCell>
                    <TableCell className="text-right pr-6 font-semibold text-red-500">
                      {formatCurrency(totalExpense)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* CSV ダウンロード */}
        <div className="flex justify-end pb-6">
          <Button asChild variant="outline" size="lg">
            <a href={`/api/summary/csv?year=${selectedYear}`} download>
              CSV ダウンロード（{selectedYear}年）
            </a>
          </Button>
        </div>
      </main>
    </div>
  )
}
