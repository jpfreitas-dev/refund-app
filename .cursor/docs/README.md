# Cursor docs

Minimal project docs for agent context. Prefer **rules** (`.mdc`) for day-to-day coding; inject these only when needed.

## When to inject

| Doc | Inject when… | Skip when… |
| --- | --- | --- |
| [architecture.md](./architecture.md) | Reorganizing folders, extracting services, **creating an endpoint or page** and you want trees + layers | One-line bugfix, typo, pure CSS polish |
| [phase-2-prs.md](./phase-2-prs.md) | Running or reviewing **which PR is next**, commit list, branch name | Generic coding outside Phase 2 |

## Practical usage

- PRs #6–#7, #9–#10: always-apply + glob rules are usually enough
- **PR #8 (services):** `@.cursor/docs/architecture.md`
- Branch switch / “what’s the next commit?”: `@.cursor/docs/phase-2-prs.md`
- Do not inject both docs at once unless necessary (saves context)
---
