import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | 副楽',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">{title}</h2>
      <div className="text-sm text-slate-700 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">利用規約</h1>
      <p className="text-sm text-slate-500 mb-8">最終更新日：2026年2月23日</p>

      <p className="text-sm text-slate-700 leading-relaxed mb-8">
        本利用規約（以下「本規約」）は、smilior（以下「当方」）が提供する副楽（以下「本サービス」）の
        利用条件を定めるものです。利用者は、本サービスを利用することで本規約に同意したものとみなします。
      </p>

      <Section title="第1条（適用・定義）">
        <p>本規約は、本サービスに関する当方と利用者との間のすべての関係に適用されます。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>「利用者」：本サービスに登録したすべての個人</li>
          <li>「コンテンツ」：利用者が本サービスに登録・入力したデータ一切</li>
          <li>「有料プラン」：ベーシックプラン・プロプラン・シーズンパスの総称</li>
        </ul>
      </Section>

      <Section title="第2条（登録・アカウント）">
        <p>利用者は、以下の条件を満たす場合に本サービスを利用できます。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>日本国内に居住する個人であること</li>
          <li>本規約およびプライバシーポリシーに同意すること</li>
          <li>正確な情報でアカウントを登録すること</li>
          <li>1人につき1アカウントのみ作成できます</li>
        </ul>
        <p className="mt-2">
          未成年者が本サービスを利用する場合は、法定代理人の同意が必要です。
        </p>
      </Section>

      <Section title="第3条（料金・決済）">
        <p>本サービスの料金プランは以下のとおりです（すべて税込）。</p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">プラン</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">価格</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">主な内容</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 font-medium">無料プラン</td>
                <td className="px-3 py-2">無料</td>
                <td className="px-3 py-2">仕訳10件/年</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">ベーシック</td>
                <td className="px-3 py-2">¥980/月</td>
                <td className="px-3 py-2">仕訳100件/年・AI-OCR・CSV出力</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">プロ</td>
                <td className="px-3 py-2">¥1,480/月</td>
                <td className="px-3 py-2">仕訳無制限・全機能</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium">シーズンパス</td>
                <td className="px-3 py-2">¥2,980（買切）</td>
                <td className="px-3 py-2">1〜3月限定・全機能</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          有料プランの決済はStripe, Inc.が提供する決済システムを通じて行われます。
          月額プランは毎月同日に自動更新されます。シーズンパスは期間限定（1月〜3月）の買切型です。
          なお、デジタルSaaSの性質上、原則として返金はお受けできません。
          サービス障害・不具合に伴う返金については個別にご対応いたします。
        </p>
      </Section>

      <Section title="第4条（禁止事項）">
        <p>利用者は以下の行為を行ってはなりません。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>法令または本規約に違反する行為</li>
          <li>当方または第三者の知的財産権・プライバシーを侵害する行為</li>
          <li>本サービスを不正な方法で利用する行為（不正アクセス・リバースエンジニアリング等）</li>
          <li>複数アカウントの作成・共有</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>反社会的勢力との関係に基づく利用</li>
          <li>その他当方が不適切と判断する行為</li>
        </ul>
        <p className="mt-2">
          禁止行為が確認された場合、当方は予告なくアカウントを停止・削除できるものとします。
        </p>
      </Section>

      <Section title="第5条（知的財産権）">
        <p>
          本サービスに関する著作権・商標権・その他知的財産権はすべて当方に帰属します。
          利用者が入力したコンテンツの著作権は利用者に帰属します。ただし、利用者は当方に対し、
          サービス改善目的での利用（匿名化・統計処理した形）を許諾するものとします。
        </p>
      </Section>

      <Section title="第6条（免責事項）">
        <p>
          当方は、本サービスが確定申告の完全な正確性を保証するものではありません。
          本サービスの利用結果については、最終的に利用者自身の責任においてご確認ください。
          税務上の判断については、税理士等の専門家にご相談ください。
        </p>
        <p>
          当方は、以下の場合に生じた損害について責任を負いません。
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>天災・通信障害等の不可抗力によるサービス停止</li>
          <li>利用者の操作ミスや不正利用</li>
          <li>第三者によるサービスへの不正アクセス</li>
          <li>外部サービス（Supabase・Stripe・OpenAI等）の障害</li>
        </ul>
        <p className="mt-2">
          当方の故意または重過失に起因する場合を除き、当方の賠償責任は利用者が直近1ヶ月に
          支払った利用料金を上限とします。
        </p>
      </Section>

      <Section title="第7条（個人情報）">
        <p>
          当方は、利用者の個人情報を別途定める
          <a href="/privacy" className="text-indigo-600 hover:underline mx-1">プライバシーポリシー</a>
          に従って適切に取り扱います。
        </p>
      </Section>

      <Section title="第8条（サービスの変更・停止）">
        <p>
          当方は、利用者への事前通知をもって、本サービスの内容を変更または停止することができます。
          サービス終了の場合は、30日前までにメールまたは本サービス上でお知らせします。
          サービス停止時は、未利用期間分の料金を日割りで返金します。
        </p>
      </Section>

      <Section title="第9条（解約）">
        <p>
          利用者はいつでも設定画面からサービスを解約できます。
          解約後も当該課金期間の終了日まで本サービスを利用できます。
          解約後も最大30日間はアカウントデータを保持しますが、その後は削除されます。
        </p>
      </Section>

      <Section title="第10条（準拠法・管轄裁判所）">
        <p>
          本規約の解釈・適用は日本法に準拠します。
          本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </Section>
    </>
  )
}
