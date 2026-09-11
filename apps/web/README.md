# RedFort Tech — Website

The public marketing website: React 19, Vite, Tailwind CSS 4, React Router.

Content (services, industries, case studies, blog posts, testimonials, team,
FAQs) is published from the CMS and read at runtime from the API's
`public/*` routes. The pages render only from that data — there is no bundled
fallback content — so the database must be seeded for the site to look complete.

## Running

From the repository root, which starts the API and CMS alongside it:

```bash
npm run dev
```

Or on its own, with the API already running:

```bash
npm run dev      # http://localhost:3000
```

## Configuration

`.env` is intentionally empty in development. With `VITE_API_URL` unset the
site calls the relative path `/api/v1/public`, which the Vite dev server
proxies to the API (see `vite.config.ts`), keeping it same-origin and free of
CORS concerns.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Absolute API base. Set this when the site and API are on different origins in production. |
| `API_PORT` / `API_ORIGIN` | Retarget the dev proxy when the API is not on port 5000. |

Declare any new `VITE_*` variable in `src/vite-env.d.ts`, and read it through
`src/lib/env.ts`, so a typo fails the build instead of surfacing as `undefined`
at runtime.

## Layout

```
src/
├── pages/        one per route, lazy-loaded
├── components/
│   ├── layout/   navbar, footer, preloader, page banner
│   ├── sections/ page sections, mostly API-driven
│   ├── ui/       reusable primitives
│   └── forms/    contact form
├── hooks/        animation and scroll behaviour
├── lib/          api client, env, logger, html sanitizer
└── data/         static company copy that is not CMS-managed
```

## Conventions

- Use `logger` from `src/lib/logger.ts`, never bare `console.*`. Debug output
  is stripped from production builds.
- Any CMS-authored HTML must pass through `sanitizeHtml` from
  `src/lib/sanitize.ts` before `dangerouslySetInnerHTML`.
- Icons resolve through the explicit registry in
  `components/ui/LucideIcon.tsx`. Add an icon there before referencing it from
  CMS content — a wildcard import would pull the whole icon set into the bundle.

## Build

```bash
npm run build      # production build to dist/
npm run typecheck  # tsc --noEmit
```
