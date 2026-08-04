# Phase 2 — PR sequence (#5–#10)

Continues after **PR #4** (`feature/frontend-api-integration`). No Docker, tests suite, Postgres, S3, or new domain features.

## Order

| # | Branch | Goal |
| --- | --- | --- |
| **#5** | `chore/cursor-rules-and-docs` | Rules + these 3 docs |
| **#6** | `refactor/config-and-env` | JWT/PORT env, `VITE_API_URL`, `.env.example`, Vite React plugin |
| **#7** | `fix/security-hardening` | No role on signup; no password in JSON; authenticated uploads |
| **#8** | `refactor/backend-services-layer` | Extract services (users → sessions → refunds → uploads) |
| **#9** | `refactor/frontend-patterns` | Inline errors, Header/useAuth, interceptor 401 |
| **#10** | `docs/readme-and-build-scripts` | Root README + backend `build`/`start` |

```
PR #4 (done) → #5 → #6 → #7 → #8 → #9 → #10
```

## Commits per PR

### PR #5 — `chore/cursor-rules-and-docs`

```
chore(cursor): add project and git always-apply rules
chore(cursor): add backend and frontend file-scoped rules
docs(cursor): add architecture and phase-2 PR sequence docs
```

**PR title:** `chore: add Cursor rules and project docs`

### PR #6 — `refactor/config-and-env`

```
chore(config): load JWT secret and port from environment variables
chore(api): use VITE_API_URL for axios base URL
chore(config): add backend and frontend .env.example files
fix(frontend): register vite react plugin
```

### PR #7 — `fix/security-hardening`

```
fix(users): prevent self-assignment of manager role on signup
fix(refunds): exclude password from user payload in refund responses
fix(uploads): serve files only for authenticated users
fix(frontend): load receipt files with authorization header
```

### PR #8 — `refactor/backend-services-layer`

```
refactor(users): extract user registration logic into service
refactor(session): extract JWT session creation into service
refactor(refunds): extract refund CRUD and pagination into service
refactor(upload): extract upload persistence into service
refactor(backend): align controllers as thin HTTP adapters
```

### PR #9 — `refactor/frontend-patterns`

```
refactor(ui): replace alert error feedback with inline form messages
fix(header): read session user from auth context
refactor(auth): handle unauthorized responses with axios interceptor
refactor(auth): logout via context without full page reload
```

### PR #10 — `docs/readme-and-build-scripts`

```
chore(backend): add production build and start scripts
docs: rewrite root README for fullstack portfolio setup
```

## Out of scope (Phase 2)

Docker, Jest/Supertest, Postgres migration, S3, approve/reject flows, Clean Architecture, long prose inside `.mdc` rules.
---
