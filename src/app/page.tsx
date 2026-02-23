import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="bg-white text-slate-900">

      {/* ══ NAVBAR (floating glassmorphism) ══ */}
      <nav className="fixed top-4 left-4 right-4 z-50 lp-glass border border-white/80 rounded-2xl shadow-lg shadow-slate-200/60 max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-300/50">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
            </svg>
          </div>
          <span className="font-extrabold text-[18px] text-slate-900 tracking-tight">fukuraku</span>
        </Link>
        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-[14px] text-slate-600 font-medium hover:text-indigo-600 transition-colors">機能</a>
          <a href="#howitworks" className="text-[14px] text-slate-600 font-medium hover:text-indigo-600 transition-colors">使い方</a>
          <a href="#pricing" className="text-[14px] text-slate-600 font-medium hover:text-indigo-600 transition-colors">料金</a>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/login" className="hidden md:block text-[13px] text-slate-600 font-semibold hover:text-indigo-600 transition-colors cursor-pointer">
            ログイン
          </Link>
          <Link href="/signup" className="bg-indigo-600 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 cursor-pointer">
            無料で始める
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
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

            {/* ── Phone Mockup ── */}
            <div className="flex-shrink-0 lp-float">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-indigo-400 opacity-20 blur-3xl rounded-full scale-110 pointer-events-none" />
                {/* Phone frame */}
                <div className="relative w-[260px] bg-slate-900 rounded-[40px] p-2.5 shadow-2xl shadow-slate-400/40">
                  <div className="bg-slate-800 rounded-[32px] overflow-hidden">
                    {/* Notch */}
                    <div className="bg-slate-900 h-6 flex items-center justify-center">
                      <div className="w-20 h-4 bg-slate-800 rounded-full" />
                    </div>
                    {/* Screen */}
                    <div className="bg-slate-50 px-3 py-3">
                      {/* Mini header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div>
                          <p className="text-[7px] text-slate-400">こんにちは</p>
                          <p className="text-[10px] font-bold text-slate-900">田中 健太 さん</p>
                        </div>
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-600">TK</div>
                      </div>

                      {/* 20万円 Card */}
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

                      {/* Summary cards */}
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

                      {/* Mini transactions */}
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
                    {/* Home indicator */}
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

      {/* ══ PAIN POINTS ══ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900 mb-3">こんな悩み、ありませんか？</h2>
          <p className="text-[16px] text-slate-500">副業サラリーマンの7割が確定申告に苦手意識を持っています</p>
        </div>
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-4">
          {/* Red */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">freeeが複雑すぎる</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">「勘定科目」「借方・貸方」…副業には関係ない機能だらけで挫折した</p>
          </div>
          {/* Amber */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">20万円を超えたか不明</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">いくら稼いだか把握できておらず、確定申告が必要かどうかわからない</p>
          </div>
          {/* Blue */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">会社にバレるのが怖い</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">住民税の納付方法を間違えると、副業が会社に知られてしまうリスクがある</p>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section
        id="howitworks"
        className="py-16 px-4"
        style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #f8f7ff 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 text-[13px] font-bold tracking-widest uppercase mb-2">How It Works</p>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900">たった3ステップで完了</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: '1',
                bg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                title: 'レシートを撮影',
                desc: '撮るだけでAIが金額・店名・日付を自動入力。手打ち不要。',
                icon: (
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                n: '2',
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                title: '20万円バーを確認',
                desc: 'リアルタイムで所得を計算。20万円に近づくと自動でアラート。',
                icon: (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                n: '3',
                bg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                title: 'CSVで申告完了',
                desc: '年間の収支をCSV出力。国税庁のe-Taxにそのまま転記できます。',
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-6 shadow-sm text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-[13px] shadow-lg shadow-indigo-300">
                  {s.n}
                </div>
                <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2`}>
                  {s.icon}
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 text-[13px] font-bold tracking-widest uppercase mb-2">Features</p>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900">副業サラリーマンだけの機能</h2>
            <p className="text-[16px] text-slate-500 mt-2">競合にはない、副業専用の3つの機能</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-default">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="inline-block bg-red-50 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">独自機能</div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">20万円超えアラート</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">副業所得がリアルタイムで計算され、15万円で黄色・20万円で赤のアラートが表示されます。確定申告の必要性を見逃しません。</p>
            </div>
            {/* Feature 2 */}
            <div className="group border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-default">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="inline-block bg-violet-50 text-violet-600 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">AI搭載</div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">レシートAI自動仕訳</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">GPT-4o Visionがレシートを読み取り、金額・店名・カテゴリを自動入力。1枚あたり約0.2円、手打ちの手間がゼロになります。</p>
            </div>
            {/* Feature 3 */}
            <div className="group border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-default">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="inline-block bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">安心</div>
              <h3 className="text-[17px] font-bold text-slate-900 mb-2">会社バレ防止ガイド</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">住民税を「普通徴収」に切り替えるための手順を丁寧にガイド。副業が会社に知られるリスクを最小化します。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
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

      {/* ══ FINAL CTA ══ */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[32px] md:text-[42px] font-extrabold text-white mb-4 leading-tight">
            確定申告の悩みを<br />今すぐ解決しよう
          </h2>
          <p className="text-[16px] text-indigo-200 mb-8">クレジットカード不要 · 月5件まで永久無料 · 15分で始められます</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-extrabold text-[17px] px-10 py-4 rounded-2xl hover:bg-indigo-50 transition-colors shadow-xl cursor-pointer"
          >
            デモアプリを試す（無料）
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="text-white font-bold">fukuraku</span>
          </div>
          <div className="flex items-center gap-6 text-[13px]">
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            <Link href="/terms" className="hover:text-white transition-colors">利用規約</Link>
            <Link href="/legal" className="hover:text-white transition-colors">特定商取引法</Link>
            <a href="mailto:fukuraku@smilior.com" className="hover:text-white transition-colors">お問い合わせ</a>
          </div>
          <p className="text-[12px]">© 2026 fukuraku. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
