import Link from 'next/link'

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-16 px-4"
      style={{ background: 'linear-gradient(160deg, #f8f7ff 0%, #eef2ff 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-600 text-[13px] font-bold tracking-widest uppercase mb-2">Pricing</p>
          <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900">シンプルな料金体系</h2>
          <p className="text-[16px] text-slate-500 mt-2">競合より安く、副業専用。月5件まで永久無料。</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Free */}
          <div className="lp-plan-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-[13px] font-bold text-slate-500 mb-3">無料プラン</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[36px] font-extrabold text-slate-900">¥0</span>
              <span className="text-[14px] text-slate-400">/月</span>
            </div>
            <p className="text-[12px] text-slate-400 mb-5">まず試したい方に</p>
            <ul className="space-y-2.5 mb-6">
              {[
                { text: '月5件まで収支記録', ok: true },
                { text: '20万円アラート', ok: true },
                { text: '確定申告の要否判定', ok: true },
                { text: 'AI仕訳（レシートOCR）', ok: false },
                { text: 'CSVエクスポート', ok: false },
              ].map((f) => (
                <li key={f.text} className={`flex items-center gap-2.5 text-[13px] ${f.ok ? 'text-slate-700' : 'text-slate-300'}`}>
                  {f.ok ? (
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full block text-center border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer">
              無料で始める
            </Link>
          </div>

          {/* Basic (Recommended) */}
          <div className="lp-plan-card bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-200 border border-indigo-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-black px-4 py-1 rounded-full shadow-sm">
              おすすめ
            </div>
            <p className="text-[13px] font-bold text-indigo-200 mb-3">ベーシックプラン</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[36px] font-extrabold text-white">¥980</span>
              <span className="text-[14px] text-indigo-300">/月</span>
            </div>
            <p className="text-[12px] text-indigo-300 mb-5">年払い ¥9,800（¥817/月）</p>
            <ul className="space-y-2.5 mb-6">
              {['収支記録 無制限', 'AI仕訳（レシートOCR）', 'CSVエクスポート', '確定申告サマリー', '会社バレ防止ガイド'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-white">
                  <svg className="w-4 h-4 text-indigo-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full block text-center bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer">
              14日間無料で試す
            </Link>
          </div>

          {/* Season Pass */}
          <div className="lp-plan-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <p className="text-[13px] font-bold text-slate-500 mb-3">シーズンパス</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[36px] font-extrabold text-slate-900">¥2,980</span>
            </div>
            <p className="text-[12px] text-slate-400 mb-5">1〜3月の3ヶ月間のみ · プロ機能</p>
            <ul className="space-y-2.5 mb-6">
              {[
                { text: 'ベーシックの全機能', color: 'text-emerald-500' },
                { text: 'AIチャット税務Q&A', color: 'text-emerald-500' },
                { text: '節税アドバイス機能', color: 'text-emerald-500' },
                { text: '優先カスタマーサポート', color: 'text-emerald-500' },
                { text: '年間サブスク不要', color: 'text-indigo-400' },
              ].map((f) => (
                <li key={f.text} className={`flex items-center gap-2.5 text-[13px] ${f.text === '年間サブスク不要' ? 'text-indigo-600 font-semibold' : 'text-slate-700'}`}>
                  <svg className={`w-4 h-4 ${f.color} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f.text}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full block text-center border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer">
              確定申告だけ使う
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[14px] text-slate-500">
            freee スターター（¥11,760/年）・マネーフォワード（¥10,800/年）より <strong className="text-indigo-600">最安水準</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
