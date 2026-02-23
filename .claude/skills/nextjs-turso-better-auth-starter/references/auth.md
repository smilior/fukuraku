# Auth Setup (Better Auth)

## Server Config — `src/lib/auth.ts`

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // Optional: Enable email/password authentication
  // emailAndPassword: {
  //   enabled: true,
  // },
  //
  // Optional: Restrict sign-ups to specific emails
  // user: {
  //   changeEmail: { enabled: true },
  //   deleteUser: { enabled: true },
  // },
});

export type Auth = typeof auth;
```

## Client Config — `src/lib/auth-client.ts`

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession } = authClient;
```

Note: `NEXT_PUBLIC_BETTER_AUTH_URL` is optional if the auth API is on the same
domain. Useful when the client needs to know the base URL explicitly.

## API Route — `src/app/api/auth/[...all]/route.ts`

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Middleware — `src/middleware.ts`

Cookie-only check for performance. Full session validation happens server-side
in the protected layout.

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for Better Auth session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect /dashboard and its sub-routes
  matcher: ["/dashboard/:path*"],
};
```

## Server-Side Session Helper — `src/lib/auth-session.ts`

Convenience wrapper for getting the session in Server Components and Server Actions.

```ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
```

## Directory Structure

```
src/
├── app/
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.ts
├── lib/
│   ├── auth.ts            # Server config
│   ├── auth-client.ts     # Client config
│   └── auth-session.ts    # Server session helper
└── middleware.ts
```
