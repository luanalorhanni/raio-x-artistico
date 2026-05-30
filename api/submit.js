import { neon } from '@neondatabase/serverless';
import { ALL_FIELDS_IN_ORDER } from '../lib/fields.js';
import { generateDiagnosticoPDF } from '../lib/pdf.js';
import { sendDiagnosticoEmail } from '../lib/email.js';
import { appendRow, isConfigured as sheetsConfigured } from '../lib/sheets.js';

const ALLOWED_FIELDS = ALL_FIELDS_IN_ORDER;

const INT_FIELDS = new Set([
  'idade','shows_previstos','publicacoes_semana',
  'total_musicas_lancadas','lancamentos_12m','shows_ultimos_12m','comprometimento',
]);

const REQUIRED = ['nome_artistico','nome_completo','email','telefone'];

function toIntOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = parseInt(String(v).replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}

function clean(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'DATABASE_URL não configurada' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Payload inválido' });
  }

  for (const field of REQUIRED) {
    if (!clean(body[field])) {
      return res.status(400).json({ error: `Campo obrigatório ausente: ${field}` });
    }
  }

  const cols = [];
  const vals = [];
  const cleanedData = {};
  for (const field of ALLOWED_FIELDS) {
    if (!(field in body)) continue;
    const v = INT_FIELDS.has(field) ? toIntOrNull(body[field]) : clean(body[field]);
    cols.push(field);
    vals.push(v);
    cleanedData[field] = v;
  }

  if (cols.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido enviado' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
  const colList = cols.join(', ');
  const query = `INSERT INTO diagnosticos (${colList}) VALUES (${placeholders}) RETURNING id, created_at`;

  let inserted;
  try {
    const rows = await sql(query, vals);
    inserted = rows[0];
  } catch (err) {
    console.error('[submit] INSERT diagnosticos falhou:', err);
    return res.status(500).json({ error: 'Erro ao salvar diagnóstico', detail: err.message });
  }

  // Pós-INSERT: efeitos colaterais (email, sheets). Falhas aqui NÃO derrubam a resposta —
  // o Neon é a fonte da verdade; estes são canais secundários de visualização.
  const sideEffects = await runSideEffects({
    id: inserted.id,
    createdAt: inserted.created_at,
    data: cleanedData,
  });

  return res.status(200).json({
    ok: true,
    id: inserted.id,
    created_at: inserted.created_at,
    side_effects: sideEffects,
  });
}

async function runSideEffects({ id, createdAt, data }) {
  const result = { email: null, sheets: null };

  // PDF é gerado uma vez e reutilizado pelo email; se quiser disponibilizar pra download
  // direto no futuro, dá pra subir pro Vercel Blob aqui.
  let pdfBuffer = null;
  try {
    pdfBuffer = await generateDiagnosticoPDF({ id, createdAt, data });
  } catch (err) {
    console.error('[submit] geração de PDF falhou:', err);
    result.email = { ok: false, error: 'pdf_failed: ' + err.message };
  }

  if (pdfBuffer) {
    try {
      await sendDiagnosticoEmail({ id, data, pdfBuffer });
      result.email = { ok: true };
    } catch (err) {
      console.error('[submit] envio de email falhou:', err);
      result.email = { ok: false, error: err.message };
    }
  }

  if (sheetsConfigured()) {
    try {
      await appendRow({ id, createdAt, data });
      result.sheets = { ok: true };
    } catch (err) {
      console.error('[submit] append no Sheets falhou:', err);
      result.sheets = { ok: false, error: err.message };
    }
  } else {
    result.sheets = { skipped: true };
  }

  return result;
}
