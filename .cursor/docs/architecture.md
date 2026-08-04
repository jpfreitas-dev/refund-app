# Architecture

Target layout for the Refund monorepo (Phase 2 ends with a thin service layer; no Clean Architecture / modules packing).

## Backend (`apps/backend/src`)

```
src/
  config/        # auth, upload, other static config
  lib/           # prisma client
  middlewares/   # auth, authorization, error handling
  routes/        # Express routers
  controllers/   # Zod + HTTP adapters
  services/      # business rules + Prisma (introduced in PR #8)
  utils/         # AppError, disk storage helpers
  types/         # Express ambient types
  app.ts
  server.ts
```

### Layer responsibilities (one line each)

| Layer | Responsibility |
| --- | --- |
| **routes** | Wire path + middleware + controller method |
| **controllers** | Parse/validate input (Zod), set status/JSON, call service |
| **services** | Domain rules, Prisma, filesystem decisions that are not pure HTTP |
| **middlewares** | Cross-cutting auth, roles, errors |
| **config / lib / utils** | Shared config, client singleton, helpers |

### Thin controller vs service (sketch)

```ts
// controller — HTTP only
async create(req: Request, res: Response) {
  const body = schema.parse(req.body)
  const user = await usersService.create(body)
  return res.status(201).json(user)
}

// service — rules + Prisma
async create(input: CreateUserInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } })
  if (exists) throw new AppError("Email already in use", 409)
  const password = await hash(input.password, 8)
  return prisma.user.create({
    data: { ...input, password, role: "employee" },
    select: { id: true, name: true, email: true, role: true },
  })
}
```

Flow: **routes → controllers → services → Prisma**.

## Frontend (`apps/frontend/src`)

```
src/
  pages/         # route-level screens
  components/    # reusable UI
  context/       # Auth context + provider
  hooks/         # useAuth and shared hooks
  routes/        # public / employee / manager route trees
  services/      # Axios client
  dtos/          # shared front types
  utils/         # formatters, class merge, categories
  App.tsx
  main.tsx
```

### Layer responsibilities

| Area | Responsibility |
| --- | --- |
| **pages** | Screen state, forms, call API |
| **components** | Presentational / shared controls |
| **context + hooks** | Session and auth API for the tree |
| **routes** | Role-based navigation shells |
| **services** | HTTP config and interceptors |

No nested “feature modules” required; keep folds flat and consistent with the existing tree.
---
