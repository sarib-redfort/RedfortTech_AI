# Deploying to Render

This deploys all three apps from this repository using the Blueprint in
[`render.yaml`](../render.yaml):

| Service | What it is | Render type | Plan |
|---|---|---|---|
| `redforttech-api` | NestJS API | Web Service | Free (see [Staying awake](#staying-awake)) |
| `redforttech-web` | Public website | Static Site | Free |
| `redforttech-cms` | Admin panel | Static Site | Free |

The database is **not** on Render. It stays on Neon: Render's free Postgres is
deleted 30 days after it is created.

---

## 1. Before you start

You need:

- A Render account, with GitHub connected to it (Render → Account Settings →
  GitHub).
- The Neon connection string for the database.
- The Cloudinary cloud name, API key and API secret, for image uploads.

> **Rotate the shared credentials first.** The Neon password and Cloudinary
> secret were shared in plain text during development. Generate new ones in the
> Neon and Cloudinary dashboards and use those below. `JWT_SECRET` needs no
> action — Render generates a fresh one.

## 2. Create the Blueprint

1. In Render, choose **New → Blueprint**.
2. Select this repository. Render finds `render.yaml` and lists the three
   services.
3. Render prompts for the values marked `sync: false`:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | The Neon connection string, with two parameters appended — see below |
   | `CLOUDINARY_CLOUD_NAME` | From the Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | From the Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard |

   The `DATABASE_URL` must end with both parameters:

   ```
   postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require&schema=redfort_app&connect_timeout=30
   ```

   - `schema=redfort_app` — this codebase's tables live in their own schema.
     Without it the API reads the older, incompatible `public` schema and every
     request fails. See [DATABASE.md](DATABASE.md).
   - `connect_timeout=30` — Neon sleeps when idle and can take several seconds
     to wake. Prisma's default 5-second timeout makes the API fail to start.

4. Choose **Apply**. The first deploy takes several minutes; the API builds
   longest.

## 3. Check the URLs Render assigned

Render names each URL after its service: `https://redforttech-api.onrender.com`
and so on. **If a name was already taken, Render adds a suffix** such as
`redforttech-api-x7k2.onrender.com`, and the services will not be able to reach
each other until you update the URLs.

The URLs appear in four places in `render.yaml`, each marked `URL`:

1. The API's `ALLOWED_ORIGINS` — both frontend URLs
2. The API's `SITE_URL` — the website URL
3. `redforttech-web`'s `buildCommand` and its `/sitemap.xml` rewrite — the API URL
4. `redforttech-cms`'s `buildCommand` — the API URL

Edit them, commit, and push; Render redeploys automatically.

The frontends cannot discover the API's URL on their own: Render's service
references resolve to a private-network hostname that browsers cannot reach.

## 4. Create the CMS accounts

The seeded CMS passwords are not in this repository, because it is public. If
the database already has accounts, sign in with the passwords you were given.

To create or reset them, run the seed with passwords of your choosing, using
the same `DATABASE_URL` as the API. From `apps/api`:

```bash
DATABASE_URL='postgresql://...&schema=redfort_app&connect_timeout=30' \
SEED_ADMIN_PASSWORD='a-strong-password' \
SEED_WRITER_PASSWORD='another-strong-one' \
npm run prisma:seed
```

Passwords must be 12–72 characters. Re-running rotates them. After signing in,
each user can change their own password under **Settings**.

If the database is empty, also load the site content:

```bash
DATABASE_URL='...' npm run prisma:seed:content
```

## 5. Verify the deploy

| Check | Expected |
|---|---|
| `https://<api>/api/v1/health` | `{"success":true,...,"data":{"status":"ok"...}}` |
| `https://<api>/api/v1/ready` | `"status":"ready"` — the API can reach the database |
| `https://<web>/` | The homepage, with hero text, services and testimonials filled in |
| `https://<web>/industries` | All 12 industries, including Healthcare and FinTech |
| `https://<web>/about` (open directly) | The About page, not a 404 — confirms client-side routing |
| `https://<web>/sitemap.xml` | XML listing every page |
| `https://<cms>/` | The login screen; signing in reaches the dashboard |

If the website loads but its sections are empty, the website cannot reach the
API — check the URLs in step 3 and the API's logs.

## Staying awake

Free web services sleep after 15 minutes without traffic and take about a minute
to wake. The website loads all its content from the API, so the first visitor
after a quiet spell sees an empty page for that minute.

Before a client demo, either:

- **Open the site a few minutes beforehand**, so the API is already awake, or
- **Use an uptime monitor** such as UptimeRobot (free) to request
  `https://<api>/api/v1/health` every 5 minutes. This keeps the API awake and
  alerts you if it goes down. Use `/health`, not `/ready`: `/health` does not
  touch the database, so it will not use up Neon's free compute hours.

Do not ping more often than every few minutes. The API only needs one request
per 15 minutes to stay awake, and Render may suspend free services that generate
unusually high traffic.

Render's own documentation says free services are not for production. For
anything beyond a demo, move the API to a paid instance; that also enables
`preDeployCommand`, which is the better place for migrations than the start
command.

## How the pieces talk

```
Browser ──> redforttech-web (static)
              ├─ /*            app shell (client-side routing)
              ├─ /sitemap.xml  → rewritten to the API
              └─ fetch ───────┐
                              ▼
Browser ──> redforttech-cms ─> redforttech-api ──> Neon (schema redfort_app)
                                    └────────────> Cloudinary (images)
```

- The website and CMS call the API directly. The API admits them through
  `ALLOWED_ORIGINS`; requests from any other origin get no CORS headers and are
  blocked by the browser.
- `TRUST_PROXY=1` makes rate limiting see each visitor's real IP. Without it,
  every request appears to come from Render's load balancer, and five failed
  logins anywhere would lock out everyone.

## Troubleshooting

**The API fails to start with `P1001: Can't reach database server`.**
`DATABASE_URL` is missing `connect_timeout=30`, or the Neon password is wrong.

**The API starts but requests fail, and logs mention a missing table or column.**
`DATABASE_URL` is missing `schema=redfort_app`, so the API is reading the old
`public` schema.

**The API fails to start with a `JWT_SECRET` error.**
The API refuses to start without a secret of at least 32 characters. Render
generates one; if you set it by hand, make it longer.

**The website loads but sections are empty.**
The website cannot reach the API. Check that the URL in `redforttech-web`'s
`buildCommand` matches the API's real URL, and that the API is running.

**The CMS says "Cannot reach the API" or the browser console shows a CORS error.**
The CMS's URL is missing from the API's `ALLOWED_ORIGINS`, or the API URL in the
CMS's `buildCommand` is wrong.

**The build fails with `nest: not found` or `vite: not found`.**
A build command lost `--include=dev`. `NODE_ENV=production` makes npm skip
devDependencies, which is where the build tools live.

**Logins fail for everyone after a few attempts.**
`TRUST_PROXY` is not set on the API.
