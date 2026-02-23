'use client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'

interface MonthDetailDrawerProps {
  year: number
  month: number
  onClose: () => void
}

interface MonthlyData {
  income: { total: number; count: number; items: Array<{ id: string; amount: number; source?: string; description?: string }> }
  expense: { total: number; count: number; items: Array<{ id: string; amount: number; description?: string }> }
  net: number
}

export default function MonthDetailDrawer({ year, month, onClose }: MonthDetailDrawerProps) {
  const [data, setData] = useState<MonthlyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/dashboard/monthly?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [year, month])

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{year}年{month}月の詳細</SheetTitle>
        </SheetHeader>
        {loading ? (
          <div className="space-y-2 mt-4">
            <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : data && (
          <div className="space-y-4 mt-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500">収入</p>
                <p className="text-[14px] font-bold text-indigo-600">¥{data.income.total.toLocaleString('ja-JP')}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500">経費</p>
                <p className="text-[14px] font-bold text-orange-500">¥{data.expense.total.toLocaleString('ja-JP')}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500">純利益</p>
                <p className="text-[14px] font-bold text-slate-700">¥{data.net.toLocaleString('ja-JP')}</p>
              </div>
            </div>
            {/* Income list */}
            {data.income.items.length > 0 && (
              <div>
                <p className="text-[12px] font-bold text-slate-700 mb-2">収入 ({data.income.count}件)</p>
                <div className="space-y-1.5">
                  {data.income.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[12px]">
                      <span className="text-slate-600">{item.source || item.description}</span>
                      <span className="font-semibold text-emerald-600">+¥{item.amount.toLocaleString('ja-JP')}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/income?month=${year}-${String(month).padStart(2, '0')}`} className="text-[11px] text-indigo-600 mt-2 block">すべて見る &rarr;</Link>
              </div>
            )}
            {/* Expense list */}
            {data.expense.items.length > 0 && (
              <div>
                <p className="text-[12px] font-bold text-slate-700 mb-2">経費 ({data.expense.count}件)</p>
                <div className="space-y-1.5">
                  {data.expense.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-[12px]">
                      <span className="text-slate-600">{item.description}</span>
                      <span className="font-semibold text-orange-500">-¥{item.amount.toLocaleString('ja-JP')}</span>
                    </div>
                  ))}
                </div>
                <Link href={`/expense?month=${year}-${String(month).padStart(2, '0')}`} className="text-[11px] text-indigo-600 mt-2 block">すべて見る &rarr;</Link>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
