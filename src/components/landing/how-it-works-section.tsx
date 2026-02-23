export default function HowItWorksSection() {
  const steps = [
    {
      n: '1',
      bg: 'bg-indigo-50',
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
      title: 'CSVで申告完了',
      desc: '年間の収支をCSV出力。国税庁のe-Taxにそのまま転記できます。',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ]

  return (
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
          {steps.map((s) => (
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
  )
}
