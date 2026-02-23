'use client'

import { useRouter } from 'next/navigation'

interface ChartYearSelectProps {
  currentYear: number
  chartYear: number
  minYear?: number
}

export default function ChartYearSelect({ currentYear, chartYear, minYear = 2020 }: ChartYearSelectProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`?chartYear=${e.target.value}`)
  }

  const years = Array.from({ length: currentYear - minYear + 1 }, (_, i) => currentYear - i)

  return (
    <select
      value={chartYear}
      onChange={handleChange}
      className="h-7 rounded-lg border border-slate-200 bg-indigo-50 px-2 text-[11px] text-indigo-600 font-medium focus:outline-none focus:border-indigo-400 cursor-pointer"
    >
      {years.map(y => (
        <option key={y} value={y}>{y}年</option>
      ))}
    </select>
  )
}
