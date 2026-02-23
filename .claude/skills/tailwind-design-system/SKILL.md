---
name: tailwind-design-system
description: Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Use when creating component libraries, implementing design systems, or standardizing UI patterns.
---

# Tailwind Design System (v4)

Tailwind CSS v4 でプロダクション対応のデザインシステムを構築する。
CSS-first設定・デザイントークン・コンポーネントバリアント・レスポンシブ・アクセシビリティを網羅。

## 前提条件・制約

- Tailwind CSS v4（2024+）を対象とする。v3 は[アップグレードガイド](https://tailwindcss.com/docs/upgrade-guide)を参照
- `tailwind.config.ts` は使わない。CSS の `@theme` を使うこと
- React 19 を前提とする（`forwardRef` 不要、`ref` は通常の props）

## 詳細ドキュメント

| ステップ | 内容 | 参照先 |
|---------|------|-------|
| 1 | @theme設定・セマンティックトークン・カスタムユーティリティ・v3→v4移行 | [TOKENS.md](./TOKENS.md) |
| 2 | CVAコンポーネント・複合コンポーネント・フォームコンポーネント | [COMPONENTS.md](./COMPONENTS.md) |
| 3 | レスポンシブグリッド・コンテナ・ネイティブCSSアニメーション | [RESPONSIVE.md](./RESPONSIVE.md) |
| 4 | ダークモード設定・ThemeProvider・テーマトグル実装 | [DARK_MODE.md](./DARK_MODE.md) |
