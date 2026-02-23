# Product Hunt, PR TIMES, Zenn投稿手順

## Product Hunt への投稿手順

### 事前準備（リリース2週間前から）

**アカウント準備：**
1. Product Hunt にアカウント作成（まだの場合）
2. プロフィールを充実させる（自己紹介、Twitter/X連携、ポートフォリオ）
3. Maker プロフィールに切り替え
4. 他のプロダクトに日常的にUpvote・コメントしてアクティビティを上げる

**投稿素材の準備：**
1. Gallery 画像（5枚）
   - 画像1: アプリの全体像（ダッシュボード）
   - 画像2: レシート撮影 → AI分類の流れ
   - 画像3: 20万円ライン監視機能
   - 画像4: 月別経費レポート
   - 画像5: 料金プラン or Before/After

2. サムネイル画像
   - サイズ: 240 x 240px
   - 副楽のロゴまたはアイコン

3. デモ動画（オプション、推奨）
   - 長さ: 30-60秒
   - レシート撮影 → 自動分類 → ダッシュボード確認 の流れ

### 投稿タイミング

**推奨：火曜日 00:01 PST（日本時間 火曜日 17:01）**

理由：
- Product Hunt のデイリーランキングは PST 00:00 にリセット
- 火曜日は投稿数が多すぎず、アクティブユーザーも多い最適な曜日
- 月曜日は先週からの持ち越し投稿が多い
- 金曜日〜日曜日はアクティブユーザーが少ない

**避けるべきタイミング：**
- 大型プロダクトのリリース日と被る場合
- 祝日やイベント（CES、WWDC等）の期間

### 投稿内容

**Tagline（短い説明文）：**
```
AI-powered tax filing assistant for Japanese freelancers
```

**Description（300字以内）：**
```
Fukuraku is a tax filing assistant designed for Japanese
side-job workers (副業サラリーマン). Simply take a photo
of your receipt, and our AI automatically categorizes your
expenses.

Key features:
- AI-powered receipt OCR with 94% accuracy
- Automatic expense categorization
- Real-time income monitoring (alerts at the 200,000 yen
  tax filing threshold)
- Dashboard for income/expense tracking

Built with Next.js, Supabase, and Vercel AI SDK.

Free plan available. Pro plan at 980 yen/month.
```

**Topics（タグ）：**
- Artificial Intelligence
- Tax
- Productivity
- SaaS
- Finance

### Maker コメント テンプレート

投稿直後にMakerコメント（First Comment）を投稿します。

```
Hi Product Hunt!

I'm [Name], a solo developer from Japan.

I built Fukuraku because I spent 30+ hours on tax filing
for my side job last year. As a salaried employee with
a side business, the process was incredibly painful:
- Piles of receipts
- Manual Excel data entry
- Confusion about expense categories
- Uncertainty about whether I needed to file

So I built an app that solves all of this.
Just take a photo of your receipt, and AI does the rest.

Tech stack:
- Next.js 15 (App Router)
- Supabase (Auth, DB, Storage)
- Vercel AI SDK + OpenAI Vision
- Stripe for billing
- Hosted on Vercel

Total monthly cost: ~$51

I'd love to hear your feedback!
Feel free to ask any questions here.

Try it free: [URL]
```

### 事前にサポーターを集める方法

**リリース前の準備（2週間前から）：**

1. **Coming Soon ページの活用**
   - Product Hunt の「Coming Soon」ページを作成
   - フォロワーにNotify（通知）を登録してもらう

2. **X（Twitter）での事前告知**
   ```
   来週、Product Hunt に副楽を投稿します。

   レシートを撮るだけでAIが経費を自動分類する、
   副業サラリーマン向けの確定申告アプリです。

   Product Hunt で応援してくれる方、
   このツイートにいいねお願いします。
   リリース日にDMでお知らせします。
   ```

3. **個人開発者コミュニティへの協力依頼**
   - Indie Hackers Japan
   - 個人開発者のDiscordコミュニティ
   - X の個人開発者仲間

4. **リリース当日のDM送信**
   ```
   おはようございます！

   本日、Product Hunt に副楽を投稿しました。
   もしよろしければ、Upvoteとコメントで
   応援いただけると嬉しいです。

   [Product Hunt URL]

   よろしくお願いします！
   ```

### リリース後の対応

**当日のタスク：**
- [ ] 全コメントに返信（1時間以内が目標）
- [ ] X で定期的に進捗報告（3時間ごと）
- [ ] バグ報告があれば即時対応
- [ ] Product Hunt のランキング推移を記録

**翌日以降：**
- [ ] 結果のまとめツイート
- [ ] 獲得したUpvote数、コメント数を記録
- [ ] Product Hunt からの流入をGA4で分析
- [ ] フィードバックの整理と優先度付け

---

## PR TIMES プレスリリース

### PR TIMES の活用

**PR TIMES の特徴：**
- 日本最大のプレスリリース配信サービス
- 無料プラン（スタートアップチャレンジ）あり
- Google ニュースに掲載される可能性
- SEOの被リンク効果

**無料プランの条件（スタートアップチャレンジ）：**
- 設立3年以内のスタートアップ
- 初回のみ無料配信可能（2回目以降は有料）
- 個人事業主でも申請可能

### プレスリリースのタイトル

**タイトル作成のルール：**
- 30文字以内を目標
- 何が新しいのかを一言で伝える
- 数字を含めると効果的

**タイトル案：**
```
案1: 副業サラリーマン専用、AI確定申告アプリ「副楽」を提供開始
案2: レシートを撮るだけで経費を自動分類、AI確定申告アプリ「副楽」リリース
案3: 確定申告の準備時間を97%削減、副業向けAIアプリ「副楽」提供開始
```

### プレスリリース本文構成

```
【リード文】（200字以内）
[運営者名]は、副業を行うサラリーマン向けのAI確定申告支援アプリ
「副楽」を20XX年XX月XX日より提供開始したことをお知らせいたします。
レシートを撮影するだけでAIが経費を自動分類し、確定申告の準備を
大幅に効率化します。

【背景】（300字程度）
近年、副業を行うサラリーマンが増加しています。
厚生労働省の調査によると、副業を行う会社員は年々増加傾向にあり、
確定申告への対応が課題となっています。

一方、既存の確定申告ソフト（freee、マネーフォワード等）は
本格的な会計ソフトであり、副業サラリーマンにはオーバースペックで
あるとの声が多く聞かれます。

「副楽」は、副業サラリーマンに特化することで、
必要な機能だけをシンプルに提供し、確定申告の準備を
誰でも簡単に行えるようにしました。

【サービス概要】
サービス名：副楽
URL：https://fukuraku.app（仮）
料金：フリープラン（無料）/ プロプラン（月額980円・税込）
対応デバイス：PC（Chrome, Safari, Edge）/ スマートフォン

【主な特徴】

1. AIによるレシート自動読取り・経費分類
   スマートフォンでレシートを撮影するだけで、
   AIが日付・金額・品目を読み取り、
   適切な経費カテゴリに自動分類します。
   読取精度は94%を実現しています。

2. 20万円ライン自動監視
   副業の所得（収入-経費）をリアルタイムで計算し、
   確定申告が必要となる20万円のラインに近づくと
   アラートで通知します。

3. 副業サラリーマン専用のシンプルなUI
   会計の知識がない方でも直感的に使える
   シンプルなインターフェースを提供します。
   既存の会計ソフトが複雑すぎると感じた方でも
   すぐに使い始められます。

【技術について】
- フロントエンド：Next.js 15（App Router）
- バックエンド：Supabase
- AI：Vercel AI SDK + OpenAI Vision API
- 決済：Stripe
- ホスティング：Vercel

全てクラウドベースで動作し、
データは東京リージョンに保存されます。

【今後の展開】
今後は以下の機能追加を予定しています。
- 銀行口座連携
- 確定申告書の直接作成機能
- 税理士マッチング機能

【会社概要（または個人情報）】
運営者：[氏名]
所在地：[住所またはバーチャルオフィス]
設立：20XX年XX月
URL：https://fukuraku.app（仮）
事業内容：Webサービスの企画・開発・運営

【本件に関するお問い合わせ】
[氏名]
メールアドレス：[メールアドレス]
```

### 配信タイミング

**推奨：月曜日 10:00 配信**

理由：
- 月曜日はメディア関係者が週の情報収集を行う
- 午前10時は記者のチェックが最も多い時間帯
- 火曜日〜木曜日も良い（金曜日は避ける）

**避けるべきタイミング：**
- 大きなニュースが予想される日
- 祝日・連休の前日
- 確定申告期限日（3/15）：ニュースが多すぎて埋もれる

### プレスリリース配信後のフォロー

- [ ] X で配信報告ツイート
- [ ] 掲載メディアの確認（Google ニュース、Yahoo!ニュース等）
- [ ] 掲載されたメディアへのお礼
- [ ] 掲載記事のURLを記録
- [ ] GA4 でプレスリリースからの流入を分析

---

## Zenn 技術記事テンプレート

### メイン記事：開発記録

**タイトル：「副業確定申告アプリをNext.js + AI SDKで個人開発した話」**

**記事構成：**

```markdown
# 副業確定申告アプリをNext.js + AI SDKで個人開発した話

## はじめに

副業の確定申告に毎年30時間かかっていたので、
レシートを撮るだけでAIが経費を自動分類するアプリを作りました。

## 作ったもの

- サービス名：副楽
- URL：[URL]
- 機能：レシートOCR、AI経費分類、20万円ライン監視

## 技術選定

### フロントエンド：Next.js 15 (App Router)

選定理由：
- App Router のServer Componentsでパフォーマンス向上
- Vercelへのデプロイが簡単

比較検討：
- Remix → Server Componentsのエコシステムが弱い
- SvelteKit → Reactのエコシステムを活用したかった

### バックエンド：Supabase

選定理由：
- PostgreSQL + Auth + Storage がオールインワン
- Row Level Security (RLS) でデータ分離が容易
- 東京リージョンがある

比較検討：
- Firebase → RDBMSが欲しかった
- PlanetScale → Auth/Storageが別途必要

### AI：Vercel AI SDK + OpenAI Vision API

選定理由：
- Vercel AI SDKのストリーミング対応
- OpenAI Vision APIのマルチモーダル対応
- structuredOutput でJSON形式のレスポンスを取得

### 決済：Stripe

選定理由：
- 日本でのサポートが充実
- サブスクリプション管理が簡単

## 実装のポイント

### レシートOCRの実装

[コードスニペット：AI SDKを使ったレシートOCR]

ポイント：
- プロンプトの工夫で精度94%を達成
- structuredOutput で日付・金額・品目をJSON取得

### Supabase RLSの設計

[コードスニペット：RLSポリシー]

ポイント：
- 全テーブルにRLSを設定
- auth.uid() でユーザーデータを完全分離

### Stripe Billingの実装

[コードスニペット：Webhook処理]

ポイント：
- Webhookでサブスクリプションの状態管理
- Customer Portal でユーザー自身がプラン管理

## 躓いたポイント

### 1. Supabase RLSのデバッグが大変

auth.uid() の型がuuid vs textで不一致になるケースに3時間ハマった。
解決策：テスト環境でRLSの挙動を確認するヘルパー関数を作成。

### 2. OpenAI Vision APIの料金管理

高解像度のレシート画像をそのまま送ると料金が跳ね上がる。
解決策：画像を1024px以下にリサイズしてから送信。
1リクエストあたり約$0.003に抑えた。

### 3. Stripe Webhookの署名検証

ローカル開発環境でWebhookのテストが面倒。
解決策：stripe CLIの `stripe listen --forward-to` を使用。

## コスト

月額運用コスト：
- Vercel Pro: $20
- Supabase Pro: $25
- OpenAI API: ~$5
- ドメイン: ~$1
- 合計: 約$51（約7,500円）

## まとめ

- 自分の課題を解決するアプリは開発モチベーションが維持しやすい
- Supabase + Vercel の組み合わせは個人開発に最適
- AI SDKのおかげでAI機能の実装が想像以上に簡単だった
- 月$51で本格的なSaaSが運用できる時代

副楽は無料で使えます → [URL]
```

### サブ記事テンプレート集

**記事2：「Vercel AI SDK + OpenAI Vision APIでレシートOCRを実装する」**
```
構成：
1. OpenAI Vision APIの概要
2. Vercel AI SDKとの連携方法
3. プロンプト設計のコツ
4. structuredOutput でJSON形式のレスポンスを取得
5. 精度を上げるためのTips
6. コスト最適化の方法
```

**記事3：「Supabase RLSでマルチテナントSaaSを構築する」**
```
構成：
1. RLSとは何か
2. 基本的なRLSポリシーの書き方
3. Storage のRLS設定
4. テスト方法
5. ハマりポイントと解決策
```

**記事4：「個人開発SaaSの月額コストを$50以下に抑える方法」**
```
構成：
1. 使用サービスとコスト内訳
2. 無料枠の活用方法
3. コスト最適化のTips
4. 月額コスト推移グラフ
5. コストが増える分岐点
```

### 記事投稿のコツ

**Zennで読まれる記事の特徴：**
- 具体的なコードスニペットが含まれている
- 実際の開発経験に基づいている（理論だけの記事は読まれにくい）
- ハマったポイントと解決策が含まれている
- スクリーンショットや図が適度に含まれている
- タイトルに技術名が含まれている

**投稿タイミング：**
- 平日の午前中（9-12時）が最もPVが伸びやすい
- 特に火曜日〜木曜日が良い

**ハッシュタグ：**
- #nextjs
- #supabase
- #openai
- #typescript
