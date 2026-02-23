import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="pt-28 pb-16 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f8f7ff 0%, #eef2ff 40%, #f0fdf4 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Text block */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm lp-fade-up lp-fade-up-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse inline-block" />
              副業サラリーマン専用 確定申告アプリ
            </div>

            <h1 className="text-[40px] md:text-[54px] font-extrabold leading-[1.15] tracking-tight mb-5 lp-fade-up lp-fade-up-2">
              副業の確定申告を<br />
              <span className="lp-gradient-text">15分</span>で終わらせよう
            </h1>

            <p className="text-[17px] text-slate-500 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0 lp-fade-up lp-fade-up-3">
              freeeは複雑すぎる。fukurakuは副業の雑所得<em>だけ</em>に特化。<br />
              会計知識ゼロ・3ステップで確定申告が完了します。
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start lp-fade-up lp-fade-up-4">
              <Link
                href="/signup"
                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-[16px] hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-200 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                無料でデモを試す
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#howitworks"
                className="border-2 border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl text-[16px] hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                使い方を見る
              </a>
            </div>

            <p className="text-[12px] text-slate-400 mt-4">クレジットカード不要 · 月5件まで永久無料</p>

            {/* Social proof */}
            <div className="mt-7 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[
                  { initials: 'TK', bg: 'bg-indigo-200', text: 'text-indigo-700' },
                  { initials: 'MS', bg: 'bg-emerald-200', text: 'text-emerald-700' },
                  { initials: 'YA', bg: 'bg-amber-200', text: 'text-amber-700' },
                  { initials: 'KS', bg: 'bg-rose-200', text: 'text-rose-700' },
                ].map((av) => (
                  <div key={av.initials} className={`w-8 h-8 rounded-full ${av.bg} border-2 border-white flex items-center justify-center text-[11px] font-bold ${av.text}`}>
                    {av.initials}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-slate-500">
                <strong className="text-slate-800">200名以上</strong>がベータ版を使用中
              </p>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="flex-shrink-0 lp-float">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400 opacity-20 blur-3xl rounded-full scale-110 pointer-events-none" />
              <div className="relative w-[260px] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl shadow-slate-400/40">
                <div className="bg-slate-800 rounded-[32px] overflow-hidden">
                  <div className="bg-slate-900 h-6 flex items-center justify-center">
                    <div className="w-20 h-4 bg-slate-800 rounded-full" />
                  </div>
                  <div className="bg-slate-50 px-3 py-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <div>
                        <p className="text-[7px] text-slate-400">こんにちは</p>
                        <p className="text-[10px] font-bold text-slate-900">田中 健太 さん</p>
                      </div>
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-600">TK</div>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 shadow-sm border border-red-100 mb-2">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <p className="text-[6px] text-slate-400">副業所得（累計）</p>
                          <p className="text-[16px] font-extrabold text-slate-900">¥156,800</p>
                        </div>
                        <div className="relative bg-red-500 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-full lp-pulse-ring">
                          要申告！
                        </div>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full lp-bar-animate flex items-center justify-end pr-1"
                          style={{ width: '78%', background: 'linear-gradient(to right, #fbbf24, #ef4444)' }}
                        >
                          <span className="text-white text-[5px] font-bold">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-[5px] text-slate-400">¥0</p>
                        <p className="text-[5px] text-red-500 font-semibold">20万円ライン</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-[6px] text-slate-400">副業収入</p>
                        <p className="text-[11px] font-extrabold text-slate-900">¥192,000</p>
                        <p className="text-[5px] text-emerald-600">今月 +¥45K</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <p className="text-[6px] text-slate-400">経費合計</p>
                        <p className="text-[11px] font-extrabold text-slate-900">¥35,200</p>
                        <p className="text-[5px] text-orange-500">今月 −¥8.4K</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="px-2 py-1.5 border-b border-slate-50">
                        <p className="text-[7px] font-bold text-slate-700">最近の取引</p>
                      </div>
                      <div className="px-2 py-1.5 flex items-center gap-1.5 border-b border-slate-50">
                        <div className="w-4 h-4 bg-emerald-50 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[7px] font-semibold text-slate-900">Webライティング</p>
                          <p className="text-[5px] text-slate-400">2月15日</p>
                        </div>
                        <p className="text-[7px] font-bold text-emerald-600">+¥45,000</p>
                      </div>
                      <div className="px-2 py-1.5 flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-orange-50 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[7px] font-semibold text-slate-900">PC周辺機器</p>
                          <p className="text-[5px] text-slate-400">2月18日</p>
                        </div>
                        <p className="text-[7px] font-bold text-orange-500">−¥12,800</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 h-5 flex items-center justify-center">
                    <div className="w-16 h-1 bg-slate-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
