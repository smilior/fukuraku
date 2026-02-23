# スキルインストールレポート

**実施日**: 2026-02-23
**担当エージェント**: installer-scanner

## インストール結果

| スキル名 | ステータス | 理由 |
|---------|-----------|------|
| nextjs-on-vercel | インストール済み | Claude-only, 脆弱性なし |
| stripe-subscriptions | インストール済み | Claude-only, 脆弱性なし |
| ai-sdk-core | インストール済み | Claude-only (shell scriptは参照用), 脆弱性なし |
| requirements-analyst | インストール済み | Claude-only, 脆弱性なし |
| tailwind-design-system | インストール済み | Claude-only, 脆弱性なし |
| vercel-react-best-practices | インストール済み | Claude-only, 脆弱性なし |
| nextjs-turso-better-auth-starter | インストール済み | Claude-only (pnpmコマンドはセットアップ手順), 脆弱性なし |
| drizzle-orm | インストール済み | Claude-only, 脆弱性なし |
| ui-ux-expert | インストール済み | Claude-only, 脆弱性なし |
| ui-ux-pro-max | 削除 | Python3依存あり（search.pyスクリプトの実行が必須 - Claude-only でない） |

## 脆弱性診断結果

### 全スキル共通チェック項目

- `rm -rf` / `sudo` 等の危険なコマンド: **検出なし**
- APIキーや機密情報のログ出力指示: **検出なし**
- 外部への不審な通信指示: **検出なし**
- 悪意のあるコード実行の可能性: **検出なし**

### 個別スキル診断

#### 1. nextjs-on-vercel
- **リスク**: なし
- **外部通信**: `fullstackrecipes.com` へのcurlコマンドあり（正規のレシピ取得用、MCP server参照が主用途）
- **判定**: 安全

#### 2. stripe-subscriptions
- **リスク**: なし
- **外部通信**: `fullstackrecipes.com` へのcurlコマンドあり（レシピ取得用）
- **判定**: 安全

#### 3. ai-sdk-core
- **リスク**: 低
- **注意点**: `scripts/check-versions.sh` が存在（npm list/npm viewコマンド実行）。パッケージバージョンチェック用の安全なスクリプト。破壊的操作なし。
- **外部通信**: npm registry への問い合わせのみ（バージョン確認）
- **判定**: 安全

#### 4. requirements-analyst
- **リスク**: なし
- **内容**: 要件定義のテンプレートとワークフロー指示のみ
- **外部通信**: なし
- **判定**: 安全

#### 5. tailwind-design-system
- **リスク**: なし
- **内容**: CSS/TypeScriptのコード例とベストプラクティスのみ
- **外部通信**: なし
- **判定**: 安全

#### 6. vercel-react-best-practices
- **リスク**: なし
- **内容**: React/Next.jsパフォーマンス最適化のルール集（57ルール、8カテゴリ）
- **外部通信**: なし
- **判定**: 安全

#### 7. nextjs-turso-better-auth-starter
- **リスク**: なし
- **内容**: プロジェクトセットアップ手順書（pnpm/tursoコマンドはユーザー向け手順）
- **外部通信**: npm registryへのパッケージインストール手順のみ
- **判定**: 安全

#### 8. drizzle-orm
- **リスク**: なし
- **内容**: Drizzle ORMのコード例とベストプラクティスのみ
- **外部通信**: なし
- **判定**: 安全

#### 9. ui-ux-expert
- **リスク**: なし
- **内容**: UI/UXデザインガイドライン、アクセシビリティ基準、テストパターン
- **外部通信**: なし
- **判定**: 安全

#### 10. ui-ux-pro-max（削除済み）
- **リスク**: 中（Python3ランタイム依存）
- **削除理由**: `python3 .shared/ui-ux-pro-max/scripts/search.py` の実行が必須。Claude-only環境では動作しない。
- **脆弱性**: 検出なし（削除前の確認で危険なコマンドや不審な通信は見つからなかった）

## 最終的にインストールされたスキル一覧

1. **nextjs-on-vercel** - Next.js on Vercel セットアップガイド
2. **stripe-subscriptions** - Stripe サブスクリプション決済システム
3. **ai-sdk-core** - Vercel AI SDK v5/v6 バックエンドAI開発
4. **requirements-analyst** - 要件定義・分析AI
5. **tailwind-design-system** - Tailwind CSS v4 デザインシステム
6. **vercel-react-best-practices** - React/Next.js パフォーマンス最適化（57ルール）
7. **nextjs-turso-better-auth-starter** - Next.js + Turso + Better Auth スターター
8. **drizzle-orm** - Drizzle ORM 開発ガイドライン
9. **ui-ux-expert** - UI/UXデザインエキスパート（WCAG 2.2対応）

**合計**: 9スキル インストール完了 / 1スキル 削除（ui-ux-pro-max）
