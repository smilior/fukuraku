import Link from 'next/link'

export default function FooterSection() {
  return (
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
        <p className="text-[12px]">&copy; 2026 fukuraku. All rights reserved.</p>
      </div>
    </footer>
  )
}
