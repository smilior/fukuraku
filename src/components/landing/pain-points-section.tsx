export default function PainPointsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-[28px] md:text-[36px] font-extrabold text-slate-900 mb-3">こんな悩み、ありませんか？</h2>
        <p className="text-[16px] text-slate-500">副業サラリーマンの7割が確定申告に苦手意識を持っています</p>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">freeeが複雑すぎる</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">「勘定科目」「借方・貸方」…副業には関係ない機能だらけで挫折した</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">20万円を超えたか不明</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">いくら稼いだか把握できておらず、確定申告が必要かどうかわからない</p>
        </div>
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
  )
}
