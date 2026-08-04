# Cursor docs

Minimal project docs for agent context. Prefer **rules** (`.mdc`) for day-to-day coding; inject these only when needed.

## When to inject

| Doc | Inject when… | Skip when… |
| --- | --- | --- |
| [architecture.md](./architecture.md) | Reorganizing folders, extracting services, **creating an endpoint or page** and you want trees + layers | One-line bug fix, typo, pure CSS polish |
| [new-features.md](./new-features.md) | Implementing the **PostgreSQL migration** (final feature) | Generic coding outside this migration |

## Practical usage

- Always-apply + glob rules are usually enough for small fixes
- Service / layer work: `@.cursor/docs/architecture.md`
- PostgreSQL migration (final feature): `@.cursor/docs/new-features.md`
- Do not inject multiple docs at once unless necessary (saves context)
---
