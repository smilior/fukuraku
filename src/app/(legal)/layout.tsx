import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">fukuraku</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">fukuraku</span>
          </div>
          <div className="flex items-center gap-5 text-[13px]">
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
