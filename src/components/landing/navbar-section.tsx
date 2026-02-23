import Link from 'next/link'

export default function NavbarSection() {
  return (
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
  )
}
