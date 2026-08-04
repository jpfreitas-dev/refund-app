# Final feature — PostgreSQL via Prisma

Root README stays deferred until the project is feature-complete. This is the **last planned infrastructure change** before that milestone. No new domain features (approve/reject, etc.), no S3, no production Docker images.

## Completed

- Multi-method domain service convention (flat `controllers/`, `services/`, `routes/`)
- Development Docker Compose stack (backend + frontend + postgres)
- API tests: Vitest + Supertest (`test:api`) against PostgreSQL (`refund_test`)
- E2E tests: Playwright (`test:e2e`)
- PostgreSQL 16 via Prisma (`@prisma/adapter-pg` + `pg`)

Service convention details remain in [architecture.md](./architecture.md).

## Goal

~~Migrate the Prisma datasource from **SQLite** to **PostgreSQL 16**~~ **Done.** PostgreSQL runs as a Compose service; dev, Docker, and API tests share the same engine (separate `refund_test` database for tests).

```
postgres (Compose) ← backend (Compose / local)
                  ← Vitest test:api (refund_test)
frontend → backend
```

## Out of scope

- Domain features (approve/reject, extra statuses, filters beyond current behavior)
- S3 / object storage
- Production Docker images or hardened deploy narrative
- Polished root README (post–feature-complete)
- Heavy CI pipelines
- Domain folder packing (`modules/refunds/`, one-file-per-use-case with single `execute()`)

## Implementation

| Item | Detail |
| ---- | ------ |
| Branch | `chore/postgres-prisma` |
| PR title | `chore: migrate Prisma from SQLite to PostgreSQL` |

### Commits (suggested order)

```
chore(prisma): switch datasource to postgresql and regenerate migrations
chore(docker): add postgres service to development compose stack
chore(config): align DATABASE_URL in env examples and compose
refactor(prisma): drop better-sqlite3 adapter and native build deps
test(api): point Vitest setup at postgres test database
```

### Files to change

| File | Change |
| ---- | ------ |
| `apps/backend/prisma/schema.prisma` | `provider = "postgresql"` |
| `apps/backend/src/lib/prisma.ts` | Remove `PrismaBetterSqlite3` adapter; use `PrismaPg` with `pg` |
| `docker-compose.yml` | Add `postgres` service; wire `DATABASE_URL` on backend |
| `.env.example`, `apps/backend/.env.example` | PostgreSQL connection strings |
| `apps/backend/package.json` | Remove `better-sqlite3` deps; add `@prisma/adapter-pg` and `pg` |
| `apps/backend/prisma/migrations/` | Regenerate baseline (SQLite migrations are not portable) |
| `apps/backend/src/tests/setup.ts` | Target `refund_test` DB; `migrate deploy` in `beforeAll`; drop `test.db` file logic |
| `apps/backend/Dockerfile.dev` | Remove `python3` / `make` / `g++` (were for `better-sqlite3`); update default `DATABASE_URL` |

**Follow-up after merge:** update `project-core.mdc` — done in the same PR as this migration.

### Compose — `postgres` service

- Image: `postgres:16-alpine`
- Env: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB=refund`
- Volume: `postgres_data`
- Port: `5432` (exposed for local dev outside Docker)
- Healthcheck: `pg_isready`
- Backend: `depends_on: postgres` with `condition: service_healthy`

### Connection URLs

| Environment | Example |
| ----------- | ------- |
| Docker backend | `postgresql://refund:refund@postgres:5432/refund` |
| Local dev (host) | `postgresql://refund:refund@localhost:5432/refund` |
| API tests | `postgresql://refund:refund@localhost:5432/refund_test` |

Create `refund_test` once (e.g. `CREATE DATABASE refund_test;` or init script in Compose).

### Migrations

SQLite migrations under `apps/backend/prisma/migrations/` cannot be reused. Reset and create a fresh PostgreSQL baseline (`prisma migrate dev` or squash). `docker-entrypoint.dev.sh` keeps running `prisma migrate deploy` on startup.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run docker:up` | Start postgres + backend + frontend; migrations on backend entrypoint |
| `npm run docker:down` | Stop the dev stack |
| `npm run test:api` | Run backend API tests (requires Postgres; uses `refund_test`) |
| `npm run test:e2e` | Run Playwright E2E (backend `webServer` also needs Postgres) |

## Tests

From the repo root:

```bash
# Start Postgres first (full stack or postgres service only)
npm run docker:up

npm run test:api
npm run test:e2e
```

- **API:** Vitest + Supertest against Express `app`; `setup.ts` sets test `DATABASE_URL`, runs `migrate deploy` in `beforeAll`, truncates via `deleteMany` in `afterEach`
- **E2E:** Playwright; starts backend + frontend via `webServer` when not already running (`reuseExistingServer` in dev)

First-time E2E setup (Chromium browser):

```bash
npx playwright install chromium --workspace refund-web
```

Or from `apps/frontend`: `npx playwright install chromium`

## Docker (dev)

From the repo root:

```bash
npm run docker:up
```

- API: http://localhost:3333
- Web: http://localhost:5173
- Postgres: `localhost:5432`
- Optional overrides: copy root `.env.example` to `.env`
- Stop: `npm run docker:down`
