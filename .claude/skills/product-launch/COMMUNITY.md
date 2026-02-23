# コミュニティ告知テンプレート

## 告知対象のコミュニティリスト

**Discord/Slackコミュニティ：**

| コミュニティ名 | プラットフォーム | メンバー規模 | 特徴 |
|--------------|---------------|------------|------|
| 副業コミュニティ系 | Discord | 数百〜数千人 | 副業全般の情報交換 |
| 個人開発者コミュニティ | Discord/Slack | 数百人 | 個人開発の情報共有 |
| Indie Hackers Japan | Discord | 数百人 | 日本のインディーハッカー |
| Next.js Japan | Discord | 数百人 | Next.js開発者 |
| Supabase Japan | Discord | 数百人 | Supabase ユーザー |
| 確定申告関連 | 各種 | 変動 | 確定申告シーズンに活発 |

**SNSコミュニティ：**
- X（Twitter）の #副業 #個人開発 #確定申告 ハッシュタグ
- Reddit の r/japan, r/japanlife（英語圏の在日外国人向け）
- note の副業カテゴリ

---

## 告知文のテンプレート（スパムにならない書き方）

**ルール：**
- 自己紹介 + 経緯 + プロダクト紹介の順で書く
- 売り込み感を出さない（あくまで「共有」のスタンス）
- コミュニティへの貢献（質問回答、情報共有）を先に行ってから告知
- 告知は1回のみ（繰り返し投稿しない）

**テンプレートA（個人開発者コミュニティ向け）：**
```
こんにちは、[名前]です。

副業の確定申告が面倒すぎて、3ヶ月かけて
自分でアプリを作りました。

副楽
https://fukuraku.app（仮）

レシートを撮るだけでAIが経費を自動分類する、
副業サラリーマン向けの確定申告アプリです。

技術スタック：
- Next.js 15 (App Router)
- Supabase
- Vercel AI SDK + OpenAI
- Stripe
- Vercel

月額コスト約$51で運用しています。

フリープラン（無料）があるので、
副業されてる方はぜひ試してみてください。

フィードバックもお待ちしています！
```

**テンプレートB（副業コミュニティ向け）：**
```
副業の確定申告、皆さんどうしてますか？

自分は去年30時間かかって、あまりに面倒だったので
アプリを自作しました。

レシートを撮影するだけで
AIが経費を自動分類してくれます。
20万円ラインの自動監視もできます。

無料で使えるので、
よかったら試してみてください。

副楽：https://fukuraku.app（仮）

使ってみた感想も聞かせてもらえると嬉しいです。
```

**テンプレートC（技術コミュニティ向け）：**
```
Next.js + Supabase + AI SDK で
副業確定申告アプリを個人開発しました。

OpenAI Vision APIでレシートのOCRを行い、
structuredOutput で経費データをJSON形式で取得しています。
読取精度は94%です。

技術的な詳細はZennに書きました：
[Zenn記事URL]

アプリはこちら：
https://fukuraku.app（仮）

技術的なフィードバックも歓迎です。
```

---

## Reddit への投稿

**対象サブレディット：**
- r/japanlife（在日外国人向け、英語）
- r/japanfinance（日本の金融・税金、英語）
- r/SideProject（個人開発プロジェクト、英語）
- r/indiehackers（インディーハッカー、英語）

**Reddit投稿テンプレート（英語）：**
```
Title: I built an AI-powered tax filing app for side-job
       workers in Japan

Body:
Hey everyone,

I'm a software developer in Japan who has been doing
side work for the past few years. Filing taxes was always
a huge pain - last year it took me over 30 hours.

So I built Fukuraku, an app that:
- Uses AI to read receipts and categorize expenses
- Monitors the 200,000 yen income threshold (above which
  tax filing is required for side income in Japan)
- Generates expense reports for tax filing

Tech stack: Next.js, Supabase, OpenAI Vision API, Stripe

Free plan available.

Would love to get feedback from anyone who does
side work in Japan!

[URL]
```

---

## 告知後のフォロー

- [ ] コメント・質問には必ず返信する
- [ ] ネガティブなフィードバックにも丁寧に対応
- [ ] 有益なフィードバックは開発に反映し、報告する
- [ ] 告知が好意的に受け入れられたコミュニティとの関係を維持
