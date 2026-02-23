# shadcn/ui LPコンポーネント実装コード

## Heroセクションのコンポーネント構成

```typescript
// app/(marketing)/page.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            ベータ版公開中
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            レシートを撮るだけ。
            <br />
            <span className="text-primary">
              確定申告の準備が終わる。
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            副業サラリーマン専用のAI確定申告アプリ。
            レシートを撮るだけでAIが経費を自動分類し、
            20万円ラインを自動で監視します。
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <a href="/auth/signup">無料で始める</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">機能を見る</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            クレジットカード不要 / 30秒で登録完了
          </p>
        </div>
      </section>

      {/* 以下、他のセクションが続く */}
    </main>
  );
}
```

---

## 料金テーブルコンポーネント

```typescript
// components/pricing-table.tsx

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "フリー",
    price: "0",
    description: "まずは試してみよう",
    features: [
      "レシート登録 月5枚",
      "AI経費自動分類",
      "基本ダッシュボード",
      "20万円ライン表示",
    ],
    cta: "無料で始める",
    popular: false,
  },
  {
    name: "プロ",
    price: "980",
    description: "副業サラリーマンの定番",
    features: [
      "レシート登録 無制限",
      "AI経費自動分類",
      "高度なダッシュボード",
      "20万円ライン自動監視",
      "アラート通知",
      "CSVエクスポート",
      "メールサポート",
    ],
    cta: "プロプランで始める",
    popular: true,
  },
  {
    name: "シーズンパス",
    price: "2,980",
    period: "/ 3ヶ月",
    description: "確定申告シーズンだけ使いたい人に",
    features: [
      "プロプランの全機能",
      "1月〜3月の3ヶ月間",
      "自動更新なし",
    ],
    cta: "シーズンパスを購入",
    popular: false,
  },
];

export function PricingTable() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            シンプルな料金プラン
          </h2>
          <p className="mt-4 text-muted-foreground">
            フリープランはずっと無料。
            必要に応じてアップグレード。
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? "border-primary shadow-lg"
                  : ""
              }
            >
              <CardHeader>
                {plan.popular && (
                  <Badge className="mb-2 w-fit">
                    おすすめ
                  </Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    円{plan.period || "/月"}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={
                    plan.popular ? "default" : "outline"
                  }
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## FAQアコーディオンコンポーネント

```typescript
// components/faq-section.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "本当に無料で使えますか？",
    answer:
      "はい。フリープランは無料で、月5枚までのレシート登録と基本的な経費管理機能をご利用いただけます。クレジットカードの登録は不要です。",
  },
  {
    question: "税理士の代わりになりますか？",
    answer:
      "いいえ。副楽は経費の記録・管理を効率化するツールです。個別の税務相談は税理士にご依頼ください。AIの分析結果は参考情報としてご活用ください。",
  },
  {
    question: "レシートの画像データは安全ですか？",
    answer:
      "はい。全データはTLS 1.3で暗号化して送信し、Supabaseの東京リージョンに保存されます。ユーザーごとにデータは厳密に分離されています。",
  },
  {
    question: "解約は簡単にできますか？",
    answer:
      "はい。設定画面から「プランを解約する」ボタンでいつでも解約できます。解約後も現在の課金期間の終了日まで利用可能です。",
  },
  {
    question: "他の確定申告ソフトとの違いは？",
    answer:
      "freeeやマネーフォワードは本格的な会計ソフトですが、副楽は「副業サラリーマン」に特化しています。必要な機能だけをシンプルに提供し、料金も月額980円と手頃です。",
  },
  {
    question: "会社に副業がバレませんか？",
    answer:
      "副楽の利用自体が会社にバレることはありません。確定申告時に住民税を「自分で納付」にすることで副業がバレるリスクを軽減できます。",
  },
  {
    question: "データのエクスポートはできますか？",
    answer:
      "はい。経費データをCSV形式でエクスポートできます。他の会計ソフトへの移行にも対応しています。",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            よくある質問
          </h2>
          <p className="mt-4 text-muted-foreground">
            副楽についてのご質問にお答えします。
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
              >
                <AccordionTrigger>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
```

---

## 問題提起セクション

```typescript
// components/problem-section.tsx

import {
  Clock,
  FileQuestion,
  Calculator,
  AlertTriangle,
} from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "時間がない",
    description:
      "レシートの整理、Excelへの入力、経費の分類...確定申告の準備に30時間以上かけていませんか？",
  },
  {
    icon: FileQuestion,
    title: "何が経費かわからない",
    description:
      "「これは経費にできる？」「按分ってどうやる？」毎回Googleで検索していませんか？",
  },
  {
    icon: Calculator,
    title: "20万円ラインの計算が面倒",
    description:
      "副業の所得が20万円を超えたかどうか、正確に計算できていますか？",
  },
  {
    icon: AlertTriangle,
    title: "会計ソフトが難しすぎる",
    description:
      "freeeやマネーフォワードを開いたものの、機能が多すぎて挫折していませんか？",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            副業の確定申告、
            <br className="sm:hidden" />
            こんなことで悩んでいませんか？
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <problem.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">
                {problem.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## ステップセクション

```typescript
// components/steps-section.tsx

const steps = [
  {
    number: "1",
    title: "レシートを撮る",
    description:
      "スマートフォンでレシートを撮影するだけ。まとめて撮っても1枚ずつ撮ってもOK。",
  },
  {
    number: "2",
    title: "AIが自動分類",
    description:
      "AIが日付、金額、品目を読み取り、経費カテゴリに自動分類します。あなたは確認するだけ。",
  },
  {
    number: "3",
    title: "結果を確認",
    description:
      "ダッシュボードで所得と経費の状況を確認。確定申告が必要かどうか、ひと目でわかります。",
  },
];

export function StepsSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            3ステップで確定申告の準備完了
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```
