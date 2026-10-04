# BoomBox TH Landing Page

Portable deployment package for the BoomBox TH marketing landing page.

## Run locally

Requirements: Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Build for static hosting

```bash
pnpm install --frozen-lockfile
pnpm build
```

The static output is written to `dist/public`. Netlify can deploy it with the included `netlify.toml`.

## Local media

All landing-page media is stored in:

- `assets/images/`
- `assets/videos/`

The same files are copied to `client/public/assets/` so Vite serves them from `/assets/...` in production. `assets/media-manifest.json` lists the original source URLs, local paths, sizes, and any files over 50 MB.

## Important deployment boundary

The public landing page and its media are portable. The current repository is still a full-stack application: the admin dashboard, catalog editing, analytics, Manus OAuth, and server-side storage procedures require a compatible backend, database, authentication provider, and object storage to be configured separately. Netlify static hosting serves the landing page but does not provide those backend services.

The LINE handoff URL is intentionally external because it is the sales destination:
`https://lin.ee/qczVNTJ`

If you want a completely independent full-stack deployment, replace the Manus OAuth/storage/database adapters in `server/_core`, `server/storage.ts`, and the catalog procedures before deploying the server.
