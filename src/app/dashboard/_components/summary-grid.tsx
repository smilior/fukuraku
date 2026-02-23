import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/format'
import Link from 'next/link'

interface SummaryGridProps {
  userId: string
  year: number
}

export default async function SummaryGrid({ userId, year }: SummaryGridProps) {
  const supabase = await createClient()

  const month = new Date().getMonth() + 1
  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const nextMonthDate = new Date(year, month, 1)
  const monthEnd = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('date, amount').eq('user_id', userId).gte('date', yearStart).lte('date', yearEnd),
    supabase.from('expenses').select('date, amount').eq('user_id', userId).gte('date', yearStart).lte('date', yearEnd),
  ])

  const incomes = incomeData ?? []
  const expenses = expenseData ?? []

  const annualIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const annualExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const monthlyIncome = incomes.filter(r => r.date >= monthStart && r.date < monthEnd).reduce((s, r) => s + r.amount, 0)
  const monthlyExpense = expenses.filter(r => r.date >= monthStart && r.date < monthEnd).reduce((s, r) => s + r.amount, 0)

  return (
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
  )
}
