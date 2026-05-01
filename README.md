# products-mock-api

API de mock para produtos e pedidos (Fastify + TypeScript + Knex + SQLite).

## Como rodar o projeto

### Requisitos

- Node.js (recomendo >= 18 LTS)
- Yarn ou npm

### Instalação

1. Clone o repositório e entre na pasta do projeto:

```bash
git clone <repo-url>
cd products-mock-api
```

2. Instale dependências:

Com Yarn:

```bash
yarn install
```

Com npm:

```bash
npm install
```

3. Inicialize o banco de dados de desenvolvimento (cria schema e insere dados mock):

```bash
# Com Yarn
yarn mock

# Com npm
npm run mock
```

O comando `mock` executa `src/infra/knex/schema.ts` e `src/infra/knex/mocks/products.ts` e gera o arquivo de banco em `src/infra/knex/db.sqlite`.

4. Rodar em modo desenvolvimento:

```bash
# Com Yarn
yarn dev

# Com npm
npm run dev
```

O servidor inicia por padrão em `http://localhost:3000` (verifique os logs caso a porta seja diferente).

5. Executar build / rodar em produção:

```bash
# Compilar TS
yarn build:ts    # ou npm run build:ts

# Rodar versão compilada
yarn start       # ou npm start
```

### Endpoints principais

- `GET /` — rota root (ex.: `{ "root": true }`).
- `GET /products` — lista produtos.
- `GET /products/:id` — busca produto por `id` (UUID).
- `POST /orders` — cria pedido. Body esperado:

```json
{ "productId": "<uuid>", "quantity": 2 }
```

- `GET /orders/:id` — busca pedido por `id` (UUID).

Exemplo rápido (curl):

```bash
curl http://localhost:3000/products

curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"productId":"<uuid>","quantity":1}'
```

## Decisões técnicas e motivos

- Fastify: escolhi principalmente pela performance e pela excelente integração com TypeScript; (e também para um projeto rápido usar o Fastify-CLI acelera bastante a configuração inicial.)
- Knex + SQLite: escolhi o SQLite com Knex para os dados mockados pois acredito que mesmo mockado é interessante demonstrar integração com um banco de dados junto com um ORM.
- Zod: usei para validar toda entrada de dados dos controllers (rotas de produtos e pedidos).
- Estrutura do projeto: routers -> controllers → repositórios; utilizei uma abstração (bem refatorada e simplista) de CLEAN/DDD.

Todas minhas decisões e escolhas se basearam em dois princípios:

1. entregar um projeto funcional e completo dentro do prazo curto;
2. demonstrar boas práticas de organização, estrutura, e qualidade de código.

Ambas considero essencial.

---

## O que eu melhoraria com mais tempo

- A primeira coisa seria adicionar Migrations & seeds via Knex (usar `knex migrate:make` / `knex seed:run`) em vez de scripts (que utilizei para ser mais simples).
- Substituir SQLite por algum banco de dados real como Postgres.
- Adicionar testes:
  - unitários (controllers, repositórios) e integração (endpoints) com um runner (Vitest/Jest + supertest).
- Documentação API (OpenAPI / Swagger) e exemplos de uso interativos.
- Validations / schemas mais completos e centralizados; contrato explícito de respostas.

---
