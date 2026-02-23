---
name: nextjs-turso-better-auth-starter
description: |
  Use when the user wants to create a new app, start a new Next.js project,
  build an app with authentication, use Turso database, use Better Auth,
  set up a full-stack TypeScript app, create a web app with Google login,
  or scaffold a new project with database and auth.
  Triggers: "new app", "new project", "Next.js app", "starter", "scaffold",
  "auth app", "Turso", "Better Auth", "login", "Google OAuth app"
---

# Next.js + Turso + Better Auth Starter

Scaffold a full-stack Next.js application with Turso (libSQL), Drizzle ORM,
Better Auth (Google OAuth), Tailwind CSS v4, and shadcn/ui.

## Tech Stack & Versions

| Technology    | Version    | Notes                                       |
|---------------|------------|---------------------------------------------|
| Next.js       | 16.x       | App Router, React 19, Turbopack dev server  |
| Turso/libSQL  | 0.17.x     | SQLite-compatible distributed database      |
| Drizzle ORM   | 0.45.x     | Type-safe ORM with libSQL dialect           |
| Drizzle Kit   | 0.30.x     | Migration toolkit                           |
| Better Auth   | 1.4.x      | TypeScript-first auth framework             |
| Tailwind CSS  | 4.x        | CSS-first config, `@import "tailwindcss"`   |
| shadcn/ui     | latest     | CLI v3, Radix UI primitives                 |
| pnpm          | 9.x+       | Package manager                             |

## Critical Notes

1. **Tailwind CSS v4**: No `tailwind.config.ts`. All config lives in `globals.css`
   via `@theme` blocks. Use `@import "tailwindcss"` instead of `@tailwind` directives.
2. **Better Auth + Drizzle**: Use `drizzleAdapter` from `better-auth/adapters/drizzle`
   with `provider: "sqlite"` for Turso.
3. **Next.js 16 Middleware**: `middleware.ts` still works. Use cookie-only checks
   for performance; validate sessions server-side in pages/routes.
4. **shadcn/ui + Tailwind v4**: Use `pnpm dlx shadcn@latest init` (not shadcn-ui).
   Components work with Tailwind v4 out of the box.
5. **Server-side session**: Use `auth.api.getSession({ headers: await headers() })`
   in Server Components. Import `headers` from `next/headers`.

## Execution Flow

When the user requests a new project, execute these steps in order.

### Step 1: Confirm Project Name

Ask the user for a project name. Default to the name they mentioned, or suggest one.
All subsequent steps are fully automatic.

### Step 2: Create Next.js Project

```bash
pnpm create next-app@latest <project-name> \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack --use-pnpm
```

Then `cd` into the project directory for all following steps.

### Step 3: Install Dependencies

Read `references/project-setup.md` for the full dependency list and shadcn/ui init.

### Step 4: Database Setup

Read `references/database.md` to create:
- `drizzle.config.ts`
- `src/lib/db/index.ts` (DB client)
- `src/lib/db/schema.ts` (Better Auth tables + sample table)
- Type exports

### Step 5: Auth Setup

Read `references/auth.md` to create:
- `src/lib/auth.ts` (Better Auth server config)
- `src/lib/auth-client.ts` (client instance)
- `src/app/api/auth/[...all]/route.ts` (API route)
- `src/middleware.ts` (route protection)

### Step 6: UI Components

Read `references/components.md` to create:
- Update `src/app/globals.css` (Tailwind v4 theme)
- `src/app/page.tsx` (landing page)
- `src/app/layout.tsx` (root layout)
- `src/app/login/page.tsx` (login page)
- `src/app/dashboard/layout.tsx` (auth-protected layout)
- `src/app/dashboard/page.tsx` (dashboard)
- `src/components/sign-in-button.tsx`

### Step 7: Environment Variables

Create `.env.local.example`:

```
# Turso Database
TURSO_CONNECTION_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=

# Better Auth
BETTER_AUTH_SECRET=        # Generate: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Step 8: Package Scripts

Add to `package.json` scripts:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

### Step 9: Completion Report

Display a summary with next steps:

1. **Create Turso database**:
   ```bash
   turso db create <project-name>
   turso db tokens create <project-name>
   ```
2. **Set up Google OAuth**: Go to Google Cloud Console > APIs & Services > Credentials.
   Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI.
3. **Copy `.env.local.example` to `.env.local`** and fill in values.
4. **Push schema**: `pnpm db:push`
5. **Start dev server**: `pnpm dev`
6. **Deploy to Vercel**: Read `references/deployment.md` for production setup.
