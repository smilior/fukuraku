import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const features = [
    {
      icon: '📷',
      title: 'レシートを撮るだけ',
      desc: 'スマホでレシートを撮影するだけ。AIが日付・金額・品目を自動で読み取ります。',
    },
    {
      icon: '🤖',
      title: 'AIが経費を自動分類',
      desc: '「これは交通費？通信費？」と迷う必要なし。GPT-4oが最適なカテゴリに自動で振り分けます。',
    },
    {
      icon: '📊',
      title: '20万円ラインを自動監視',
      desc: '副業所得が20万円を超えると確定申告が必要。いつでもリアルタイムで進捗を確認できます。',
    },
  ]

  const steps = [
    { step: '01', title: 'Googleでログイン', desc: '30秒で登録完了。クレジットカード不要。' },
    { step: '02', title: '収入・経費を記録', desc: 'レシートを撮影するか、手入力で記録。どちらでも簡単。' },
    { step: '03', title: 'ダッシュボードで確認', desc: '20万円バーで申告が必要かを一目で確認。' },
  ]

  const plans = [
    {
      name: '無料',
      price: '0',
      unit: '円',
      desc: 'まずは試してみよう',
      features: ['収入・経費の記録（年10件）', '20万円ライン表示', 'ダッシュボード'],
      cta: '無料で始める',
      highlight: false,
    },
    {
      name: 'ベーシック',
      price: '980',
      unit: '円/月',
      desc: '副業をしっかり管理したい方に',
      features: ['収入・経費の記録（年100件）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '20万円ライン表示'],
      cta: '14日間無料で試す',
      highlight: false,
    },
    {
      name: 'プロ',
      price: '1,480',
      unit: '円/月',
      desc: '制限なしで全機能を使いたい方に',
      features: ['収入・経費の記録（無制限）', 'AI-OCRレシート読み取り', 'CSVエクスポート', '確定申告サマリー', '優先サポート'],
      cta: '14日間無料で試す',
      highlight: true,
      badge: 'おすすめ',
    },
    {
      name: 'シーズンパス',
      price: '2,980',
      unit: '円（1〜3月限定）',
      desc: '確定申告シーズンだけ使いたい方に',
      features: ['プロの全機能（3ヶ月間）', '確定申告サポート資料', '優先サポート'],
      cta: '今すぐ購入',
      highlight: false,
      badge: '期間限定',
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
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-green-700">副楽</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">ログイン</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">無料で始める</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-28 px-4 text-center bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 text-green-700 bg-green-100">
              副業サラリーマン専用
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              副業の確定申告、<br />
              <span className="text-green-600">もう悩まない。</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
              レシートを撮るだけでAIが経費を自動分類。<br />
              20万円ラインの監視もおまかせ。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  無料で始める
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  機能を見る
                </Button>
              </a>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              クレジットカード不要 · 30秒で登録完了
            </p>
          </div>
        </section>

        {/* 問題提起 */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
              副業の確定申告、<br className="sm:hidden" />こんな悩みありませんか？
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'レシートが溜まっていくばかりで整理する時間がない',
                '何が経費になるのかよくわからない',
                '副業の所得が20万円を超えたか計算するのが面倒',
                'freeeやマネーフォワードは機能が多すぎて使いこなせない',
                '確定申告の時期になると毎年パニックになる',
                '会社にバレないか不安で、調べるだけで疲れる',
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                  <p className="text-gray-700 text-sm">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 特徴 */}
        <section id="features" className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              副楽なら、レシートを撮るだけ。
            </h2>
            <p className="text-center text-gray-500 mb-10">AIが全部やります。</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {features.map((f) => (
                <Card key={f.title} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="text-4xl mb-2">{f.icon}</div>
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 使い方 */}
        <section className="py-16 px-4 bg-green-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
              3ステップで始められる
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="text-4xl font-bold text-green-200 mb-2">{s.step}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金プラン */}
        <section id="pricing" className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              料金プラン
            </h2>
            <p className="text-center text-gray-500 mb-10">まずは無料から。いつでもアップグレード可能。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.highlight ? 'border-green-500 border-2 shadow-lg' : ''}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      {plan.badge && (
                        <Badge className={plan.highlight ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'}>
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">{plan.desc}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-gray-900">¥{plan.price}</span>
                      <span className="text-xs text-gray-500 ml-1">{plan.unit}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup" className="block mt-4">
                      <Button
                        className="w-full"
                        variant={plan.highlight ? 'default' : 'outline'}
                        size="sm"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
              よくある質問
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="bg-white rounded-lg border border-gray-100 group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-800 text-sm list-none">
                    {faq.q}
                    <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-xs text-gray-400 text-center">
              ※ 本アプリは記録・集計ツールです。税務上の判断については税理士にご相談ください。
            </p>
          </div>
        </section>

        {/* 最終CTA */}
        <section className="py-20 px-4 text-center bg-gradient-to-b from-white to-green-50">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              今年の確定申告、副楽で終わらせよう。
            </h2>
            <p className="text-gray-500 mb-8">無料プランから始められます。クレジットカード不要。</p>
            <Link href="/signup">
              <Button size="lg" className="px-10">
                無料で始める
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-semibold text-green-700">副楽</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600">利用規約</a>
            <a href="#" className="hover:text-gray-600">プライバシーポリシー</a>
            <a href="#" className="hover:text-gray-600">特定商取引法</a>
            <Link href="/login" className="hover:text-gray-600">ログイン</Link>
          </div>
          <span>© 2026 副楽</span>
        </div>
      </footer>
    </div>
  )
}
