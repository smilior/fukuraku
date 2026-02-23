import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateJP } from '@/lib/format'
import Link from 'next/link'
import type { IncomeRow, ExpenseRow } from '@/types/database'

interface RecentTransactionsProps {
  userId: string
}

export default async function RecentTransactions({ userId }: RecentTransactionsProps) {
  const supabase = await createClient()

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('id, date, amount, source').eq('user_id', userId).order('date', { ascending: false }).limit(5),
    supabase.from('expenses').select('id, date, amount, description').eq('user_id', userId).order('date', { ascending: false }).limit(5),
  ])

  const recent = [
    ...(incomeData ?? []).map(r => ({
      id: r.id, type: 'income' as const, date: r.date, label: r.source, amount: r.amount,
    })),
    ...(expenseData ?? []).map(r => ({
      id: r.id, type: 'expense' as const, date: r.date, label: r.description, amount: r.amount,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
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
  )
}
