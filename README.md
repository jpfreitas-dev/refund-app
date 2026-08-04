# Refund App

Monorepo full-stack para solicitação e gestão de reembolsos: colaboradores criam pedidos com comprovante; gestores consultam a lista.

Foco de portfólio em API Express + Prisma, camada de services, autenticação JWT por papéis, Docker Compose de desenvolvimento e testes automatizados (API + E2E).

## Stack

| Camada | Tecnologias |
| --- | --- |
| Backend | Node.js, Express, TypeScript, Prisma, PostgreSQL 16, Zod, JWT, Multer, bcrypt |
| Frontend | React, Vite, TypeScript, Tailwind CSS, Axios, React Router |
| Qualidade | ESLint, Prettier, Husky, lint-staged |
| Testes | Vitest + Supertest (API), Playwright (E2E) |
| DevOps local | Docker Compose (postgres + backend + frontend) |

## Estrutura

```
apps/
  backend/   # refund-api — Express + Prisma
  frontend/  # refund-web — React + Vite
docker/
  postgres/  # init script (cria refund_test)
```

Fluxo da API: **routes → controllers → services → Prisma**.

Detalhes de pastas e convenções de services: [`.cursor/docs/architecture.md`](.cursor/docs/architecture.md).

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (recomendado para Postgres e stack completa)

## Começando com Docker

Na raiz do repositório:

```bash
npm install
cp .env.example .env   # opcional — sobrescreve defaults do Compose
npm run docker:up
```

| Serviço | URL |
| --- | --- |
| API | http://localhost:3333 |
| Web | http://localhost:5173 |
| Postgres | `localhost:5432` |

Parar: `npm run docker:down`.

## Desenvolvimento local (sem containers da app)

1. Suba pelo menos o Postgres (`npm run docker:up` ou só o serviço `postgres`).
2. Configure os envs:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

3. Em terminais separados:

```bash
npm run dev:backend
npm run dev:frontend
```

O entrypoint do backend em Docker já roda `prisma migrate deploy`. Em local, após o Postgres estar no ar:

```bash
npm exec prisma migrate deploy --workspace refund-api
```

## Variáveis de ambiente

| Variável | Onde | Uso |
| --- | --- | --- |
| `DATABASE_URL` | backend | Conexão PostgreSQL |
| `JWT_SECRET` | backend / Compose | Assinatura do token |
| `PORT` | backend | Porta da API (default `3333`) |
| `VITE_API_URL` | frontend / Compose | Base URL da API no browser |

Exemplos em `.env.example` (raiz) e `apps/backend/.env.example`. Não versionar `.env` com segredos reais.

URLs típicas:

| Ambiente | `DATABASE_URL` |
| --- | --- |
| Docker (serviço backend) | `postgresql://refund:refund@postgres:5432/refund` |
| Host local | `postgresql://refund:refund@localhost:5432/refund` |
| Testes de API / E2E | `postgresql://refund:refund@localhost:5432/refund_test` |

## Scripts (raiz)

| Script | Descrição |
| --- | --- |
| `npm run docker:up` | Sobe postgres + backend + frontend |
| `npm run docker:down` | Derruba a stack |
| `npm run dev:backend` | API em watch (`tsx`) |
| `npm run dev:frontend` | Vite |
| `npm run test:api` | Vitest + Supertest (precisa do Postgres) |
| `npm run test:e2e` | Playwright (sobe apps via `webServer` se necessário) |

Primeira vez no E2E:

```bash
npx playwright install chromium --workspace refund-web
```

## API

Autenticação: `Authorization: Bearer <token>` nas rotas protegidas.

### Auth

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/users` | Cadastro (`name`, `email`, `password`) — role `employee` |
| `POST` | `/sessions` | Login — retorna token + usuário |

### Uploads

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/uploads` | `multipart/form-data` campo `file` — retorna `filename` |
| `GET` | `/uploads/:filename` | Serve o comprovante (autenticado) |

### Reembolsos

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/refunds` | Cria pedido (`name`, `category`, `amount`, `filename`) |
| `GET` | `/refunds` | Lista (filtros `name`, paginação `page` / `perPage`) |
| `GET` | `/refunds/:id` | Detalhe |

Categorias: `food`, `others`, `services`, `transport`, `accommodation`.

Coleção Insomnia: [`apps/backend/insomnia-refund-routes.yml`](apps/backend/insomnia-refund-routes.yml).

## Papéis

| Role | Comportamento |
| --- | --- |
| `employee` | Cria e consulta os próprios reembolsos |
| `manager` | Lista/consulta reembolsos no painel de gestão |

## Testes

```bash
# Postgres acessível em localhost:5432 (stack ou só postgres)
npm run test:api
npm run test:e2e
```

- **API:** setup aponta para `refund_test`, aplica migrations e limpa dados entre casos.
- **E2E:** sobe API/frontend nas portas `3334`/`5174` usando `refund_test` (não o banco `refund` do Docker).

## Licença

ISC
