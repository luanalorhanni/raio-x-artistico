-- Raio X Artístico — schema da tabela de diagnósticos
-- Rode isto no SQL Editor do Neon uma única vez.

CREATE TABLE IF NOT EXISTS diagnosticos (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- S1: Informações Gerais
  nome_artistico            TEXT,
  nome_completo             TEXT,
  idade                     INTEGER,
  cidade_estado             TEXT,
  telefone                  TEXT,
  email                     TEXT,
  instagram                 TEXT,
  tiktok                    TEXT,
  youtube                   TEXT,
  spotify                   TEXT,

  -- S2: Sua História
  interesse_musica          TEXT,
  tempo_atuacao             TEXT,
  maior_conquista           TEXT,
  momentos_importantes      TEXT,
  maior_desafio             TEXT,
  motivacao                 TEXT,

  -- S3: Propósito e Visão
  proposito_musica          TEXT,
  transmitir_arte           TEXT,
  sentimento_publico        TEXT,
  como_lembrado             TEXT,
  impacto_vidas             TEXT,
  definicao_sucesso         TEXT,

  -- S4: Objetivos
  resultados_12m            TEXT,
  shows_previstos           INTEGER,
  meta_seguidores           TEXT,
  lancamentos_planejados    TEXT,
  visao_3anos               TEXT,
  grande_sonho              TEXT,
  visao_10anos              TEXT,

  -- S5: Identidade Artística
  estilo_musical            TEXT,
  generos_musicais          TEXT,
  influencias               TEXT,
  diferencial               TEXT,
  personalidade_artistica   TEXT,
  frase_publico             TEXT,

  -- S6: Posicionamento de Mercado
  mercado                       TEXT,
  concorrentes                  TEXT,
  referencias_carreira          TEXT,
  oportunidades_nao_aproveitadas TEXT,
  barreiras                     TEXT,

  -- S7: Público-Alvo
  publico_atual             TEXT,
  publico_ideal             TEXT,
  faixa_etaria              TEXT,
  genero_publico            TEXT,
  localizacao_publico       TEXT,
  habitos_publico           TEXT,
  conexao_musica            TEXT,

  -- S8: Presença Digital
  melhor_rede               TEXT,
  rede_favorita             TEXT,
  publicacoes_semana        INTEGER,
  calendario_conteudo       TEXT,
  conforto_cameras          TEXT,
  tipos_conteudo            TEXT,
  conteudos_engajamento     TEXT,
  conteudos_evita           TEXT,

  -- S9: Streaming e Lançamentos
  total_musicas_lancadas    INTEGER,
  lancamentos_12m           INTEGER,
  ouvintes_mensais          TEXT,
  musica_melhor_desempenho  TEXT,
  playlists_relevantes      TEXT,
  estrategia_lancamentos    TEXT,

  -- S10: Shows e Performance
  shows_ultimos_12m         INTEGER,
  cache_medio               TEXT,
  maior_publico             TEXT,
  banda_equipe              TEXT,
  show_eventos_maiores      TEXT,
  cidades_alcancar          TEXT,
  objetivo_shows            TEXT,

  -- S11: Equipe e Estrutura
  empresario                TEXT,
  assessor_imprensa         TEXT,
  produtor_musical          TEXT,
  designer                  TEXT,
  videomaker                TEXT,
  cuida_redes               TEXT,
  decisoes_carreira         TEXT,

  -- S12: Investimento
  investimento_mensal       TEXT,
  investimento_marketing    TEXT,
  trafego_pago              TEXT,
  patrocinadores            TEXT,
  interesse_parcerias       TEXT,

  -- S13: Monetização
  fonte_renda               TEXT,
  fontes_desenvolver        TEXT,
  merchandising             TEXT,
  licenciamento             TEXT,

  -- S14: SWOT
  pontos_fortes             TEXT,
  pontos_fracos             TEXT,
  oportunidades             TEXT,
  ameacas                   TEXT,

  -- S15: Comprometimento
  comprometimento           INTEGER,
  planejamento_longo_prazo  TEXT,
  diferencial_dedicacao     TEXT,
  entrevista_5anos          TEXT
);

CREATE INDEX IF NOT EXISTS diagnosticos_created_at_idx ON diagnosticos (created_at DESC);
CREATE INDEX IF NOT EXISTS diagnosticos_email_idx      ON diagnosticos (email);
