'use client'

import { useState } from 'react'

const ITEMS = [
  '源泉徴収票を用意した',
  '副業収入の記録が完了した',
  '経費の領収書を整理した',
  '確定申告書類をダウンロードした',
  'e-Taxで申告を完了した',
]

export default function FilingChecklist() {
  const [checked, setChecked] = useState<boolean[]>(ITEMS.map(() => false))

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const doneCount = checked.filter(Boolean).length

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-slate-700">申告チェックリスト</h3>
        <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
          {doneCount}/{ITEMS.length}
        </span>
      </div>
      <ul>
        {ITEMS.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
            >
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  checked[i]
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300'
                }`}
              >
                {checked[i] && (
                  <svg
                    className="app-check-pop"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="white"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[13px] ${
                  checked[i] ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
