import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/app/bottom-nav'
import ChartYearSelect from '@/components/app/chart-year-select'
import DashboardChart from '@/components/app/dashboard-chart-dynamic'
import NotificationPopover from '@/components/app/notification-popover'
import { formatCurrency, formatDateJP } from '@/lib/format'
import { generateNotifications } from '@/lib/notifications'
import type { IncomeRow, ExpenseRow } from '@/types/database'

const THRESHOLD = 200_000

interface PageProps {
  searchParams: Promise<{ chartYear?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
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

  const params = await searchParams
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const nextMonthDate = new Date(year, month, 1)
  const monthEnd = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`

  const chartYear = (() => {
    const y = parseInt(params.chartYear ?? '', 10)
    return Number.isFinite(y) && y >= 2020 && y <= year ? y : year
  })()

  const [
    { data: incomeData },
    { data: expenseData },
    { data: recentIncomes },
    { data: recentExpenses },
  ] = await Promise.all([
    supabase.from('incomes').select('*').eq('user_id', user.id).gte('date', yearStart).lte('date', yearEnd),
    supabase.from('expenses').select('*').eq('user_id', user.id).gte('date', yearStart).lte('date', yearEnd),
    supabase.from('incomes').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
    supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
  ])

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  const annualIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const annualExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const annualNet = annualIncome - annualExpense
  const progressPct = Math.min(Math.round((annualNet / THRESHOLD) * 100), 100)

  const monthlyIncome = incomes
    .filter(r => r.date >= monthStart && r.date < monthEnd)
    .reduce((s, r) => s + r.amount, 0)
  const monthlyExpense = expenses
    .filter(r => r.date >= monthStart && r.date < monthEnd)
    .reduce((s, r) => s + r.amount, 0)

  // chartYear が当年と異なる場合、チャート用データを別途取得
  let chartIncomes = incomes
  let chartExpenses = expenses
  if (chartYear !== year) {
    const cyStart = `${chartYear}-01-01`
    const cyEnd   = `${chartYear}-12-31`
    const [{ data: ciData }, { data: ceData }] = await Promise.all([
      supabase.from('incomes').select('date, amount').eq('user_id', user.id).gte('date', cyStart).lte('date', cyEnd),
      supabase.from('expenses').select('date, amount').eq('user_id', user.id).gte('date', cyStart).lte('date', cyEnd),
    ])
    chartIncomes  = (ciData  ?? []) as IncomeRow[]
    chartExpenses = (ceData ?? []) as ExpenseRow[]
  }

  // 月別グラフデータ（12ヶ月）
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    const prefix = `${chartYear}-${m}`
    return {
      month: `${i + 1}月`,
      収入: chartIncomes.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
      経費: chartExpenses.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
    }
  })

  // 直近取引（収入・経費を合算して日付降順 top5）
  const recent = [
    ...((recentIncomes ?? []) as IncomeRow[]).map(r => ({
      id: r.id, type: 'income' as const, date: r.date, label: r.source, amount: r.amount,
    })),
    ...((recentExpenses ?? []) as ExpenseRow[]).map(r => ({
      id: r.id, type: 'expense' as const, date: r.date, label: r.description, amount: r.amount,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const displayName = profile?.display_name ?? user.email ?? 'ユーザー'
  const initials = displayName.slice(0, 2).toUpperCase()

  // 3月15日までの日数
  let deadline = new Date(now.getFullYear(), 2, 15)
  if (now > deadline) deadline = new Date(now.getFullYear() + 1, 2, 15)
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // 通知生成
  const notifications = generateNotifications(annualNet)

  return (
    <div className="bg-[#F8FAFC] min-h-screen lg:pl-60">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">こんにちは</p>
            <h1 className="text-[17px] font-bold text-slate-900">{displayName} さん</h1>
          </div>
          <div className="flex items-center gap-2.5">
            {/* 通知ベル */}
            <NotificationPopover notifications={notifications} />
            {/* イニシャルアバター */}
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full text-indigo-600 font-bold text-[13px]">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 px-4 pt-3 pb-24 lg:pb-8">
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start mt-3">

          {/* 左カラム */}
          <div className="space-y-3">
            {/* 20万円カード */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-50 rounded-full opacity-60 pointer-events-none" />
              <div className="absolute -bottom-6 -right-2 w-20 h-20 bg-orange-50 rounded-full opacity-40 pointer-events-none" />

              <div className="flex items-start justify-between mb-3 relative">
                <div>
                  <p className="text-[11px] text-slate-400">{year}年 副業所得（累計）</p>
                  <p className="text-[32px] font-extrabold text-slate-900 leading-tight">{formatCurrency(annualNet)}</p>
                </div>
                {annualNet >= THRESHOLD && (
                  <div className="app-pulse-ring bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0">
                    確定申告が必要！
                  </div>
                )}
              </div>

              {/* グラデーションバー */}
              <div className="relative">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>¥0</span>
                  <span className="font-semibold text-slate-600">¥200,000（確定申告ライン）</span>
                </div>
                <div className="bg-slate-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500 app-bar-animate flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(progressPct, 4)}%` }}
                  >
                    <span className="text-white text-[11px] font-bold">{progressPct}%</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] mt-1.5">
                  <span className="text-slate-400">収入 {formatCurrency(annualIncome)} − 経費 {formatCurrency(annualExpense)}</span>
                  <span className="text-red-500 font-semibold">あと{formatCurrency(Math.max(0, THRESHOLD - annualNet))} で上限</span>
                </div>
              </div>

              {/* Tipボックス */}
              <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-2">
                <svg className="text-red-500 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <p className="text-[11px] text-red-600 font-medium">
                  3月15日（確定申告期限）まであと <strong>{daysUntilDeadline}日</strong> です
                </p>
              </div>
            </div>

            {/* 2×2 サマリー */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/income">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex items-center justify-center w-7 h-7 bg-emerald-50 rounded-xl">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                      </svg>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">副業収入</span>
                  </div>
                  <p className="text-[18px] font-extrabold text-slate-900">{formatCurrency(annualIncome)}</p>
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium">今月 +{formatCurrency(monthlyIncome)}</p>
                </div>
              </Link>
              <Link href="/expense">
                <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex items-center justify-center w-7 h-7 bg-orange-50 rounded-xl">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                      </svg>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">経費合計</span>
                  </div>
                  <p className="text-[18px] font-extrabold text-slate-900">{formatCurrency(annualExpense)}</p>
                  <p className="text-[11px] text-orange-500 mt-1 font-medium">今月 −{formatCurrency(monthlyExpense)}</p>
                </div>
              </Link>
            </div>
          </div>

          {/* 右カラム */}
          <div className="space-y-3">
            {/* 月別チャート */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-slate-700">月別収入推移</h3>
                <ChartYearSelect currentYear={year} chartYear={chartYear} minYear={2020} />
              </div>
              <DashboardChart data={chartData} year={chartYear} />
            </div>

            {/* 最近の取引 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-slate-700">最近の取引</h3>
                <Link href="/income" className="text-[12px] text-indigo-600">すべて見る →</Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-[13px] text-slate-400 py-8 text-center">取引記録がありません</p>
              ) : (
                recent.map(tx => (
                  <div key={`${tx.type}-${tx.id}`} className="px-4 py-3 flex items-center gap-3 border-b border-slate-50 last:border-0">
                    <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                      {tx.type === 'income' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">{tx.label}</p>
                      <p className="text-[11px] text-slate-400">{formatDateJP(tx.date)} · {tx.type === 'income' ? '収入' : '経費'}</p>
                    </div>
                    <span className={`text-[14px] font-bold shrink-0 ${tx.type === 'income' ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  )
}
