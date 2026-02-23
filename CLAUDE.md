# 副楽（フクラク）— Claude Code 設定

## プロジェクト概要
- **アプリ名:** 副楽（ふくらく）— 副業サラリーマン専用 確定申告アプリ
- **技術スタック:** Next.js 16+ + Supabase + GPT-4o Vision + Stripe + Vercel
- **スタイル:** shadcn/ui + Tailwind CSS + Zustand + PWA（next-pwa）
- **GitHub:** https://github.com/smilior/fukuraku
- **ドキュメント:** `docs/` 配下に整理済み

## プラン設計
- 無料: 10件/年
- ベーシック: 月額980円（100件/年・AI-OCR・CSV出力）
- プロ: 月額1,480円（無制限・全機能）
- シーズンパス: 2,980円（1〜3月限定）

---

## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

## スキル自動活用ルール

タスクに着手する前に、対応するスキルが `.claude/skills/` に存在するか確認すること。
該当スキルがあれば、ユーザーが明示しなくても必ず参照してから実装を進める。

```
タスク受信
  → .claude/skills/ に関連スキルがあるか確認
  → あれば SKILL.md（＋サブファイル）を読んでから実装
  → なければ通常通り対応
```

## スキル活用ガイド（優先度順）

| フェーズ | スキル | 用途 |
|---------|--------|------|
| Week 1 | `nextjs-on-vercel` | プロジェクト立ち上げ・Vercelデプロイ |
| Week 1 | `tailwind-design-system` | デザイントークン・shadcn/ui設定 |
| Week 2 | `vercel-react-best-practices` | コンポーネント設計・パフォーマンス |
| Week 3 | `ai-sdk-core` | GPT-4o Vision レシートOCR実装 |
| Week 4 | `stripe-subscriptions` | フリーミアム決済・Webhook |
| Week 4 | `subscription-payment-testing` | Stripe決済テスト自動化 |
| Week 5 | `legal-compliance-jp` | 利用規約・プライバシーポリシー |
| Week 5 | `lp-copywriting` | LPコピー |
| Week 6 | `ui-ux-expert` | WCAG 2.2 アクセシビリティ |
| Week 7 | `seo-content-marketing` | SEO・ブログ記事 |
| Week 8 | `product-launch` | Product Hunt・リリース告知 |
| 通年 | `web-app-security` | Supabase RLS・OWASP対応 |
| 通年 | `testing-strategy` | Vitest + Playwright E2E |
| 通年 | `x-twitter-marketing` | X（Twitter）運用 |

## 技術的注意事項
- Supabase を使用（stripe-subscriptions / nextjs-turso-starter はNeon向けのため読み替え必須）
- ai-sdk-core v6.0.40 は使用禁止（v6.0.41以降を使用）
- Vercel Hobbyプランは商用利用不可 → 有料ユーザー発生時にProへアップグレード
- shadcn/ui: `pnpm dlx shadcn@latest init`（Tailwind v4対応）
