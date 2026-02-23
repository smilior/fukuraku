'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import MonthDetailDrawer from './month-detail-drawer'

interface ChartData {
  month: string  // '1月', '2月', etc.
  収入: number
  経費: number
}

interface DashboardChartProps {
  data: ChartData[]
  year: number
}

export default function DashboardChart({ data, year }: DashboardChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)

  return (
    <>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barGap={2} onClick={(e) => {
          if (e?.activeTooltipIndex != null) setSelectedMonth(Number(e.activeTooltipIndex) + 1)
        }}>
          <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v, name) => [`¥${Number(v).toLocaleString('ja-JP')}`, name]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="収入" fill="#4F46E5" radius={[3, 3, 0, 0]} maxBarSize={12} />
          <Bar dataKey="経費" fill="#F97316" radius={[3, 3, 0, 0]} maxBarSize={12} />
        </BarChart>
      </ResponsiveContainer>
      {selectedMonth && (
        <MonthDetailDrawer
          year={year}
          month={selectedMonth}
          onClose={() => setSelectedMonth(null)}
        />
      )}
    </>
  )
}
