import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/format'
import { generateNotifications } from '@/lib/notifications'
import NotificationPopover from '@/components/app/notification-popover'
import type { IncomeRow, ExpenseRow } from '@/types/database'

const THRESHOLD = 200_000

interface ThresholdCardProps {
  userId: string
  year: number
  displayName: string
  initials: string
}

export default async function ThresholdCard({ userId, year, displayName, initials }: ThresholdCardProps) {
  const supabase = await createClient()
  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('amount').eq('user_id', userId).gte('date', yearStart).lte('date', yearEnd),
    supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', yearStart).lte('date', yearEnd),
  ])

  const annualIncome = (incomeData ?? []).reduce((s, r) => s + r.amount, 0)
  const annualExpense = (expenseData ?? []).reduce((s, r) => s + r.amount, 0)
  const annualNet = annualIncome - annualExpense
  const progressPct = Math.min(Math.round((annualNet / THRESHOLD) * 100), 100)

  const now = new Date()
  let deadline = new Date(now.getFullYear(), 2, 15)
  if (now > deadline) deadline = new Date(now.getFullYear() + 1, 2, 15)
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const notifications = generateNotifications(annualNet)

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400">こんにちは</p>
            <h1 className="text-[17px] font-bold text-slate-900">{displayName} さん</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <NotificationPopover notifications={notifications} />
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-100 rounded-full text-indigo-600 font-bold text-[13px]">
              {initials}
            </div>
          </div>
        </div>
      </header>

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

        <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <svg className="text-red-500 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <p className="text-[11px] text-red-600 font-medium">
            3月15日（確定申告期限）まであと <strong>{daysUntilDeadline}日</strong> です
          </p>
        </div>
      </div>
    </>
  )
}
