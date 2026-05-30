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

### 3. Google Sheets (via Apps Script — sem GCP)

A planilha é o próprio "backend" via Apps Script Web App. Não precisa de Google Cloud, service account, nem cartão.

1. **Crie a planilha** no Google Sheets (qualquer nome).
2. **Abre Extensões → Apps Script.** Cola o conteúdo de `apps-script/Code.gs` deste repo.
3. **Troca o `SECRET`** dentro do código por uma string aleatória (gera em uuidgenerator.net por exemplo).
4. Salva (Ctrl+S).
5. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Clica **Deploy** → autoriza (na tela "app não verificado", clica Advanced → Go to ... → Allow)
6. Copia a **Web app URL** que aparece (algo como `https://script.google.com/macros/s/AKfyc.../exec`).
7. **Configura env vars no Vercel** (*Settings → Environment Variables*, marca Production):

| Variável | Valor |
| --- | --- |
| `SHEETS_WEBHOOK_URL` | URL do passo 6 |
| `SHEETS_WEBHOOK_SECRET` | A string aleatória do passo 3 (mesma do Apps Script) |

### 4. Variáveis de ambiente (resumo)

| Variável | Origem | Necessária |
| --- | --- | --- |
| `DATABASE_URL` | Neon (Marketplace) | Sim |
| `RESEND_API_KEY` | Resend (Marketplace) | Pra email |
| `RESEND_FROM` | manual | Opcional (default `onboarding@resend.dev`) |
| `NOTIFY_EMAIL` | manual | Opcional (default `REDACTED_EMAIL`) |
| `SHEETS_WEBHOOK_URL` | manual (Apps Script) | Pra sheets |
| `SHEETS_WEBHOOK_SECRET` | manual | Pra sheets |

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
