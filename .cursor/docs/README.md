# Cursor docs

Agent context only. Prefer **rules** (`.mdc`) for day-to-day coding; inject this folder when you need layout or layer detail.

## When to inject

| Doc | Inject when… | Skip when… |
| --- | --- | --- |
| [architecture.md](./architecture.md) | Reorganizing folders, extracting services, creating an endpoint or page and you want trees + layers | One-line bug fix, typo, pure CSS polish |

## Practical usage

- Always-apply + glob rules are usually enough for small fixes
- Service / layer work: `@.cursor/docs/architecture.md`
- Human-facing project docs live in the root [README.md](../../README.md)
---
