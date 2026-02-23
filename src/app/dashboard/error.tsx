'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-[15px] font-semibold text-slate-700">データの読み込みに失敗しました</p>
        <p className="text-[13px] text-slate-400">ネットワーク接続を確認して再試行してください</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-4 py-2 bg-indigo-600 text-white text-[13px] font-semibold rounded-xl">再試行</button>
          <Link href="/" className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-semibold rounded-xl">ホームへ</Link>
        </div>
      </div>
    </div>
  )
}
