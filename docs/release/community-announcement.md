# コミュニティ告知文テンプレート

## 告知ルール

- 自己紹介 + 経緯 + プロダクト紹介の順で書く
- 売り込み感を出さない（「共有」のスタンス）
- コミュニティへの貢献を先に行ってから告知する
- **告知は1回のみ**（繰り返し投稿しない）

---

## テンプレートA: 個人開発者コミュニティ向け

**対象:** Indie Hackers Japan、個人開発者Discord、Next.js Japan、Supabase Japan

```
こんにちは、副業確定申告アプリ「副楽」を個人開発しているsmiliorです。

副業の確定申告に毎年30時間かかっていたので、
レシートを撮るだけでAIが経費を自動分類するアプリを作りました。

副楽
https://fukuraku.smilior.com

技術スタック：
- Next.js 16 (App Router)
- Supabase (Auth, PostgreSQL, Storage, 東京リージョン)
- Vercel AI SDK + OpenAI GPT-4o Vision
- Stripe
- Vercel

月額コスト約$51で運用しています。

開発記録はZennに書きました：
[Zenn記事URL]

フリープランは無料なので、副業されてる方はぜひ試してみてください。
技術的なフィードバックも歓迎です！
```

---

## テンプレートB: 副業コミュニティ向け

**対象:** 副業系Discord/Slackコミュニティ、副業関連のオンラインサロン

```
副業の確定申告、皆さんどうしてますか？

自分は去年30時間かかって、あまりに面倒だったので
アプリを自作しました。

レシートをスマホで撮影するだけで
AIが経費を自動分類してくれます。
20万円ラインの自動監視もできます。

無料で使えるので、よかったら試してみてください。

副楽：https://fukuraku.smilior.com

使ってみた感想も聞かせてもらえると嬉しいです。
改善に活かします。
```

---

## テンプレートC: 技術コミュニティ向け

**対象:** Next.js Japan Discord、Supabase Japan Discord、TypeScript コミュニティ

```
Next.js + Supabase + AI SDK で
副業確定申告アプリを個人開発しました。

OpenAI Vision APIでレシートのOCRを行い、
Vercel AI SDKのgenerateObjectでstructuredOutputとして
経費データをJSON形式で取得しています。
読取精度は94%です。

主な技術的チャレンジ：
- Supabase RLS でのマルチテナント設計
- AI SDKのストリーミング + 構造化出力
- Stripe Webhookでのサブスクリプション管理
- Next.js 16 Middleware でのセキュリティヘッダー

技術的な詳細はZennに書きました：
[Zenn記事URL]

アプリはこちら：
https://fukuraku.smilior.com

技術的なフィードバック歓迎です。
```

---

## テンプレートD: Reddit向け（英語）

**対象:** r/SideProject, r/indiehackers, r/japanfinance, r/japanlife

```
Title: I built an AI-powered expense tracker for side-job workers
in Japan — from 30 hours of tax prep to 3 minutes

Body:

Hey everyone,

I'm a software developer in Japan who has been doing side work
for the past few years. Tax filing season was always brutal —
last year it took me over 30 hours of manual receipt entry,
expense categorization, and number crunching.

So I built Fukuraku (副楽), an app that:

- Takes a photo of your receipt and uses AI (GPT-4o Vision)
  to read it automatically
- Categorizes expenses into the correct tax categories
- Monitors the 200,000 yen income threshold (above which
  side-job income requires tax filing in Japan)
- Exports data as CSV for tax filing

Tech stack:
- Next.js 16 (App Router)
- Supabase (Auth, PostgreSQL, Storage)
- Vercel AI SDK + OpenAI GPT-4o Vision
- Stripe for subscriptions
- Vercel for hosting

Monthly operating cost: ~$51

Free plan available. The app is in Japanese, targeting the
Japanese market, but happy to answer questions about the
tech stack or development process.

Live: https://fukuraku.smilior.com
Technical writeup on Zenn: [URL]

Would love feedback!
```

---

## テンプレートE: note向け（リリース告知記事）

**対象:** noteの副業カテゴリ

```markdown
# 副業の確定申告アプリ「副楽」を正式リリースしました

副業の確定申告に毎年30時間かかっていました。

レシートの手入力、経費分類の調査、Excel との格闘...
確定申告シーズンが来るたびに憂鬱でした。

freeeやマネーフォワードも試しましたが、
副業サラリーマンには高機能すぎて、
初期設定の時点で挫折。

「副業の確定申告に特化した、シンプルなアプリがあればいいのに。」

ないなら作ろう。
そう思って開発を始め、本日正式にリリースしました。

## 副楽でできること

1. **レシートを撮るだけ** — AIが日付・金額・経費カテゴリを自動判定
2. **20万円ラインを自動監視** — 確定申告が必要になりそうなら通知
3. **CSV出力** — 確定申告書への転記がラク

必要な機能だけ。シンプルに。

## 料金

- フリープラン：無料（月10件まで）
- ベーシック：月額980円（月100件・AI-OCR・CSV出力）
- プロ：月額1,480円（無制限・全機能）

freeeの約1/3の価格です。
副業サラリーマンに高い会計ソフトは必要ありません。

## 試してみてください

https://fukuraku.smilior.com

フィードバックをいただけると本当に嬉しいです。
一人で開発しているので、皆さんの声が改善の原動力です。

コメントやDMでお気軽にどうぞ。
```

---

## 告知後のフォロー

- [ ] コメント・質問には必ず返信する（24時間以内）
- [ ] ネガティブなフィードバックにも丁寧に対応
- [ ] 有益なフィードバックは開発に反映し、報告する
- [ ] 好意的に受け入れられたコミュニティとの関係を維持
- [ ] 結果をまとめてX/noteで報告（1週間後）
