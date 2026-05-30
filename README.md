# Raio X Artístico

Formulário de diagnóstico estratégico de carreira artística. HTML estático + 1 função serverless que persiste em Neon Postgres, envia email com PDF anexado via Resend, e faz append automático numa planilha Google Sheets.

## Estrutura

```
.
├── diagnostico-artistico.html   # Formulário (servido em /)
├── api/submit.js                # Função Vercel: orquestra INSERT + email + sheets
├── lib/
│   ├── fields.js                # Metadata das 15 seções e labels
│   ├── pdf.js                   # Gera PDF formatado com pdfkit
│   ├── email.js                 # Envia email via Resend com PDF anexado
│   └── sheets.js                # Append no Google Sheets via service account
├── scripts/setup-sheet.js       # Backfill: cria header e empurra registros existentes pra planilha
├── schema.sql                   # CREATE TABLE diagnosticos
├── vercel.json                  # rewrite / → diagnostico-artistico.html
└── package.json
```

## Setup completo

### 1. Neon Postgres (já feito)

Provisionado via Vercel Marketplace. `DATABASE_URL` injetada automaticamente. Schema rodado uma vez via `schema.sql`.

### 2. Resend (email + PDF)

1. No Vercel dashboard do projeto → **Storage** (ou **Integrations**) → **Add Integration** → **Resend** → segue o fluxo.
2. Isso injeta `RESEND_API_KEY` automaticamente.
3. Por padrão o sender é `onboarding@resend.dev` (funciona out-of-the-box, mas limita destinatário). Pra produção, no dashboard da Resend:
   - **Domains** → adiciona um domínio próprio (ex: `feghalli.com`)
   - Configura DNS (TXT/MX/DKIM)
   - Define env var `RESEND_FROM` no Vercel, ex: `Raio X Artístico <noreply@feghalli.com>`

### 3. Google Sheets

#### 3.1. Criar a planilha
- Crie uma planilha em sheets.google.com (qualquer nome)
- Renomeie a primeira aba pra `Respostas`
- Copie o ID da URL: `https://docs.google.com/spreadsheets/d/{ESTE_ID}/edit`

#### 3.2. Criar service account no Google Cloud
1. https://console.cloud.google.com → cria/seleciona um projeto
2. **APIs & Services → Library** → habilita **Google Sheets API**
3. **APIs & Services → Credentials → Create credentials → Service account**
4. Dá um nome (`raio-x-artistico-sheets`), pula as permissões opcionais
5. Na service account criada: **Keys → Add key → Create new key → JSON** → baixa o `.json`
6. Copie o email da service account (algo como `raio-x-...@projeto.iam.gserviceaccount.com`)

#### 3.3. Compartilhar a planilha com a service account
- Na planilha, clica **Share** → cola o email da service account → permissão **Editor** → Send (sem notificação)

#### 3.4. Configurar env vars no Vercel
Em *Settings → Environment Variables*:

| Variável | Valor |
| --- | --- |
| `GOOGLE_SHEET_ID` | ID da planilha (passo 3.1) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Conteúdo do JSON inteiro da service account (ou em base64) |
| `GOOGLE_SHEET_RANGE` | `Respostas!A1` (opcional, esse é o padrão) |

> **Dica:** se o JSON do service account quebrar (escapes de newline na private_key), passe ele em **base64**: `base64 < service-account.json` → cola o resultado.

### 4. Variáveis de ambiente (resumo)

| Variável | Origem | Necessária |
| --- | --- | --- |
| `DATABASE_URL` | Neon (Marketplace) | Sim |
| `RESEND_API_KEY` | Resend (Marketplace) | Pra email |
| `RESEND_FROM` | manual | Opcional (default `onboarding@resend.dev`) |
| `NOTIFY_EMAIL` | manual | Opcional (default `REDACTED_EMAIL`) |
| `GOOGLE_SHEET_ID` | manual | Pra sheets |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | manual | Pra sheets |
| `GOOGLE_SHEET_RANGE` | manual | Opcional |

Se uma dessas faltar, o submit ainda funciona — só o canal correspondente é pulado (com log de aviso no Vercel).

### 5. Backfill / setup inicial da planilha

Depois de criar a planilha e setar as env vars, puxa as vars pra rodar local:

```bash
npx vercel env pull .env.local --environment=production
node scripts/setup-sheet.js
```

Isso cria o header e empurra todos os diagnósticos que já existem no Neon pra dentro da planilha.

## Desenvolvimento local

```bash
npx vercel dev
```

## Consultar dados

- **Planilha** — abre e olha.
- **Neon Console** — SQL Editor + botão "Download CSV".
- **psql** local: `psql "$DATABASE_URL" -c "COPY diagnosticos TO STDOUT WITH CSV HEADER" > dump.csv`

## Adicionar/remover campos

1. Edita HTML adicionando `name="..."` no novo input.
2. Adiciona coluna em `schema.sql` e roda `ALTER TABLE` no Neon.
3. Acrescenta o campo (e o label) em `lib/fields.js` na seção certa.

Os outros canais (PDF/email/Sheets) puxam de `fields.js` automaticamente.
