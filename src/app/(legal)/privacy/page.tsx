import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | fukuraku',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">{title}</h2>
      <div className="text-sm text-slate-700 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-slate-500 mb-8">最終更新日：2026年2月23日</p>

      <p className="text-sm text-slate-700 leading-relaxed mb-8">
        smilior（以下「当方」）は、副楽（以下「本サービス」）における利用者の個人情報の取扱いについて、
        個人情報の保護に関する法律（個人情報保護法）に基づき、以下のとおりプライバシーポリシーを定めます。
      </p>

      <Section title="第1条 収集する個人情報">
        <p>当方は、本サービスの提供にあたり、以下の個人情報を収集することがあります。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>氏名・メールアドレス（アカウント登録時）</li>
          <li>レシート・領収書の画像データ（AI-OCR機能利用時）</li>
          <li>収入・支出・仕訳データ（確定申告関連情報）</li>
          <li>サービス利用履歴・ログデータ</li>
          <li>決済に関する情報（カード番号は当方のサーバーへは送信されません）</li>
        </ul>
      </Section>

      <Section title="第2条 利用目的">
        <p>収集した個人情報は、以下の目的に限り利用します。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>本サービスの提供・運営</li>
          <li>会員認証・アカウント管理</li>
          <li>AI-OCRによるレシート解析</li>
          <li>確定申告書類の作成支援</li>
          <li>利用料金の請求・決済処理</li>
          <li>サービス改善・新機能開発</li>
          <li>重要なお知らせ・サポート対応</li>
        </ul>
      </Section>

      <Section title="第3条 第三者提供">
        <p>当方は、以下の場合を除き、個人情報を第三者に提供しません。</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>利用者の同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>人の生命・身体・財産の保護に必要な場合</li>
        </ul>
        <p className="mt-4">本サービスでは、以下の委託先に対して業務の一部を委託しており、必要な範囲で個人情報を提供します。</p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">委託先</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">目的</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-700">取扱いデータ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2">Supabase Inc.</td>
                <td className="px-3 py-2">データベース・認証基盤</td>
                <td className="px-3 py-2">アカウント情報・仕訳データ</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Stripe, Inc.</td>
                <td className="px-3 py-2">決済処理</td>
                <td className="px-3 py-2">メールアドレス・決済情報</td>
              </tr>
              <tr>
                <td className="px-3 py-2">OpenAI, LLC</td>
                <td className="px-3 py-2">AI-OCR（レシート解析）</td>
                <td className="px-3 py-2">レシート画像データ</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Vercel Inc.</td>
                <td className="px-3 py-2">アプリケーションホスティング</td>
                <td className="px-3 py-2">アクセスログ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="第4条 外国への個人情報の提供">
        <p>
          第3条の委託先（Supabase、Stripe、OpenAI、Vercel）はいずれも米国に拠点を置く事業者であり、
          個人情報保護法第24条に基づき、米国のサーバーで個人情報が処理されます。
          各社は適切なセキュリティ基準（SOC 2等）に準拠しています。
        </p>
      </Section>

      <Section title="第5条 Cookieの使用">
        <p>
          本サービスでは、ログイン状態の維持・サービス改善のためにCookieおよびローカルストレージを使用します。
          ブラウザの設定からCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
        </p>
      </Section>

      <Section title="第6条 安全管理措置">
        <p>
          当方は、個人情報の漏洩・滅失・毀損の防止のため、以下の安全管理措置を講じます。
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>通信の暗号化（HTTPS/TLS）</li>
          <li>行レベルセキュリティ（RLS）によるデータアクセス制御</li>
          <li>パスワードなし認証（OAuth 2.0）の採用</li>
          <li>決済情報のStripeへの完全委託（当方サーバーへの保存なし）</li>
        </ul>
      </Section>

      <Section title="第7条 開示・訂正・削除の請求">
        <p>
          利用者は、当方が保有する自己の個人情報について、開示・訂正・削除・利用停止を請求できます。
          下記お問い合わせ先までメールにてご連絡ください。本人確認の上、合理的な期間内に対応いたします。
          なお、アカウントの削除はアプリ設定画面からご自身で行うことも可能です。
        </p>
      </Section>

      <Section title="第8条 プライバシーポリシーの変更">
        <p>
          当方は、法令の改正やサービスの変更に伴い、本ポリシーを変更することがあります。
          重要な変更がある場合は、本サービス上でお知らせします。
          変更後も本サービスを継続してご利用いただいた場合、変更後のポリシーに同意したものとみなします。
        </p>
      </Section>

      <Section title="第9条 お問い合わせ">
        <p>個人情報の取扱いに関するお問い合わせは、以下の窓口までご連絡ください。</p>
        <div className="mt-2 p-3 bg-slate-50 rounded-lg">
          <p>販売事業者：smilior</p>
          <p>メール：<a href="mailto:fukuraku@smilior.com" className="text-indigo-600 hover:underline">fukuraku@smilior.com</a></p>
        </div>
      </Section>
    </>
  )
}
