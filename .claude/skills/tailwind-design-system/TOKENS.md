# デザイントークン設定

## Quick Start: CSS-first 設定

```css
/* app.css - Tailwind v4 CSS-first 設定 */
@import "tailwindcss";

/* @theme でテーマを定義 */
@theme {
  /* セマンティックカラートークン（OKLCH による高い色知覚均一性） */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.5% 0.025 264);

  --color-primary: oklch(14.5% 0.025 264);
  --color-primary-foreground: oklch(98% 0.01 264);

  --color-secondary: oklch(96% 0.01 264);
  --color-secondary-foreground: oklch(14.5% 0.025 264);

  --color-muted: oklch(96% 0.01 264);
  --color-muted-foreground: oklch(46% 0.02 264);

  --color-accent: oklch(96% 0.01 264);
  --color-accent-foreground: oklch(14.5% 0.025 264);

  --color-destructive: oklch(53% 0.22 27);
  --color-destructive-foreground: oklch(98% 0.01 264);

  --color-border: oklch(91% 0.01 264);
  --color-ring: oklch(14.5% 0.025 264);

  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(14.5% 0.025 264);

  /* フォーカス状態のリングオフセット */
  --color-ring-offset: oklch(100% 0 0);

  /* Radius トークン */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* アニメーショントークン */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-fade-out: fade-out 0.2s ease-in;
  --animate-slide-in: slide-in 0.3s ease-out;
  --animate-slide-out: slide-out 0.3s ease-in;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slide-in {
    from { transform: translateY(-0.5rem); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slide-out {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-0.5rem); opacity: 0; }
  }
}
```

## デザイントークン階層

```
Brand Tokens (abstract)
    └── Semantic Tokens (purpose)
        └── Component Tokens (specific)

例:
    oklch(45% 0.2 260) → --color-primary → bg-primary
```

## コンポーネントアーキテクチャ

```
Base styles → Variants → Sizes → States → Overrides
```

## 高度な v4 パターン

### @utility によるカスタムユーティリティ

```css
/* 装飾ラインのカスタムユーティリティ */
@utility line-t {
  @apply relative before:absolute before:top-0 before:-left-[100vw] before:h-px before:w-[200vw] before:bg-gray-950/5 dark:before:bg-white/10;
}

/* テキストグラデーションのカスタムユーティリティ */
@utility text-gradient {
  @apply bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent;
}
```

### テーマモディファイアー

```css
/* 他の CSS 変数を参照する場合は @theme inline を使用 */
@theme inline {
  --font-sans: var(--font-inter), system-ui;
}

/* 未使用でも常に CSS 変数を生成する場合は @theme static */
@theme static {
  --color-brand: oklch(65% 0.15 240);
}

/* テーマオプション付きインポート */
@import "tailwindcss" theme(static);
```

### 名前空間オーバーライド

```css
@theme {
  /* デフォルトのカラーをすべてクリアして独自定義 */
  --color-*: initial;
  --color-white: #fff;
  --color-black: #000;
  --color-primary: oklch(45% 0.2 260);
  --color-secondary: oklch(65% 0.15 200);

  /* 最小セットアップのためすべてのデフォルトをクリア */
  /* --*: initial; */
}
```

### 半透明カラーバリアント

```css
@theme {
  /* alpha バリアントに color-mix() を使用 */
  --color-primary-50: color-mix(in oklab, var(--color-primary) 5%, transparent);
  --color-primary-100: color-mix(in oklab, var(--color-primary) 10%, transparent);
  --color-primary-200: color-mix(in oklab, var(--color-primary) 20%, transparent);
}
```

### コンテナクエリ

```css
@theme {
  --container-xs: 20rem;
  --container-sm: 24rem;
  --container-md: 28rem;
  --container-lg: 32rem;
}
```

## ユーティリティ関数

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// フォーカスリングユーティリティ
export const focusRing = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-ring focus-visible:ring-offset-2",
);

// 無効化ユーティリティ
export const disabled = "disabled:pointer-events-none disabled:opacity-50";
```

## v3 から v4 への移行チェックリスト

- [ ] `tailwind.config.ts` を CSS の `@theme` ブロックに置き換え
- [ ] `@tailwind base/components/utilities` を `@import "tailwindcss"` に変更
- [ ] カラー定義を `@theme { --color-*: value }` に移動
- [ ] `darkMode: "class"` を `@custom-variant dark` に置き換え
- [ ] `@keyframes` を `@theme` ブロック内に移動
- [ ] `require("tailwindcss-animate")` をネイティブ CSS アニメーションに置き換え
- [ ] `h-10 w-10` を `size-10` に更新（新しいユーティリティ）
- [ ] `forwardRef` を削除（React 19 は ref を props として渡す）
- [ ] HSL より優れた知覚均一性を持つ OKLCH カラーを検討
- [ ] カスタムプラグインを `@utility` ディレクティブに置き換え

## v3 と v4 のパターン比較

| v3 Pattern | v4 Pattern |
|-----------|-----------|
| `tailwind.config.ts` | `@theme` in CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `darkMode: "class"` | `@custom-variant dark (&:where(.dark, .dark *))` |
| `theme.extend.colors` | `@theme { --color-*: value }` |
| `require("tailwindcss-animate")` | CSS `@keyframes` in `@theme` + `@starting-style` |
