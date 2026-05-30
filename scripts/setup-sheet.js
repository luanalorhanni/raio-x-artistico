// Roda uma vez (ou sempre que quiser refazer): cria header e faz backfill
// de todas as linhas que já existem no Neon pra dentro da planilha.
//
// Uso:
//   node scripts/setup-sheet.js
//
// Requer .env.local com DATABASE_URL, GOOGLE_SHEET_ID e GOOGLE_SERVICE_ACCOUNT_JSON.

import fs from 'fs';
import { neon } from '@neondatabase/serverless';
import { ensureHeader, appendRow } from '../lib/sheets.js';
import { ALL_FIELDS_IN_ORDER } from '../lib/fields.js';

function loadEnv() {
  const raw = fs.readFileSync('.env.local', 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnv();

const sql = neon(process.env.DATABASE_URL);

console.log('Garantindo header na planilha...');
const headerResult = await ensureHeader();
console.log(headerResult.alreadyHadHeader ? '  já existia, mantido.' : '  header criado.');

console.log('Lendo diagnósticos do Neon...');
const cols = ['id', 'created_at', ...ALL_FIELDS_IN_ORDER].join(', ');
const rows = await sql(`SELECT ${cols} FROM diagnosticos ORDER BY id ASC`);
console.log(`  ${rows.length} registros encontrados.`);

let pushed = 0;
for (const row of rows) {
  const data = {};
  for (const f of ALL_FIELDS_IN_ORDER) data[f] = row[f];
  try {
    await appendRow({ id: row.id, createdAt: row.created_at, data });
    pushed++;
    console.log(`  +linha #${row.id} (${row.nome_artistico || 'sem nome'})`);
  } catch (err) {
    console.error(`  !erro em #${row.id}:`, err.message);
  }
}
console.log(`\nFeito. ${pushed}/${rows.length} linhas escritas na planilha.`);
