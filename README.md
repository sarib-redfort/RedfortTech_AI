# RedFort Tech — Platform

The complete RedFort Tech product in one repository: the public marketing
website, the CMS admin panel, and the API that powers both.

| Project           | What it is                    | Stack                              | Dev URL                 |
|-------------------|-------------------------------|------------------------------------|-------------------------|
| `redfortwebsit/`  | Public marketing website      | React 19 + Vite + Tailwind 4       | http://localhost:3000   |
| `cms/`            | Admin panel (content editing) | React 19 + Vite + Tailwind 4       | http://localhost:3001   |
| `redfortBackend/` | REST API                      | NestJS 11 + Prisma 6 + PostgreSQL  | http://localhost:5000   |

The website reads published content from the API's `public/*` routes. The CMS
writes that content through the JWT-protected `admin/*` routes. Both talk to the
same Neon PostgreSQL database through the backend.

```
  redfortwebsit (3000) ──GET /api/v1/public/*──┐
                                               ├──> redfortBackend (5000) ──> Neon PostgreSQL
  cms (3001) ──────────►/api/v1/admin/* + JWT──┘                        └──> Cloudinary (images)
```

## Quick start

```bash
npm install          # root tooling (concurrently)
npm run setup        # installs all 3 projects, generates the Prisma client,
                     # migrates the DB, seeds users, seeds website content
npm run dev          # runs all 3 projects together
```

Then open **http://localhost:3000** for the website and
**http://localhost:3001** for the CMS.

> **Ports must be free.** The three servers bind 3000, 3001 and 5000. If
> something else already holds one, that server silently loses the port (on
> Windows two processes can bind the same port and the first one wins every
> request). Check with
> `Get-NetTCPConnection -LocalPort 3000,3001,5000 -State Listen`.
> To move the API: set `PORT` in `redfortBackend/.env`, `API_PORT` in
> `redfortwebsit/.env`, and `VITE_API_URL` in `cms/.env`.

`npm run dev` starts the API, website, and CMS in one terminal with colour-coded,
prefixed output (`api`, `web`, `cms`).

### Log in to the CMS

Open http://localhost:3001 and sign in with the seeded admin account:

- **Email:** `admin@redforai.com`
- **Password:** `admin123`

A second seeded account, `writer@redforai.com` / `writer123`, has the
ContentWriter role.

> Change both passwords before this is exposed to anything but localhost.

### Content

`npm run setup` also loads the site's marketing content into the CMS
(4 services, 12 industries, 8 case studies, 12 blog posts, 8 testimonials,
5 team members, 7 FAQs, plus the homepage/about/settings records). It is
sourced from `redfortwebsit/src/data/*` via
`redfortBackend/prisma/seed-data.json`.

Re-run it any time with `npm run db:seed:content` — it matches records on
slug/title/name and updates in place, so it never creates duplicates.

The dynamic sections of the website render **only** from the API; they do not
fall back to bundled data. An empty database means an empty homepage, which is
why this seed exists.

> ### ⚠ Database and credentials
> The shared Neon database contains an **older, incompatible schema**, so this
> codebase writes to a separate `redfort_app` Postgres schema and leaves the
> existing `public` schema untouched. The shared credentials also arrived over
> chat and need rotating.
> **Read [DATABASE-NOTES.md](DATABASE-NOTES.md) before deploying.**

## Configuration

Each project keeps its own `.env`, and each has a committed `.env.example`
showing the required keys.

**`redfortBackend/.env`** — the only file holding secrets:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Signing key and lifetime for auth tokens |
| `PORT` | API port (default `5000`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist — must include both frontend origins |
| `CLOUDINARY_*` | Image upload credentials |

**`cms/.env`**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | API base — `http://localhost:5000/api/v1` |
| `VITE_USE_BACKEND` | `"true"` serves hardcoded demo data instead of calling the API. Keep it `"false"`. |

**`redfortwebsit/.env`** — intentionally empty in development. With `VITE_API_URL`
unset, the site calls the relative path `/api/v1/public`, which the Vite dev
server proxies to the backend (see `redfortwebsit/vite.config.ts`). That keeps
the website same-origin in dev, so it never depends on CORS. Set `VITE_API_URL`
to the deployed API for a production build.

## Common commands

| Command | Effect |
|---|---|
| `npm run dev` | Run API + website + CMS together |
| `npm run dev:api` / `dev:web` / `dev:cms` | Run just one of them |
| `npm run build` | Production build of all three |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Re-seed the default users |
| `npm run db:seed:content` | Re-seed the website content |
| `npm run lint` | Type-check both frontends |

API docs (Swagger) are served at http://localhost:5000/api/docs while the
backend is running.

## Repository layout

This repo is the combination of three previously separate repositories:
`redfortwebsit`, `cms`, and `redfortBackend`. Each keeps its own
`package.json` and `node_modules`; the root `package.json` only orchestrates
them, so each project can still be deployed independently.
