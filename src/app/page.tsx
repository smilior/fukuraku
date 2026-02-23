import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const pains = [
    { icon: '😰', text: 'レシートが溜まっていくばかりで整理する時間がない' },
    { icon: '🤔', text: '何が経費になるのかよくわからない' },
    { icon: '📝', text: '副業の所得が20万円を超えたか計算するのが面倒' },
    { icon: '😵', text: 'freeeやマネーフォワードは機能が多すぎて使いこなせない' },
    { icon: '😱', text: '確定申告の時期になると毎年パニックになる' },
    { icon: '😟', text: '会社にバレないか不安で、調べるだけで疲れる' },
  ]

  const painBorders = [
    'border-l-red-400',
    'border-l-orange-400',
    'border-l-amber-400',
    'border-l-violet-400',
    'border-l-pink-400',
    'border-l-rose-400',
  ]

  const features = [
    {
      icon: '📷',
      title: 'レシートを撮るだけ',
      desc: 'スマホでレシートを撮影するだけ。AIが日付・金額・品目を自動で読み取ります。',
      gradient: 'from-violet-500 to-purple-600',
      ring: 'from-violet-300 to-purple-300',
    },
    {
      icon: '🤖',
      title: 'AIが経費を自動分類',
      desc: '「これは交通費？通信費？」と迷う必要なし。GPT-4oが最適なカテゴリに自動で振り分けます。',
      gradient: 'from-sky-500 to-blue-600',
      ring: 'from-sky-300 to-blue-300',
    },
    {
      icon: '📊',
      title: '20万円ラインを自動監視',
      desc: '副業所得が20万円を超えると確定申告が必要。いつでもリアルタイムで進捗を確認できます。',
      gradient: 'from-emerald-500 to-green-600',
      ring: 'from-emerald-300 to-green-300',
    },
  ]

  const steps = [
    { num: '01', title: 'Googleでログイン', desc: '30秒で登録完了。クレジットカード不要。' },
    { num: '02', title: '収入・経費を記録', desc: 'レシートを撮影するか、手入力で記録。どちらでも簡単。' },
    { num: '03', title: 'ダッシュボードで確認', desc: '20万円バーで申告が必要かを一目で確認。' },
  ]

  const plans = [
    {
      name: '無料',
      price: '0',
      unit: '円',
      period: '',
      desc: 'まずは試してみよう',
      features: ['収入・経費の記録（年10件）', '20万円ライン表示', 'ダッシュボード'],
      cta: '無料で始める',
      dark: false,
      badge: null as string | null,
    },
    {
      name: 'ベーシック',
      price: '980',
      unit: '円',
      period: '/月',
      desc: '副業をしっかり管理したい方に',
      features: ['収入・経費の記録（年100件）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '20万円ライン表示'],
      cta: '14日間無料で試す',
      dark: false,
      badge: null as string | null,
    },
    {
      name: 'プロ',
      price: '1,480',
      unit: '円',
      period: '/月',
      desc: '制限なしで全機能を使いたい方に',
      features: ['収入・経費の記録（無制限）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '確定申告サマリー', '優先サポート'],
      cta: '14日間無料で試す',
      dark: true,
      badge: 'おすすめ' as string | null,
    },
    {
      name: 'シーズンパス',
      price: '2,980',
      unit: '円',
      period: '（1〜3月限定）',
      desc: '確定申告シーズンだけ使いたい方に',
      features: ['プロの全機能（3ヶ月間）', '確定申告サポート資料', '優先サポート'],
      cta: '今すぐ購入',
      dark: false,
      badge: '期間限定' as string | null,
    },
  ]

  const faqs = [
    {
      q: '副業の確定申告が必要な条件を教えてください。',
      a: '給与所得者で副業の所得（収入−経費）が年間20万円を超えた場合、確定申告が必要です。副楽の20万円バーでいつでも状況を確認できます。なお、税務上の判断は税理士にご確認ください。',
    },
    {
      q: '会社にバレる心配はありますか？',
      a: '副楽は確定申告の準備ツールです。住民税の申告方法（普通徴収を選択）など確定申告時の対応については、税理士や市区町村にご相談ください。',
    },
    {
      q: 'freeeやマネーフォワードとの違いは何ですか？',
      a: '副楽は「副業サラリーマン」に特化したシンプルな設計です。青色申告や複式簿記には対応せず、「20万円を超えたか確認する」「経費をざっくり記録する」という副業特有のニーズに絞っています。',
    },
    {
      q: 'AIのレシート読み取り精度はどのくらいですか？',
      a: 'GPT-4o Visionを使用しており、鮮明な写真であれば高精度で読み取りが可能です。読み取り結果は必ずご自身で確認・修正をお願いします。',
    },
    {
      q: 'いつでも解約できますか？',
      a: 'はい、いつでもマイページからワンクリックで解約できます。解約後も無料プランでデータを閲覧できます。',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-white tracking-wide">
            副<span className="text-violet-400">楽</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                ログイン
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white font-semibold shadow-lg shadow-green-600/30">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 py-24 md:py-36 px-4 text-center">
          {/* Decorative blurred circles */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
          <div className="absolute top-16 left-8 w-[180px] h-[180px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute bottom-16 right-16 w-[100px] h-[100px] rounded-full border border-white/5 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
              副業サラリーマン専用 確定申告アプリ
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
              副業の確定申告、<br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
                もう悩まない。
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
              レシートを撮るだけでAIが経費を自動分類。<br />
              20万円ラインの監視もおまかせ。
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto px-10 h-12 bg-white text-slate-900 hover:bg-white/90 font-bold text-base shadow-xl">
                  無料で始める →
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 h-12 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 font-medium text-base"
                >
                  機能を見る
                </Button>
              </a>
            </div>

            <p className="mt-4 text-sm text-white/30">
              クレジットカード不要 · 30秒で登録完了
            </p>

            {/* Stats strip */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { val: '無料', label: 'プランあり' },
                { val: '30秒', label: '登録完了' },
                { val: 'GPT-4o', label: 'AI搭載' },
              ].map((stat, i) => (
                <div key={stat.val} className={`text-center py-4 ${i === 1 ? 'border-x border-white/10' : ''}`}>
                  <div className="text-2xl font-bold text-white">{stat.val}</div>
                  <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 問題提起 */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                こんな悩みありませんか？
              </h2>
              <p className="mt-3 text-slate-500 text-lg">
                副業を持つサラリーマンの多くが直面する問題です
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pains.map((pain, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border-l-4 ${painBorders[i]} hover:shadow-md transition-shadow`}
                >
                  <span className="text-2xl flex-shrink-0">{pain.icon}</span>
                  <p className="text-slate-700 text-sm leading-relaxed self-center">{pain.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 特徴 */}
        <section id="features" className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                副楽なら、レシートを撮るだけ。
              </h2>
              <p className="text-slate-500 text-lg">AIが全部やります。</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`group rounded-2xl p-px bg-gradient-to-br ${f.ring} hover:${f.ring.replace('300', '400')} transition-all duration-300 shadow-md hover:shadow-xl`}
                >
                  <div className="rounded-2xl bg-white p-7 h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 使い方 */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                3ステップで始められる
              </h2>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10">
              {/* Connector line (desktop) */}
              <div className="hidden sm:block absolute top-8 left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-px bg-gradient-to-r from-violet-200 via-sky-300 to-violet-200" />
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xl font-black flex items-center justify-center shadow-lg shadow-violet-500/30 mb-5 relative z-10 bg-white">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金プラン */}
        <section id="pricing" className="py-20 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">料金プラン</h2>
              <p className="text-slate-500 text-lg">まずは無料から。いつでもアップグレード可能。</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                    plan.dark
                      ? 'bg-gradient-to-br from-slate-900 to-violet-900 text-white shadow-2xl shadow-violet-900/40 scale-105 ring-1 ring-violet-500/30'
                      : 'bg-white shadow-sm hover:shadow-md border border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-bold text-base ${plan.dark ? 'text-white' : 'text-slate-800'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${plan.dark ? 'text-white/60' : 'text-slate-400'}`}>
                        {plan.desc}
                      </p>
                    </div>
                    {plan.badge && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          plan.dark
                            ? 'bg-violet-400/30 text-violet-200'
                            : 'bg-orange-100 text-orange-600'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <span className={`text-3xl font-black ${plan.dark ? 'text-white' : 'text-slate-900'}`}>
                      ¥{plan.price}
                    </span>
                    <span className={`text-xs ml-1 ${plan.dark ? 'text-white/50' : 'text-slate-400'}`}>
                      {plan.unit}{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-start gap-2 text-sm ${plan.dark ? 'text-white/80' : 'text-slate-600'}`}
                      >
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.dark ? 'text-violet-300' : 'text-green-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link href="/signup">
                    <Button
                      className={`w-full font-semibold ${
                        plan.dark
                          ? 'bg-white text-slate-900 hover:bg-white/90 shadow-lg'
                          : ''
                      }`}
                      variant={plan.dark ? 'default' : 'outline'}
                      size="sm"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
              よくある質問
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-violet-200 transition-colors"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-slate-800 text-sm list-none">
                    {faq.q}
                    <span className="ml-4 flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 group-open:bg-violet-100 flex items-center justify-center text-slate-500 group-open:text-violet-600 transition-all text-xs group-open:rotate-180 duration-200">
                      ▾
                    </span>
                  </summary>
                  <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-xs text-slate-400 text-center">
              ※ 本アプリは記録・集計ツールです。税務上の判断については税理士にご相談ください。
            </p>
          </div>
        </section>

        {/* 最終CTA */}
        <section className="relative overflow-hidden py-24 px-4 text-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              今年の確定申告、<br />
              <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
                副楽で終わらせよう。
              </span>
            </h2>
            <p className="text-white/50 mb-10 text-lg">無料プランから始められます。クレジットカード不要。</p>
            <Link href="/signup">
              <Button size="lg" className="px-12 h-12 bg-white text-slate-900 hover:bg-white/90 font-bold text-base shadow-xl">
                無料で始める →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-slate-950 border-t border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span className="font-black text-white">
            副<span className="text-violet-400">楽</span>
          </span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/70 transition-colors">利用規約</a>
            <a href="#" className="hover:text-white/70 transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-white/70 transition-colors">特定商取引法</a>
            <Link href="/login" className="hover:text-white/70 transition-colors">ログイン</Link>
          </div>
          <span>© 2026 副楽</span>
        </div>
      </footer>
    </div>
  )
}
