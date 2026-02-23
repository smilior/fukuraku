import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { IncomeRow, ExpenseRow } from '@/types/database'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
  const month = parseInt(searchParams.get('month') ?? '1')

  const start = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const end = new Date(year, month, 0).toISOString().split('T')[0]

  const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
    supabase.from('incomes').select('*').eq('user_id', user.id).gte('date', start).lte('date', end).order('date', { ascending: false }),
    supabase.from('expenses').select('*').eq('user_id', user.id).gte('date', start).lte('date', end).order('date', { ascending: false }),
  ])

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  const incomeTotal = incomes.reduce((s, r) => s + r.amount, 0)
  const expenseTotal = expenses.reduce((s, r) => s + r.amount, 0)

  return NextResponse.json({
    income: { total: incomeTotal, count: incomes.length, items: incomes.slice(0, 5) },
    expense: { total: expenseTotal, count: expenses.length, items: expenses.slice(0, 5) },
    net: incomeTotal - expenseTotal,
  })
}
