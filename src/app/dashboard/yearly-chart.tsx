'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MonthlyData {
  month: string
  収入: number
  経費: number
}

interface YearlyChartProps {
  data: MonthlyData[]
}

function formatYen(value: number) {
  if (value >= 10000) return `${Math.floor(value / 10000)}万`
  return `¥${value.toLocaleString('ja-JP')}`
}

export default function YearlyChart({ data }: YearlyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYen} tick={{ fontSize: 11 }} width={48} />
        <Tooltip
          formatter={(value: number | string | undefined) => {
            if (typeof value === 'number') return `¥${value.toLocaleString('ja-JP')}`
            return value ?? ''
          }}
        />
        <Legend />
        <Bar dataKey="収入" fill="#22c55e" radius={[3, 3, 0, 0]} />
        <Bar dataKey="経費" fill="#f87171" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
