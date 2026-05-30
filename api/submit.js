import { neon } from '@neondatabase/serverless';

const ALLOWED_FIELDS = [
  'nome_artistico','nome_completo','idade','cidade_estado','telefone','email',
  'instagram','tiktok','youtube','spotify',
  'interesse_musica','tempo_atuacao','maior_conquista','momentos_importantes','maior_desafio','motivacao',
  'proposito_musica','transmitir_arte','sentimento_publico','como_lembrado','impacto_vidas','definicao_sucesso',
  'resultados_12m','shows_previstos','meta_seguidores','lancamentos_planejados','visao_3anos','grande_sonho','visao_10anos',
  'estilo_musical','generos_musicais','influencias','diferencial','personalidade_artistica','frase_publico',
  'mercado','concorrentes','referencias_carreira','oportunidades_nao_aproveitadas','barreiras',
  'publico_atual','publico_ideal','faixa_etaria','genero_publico','localizacao_publico','habitos_publico','conexao_musica',
  'melhor_rede','rede_favorita','publicacoes_semana','calendario_conteudo','conforto_cameras','tipos_conteudo','conteudos_engajamento','conteudos_evita',
  'total_musicas_lancadas','lancamentos_12m','ouvintes_mensais','musica_melhor_desempenho','playlists_relevantes','estrategia_lancamentos',
  'shows_ultimos_12m','cache_medio','maior_publico','banda_equipe','show_eventos_maiores','cidades_alcancar','objetivo_shows',
  'empresario','assessor_imprensa','produtor_musical','designer','videomaker','cuida_redes','decisoes_carreira',
  'investimento_mensal','investimento_marketing','trafego_pago','patrocinadores','interesse_parcerias',
  'fonte_renda','fontes_desenvolver','merchandising','licenciamento',
  'pontos_fortes','pontos_fracos','oportunidades','ameacas',
  'comprometimento','planejamento_longo_prazo','diferencial_dedicacao','entrevista_5anos',
];

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
  for (const field of ALLOWED_FIELDS) {
    if (!(field in body)) continue;
    const v = INT_FIELDS.has(field) ? toIntOrNull(body[field]) : clean(body[field]);
    cols.push(field);
    vals.push(v);
  }

  if (cols.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo válido enviado' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
  const colList = cols.join(', ');
  const query = `INSERT INTO diagnosticos (${colList}) VALUES (${placeholders}) RETURNING id, created_at`;

  try {
    const rows = await sql(query, vals);
    return res.status(200).json({ ok: true, id: rows[0].id, created_at: rows[0].created_at });
  } catch (err) {
    console.error('INSERT diagnosticos falhou:', err);
    return res.status(500).json({ error: 'Erro ao salvar diagnóstico', detail: err.message });
  }
}
