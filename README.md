# Raio X Artístico

Formulário de diagnóstico estratégico de carreira artística. HTML estático + 1 função serverless que persiste em Neon Postgres.

## Estrutura

```
.
├── diagnostico-artistico.html   # Formulário (servido em /)
├── api/submit.js                # Função Vercel: recebe JSON e INSERT no Neon
├── schema.sql                   # CREATE TABLE diagnosticos
├── vercel.json                  # rewrite / → diagnostico-artistico.html
└── package.json                 # depende de @neondatabase/serverless
```

## Setup (uma vez só)

### 1. Criar projeto Vercel + provisionar Neon

```bash
npm install
npx vercel link          # cria projeto Vercel
npx vercel integration add neon   # provisiona Neon Postgres via Marketplace
```

A integração injeta a variável `DATABASE_URL` automaticamente nos ambientes (Preview e Production).

### 2. Criar a tabela

Puxe a URL pra rodar o schema localmente:

```bash
npx vercel env pull .env.local
psql "$(grep DATABASE_URL .env.local | cut -d= -f2- | tr -d '"')" -f schema.sql
```

Ou cole o conteúdo de `schema.sql` no SQL Editor do Neon (console web).

### 3. Deploy

```bash
npx vercel --prod
```

## Desenvolvimento local

```bash
npx vercel dev
# abre em http://localhost:3000
```

## Consultar dados

- **SQL Editor do Neon** (web) — botão "Download CSV" pra exportar.
- **Linha de comando**:
  ```bash
  psql "$DATABASE_URL" -c "COPY diagnosticos TO STDOUT WITH CSV HEADER" > diagnosticos.csv
  ```
- **DBeaver / TablePlus** — conecta com a `DATABASE_URL` e exporta pra CSV/Excel.

## Adicionar/remover campos

1. Edite o HTML (adicione `name="..."` no novo campo).
2. Adicione coluna em `schema.sql` e rode `ALTER TABLE diagnosticos ADD COLUMN ...` no Neon.
3. Inclua o nome em `ALLOWED_FIELDS` (e `INT_FIELDS` se for inteiro) em `api/submit.js`.
