import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/app/bottom-nav'
import MonthSelect from '@/components/app/month-select'
import { formatCurrency, formatDateJP } from '@/lib/format'
import type { ExpenseRow, ExpenseCategory } from '@/types/database'

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string }> = {
  '通信費':     { bg: 'bg-blue-50',    text: 'text-blue-600' },
  '消耗品費':   { bg: 'bg-amber-50',   text: 'text-amber-600' },
  '接待交際費': { bg: 'bg-pink-50',    text: 'text-pink-600' },
  '交通費':     { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  '広告宣伝費': { bg: 'bg-violet-50',  text: 'text-violet-600' },
  '外注費':     { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
  '研修費':     { bg: 'bg-teal-50',    text: 'text-teal-600' },
  '地代家賃':   { bg: 'bg-orange-50',  text: 'text-orange-600' },
  'その他':     { bg: 'bg-slate-100',  text: 'text-slate-500' },
}

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{ month?: string; page?: string }>
}

export default async function ExpensePage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { month, page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('expenses')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (month) {
    const [year, mon] = month.split('-')
    const startDate = `${year}-${mon}-01`
    const nextMonth = new Date(Number(year), Number(mon), 1)
    const endDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`
    query = query.gte('date', startDate).lt('date', endDate)
  }

  const { data: expensesData, error, count } = await query.range(from, to)

  if (error) {
    console.error('Failed to fetch expenses:', error)
  }

  const rows: ExpenseRow[] = (expensesData as ExpenseRow[] | null) ?? []
  const totalCount = count ?? 0
  const total = rows.reduce((sum, e) => sum + e.amount, 0)

  function buildPageUrl(p: number) {
    const params = new URLSearchParams()
    if (month) params.set('month', month)
    params.set('page', String(p))
    return `/expense?${params.toString()}`
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 lg:pb-0 lg:pl-60">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-lg mx-auto lg:max-w-5xl lg:px-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900">経費記録</h2>
          <Link
            href="/expense/new"
            className="text-[13px] text-indigo-600 font-semibold"
          >
            手動で追加
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto lg:max-w-5xl">
        {/* AIレシートボタン */}
        <div className="px-4 pt-4 lg:max-w-2xl">
          <Link
            href="/receipt/new"
            className="flex items-center gap-4 w-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-4 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-[15px]">レシートをAI仕訳</p>
              <p className="text-white/75 text-[12px] mt-0.5">撮影するだけで自動入力</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* 月フィルター */}
        <div className="px-4 pt-3 flex items-center gap-2">
          <MonthSelect basePath="/expense" currentMonth={month} />
          {month && (
            <Link href="/expense" className="h-9 px-3 flex items-center text-[13px] text-slate-500 border border-slate-200 rounded-xl bg-white">
              クリア
            </Link>
          )}
        </div>

        {/* オレンジバナー */}
        <div className="mx-4 mt-3 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-orange-600 font-medium">経費合計</p>
            <p className="text-[22px] font-extrabold text-orange-700">{formatCurrency(total)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-orange-600 font-medium">件数</p>
            <p className="text-[22px] font-extrabold text-orange-700">{rows.length}件</p>
          </div>
        </div>

        {/* カードリスト */}
        {rows.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-[14px] mb-4">経費が登録されていません</p>
            <Link
              href="/expense/new"
              className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[13px] font-semibold px-4 py-2 rounded-xl"
            >
              + 経費を追加する
            </Link>
          </div>
        ) : (
          <>
            <ul className="px-4 pt-3 pb-3 space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
              {rows.map((expense) => (
                <li key={expense.id}>
                  <Link href={`/expense/${expense.id}/edit`}>
                    <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-xl shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-slate-900 truncate">{expense.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">{formatDateJP(expense.date)}</span>
                          {expense.category && (() => {
                            const colors = CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS['その他']
                            return (
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                {expense.category}
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <span className="text-[15px] font-extrabold text-orange-500 shrink-0">
                        −{formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {totalCount > PAGE_SIZE && (
              <div className="flex justify-between items-center px-4 py-3 text-[13px]">
                <span className="text-slate-400">{totalCount}件中{from + 1}〜{Math.min(from + PAGE_SIZE, totalCount)}件</span>
                <div className="flex gap-2">
                  {page > 1 && <Link href={buildPageUrl(page - 1)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">← 前</Link>}
                  {from + PAGE_SIZE < totalCount && <Link href={buildPageUrl(page + 1)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">次 →</Link>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
