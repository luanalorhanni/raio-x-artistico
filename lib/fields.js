// Metadata das seções e campos do formulário Raio X Artístico.
// Usado por: geração de PDF, corpo do email e header da planilha.

export const SECTIONS = [
  {
    num: 1,
    title: 'Informações Gerais',
    fields: [
      ['nome_artistico', 'Nome artístico'],
      ['nome_completo', 'Nome completo'],
      ['idade', 'Idade'],
      ['cidade_estado', 'Cidade / Estado'],
      ['telefone', 'Telefone'],
      ['email', 'E-mail'],
      ['instagram', 'Instagram'],
      ['tiktok', 'TikTok'],
      ['youtube', 'YouTube'],
      ['spotify', 'Spotify'],
    ],
  },
  {
    num: 2,
    title: 'Sua História',
    fields: [
      ['interesse_musica', 'Como surgiu seu interesse pela música?'],
      ['tempo_atuacao', 'Há quanto tempo atua como artista?'],
      ['maior_conquista', 'Maior conquista artística até o momento'],
      ['momentos_importantes', 'Momentos mais importantes da sua trajetória'],
      ['maior_desafio', 'Maior desafio enfrentado na carreira'],
      ['motivacao', 'O que te motiva a continuar na música?'],
    ],
  },
  {
    num: 3,
    title: 'Propósito e Visão',
    fields: [
      ['proposito_musica', 'Por que você faz música?'],
      ['transmitir_arte', 'O que deseja transmitir através da sua arte?'],
      ['sentimento_publico', 'O que gostaria que as pessoas sentissem ao ouvir suas músicas?'],
      ['como_lembrado', 'Como deseja ser lembrado no futuro?'],
      ['impacto_vidas', 'Que impacto gostaria de causar na vida das pessoas?'],
      ['definicao_sucesso', 'O que significa sucesso para você?'],
    ],
  },
  {
    num: 4,
    title: 'Objetivos',
    fields: [
      ['resultados_12m', 'Resultados que deseja alcançar nos próximos 12 meses'],
      ['shows_previstos', 'Shows previstos (próximos 12 meses)'],
      ['meta_seguidores', 'Meta de seguidores'],
      ['lancamentos_planejados', 'Lançamentos planejados'],
      ['visao_3anos', 'Onde deseja estar artisticamente em 3 anos?'],
      ['grande_sonho', 'Seu grande sonho dentro da música'],
      ['visao_10anos', 'Como imagina sua carreira daqui a 10 anos?'],
    ],
  },
  {
    num: 5,
    title: 'Identidade Artística',
    fields: [
      ['estilo_musical', 'Como você define seu estilo musical?'],
      ['generos_musicais', 'Gêneros musicais do seu trabalho'],
      ['influencias', 'Artistas que mais influenciam você'],
      ['diferencial', 'O que te diferencia dos demais artistas do seu segmento?'],
      ['personalidade_artistica', 'Características que definem sua personalidade artística'],
      ['frase_publico', 'Como gostaria que o público te descrevesse em uma frase?'],
    ],
  },
  {
    num: 6,
    title: 'Posicionamento de Mercado',
    fields: [
      ['mercado', 'Em qual mercado você acredita estar inserido?'],
      ['concorrentes', 'Principais concorrentes ou artistas semelhantes'],
      ['referencias_carreira', 'Artistas que você admira como referência de carreira'],
      ['oportunidades_nao_aproveitadas', 'Oportunidades que ainda não aproveitou'],
      ['barreiras', 'Barreiras que impedem seu crescimento'],
    ],
  },
  {
    num: 7,
    title: 'Público-Alvo',
    fields: [
      ['publico_atual', 'Quem é seu público hoje?'],
      ['publico_ideal', 'Quem você gostaria que fosse seu público?'],
      ['faixa_etaria', 'Faixa etária predominante'],
      ['genero_publico', 'Composição de gênero'],
      ['localizacao_publico', 'Onde está localizado'],
      ['habitos_publico', 'Hábitos e comportamentos desse público'],
      ['conexao_musica', 'O que faz as pessoas se conectarem com sua música?'],
    ],
  },
  {
    num: 8,
    title: 'Presença Digital',
    fields: [
      ['melhor_rede', 'Melhor rede social em desempenho'],
      ['rede_favorita', 'Rede que mais gosta de produzir conteúdo'],
      ['publicacoes_semana', 'Publicações por semana'],
      ['calendario_conteudo', 'Calendário de conteúdo'],
      ['conforto_cameras', 'Confortável com câmeras?'],
      ['tipos_conteudo', 'Tipos de conteúdo que costuma produzir'],
      ['conteudos_engajamento', 'Conteúdos que geram mais engajamento'],
      ['conteudos_evita', 'Tipos de conteúdo que não gosta de fazer'],
    ],
  },
  {
    num: 9,
    title: 'Streaming e Lançamentos',
    fields: [
      ['total_musicas_lancadas', 'Total de músicas lançadas'],
      ['lancamentos_12m', 'Lançamentos nos últimos 12 meses'],
      ['ouvintes_mensais', 'Ouvintes mensais médios'],
      ['musica_melhor_desempenho', 'Qual música teve melhor desempenho?'],
      ['playlists_relevantes', 'Já entrou em playlists relevantes?'],
      ['estrategia_lancamentos', 'Estratégia atual de lançamentos'],
    ],
  },
  {
    num: 10,
    title: 'Shows e Performance',
    fields: [
      ['shows_ultimos_12m', 'Shows nos últimos 12 meses'],
      ['cache_medio', 'Cachê médio atual'],
      ['maior_publico', 'Maior público para quem se apresentou'],
      ['banda_equipe', 'Possui banda ou equipe fixa?'],
      ['show_eventos_maiores', 'Show preparado para eventos maiores?'],
      ['cidades_alcancar', 'Cidades ou regiões que deseja alcançar'],
      ['objetivo_shows', 'Objetivo principal dos shows'],
    ],
  },
  {
    num: 11,
    title: 'Equipe e Estrutura',
    fields: [
      ['empresario', 'Possui empresário?'],
      ['assessor_imprensa', 'Possui assessor de imprensa?'],
      ['produtor_musical', 'Possui produtor musical?'],
      ['designer', 'Possui designer?'],
      ['videomaker', 'Possui videomaker?'],
      ['cuida_redes', 'Quem cuida das redes sociais?'],
      ['decisoes_carreira', 'Quem toma as decisões da carreira?'],
    ],
  },
  {
    num: 12,
    title: 'Investimento',
    fields: [
      ['investimento_mensal', 'Investimento mensal na carreira'],
      ['investimento_marketing', 'Quanto está disposto a investir em marketing'],
      ['trafego_pago', 'Aberto a investir em tráfego pago?'],
      ['patrocinadores', 'Possui patrocinadores ou apoiadores?'],
      ['interesse_parcerias', 'Interesse em captar parcerias comerciais?'],
    ],
  },
  {
    num: 13,
    title: 'Monetização',
    fields: [
      ['fonte_renda', 'Principal fonte de renda atual'],
      ['fontes_desenvolver', 'Fontes de receita que deseja desenvolver'],
      ['merchandising', 'Possui merchandising?'],
      ['licenciamento', 'Interesse em licenciamento musical?'],
    ],
  },
  {
    num: 14,
    title: 'Análise SWOT Pessoal',
    fields: [
      ['pontos_fortes', 'Pontos Fortes'],
      ['pontos_fracos', 'Pontos Fracos'],
      ['oportunidades', 'Oportunidades'],
      ['ameacas', 'Ameaças'],
    ],
  },
  {
    num: 15,
    title: 'Comprometimento',
    fields: [
      ['comprometimento', 'Nível de comprometimento com a carreira (0-10)'],
      ['planejamento_longo_prazo', 'Está disposto a seguir um planejamento estratégico de longo prazo?'],
      ['diferencial_dedicacao', 'O que está disposto a fazer que seus concorrentes provavelmente não estão?'],
      ['entrevista_5anos', 'Entrevista de sucesso daqui 5 anos: o que mencionaria?'],
    ],
  },
];

// Ordem completa de campos (id, created_at, depois todos os campos do form).
// Usado pelo header da planilha e ordem de colunas.
export const ALL_FIELDS_IN_ORDER = SECTIONS.flatMap(s => s.fields.map(([name]) => name));

// Lookup rápido de label por nome de campo.
export const LABEL_BY_FIELD = Object.fromEntries(
  SECTIONS.flatMap(s => s.fields)
);
