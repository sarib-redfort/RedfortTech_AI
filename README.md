# RedFort Tech — Platform

The complete RedFort Tech product in one repository: the public marketing
website, the CMS admin panel, and the API that powers both.

| App         | What it is                    | Stack                             | Dev URL               |
|-------------|-------------------------------|-----------------------------------|-----------------------|
| `apps/web`  | Public marketing website      | React 19 + Vite + Tailwind 4      | http://localhost:3000 |
| `apps/cms`  | Admin panel (content editing) | React 19 + Vite + Tailwind 4      | http://localhost:3001 |
| `apps/api`  | REST API                      | NestJS 11 + Prisma 6 + PostgreSQL | http://localhost:5000 |

The website reads published content from the API's `public/*` routes. The CMS
writes that content through the JWT-protected `admin/*` routes. Both talk to
the same PostgreSQL database through the API.

```
  apps/web (3000) ──GET /api/v1/public/*───┐
                                           ├──> apps/api (5000) ──> PostgreSQL (Neon)
  apps/cms (3001) ──/api/v1/admin/* + JWT──┘                   └──> Cloudinary (images)
```

## Quick start

```bash
npm install          # root tooling (concurrently)
npm run setup        # installs all 3 apps, generates the Prisma client,
                     # migrates the DB, and seeds website content
npm run dev          # runs all 3 apps together
```

Then open **http://localhost:3000** for the website and
**http://localhost:3001** for the CMS.

Then create the admin and content-writer accounts. This is a separate step
because their passwords are taken from the environment — never from the code,
since this repository is public:

```bash
SEED_ADMIN_PASSWORD='choose-a-strong-one' SEED_WRITER_PASSWORD='and-another-one' npm run db:seed
```

Sign in to the CMS as `admin@redforai.com` with the password you chose.
Re-running the seed with new values rotates both passwords. Passwords must be
12–72 characters.

> **Ports must be free.** The three servers bind 3000, 3001 and 5000, and the
> dev servers use `--strictPort` so a clash fails loudly instead of silently
> moving to another port. Check with
> `Get-NetTCPConnection -LocalPort 3000,3001,5000 -State Listen`.
> To move the API: set `PORT` in `apps/api/.env`, `API_PORT` in
> `apps/web/.env`, and `VITE_API_URL` in `apps/cms/.env`.

## Repository layout

```
├── apps/
│   ├── api/                 NestJS REST API
│   │   ├── prisma/          schema, migrations, seeds
│   │   ├── src/
│   │   │   ├── <resource>/  one module per resource (controller/service/dto)
│   │   │   ├── auth/        JWT strategy, guards, decorators
│   │   │   ├── common/      shared filters, interceptors, pipes, utils
│   │   │   ├── health/      liveness and readiness probes
│   │   │   └── prisma/      Prisma module and service
│   │   └── uploads/         legacy on-disk images (new uploads go to Cloudinary)
│   ├── cms/                 admin panel
│   │   └── src/
│   │       ├── features/    one folder per screen (blogs, users, settings, …)
│   │       ├── components/  shared UI (common, forms, layout, cards)
│   │       ├── services/    API clients, built from a shared CRUD factory
│   │       ├── lib/         http client, crud factory, env, logger, image
│   │       └── types/
│   └── web/                 public website
│       └── src/
│           ├── pages/       one per route, lazy-loaded
│           ├── components/  layout / sections / ui / forms
│           ├── hooks/       animation and scroll hooks
│           ├── lib/         api client, env, logger
│           └── data/        static company copy (not CMS-managed)
├── docs/
│   ├── DATABASE.md          database state and migration notes
│   └── DEPLOYMENT.md        deploying to Render, step by step
├── render.yaml              Render Blueprint for all three apps
└── package.json             orchestrates all three apps
```

Each app keeps its own `package.json` and `node_modules`; the root
`package.json` only orchestrates them, so each can be deployed independently.

## Configuration

Each app keeps its own `.env`, and each has a committed `.env.example`.

**`apps/api/.env`** — the only file holding secrets:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Signing key and lifetime for auth tokens |
| `PORT` | API port (default `5000`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist — must include both frontend origins |
| `CLOUDINARY_*` | Image upload credentials |

**`apps/cms/.env`**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base — `http://localhost:5000/api/v1` |

**`apps/web/.env`** — intentionally empty in development. With `VITE_API_URL`
unset the site calls the relative path `/api/v1/public`, which the Vite dev
server proxies to the API, so it is same-origin in dev and never depends on
CORS. Set `VITE_API_URL` to the deployed API when the website and API are on
different origins in production. `API_PORT` / `API_ORIGIN` retarget the dev
proxy if port 5000 is taken.

Environment variables are read through `src/lib/env.ts` in both frontends,
which validates them at startup rather than letting a missing value surface
later as a request to `undefined/...`. Declare any new `VITE_*` variable in
`src/vite-env.d.ts` so a typo is a compile error.

## Content

`npm run setup` loads the site's marketing content into the CMS (4 services,
12 industries, 8 case studies, 12 blog posts, 8 testimonials, 5 team members,
7 FAQs, plus the homepage/about/settings records) from
`apps/api/prisma/seed-data.json`.

Re-run it any time with `npm run db:seed:content` — records are matched on
slug/title/name and updated in place, so it never creates duplicates.

The website's dynamic sections render **only** from the API and do not fall
back to bundled data. An empty database means an empty homepage, which is why
this seed exists.

> ### ⚠ Database and credentials
> The shared Neon database contains an **older, incompatible schema**, so this
> codebase writes to a separate `redfort_app` Postgres schema and leaves the
> existing `public` schema untouched. The shared credentials also arrived over
> chat and need rotating.
> **Read [docs/DATABASE.md](docs/DATABASE.md) before deploying.**

## Deployment

The repository deploys to Render from [`render.yaml`](render.yaml): the API as a
web service, the website and CMS as static sites, with the database on Neon.
Follow **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the setup, the secrets
to enter, and how to verify the result.

## Commands

| Command | Effect |
|---|---|
| `npm run dev` | Run API + website + CMS together |
| `npm run dev:api` / `dev:web` / `dev:cms` | Run just one |
| `npm run build` | Production build of all three |
| `npm run typecheck` | Type-check both frontends |
| `npm run lint` | Lint/type-check all three |
| `npm test` | API unit tests |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Create or rotate the CMS accounts (needs `SEED_*_PASSWORD`) |
| `npm run db:seed:content` | Re-seed the website content |
| `npm run db:studio` | Open Prisma Studio |

## API

Swagger UI is served at http://localhost:5000/api/docs in development. It is
hidden when `NODE_ENV=production`, since it enumerates every endpoint; set
`ENABLE_SWAGGER=true` to expose it there deliberately.

All responses are wrapped by a global interceptor:

```json
{ "success": true, "message": "...", "data": ... }
```

List endpoints also return `meta` — `{ total, page, limit, totalPages }` — and
accept `?page=` and `?limit=` (at most 100). Clients must walk the pages; the
default page holds only 10 records.

Health endpoints for load balancers and orchestrators:

| Route | Purpose |
|---|---|
| `GET /api/v1/health` | Liveness — process is up. Does not touch the database. |
| `GET /api/v1/ready` | Readiness — verifies the database is reachable. |

## Conventions

- **Logging.** Use `logger` from `src/lib/logger.ts` in the frontends, never
  bare `console.*`. `debug`/`info`/`warn` are stripped from production builds;
  `error` is kept. Never log credentials, tokens, or raw request bodies.
- **CMS API clients.** Resources are generated by `createCrudService` in
  `src/lib/crud.ts`. Adding a resource means one entry in
  `src/services/resources.ts` plus a normalizer, not a new hand-written client.
- **Icons.** `apps/web` resolves icon names through an explicit registry in
  `components/ui/LucideIcon.tsx`. Add an icon there before referencing it from
  CMS content — a wildcard import would pull the whole 850 kB icon set into the
  bundle.
- **List endpoints.** Use `resolvePagination` / `searchFilter` / `paginated`
  from `apps/api/src/common/utils/pagination.util.ts` rather than re-deriving
  `skip`/`take`/`meta`.
