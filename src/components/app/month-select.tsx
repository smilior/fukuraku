'use client'

import { useRouter } from 'next/navigation'

interface MonthSelectProps {
  basePath: string
  currentMonth?: string
}

function generateMonthOptions(): { value: string; label: string }[] {
  const options = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`
    options.push({ value, label })
  }
  return options
}

export default function MonthSelect({ basePath, currentMonth }: MonthSelectProps) {
  const router = useRouter()
  const monthOptions = generateMonthOptions()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`${basePath}?month=${value}`)
    } else {
      router.push(basePath)
    }
  }

  return (
    <select
      value={currentMonth ?? ''}
      onChange={handleChange}
      className="flex-1 h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 shadow-sm focus:outline-none focus:border-indigo-400"
    >
      <option value="">すべての期間</option>
      {monthOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
