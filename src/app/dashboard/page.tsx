import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import LogoutButton from './logout-button'
import YearlyChart from './yearly-chart'
import type { IncomeRow, ExpenseRow } from '@/types/database'

const THRESHOLD = 200_000 // 20万円ライン

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('onboarding_completed, display_name')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/onboarding')
  }

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const nextMonth = new Date(year, month, 1)
  const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`

  // 並行データ取得
  const [
    { data: incomeData },
    { data: expenseData },
    { data: recentIncomes },
    { data: recentExpenses },
  ] = await Promise.all([
    supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', yearStart)
      .lte('date', yearEnd),
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', yearStart)
      .lte('date', yearEnd),
    supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
  ])

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  // 年間集計
  const annualIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const annualExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const annualNet = annualIncome - annualExpense
  const progressPct = Math.min(Math.round((annualNet / THRESHOLD) * 100), 100)

  // 今月集計
  const monthlyIncome = incomes
    .filter(r => r.date >= monthStart && r.date < monthEnd)
    .reduce((s, r) => s + r.amount, 0)
  const monthlyExpense = expenses
    .filter(r => r.date >= monthStart && r.date < monthEnd)
    .reduce((s, r) => s + r.amount, 0)

  // 月別グラフデータ（1〜12月）
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    const prefix = `${year}-${m}`
    return {
      month: `${i + 1}月`,
      収入: incomes.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
      経費: expenses.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
    }
  })

  // 直近取引（収入・経費を合算して日付降順 top5）
  const recent = [
    ...((recentIncomes ?? []) as IncomeRow[]).map(r => ({
      id: r.id, type: 'income' as const, date: r.date,
      label: r.source, amount: r.amount,
    })),
    ...((recentExpenses ?? []) as ExpenseRow[]).map(r => ({
      id: r.id, type: 'expense' as const, date: r.date,
      label: r.description, amount: r.amount,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const displayName = profile?.display_name ?? user.email

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-700">副楽</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* 20万円バー */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex justify-between items-center">
              <span>年間所得の進捗</span>
              <span className="text-sm font-normal text-gray-500">
                {formatCurrency(annualNet)} / 20万円
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPct} className="h-3" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0円</span>
              <span className={annualNet >= THRESHOLD ? 'text-red-500 font-medium' : ''}>
                {progressPct}%
                {annualNet >= THRESHOLD && '  ⚠️ 申告が必要です'}
              </span>
              <span>20万円</span>
            </div>
          </CardContent>
        </Card>

        {/* 今月の収支カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">今月の収入</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">今月の経費</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(monthlyExpense)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-gray-500">今月の差引所得</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${monthlyIncome - monthlyExpense >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
                {formatCurrency(monthlyIncome - monthlyExpense)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 年間推移グラフ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{year}年 月別収支</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyChart data={chartData} />
          </CardContent>
        </Card>

        {/* 直近の取引 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">直近の取引</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">取引記録がありません</p>
            ) : (
              <ul className="divide-y">
                {recent.map(tx => (
                  <li key={`${tx.type}-${tx.id}`} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tx.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'income' ? '収入' : '経費'}
                      </span>
                      <span className="text-sm">{tx.label}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* クイックアクション */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/income/new" className="block">
            <Card className="hover:bg-green-50 transition-colors cursor-pointer">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-sm font-medium">+ 収入</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/expense/new" className="block">
            <Card className="hover:bg-red-50 transition-colors cursor-pointer">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl mb-1">🧾</div>
                <p className="text-sm font-medium">+ 経費</p>
              </CardContent>
            </Card>
          </Link>
          <Card className="opacity-50 cursor-not-allowed">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl mb-1">📷</div>
              <p className="text-sm font-medium text-gray-400">カメラ</p>
              <p className="text-xs text-gray-400">準備中</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
