'use client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'

interface MonthDetailDrawerProps {
  year: number
  month: number
  onClose: () => void
}

interface TxItem {
  id: string
  amount: number
  source?: string
  description?: string
}

interface MonthlyData {
  income: { total: number; count: number; items: TxItem[] }
  expense: { total: number; count: number; items: TxItem[] }
  net: number
}

const UpArrow = ({ color = '#059669' }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
)

const DownArrow = ({ color = '#F97316' }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 13l-5 5m0 0l-5-5m5 5V6" />
  </svg>
)

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export default function MonthDetailDrawer({ year, month, onClose }: MonthDetailDrawerProps) {
  const [data, setData] = useState<MonthlyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData(null)
    fetch(`/api/dashboard/monthly?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [year, month])

  const monthStr = `${year}-${String(month).padStart(2, '0')}`

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto px-4 pb-8">

        {/* ヘッダー */}
        <SheetHeader className="pb-4 border-b border-slate-100 mb-4">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">月別詳細</p>
            <SheetTitle className="text-[18px] font-extrabold text-slate-900 mt-0.5">
              {year}年{month}月
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* ローディング */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-[72px] bg-slate-100 rounded-2xl" />
              <div className="h-[72px] bg-slate-100 rounded-2xl" />
              <div className="h-[72px] bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-[120px] bg-slate-100 rounded-2xl" />
            <div className="h-[80px] bg-slate-100 rounded-2xl" />
          </div>
        )}

        {/* データあり */}
        {!loading && data && (
          <div className="space-y-5">

            {/* サマリーカード */}
            <div className="grid grid-cols-3 gap-2">
              {/* 収入 */}
              <div className="bg-emerald-50 rounded-2xl p-3">
                <div className="flex items-center gap-1 mb-1.5">
                  <UpArrow color="#059669" />
                  <span className="text-[10px] text-emerald-600 font-semibold">収入</span>
                </div>
                <p className="text-[18px] font-extrabold text-emerald-700 leading-tight">
                  ¥{data.income.total.toLocaleString('ja-JP')}
                </p>
                <p className="text-[10px] text-emerald-500 mt-0.5">{data.income.count}件</p>
              </div>
              {/* 経費 */}
              <div className="bg-orange-50 rounded-2xl p-3">
                <div className="flex items-center gap-1 mb-1.5">
                  <DownArrow color="#F97316" />
                  <span className="text-[10px] text-orange-500 font-semibold">経費</span>
                </div>
                <p className="text-[18px] font-extrabold text-orange-600 leading-tight">
                  ¥{data.expense.total.toLocaleString('ja-JP')}
                </p>
                <p className="text-[10px] text-orange-400 mt-0.5">{data.expense.count}件</p>
              </div>
              {/* 純利益 */}
              <div className={`rounded-2xl p-3 ${data.net >= 0 ? 'bg-indigo-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className={`text-[10px] font-semibold ${data.net >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>純利益</span>
                </div>
                <p className={`text-[18px] font-extrabold leading-tight ${data.net >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                  ¥{Math.abs(data.net).toLocaleString('ja-JP')}
                </p>
                <p className={`text-[10px] mt-0.5 ${data.net >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                  {data.net >= 0 ? '黒字' : '赤字'}
                </p>
              </div>
            </div>

            {/* 空状態 */}
            {data.income.items.length === 0 && data.expense.items.length === 0 && (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <p className="text-[13px] text-slate-500 font-medium">この月の取引はありません</p>
                <Link
                  href="/income/new"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-[12px] font-semibold rounded-xl"
                >
                  収入を追加する
                </Link>
              </div>
            )}

            {/* 収入セクション */}
            {data.income.items.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-lg">
                    <UpArrow color="#059669" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700">収入</span>
                  <span className="text-[11px] text-slate-400">{data.income.count}件</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  {data.income.items.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 ${i < data.income.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-xl shrink-0">
                        <UpArrow color="#059669" />
                      </div>
                      <p className="flex-1 text-[13px] font-medium text-slate-800 truncate">
                        {item.source || item.description || '収入'}
                      </p>
                      <span className="text-[13px] font-bold text-emerald-600 shrink-0">
                        +¥{item.amount.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/income?month=${monthStr}`}
                  className="mt-2.5 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-indigo-200 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  収入一覧を見る
                  <ChevronRight />
                </Link>
              </div>
            )}

            {/* 経費セクション */}
            {data.expense.items.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-lg">
                    <DownArrow color="#F97316" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700">経費</span>
                  <span className="text-[11px] text-slate-400">{data.expense.count}件</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                  {data.expense.items.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 ${i < data.expense.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-xl shrink-0">
                        <DownArrow color="#F97316" />
                      </div>
                      <p className="flex-1 text-[13px] font-medium text-slate-800 truncate">
                        {item.description || '経費'}
                      </p>
                      <span className="text-[13px] font-bold text-orange-500 shrink-0">
                        −¥{item.amount.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/expense?month=${monthStr}`}
                  className="mt-2.5 flex items-center justify-center gap-1 py-2.5 rounded-xl border border-orange-200 text-[12px] font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
                >
                  経費一覧を見る
                  <ChevronRight />
                </Link>
              </div>
            )}

          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
