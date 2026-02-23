import { createClient } from '@/lib/supabase/server'
import ChartYearSelect from '@/components/app/chart-year-select'
import DashboardChart from '@/components/app/dashboard-chart-dynamic'
import type { IncomeRow, ExpenseRow } from '@/types/database'

interface ChartSectionProps {
  userId: string
  year: number
  currentYear: number
}

export default async function ChartSection({ userId, year, currentYear }: ChartSectionProps) {
  const supabase = await createClient()
  const cyStart = `${year}-01-01`
  const cyEnd = `${year}-12-31`

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('date, amount').eq('user_id', userId).gte('date', cyStart).lte('date', cyEnd),
    supabase.from('expenses').select('date, amount').eq('user_id', userId).gte('date', cyStart).lte('date', cyEnd),
  ])

  const chartIncomes = (incomeData ?? []) as Pick<IncomeRow, 'date' | 'amount'>[]
  const chartExpenses = (expenseData ?? []) as Pick<ExpenseRow, 'date' | 'amount'>[]

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    const prefix = `${year}-${m}`
    return {
      month: `${i + 1}月`,
      収入: chartIncomes.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
      経費: chartExpenses.filter(r => r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0),
    }
  })

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold text-slate-700">月別収入推移</h3>
        <ChartYearSelect currentYear={currentYear} chartYear={year} minYear={2020} />
      </div>
      <DashboardChart data={chartData} year={year} />
    </div>
  )
}
