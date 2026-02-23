import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表示 | fukuraku',
}

export default function LegalNoticePage() {
  const rows = [
    { label: '販売事業者', value: 'smilior' },
    { label: '所在地', value: 'ご請求いただければ遅滞なく開示いたします' },
    { label: '電話番号', value: 'ご請求いただければ遅滞なく開示いたします' },
    { label: 'メールアドレス', value: 'fukuraku@smilior.com', isEmail: true },
    {
      label: '販売価格',
      value: '無料プラン：無料 / ベーシックプラン：¥980/月（税込）/ プロプラン：¥1,480/月（税込）/ シーズンパス：¥2,980（税込・買切）',
    },
    { label: '支払方法', value: 'クレジットカード（Visa / Mastercard / American Express 等）via Stripe' },
    { label: '支払時期', value: '決済時即時。月額プランは以後毎月同日に自動課金されます' },
    { label: 'サービス提供時期', value: '決済完了後、直ちにご利用いただけます' },
    {
      label: '返品・キャンセルについて',
      value: 'デジタルコンテンツ・SaaSの性質上、原則として返品・返金はお受けできません。ただし、当サービスの不具合・障害に起因する場合は個別にご対応いたします。',
    },
    { label: '解約方法', value: 'アプリ設定画面から随時解約が可能です。解約後も当該課金期間の終了日まではサービスをご利用いただけます。' },
  ]

  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">特定商取引法に基づく表示</h1>
      <p className="text-sm text-slate-500 mb-8">最終更新日：2026年2月23日</p>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ label, value, isEmail }) => (
              <tr key={label} className="flex flex-col sm:table-row">
                <th className="text-left px-4 py-3 font-semibold text-slate-700 bg-slate-50 sm:w-1/3 sm:align-top whitespace-nowrap">
                  {label}
                </th>
                <td className="px-4 py-3 text-slate-700 leading-relaxed">
                  {isEmail ? (
                    <a href={`mailto:${value}`} className="text-indigo-600 hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-6">
        ※ 所在地・電話番号の開示請求は
        <a href="mailto:fukuraku@smilior.com" className="text-indigo-600 hover:underline mx-1">fukuraku@smilior.com</a>
        までメールにてお申し付けください。遅滞なく開示いたします。
      </p>
    </>
  )
}
