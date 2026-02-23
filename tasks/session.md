# セッションメモ（毎セッション上書き）

## 最終更新: 2026-02-23

## 今セッションでやったこと

### PCデスクトップレイアウト追加（/ui-ux-pro-max + Agent Team）

Agent Team（eng-1 / eng-2 / eng-3）で並行実装:
- `bottom-nav.tsx`: `hidden lg:flex` 固定サイドバー追加（ロゴ + 4ナビ + 設定）/ モバイルは `lg:hidden` でボトムタブ継続
- `dashboard/page.tsx`: `lg:grid-cols-2` 2カラムグリッド / 12ヶ月チャート / `chartYear` searchParam で年切り替えフォーム
- `income/page.tsx`: カードリスト → `lg:grid-cols-2` グリッド対応
- `expense/page.tsx`: カードリスト → `lg:grid-cols-2` グリッド対応
- `summary/page.tsx`: 2カラムレイアウト（バナー+テーブル+ボタン左 / チェックリスト右）
- `settings/page.tsx`: `lg:pl-60` + BottomNav + ログアウトボタン修正
- commit: 5da3764 → push済み

---

### UI全面改修 Phase 2 — モックアップ完全一致修正（/ui-ux-pro-max + Agent Team）

Agent Team（engineer-1 / engineer-2）で並行修正:
- `bottom-nav.tsx`: ホーム(部屋付き)/収入/経費(レシート)/申告書(グラフ) SVGパスをMoc完全一致
- `dashboard/page.tsx`: サマリーカードをアイコン+ラベル横並びに / YearlyChart→カスタムdivバーチャート（indigo・凡例なし）/ ベル・警告・取引アイコン全path統一
- `summary/page.tsx`: サブタイトル追加・申告バナーをアイコン+テキスト型に・mx-4統一
- `filing-checklist.tsx`: タイトル「申告準備チェックリスト」(uppercase tracking-wider)・チェックSVGパス修正
- commit: 801e6ae → push済み

---

### UI全面改修 Phase 1 — モバイルファーストのモックアップ忠実実装

`docs/mockups/app.html` に忠実なデザインへ全面書き直し。

| ファイル | 変更内容 |
|---------|---------|
| `src/app/globals.css` | app-bar-animate / app-pulse-ring / app-check-pop アニメーション追加 |
| `src/components/app/bottom-nav.tsx` | 新規：ボトムタブバー（ホーム/収入/+FAB/経費/申告書） |
| `src/components/app/filing-checklist.tsx` | 新規：申告チェックリスト（5項目・チェックアニメ） |
| `src/app/dashboard/page.tsx` | 完全書き直し（インディゴ/エメラルド/オレンジ体系） |
| `src/app/dashboard/yearly-chart.tsx` | indigo-600 / orange-500 に色変更 |
| `src/app/income/page.tsx` | エメラルドバナー・カードリスト・BottomNav |
| `src/app/expense/page.tsx` | OCRグラデーションボタン・オレンジバナー・カードリスト・BottomNav |
| `src/app/summary/page.tsx` | 概算税額行・FilingChecklist・e-Taxボタン・BottomNav |

- `bunx tsc --noEmit` → エラーなし
- commit & push 済み（main: c2c32c5）

## 重要な技術メモ（前セッションから継続）
- AI SDK v6: `experimental_output: Output.object()` → `result.experimental_output` でアクセス
- Supabase Storage: `receipts` バケットを手動で作成する必要あり（Supabase Dashboard）
- Stripe API version: `2026-01-28.clover`
- テスト用定数は `src/lib/plans.ts`
- PWAアイコン: `public/icons/icon-192.png` / `icon-512.png`（本番前に正式デザインへ差し替え）
- OGP画像: `src/app/opengraph-image.tsx`
- LP: `src/app/page.tsx`
- `IncomeRow` に `withholding_tax` フィールドはない（category で代替）

## デザイントークン（確定）
| 用途 | クラス |
|-----|-------|
| プライマリ | `indigo-600` |
| 収入 | `emerald-600` / `emerald-50` |
| 経費 | `orange-500` / `orange-50` |
| アラート | `red-500` / `red-50` |
| カード | `bg-white rounded-2xl shadow-sm` |
| ページ背景 | `bg-[#F8FAFC]` |
| タブバー余白 | `pb-24` |
| コンテナ（モバイル） | `max-w-lg mx-auto` |
| コンテナ（PC） | `lg:max-w-5xl lg:px-4` |
| サイドバー幅 | `lg:pl-60` / サイドバー `w-60` |

## 環境一覧（確定）
| 環境 | URL | ブランチ |
|------|-----|---------|
| ローカル | http://localhost:3000 | - |
| 検証 | https://fukuraku-test.smilior.com | staging |
| 本番 | https://fukuraku.smilior.com | main |

## 次セッションの再開ポイント
**全 GitHub Issue 完了・UI改修（モバイル＋PC）も完了**
次の作業はオーナーによる人手タスク（`tasks/todo.md` 参照）

## 未解決・持ち越し（オーナーアクション必要）
1. Google Form 作成 → `docs/marketing/beta/recruitment-post.md` 参照
2. X アカウント運用開始 → `docs/marketing/x/` 参照
3. Note 記事公開 → `docs/marketing/note/` 参照
4. Product Hunt 投稿 → `docs/release/product-hunt.md` 参照（火曜 00:01 PST）
5. 本番 Supabase マイグレーション適用（prod: mjmxibsponmvucyqdpvc）
6. Stripe 本番モード確認（本番キー・Webhook設定）
7. Supabase Storage の `receipts` バケット作成（Dashboard で手動）
