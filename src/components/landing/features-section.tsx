export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-600 text-[13px] font-bold tracking-widest uppercase mb-2">Features</p>
          <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900">副業サラリーマンだけの機能</h2>
          <p className="text-[16px] text-slate-500 mt-2">競合にはない、副業専用の3つの機能</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
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
  )
}
