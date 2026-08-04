# Cursor docs

Minimal project docs for agent context. Prefer **rules** (`.mdc`) for day-to-day coding; inject these only when needed.

## When to inject

| Doc | Inject when… | Skip when… |
| --- | --- | --- |
| [architecture.md](./architecture.md) | Reorganizing folders, extracting services, **creating an endpoint or page** and you want trees + layers | One-line bug fix, typo, pure CSS polish |
| [new-features.md](./new-features.md) | Running or reviewing **Phase 3** (#11–#13): Docker DX, tests, service convention | Generic coding outside Phase 3 |

## Practical usage

- Always-apply + glob rules are usually enough for small fixes
- Service / layer work: `@.cursor/docs/architecture.md`
- Phase 3 (Docker, API/E2E tests, portfolio foundation): `@.cursor/docs/new-features.md`
- Do not inject multiple docs at once unless necessary (saves context)
---
