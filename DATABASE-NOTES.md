# Database state — read before deploying

## Summary

The Neon connection string that was shared with the team points at a database
whose `public` schema **does not match `redfortBackend/prisma/schema.prisma`**.
It was created by a different, older version of this backend.

To avoid destroying that data, this codebase now writes to a **separate Postgres
schema** in the same database:

```
DATABASE_URL="postgresql://…/neondb?sslmode=require&channel_binding=require&schema=redfort_app"
                                                                            ^^^^^^^^^^^^^^^^^^
```

| Schema         | Owner                              | Status                                   |
|----------------|------------------------------------|------------------------------------------|
| `public`       | an older/different backend build   | Untouched. Left exactly as found.        |
| `redfort_app`  | this codebase                      | Created, migrated, and seeded. In use.   |

A full JSON backup of `public` was taken before any work:
[`backups/neon-public-schema-backup.json`](backups/neon-public-schema-backup.json).

## Why they are incompatible

The two schemas disagree on naming and on which tables exist at all.

**Column naming** — `public` uses snake_case, this codebase uses camelCase:

| `public` (old)  | `schema.prisma` (this codebase) |
|-----------------|---------------------------------|
| `created_at`    | `createdAt`                     |
| `display_order` | `displayOrder`                  |
| `is_active`     | `status` (enum `Active`/`Inactive`) |
| `full_name`     | `name`                          |
| `target_page`   | `page`                          |

**Tables only in `public`** (no model exists for them here):
`about_cards`, `about_pages`, `faq_pages`, `industries_pages`, `resources`,
`resources_pages`, `services_pages`, `trusted_companies`.

**Tables only in this codebase:** `blogs`, `team_members`, `settings`.

Prisma's own diff confirms the gap: pointing this codebase's migrations at
`public` would emit **61 `DROP` statements**. That is why it was not done.

## What was in `public`

Almost entirely test data, which is the main reason this was judged safe to
leave aside rather than migrate:

| Table          | Rows | Content                                              |
|----------------|------|------------------------------------------------------|
| `services`     | 1    | titled `"ai"`                                         |
| `industries`   | 1    | titled `"ai"`                                         |
| `testimonials` | 1    | `"Haroon"`                                            |
| `case_studies` | 3    | `"ai and pibi"`, `"Ai"`, one real-looking entry       |
| `faqs`         | 4    | 2 real questions, one answered `"ok done"`            |
| `contacts`     | 7    | form submissions, mostly from `Abdul Basit` / `hashim`|
| `users`        | 2    | two `Admin` accounts                                  |

The one asset worth a second look is the 7 contact submissions. They are
preserved in the backup file and can be imported into
`redfort_app.contacts` — the mapping is `full_name -> name`,
`phone -> phoneNumber`, `created_at -> createdAt`.

## Choosing a different path

**Keep the split (current state).** Nothing further to do. `public` stays as a
frozen copy of the old build.

**Give this codebase the whole database.** Only once you are certain `public`
is disposable:

```bash
# destructive — drops every table in `public`
psql "$DATABASE_URL" -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
# then drop `&schema=redfort_app` from DATABASE_URL and re-run:
npm run db:migrate && npm run db:seed && npm run db:seed:content
```

**Use a clean database instead.** Create a new Neon database, drop the
`&schema=` parameter, and run `npm run setup`. This is the cleanest option for
production.

## Credentials

The `DATABASE_URL`, `JWT_SECRET`, and Cloudinary keys currently in
`redfortBackend/.env` arrived over a WhatsApp message, so they should be
treated as public. **Rotate all three before this goes live**, and keep the
real values out of chat and out of git — `.env` is gitignored; `.env.example`
holds placeholders only.
