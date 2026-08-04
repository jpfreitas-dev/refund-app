# Phase 3 — Portfolio foundation (#11–#13)

Root README is deferred until the project is feature-complete. No new domain features (approve/reject, etc.), no Postgres/S3, no production Docker images.

## Goals

- Crystalize backend **service naming and multi-method domain services** (flat folders)
- **Docker Compose for development** so recruiters can clone and run locally
- **API tests (Supertest)** + **E2E (Playwright)** with npm scripts
- Few, denser PRs rather than micro-splits

## Out of scope

- Polished root README and production `build`/`start` narrative (post–Phase 3)
- Domain features (approve/reject, extra statuses, filters beyond current behavior)
- Postgres, S3, heavy CI pipelines
- Domain folder packing (`modules/refunds/`, one-file-per-use-case with single `execute()`)

## Service convention (official)

**One service class per domain**, multiple public methods.

| Piece   | Convention                    | Example                                              |
| ------- | ----------------------------- | ---------------------------------------------------- |
| File    | `kebab-case` + `-service.ts`  | `refunds-service.ts`                                 |
| Class   | PascalCase domain + `Service` | `RefundsService`                                     |
| Methods | Operation verbs               | `create`, `index`, `show`                            |
| Export  | Singleton instance            | `export const refundsService = new RefundsService()` |

- Controllers stay thin (Zod + HTTP); services hold rules + Prisma; no `req`/`res` in services
- Do **not** split into `CreateRefundService` / `execute()` per operation — unnecessary file sprawl at this app size
- Do **not** migrate to `modules/<domain>/`; keep flat `controllers/`, `services/`, `routes/`

## Order

| #       | Branch                        | Goal                                                |
| ------- | ----------------------------- | --------------------------------------------------- |
| **#11** | `docs/implement-new-features` | This doc + Cursor docs/rules alignment              |
| **#12** | `chore/docker-dev`            | Dev Compose + Dockerfiles + scripts for local stack |
| **#13** | `test/api-and-e2e`            | Supertest API suite + Playwright E2E + npm scripts  |

```
#11 → #12 → #13
```

## Commits per PR

### PR #11 — `docs/implement-new-features`

```
docs(cursor): add phase-3 portfolio foundation PR sequence
docs(cursor): document multi-method domain service convention
chore(cursor): allow Docker and test suites in phase-3 scope
docs(cursor): defer root README until post phase-3
```

**PR title:** `docs: add Phase 3 portfolio foundation plan`

### PR #12 — `chore/docker-dev`

```
chore(docker): add development Dockerfiles for backend and frontend
chore(docker): add Compose stack for local recruiter setup
chore(config): align env examples with Compose services
chore(scripts): add compose up helpers at repo root
```

**PR title:** `chore: add development Docker Compose stack`

Notes for implementation:

- Dev-only images (hot reload / volume mounts as practical); not production hardening
- Backend + frontend services; persist SQLite DB and uploads via volumes when useful
- One-command path: `docker compose up` (document command in this phase doc / scripts; full README later)

### PR #13 — `test/api-and-e2e`

```
test(api): add Supertest suite for auth sessions users refunds uploads
test(e2e): add Playwright flows for login and refund creation
chore(scripts): add test:api and test:e2e npm scripts
```

**PR title:** `test: add API and E2E suites`

Notes for implementation:

- API: hit Express `app` (or equivalent) with Supertest; cover happy paths + key auth/validation failures; fixtures minimal
- E2E: Playwright for critical UI paths (login, create refund; manager view if already in product)
- Do not chase 100% coverage; prefer readable smoke + regression value
- Stack choice: Vitest or Jest for API runner — pick one and keep consistent with the backend toolchain

## Scripts (target)

| Script                                  | Purpose                             |
| --------------------------------------- | ----------------------------------- |
| `docker compose up` (or root npm alias) | Start dev stack for recruiters      |
| `test:api`                              | Run backend API / integration tests |
| `test:e2e`                              | Run Playwright E2E                  |

Exact package.json placement (root vs `apps/*`) decided in #12/#13; keep discoverable from the repo root when practical.

## Tests

From the repo root:

```bash
npm run test:api
npm run test:e2e
```

- **API:** Vitest + Supertest against Express `app`; uses isolated `prisma/test.db` (no Docker required)
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
- Optional overrides: copy root `.env.example` to `.env`
- Stop: `npm run docker:down`
