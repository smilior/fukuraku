/**
 * 確定申告サマリー画面
 * Server Component — データ取得・集計・表示をすべてサーバーサイドで行う
 */
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/app/bottom-nav'
import FilingChecklist from '@/components/app/filing-checklist'
import type { IncomeRow, ExpenseRow } from '@/types/database'

const FILING_THRESHOLD = 200_000

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

export default async function SummaryPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams
  const currentYear = new Date().getFullYear()
  const selectedYear = (() => {
    const y = parseInt(params.year ?? '', 10)
    return Number.isFinite(y) && y >= 2015 && y <= currentYear ? y : currentYear
  })()

  const yearStart = `${selectedYear}-01-01`
  const yearEnd = `${selectedYear}-12-31`

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('*').eq('user_id', user.id).gte('date', yearStart).lte('date', yearEnd),
    supabase.from('expenses').select('*').eq('user_id', user.id).gte('date', yearStart).lte('date', yearEnd),
  ])

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  const totalIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const netIncome = totalIncome - totalExpense
  const estimatedTax = Math.round(netIncome * 0.2)
  const needsFiling = netIncome > FILING_THRESHOLD

  const yearOptions = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => currentYear - i)

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">確定申告サマリー</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">{selectedYear}年分（令和{selectedYear - 2018}年分）</p>
          </div>
          {/* 年度切り替え */}
          <form method="GET" className="flex items-center gap-2">
            <select
              name="year"
              defaultValue={selectedYear}
              className="h-8 rounded-xl border border-slate-200 bg-white px-2 text-[13px] text-slate-700 focus:outline-none focus:border-indigo-400"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <button
              type="submit"
              className="h-8 px-3 bg-indigo-600 text-white text-[12px] font-semibold rounded-xl"
            >
              表示
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-lg mx-auto pt-3 space-y-3">
        {/* 申告要否バナー */}
        {needsFiling ? (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-red-700">確定申告が必要です</p>
              <p className="text-[11px] text-red-500">副業所得が20万円を超えています</p>
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-full flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-emerald-700">確定申告は不要です</p>
              <p className="text-[11px] text-emerald-500">副業所得が20万円以下です</p>
            </div>
          </div>
        )}

        {/* 収支サマリーテーブル */}
        <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">収支サマリー</span>
          </div>
          {/* 副業収入 */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50">
            <span className="text-[13px] text-slate-600">副業収入（総額）</span>
            <span className="text-[15px] font-bold text-slate-900">{formatCurrency(totalIncome)}</span>
          </div>
          {/* 経費合計 */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-50">
            <span className="text-[13px] text-slate-600">経費合計</span>
            <span className="text-[15px] font-bold text-orange-600">−{formatCurrency(totalExpense)}</span>
          </div>
          {/* 雑所得 */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[13px] font-semibold text-slate-700">雑所得（課税所得）</span>
            <span className="text-[15px] font-extrabold text-indigo-600">{formatCurrency(netIncome)}</span>
          </div>
          {/* 概算税額 */}
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <span className="text-[13px] font-semibold text-slate-700">概算税額</span>
              <span className="text-[11px] text-slate-400 ml-1">（所得税 20%）</span>
            </div>
            <span className="text-[15px] font-extrabold text-red-600">{formatCurrency(estimatedTax)}</span>
          </div>
        </div>

        {/* チェックリスト */}
        <div className="mx-4">
          <FilingChecklist />
        </div>

        {/* ボタン */}
        <div className="mx-4 space-y-2.5 pb-6">
          <a
            href={`/api/summary/csv?year=${selectedYear}`}
            download
            className="flex items-center justify-center w-full bg-indigo-600 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-indigo-200"
          >
            <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            CSV ダウンロード（{selectedYear}年）
          </a>
          <a
            href="https://www.e-tax.nta.go.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-emerald-600 text-white font-bold text-[15px] py-4 rounded-2xl shadow-lg shadow-emerald-200"
          >
            <svg className="mr-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            e-Tax で申告する
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
