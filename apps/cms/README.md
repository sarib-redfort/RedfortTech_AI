# RedFort Tech — CMS

The admin panel used to publish everything the website renders: React 19,
Vite, Tailwind CSS 4.

It talks to the API's JWT-protected `admin/*` routes. Sign in with a seeded
account (see the repository root README); the token is held in `localStorage`
and verified against `/auth/me` on every page load, so an expired session
returns to the login screen rather than failing silently.

## Running

From the repository root, which starts the API and website alongside it:

```bash
npm run dev
```

Or on its own, with the API already running:

```bash
npm run dev      # http://localhost:3001
```

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base, including the `/api/v1` prefix. Required in production. |

Declare any new `VITE_*` variable in `src/vite-env.d.ts`, and read it through
`src/lib/env.ts`, so a typo fails the build instead of surfacing as `undefined`
at runtime.

## Layout

```
src/
├── features/     one folder per screen (blogs, users, settings, …)
├── components/   shared UI (common, forms, layout, cards)
├── services/     API clients, generated from a shared CRUD factory
├── lib/          http client, crud factory, env, logger, image, sanitizer
└── types/
```

## Conventions

- **Adding a resource** means one entry in `src/services/resources.ts` plus a
  normalizer in `src/services/normalizers.ts` — not a hand-written client.
  `createCrudService` in `src/lib/crud.ts` generates the four operations.
- **Errors shown to users** go through `toErrorMessage`, which surfaces the
  API's message instead of `Request failed with status code 500`.
- **Logging** uses `logger` from `src/lib/logger.ts`, never bare `console.*`.
  Never log credentials, tokens, or raw request bodies.
- **Rich-text preview** must pass through `sanitizeHtml` before
  `dangerouslySetInnerHTML`; entity-decoding alone turns escaped markup back
  into executable HTML.

## Build

```bash
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
```
