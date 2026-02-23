# Project Setup

## Create Next.js App

```bash
pnpm create next-app@latest <project-name> \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack --use-pnpm
```

Then `cd <project-name>`.

## Install Dependencies

### Core Dependencies

```bash
pnpm add better-auth @libsql/client drizzle-orm
```

### Dev Dependencies

```bash
pnpm add -D drizzle-kit dotenv
```

## Initialize shadcn/ui

```bash
pnpm dlx shadcn@latest init -y
```

This auto-detects Tailwind v4, sets up `src/lib/utils.ts` with the `cn` utility,
and configures CSS variables.

### Add Base Components

```bash
pnpm dlx shadcn@latest add button card input label
```

## Verify Project Structure

After setup, the `src/` directory should look like:

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
└── lib/
    └── utils.ts
```
