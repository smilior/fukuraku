# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと
Week 3-4 Milestone の全 Issue (#8〜#14) + LP関連 (#32, #34) を完了

| Issue | 内容 |
|-------|------|
| #5〜#7 | ダッシュボード・収入/経費CRUD |
| #8 | レシートOCR（GPT-4o Vision + AI SDK v6） |
| #9 | 確定申告サマリー・CSVエクスポート |
| #10 | 設定画面（プロフィール・削除） |
| #11 | Stripe決済（Checkout/Webhook/Portal） |
| #12 | PWA（next-pwa・manifest・アイコン） |
| #13 | Vitestユニットテスト32件・GitHub Actions CI |
| #14 | ランディングページ |
| #32 | OGP画像（opengraph-image.tsx / ImageResponse 1200×630） |
| #34 | LPデザインブラッシュアップ（モダンSaaSダークテーマ） |

## 重要な技術メモ
- AI SDK v6: `experimental_output: Output.object()` → `result.experimental_output` でアクセス
- Supabase Storage: `receipts` バケットを手動で作成する必要あり（Supabase Dashboard）
- Stripe API version: `2026-01-28.clover`
- テスト用定数は `src/lib/plans.ts`（stripe.ts から分離済み、テストで安全にインポート可）
- PWAアイコン: `public/icons/icon-192.png` / `icon-512.png`（本番前に正式デザインへ差し替え）
- OGP画像: `src/app/opengraph-image.tsx` (Next.js ImageResponse、og:image/twitter:image自動注入)
- LP: `src/app/page.tsx` — ダークグラデーションHero、グラデーションボーダーカード、プロプランscale-105

## 環境一覧（確定）
| 環境 | URL | ブランチ |
|------|-----|---------|\
| ローカル | http://localhost:3000 | - |
| 検証 | https://fukuraku-git-staging-smiliors-projects.vercel.app | staging |
| 本番 | https://fukuraku.vercel.app | main |

## 次セッションの再開ポイント
`gh issue list --milestone "Week 5-6: ベータリリース"` で次Issueを確認

## 未解決・持ち越し
- Supabase Storage の `receipts` バケット作成（Dashboard で手動）
- ローカルWebhookテスト: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Production Supabase（mjmxibsponmvucyqdpvc）への切り替えは本番運用開始時
- `Database` 型に `Relationships: []` が必須（postgrest-js v2）
