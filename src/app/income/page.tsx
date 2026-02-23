import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/app/bottom-nav'
import MonthSelect from '@/components/app/month-select'
import { formatCurrency, formatDateJP } from '@/lib/format'
import type { IncomeRow } from '@/types/database'

interface PageProps {
  searchParams: Promise<{ month?: string }>
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

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 lg:pb-0 lg:pl-60">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900">収入記録</h2>
          <Link
            href="/income/new"
            className="flex items-center gap-1 bg-indigo-600 text-white text-[13px] font-semibold px-3 py-1.5 rounded-xl"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            追加
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto lg:max-w-5xl">
        {/* 月フィルター */}
        <div className="px-4 pt-3 flex items-center gap-2">
          <MonthSelect basePath="/income" currentMonth={month} />
          {month && (
            <Link href="/income" className="h-9 px-3 flex items-center text-[13px] text-slate-500 border border-slate-200 rounded-xl bg-white">
              クリア
            </Link>
          )}
        </div>

        {/* エメラルドバナー */}
        <div className="mx-4 mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-emerald-600 font-medium">収入合計</p>
            <p className="text-[22px] font-extrabold text-emerald-700">{formatCurrency(total)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-emerald-600 font-medium">件数</p>
            <p className="text-[22px] font-extrabold text-emerald-700">{rows.length}件</p>
          </div>
        </div>

        {/* カードリスト */}
        {rows.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-[14px] mb-4">収入記録がありません</p>
            <Link
              href="/income/new"
              className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[13px] font-semibold px-4 py-2 rounded-xl"
            >
              + 収入を追加する
            </Link>
          </div>
        ) : (
          <ul className="px-4 pt-3 pb-6 space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
            {rows.map((income) => (
              <li key={income.id}>
                <Link href={`/income/${income.id}/edit`}>
                  <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-xl shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-slate-900 truncate">{income.source}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">{formatDateJP(income.date)}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                          {income.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[15px] font-extrabold text-emerald-600 shrink-0">
                      +{formatCurrency(income.amount)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
