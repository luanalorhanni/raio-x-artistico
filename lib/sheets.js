// Integração com Google Sheets via Apps Script Web App.
//
// Não usa Google Cloud / Service Account: a "API" é um script publicado dentro
// da própria planilha, que recebe POST com payload assinado pelo SHEETS_WEBHOOK_SECRET.
// Veja apps-script/Code.gs e README seção 3 pra publicar o webhook.

import { ALL_FIELDS_IN_ORDER } from './fields.js';

export const SHEET_HEADER = ['id', 'created_at', ...ALL_FIELDS_IN_ORDER];

async function call(action, body) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!url) throw new Error('SHEETS_WEBHOOK_URL não configurada');
  if (!secret) throw new Error('SHEETS_WEBHOOK_SECRET não configurada');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, action, ...body }),
    redirect: 'follow',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Apps Script HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Apps Script respondeu non-JSON: ' + text.slice(0, 200));
  }

  if (!data.ok) {
    throw new Error('Apps Script error: ' + (data.error || JSON.stringify(data)));
  }
  return data;
}

export async function ensureHeader() {
  return call('ensureHeader', { header: SHEET_HEADER });
}

export async function appendRow({ id, createdAt, data }) {
  const row = [
    id,
    new Date(createdAt).toISOString(),
    ...ALL_FIELDS_IN_ORDER.map(f => {
      const v = data[f];
      return v == null ? '' : String(v);
    }),
  ];
  return call('appendRow', { row });
}
