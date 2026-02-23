/**
 * GET /api/summary/csv?year=YYYY
 * 確定申告用 CSV エクスポート API
 * - BOM付き UTF-8（Excel 対応）
 * - 収入・経費の全データ + 合計行
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { IncomeRow, ExpenseRow } from '@/types/database'

/** 源泉徴収額を計算（10.21%） */
function calcWithholding(amount: number): number {
  return Math.floor(amount * 0.1021)
}

/** CSV セルの値をエスケープ（カンマ・改行・ダブルクォートを含む場合は引用） */
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function csvRow(cells: (string | number | null | undefined)[]): string {
  return cells.map(csvCell).join(',')
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 年度パラメータ（デフォルト: 当年）
  const { searchParams } = request.nextUrl
  const currentYear = new Date().getFullYear()
  const rawYear = parseInt(searchParams.get('year') ?? '', 10)
  const selectedYear =
    Number.isFinite(rawYear) && rawYear >= 2015 && rawYear <= currentYear
      ? rawYear
      : currentYear

  const yearStart = `${selectedYear}-01-01`
  const yearEnd = `${selectedYear}-12-31`

  // 収入・経費を並行取得
  const [{ data: incomeData, error: incomeError }, { data: expenseData, error: expenseError }] =
    await Promise.all([
      supabase
        .from('incomes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', yearStart)
        .lte('date', yearEnd)
        .order('date', { ascending: true }),
      supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', yearStart)
        .lte('date', yearEnd)
        .order('date', { ascending: true }),
    ])

  if (incomeError || expenseError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const incomes = (incomeData ?? []) as IncomeRow[]
  const expenses = (expenseData ?? []) as ExpenseRow[]

  // CSV 生成
  const lines: string[] = []

  // ヘッダー行
  lines.push(csvRow(['種別', '日付', 'カテゴリ', '金額', '取引先/説明', '源泉徴収額']))

  // 収入行
  for (const row of incomes) {
    lines.push(
      csvRow([
        '収入',
        row.date,
        row.category,
        row.amount,
        row.source,
        calcWithholding(row.amount),
      ])
    )
  }

  // 経費行
  for (const row of expenses) {
    lines.push(
      csvRow([
        '経費',
        row.date,
        row.category,
        row.amount,
        row.description,
        0,
      ])
    )
  }

  // 集計行
  const totalIncome = incomes.reduce((s, r) => s + r.amount, 0)
  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0)
  const netIncome = totalIncome - totalExpense

  lines.push(csvRow(['合計収入', '', '', '', totalIncome, '']))
  lines.push(csvRow(['合計経費', '', '', '', totalExpense, '']))
  lines.push(csvRow(['差引所得', '', '', '', netIncome, '']))

  // BOM付き UTF-8 で結合
  const csvContent = '\uFEFF' + lines.join('\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fukuraku_${selectedYear}.csv"`,
    },
  })
}
