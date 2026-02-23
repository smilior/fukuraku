import Link from 'next/link'

export default function CtaSection() {
  return (
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
  )
}
