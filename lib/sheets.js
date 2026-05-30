import { google } from 'googleapis';
import { ALL_FIELDS_IN_ORDER } from './fields.js';

const SHEET_RANGE = process.env.GOOGLE_SHEET_RANGE || 'Respostas!A1';

function parseServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON não configurada');
  // Aceita JSON direto ou base64 (mais fácil de colar em env var sem quebrar escape).
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    try {
      parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    } catch {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON inválido (não é JSON nem base64 de JSON)');
    }
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Service account sem client_email ou private_key');
  }
  return parsed;
}

async function getSheetsClient() {
  const credentials = parseServiceAccount();
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

/**
 * Cabeçalho usado na primeira linha da planilha.
 * Quem cria a planilha pode rodar `ensureHeader` uma vez (ou colar manualmente).
 */
export const SHEET_HEADER = ['id', 'created_at', ...ALL_FIELDS_IN_ORDER];

export async function ensureHeader() {
  if (!process.env.GOOGLE_SHEET_ID) throw new Error('GOOGLE_SHEET_ID não configurada');
  const sheets = await getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tab = (SHEET_RANGE.split('!')[0]) || 'Respostas';
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tab}!A1:1`,
  });
  if (existing.data.values && existing.data.values[0] && existing.data.values[0].length > 0) {
    return { alreadyHadHeader: true };
  }
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tab}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [SHEET_HEADER] },
  });
  return { alreadyHadHeader: false };
}

export async function appendRow({ id, createdAt, data }) {
  if (!process.env.GOOGLE_SHEET_ID) {
    throw new Error('GOOGLE_SHEET_ID não configurada');
  }
  const sheets = await getSheetsClient();
  const row = [
    id,
    new Date(createdAt).toISOString(),
    ...ALL_FIELDS_IN_ORDER.map(f => {
      const v = data[f];
      return v == null ? '' : String(v);
    }),
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}
