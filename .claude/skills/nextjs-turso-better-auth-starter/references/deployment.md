# Vercel Deployment

## vercel.json

Create at project root (optional, for custom configuration):

```json
{
  "framework": "nextjs"
}
```

For most Next.js projects, Vercel auto-detects the framework so `vercel.json`
is only needed if you need custom config (headers, rewrites, cron, etc.).

## Environment Variables

Set these in Vercel Dashboard > Project > Settings > Environment Variables:

| Variable              | Description                          | Example                                        |
|-----------------------|--------------------------------------|-------------------------------------------------|
| `TURSO_CONNECTION_URL`| Turso database URL                   | `libsql://mydb-myorg.turso.io`                 |
| `TURSO_AUTH_TOKEN`    | Turso auth token                     | (from `turso db tokens create`)                |
| `BETTER_AUTH_SECRET`  | Auth encryption secret               | (from `openssl rand -base64 32`)               |
| `BETTER_AUTH_URL`     | Production URL                       | `https://your-app.vercel.app`                  |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID               | `xxx.apps.googleusercontent.com`               |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret           | (from Google Cloud Console)                    |

## Production Checklist

1. **Update `BETTER_AUTH_URL`**: Must match your production domain exactly.
   Better Auth uses this to construct OAuth callback URLs.

2. **Add OAuth redirect URI**: In Google Cloud Console, add your production
   callback URL:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

3. **Push database schema**: Run migrations against your production Turso DB
   before the first deployment:
   ```bash
   TURSO_CONNECTION_URL=<prod-url> TURSO_AUTH_TOKEN=<prod-token> pnpm db:push
   ```

4. **Generate auth secret**: Use a strong random secret for production:
   ```bash
   openssl rand -base64 32
   ```

5. **Verify `NEXT_PUBLIC_BETTER_AUTH_URL`**: If using this env var in
   `auth-client.ts`, set it to your production URL in Vercel.

## Deploy

```bash
# Install Vercel CLI if needed
pnpm add -g vercel

# Deploy
vercel

# Or link and deploy to production
vercel --prod
```

## Custom Domain

If using a custom domain:
1. Add it in Vercel Dashboard > Project > Settings > Domains
2. Update `BETTER_AUTH_URL` to use the custom domain
3. Add the custom domain callback URL in Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

## Turso Database Regions

For best performance, create your Turso database in a region close to your
Vercel deployment region:

```bash
# List available regions
turso db locations

# Create DB in a specific region
turso db create mydb --location nrt  # Tokyo
```
