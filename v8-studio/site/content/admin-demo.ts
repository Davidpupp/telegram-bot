// Dados de exemplo do painel (modo demonstração). Tudo aqui é fictício: pessoas, contatos, visitas e notas.
// As perguntas, as opções e as chaves são as mesmas do formulário Começar (v8-studio/comecar.html), e a
// compatibilidade usa a mesma fórmula de lá. Quando o backend for ligado, cada bloco vira uma consulta.
import type { CompId } from "@/motion/compositions/registry";
import { DEMO_BY_SERVICE, DEMO_LABELS } from "./home";
import { POSTS, type Post } from "./posts";
import { SERVICES } from "./services";

/* ============================================================
   Datas
   Horário de Brasília, no formato "AAAA-MM-DD HH:MM". Tudo é texto para o servidor e o navegador
   mostrarem o mesmo resultado, seja qual for o fuso de cada um.
   ============================================================ */

/** "Hoje" da demonstração. Com o backend, vira a data do servidor. */
export const DEMO_HOJE = "2026-10-14";
/** Domínio usado nas prévias de busca. A confirmar com o usuário. */
export const SITE_DOMINIO = "v8studio.com.br";

export const PERIODO = { inicio: "2026-09-15", fim: "2026-10-14", rotulo: "Últimos 30 dias" } as const;
export const PERIODO_ANTERIOR = { inicio: "2026-08-16", fim: "2026-09-14" } as const;

const pad = (n: number) => String(n).padStart(2, "0");
/** Número do dia (dias desde 1970) de "AAAA-MM-DD", sem fuso. */
export const diaNum = (s: string) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};
const diaStr = (n: number) => {
  const dt = new Date(n * 86400000);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
};
/** "13/10/2026" */
export const dataBR = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`;
/** "13/10" */
export const diaMes = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;
/** "13/10" sem zeros à esquerda: "5/10" */
export const diaMesCurto = (s: string) => `${Number(s.slice(8, 10))}/${Number(s.slice(5, 7))}`;
export const hora = (s: string) => s.slice(11, 16);
/** "13/10/2026 às 18:10" */
export const dataHoraBR = (s: string) => `${dataBR(s)} às ${hora(s)}`;
/** "Hoje, 09:25", "Ontem, 18:10" ou "12/10, 16:20", relativo ao hoje da demonstração. */
export const quandoCurto = (s: string) => {
  const diff = diaNum(DEMO_HOJE) - diaNum(s);
  if (diff === 0) return `Hoje, ${hora(s)}`;
  if (diff === 1) return `Ontem, ${hora(s)}`;
  return `${diaMes(s)}, ${hora(s)}`;
};
export const noIntervalo = (s: string, inicio: string, fim: string) => s.slice(0, 10) >= inicio && s.slice(0, 10) <= fim;

/** Número com vírgula decimal: 2,1. */
export const decimalBR = (n: number, casas = 1) => n.toFixed(casas).replace(".", ",");
/** Porcentagem: "2,1%". */
export const porcentagem = (parte: number, todo: number) => (todo > 0 ? `${decimalBR((parte / todo) * 100)}%` : "—");

/* ============================================================
   Formulário Começar: perguntas e opções (mesmas chaves de comecar.html)
   ============================================================ */

export const PERGUNTAS = {
  need: {
    titulo: "O que você precisa hoje?",
    rotulo: "Serviço",
    opcoes: { site: "Site institucional", landing: "Landing page", loja: "Loja virtual", sistema: "Sistema web", app: "Aplicativo", naosei: "Ainda não sei" },
  },
  site: { titulo: "Já tem site?", rotulo: "Site atual", opcoes: { nao: "Não tenho", naogera: "Tenho, mas não gera clientes", evoluir: "Tenho e quero evoluir" } },
  objetivo: {
    titulo: "Qual o objetivo?",
    rotulo: "Objetivo",
    opcoes: { contatos: "Gerar contatos", vender: "Vender online", credibilidade: "Passar credibilidade", operacao: "Organizar a operação" },
  },
  segmento: {
    titulo: "Qual o seu segmento?",
    rotulo: "Segmento",
    opcoes: {
      saude: "Saúde",
      advocacia: "Advocacia",
      alimentacao: "Alimentação",
      imobiliario: "Imobiliário",
      fitness: "Fitness",
      arquitetura: "Arquitetura e design",
      varejo: "Varejo e moda",
      servicos: "Serviços e consultoria",
      educacao: "Educação",
    },
  },
  prazo: { titulo: "Para quando?", rotulo: "Prazo", opcoes: { ontem: "Para ontem", "30": "Em até 30 dias", "90": "Em até 90 dias", sempressa: "Sem pressa" } },
  faixa: {
    titulo: "Faixa de investimento",
    rotulo: "Investimento",
    opcoes: { ate3: "Até R$ 3 mil", "3a6": "R$ 3 a 6 mil", "6a12": "R$ 6 a 12 mil", "12a25": "R$ 12 a 25 mil", mais25: "Acima de R$ 25 mil", proposta: "Prefiro ouvir uma proposta" },
  },
  quem: { titulo: "Você é...", rotulo: "Papel", opcoes: { dono: "Dono do negócio", socio: "Sócio ou gestor", marketing: "Marketing da empresa", agencia: "Agência ou parceiro" } },
} as const;

export type PerguntaId = keyof typeof PERGUNTAS;
export type Respostas = { [K in PerguntaId]: keyof (typeof PERGUNTAS)[K]["opcoes"] };
export const ORDEM_PERGUNTAS: PerguntaId[] = ["need", "site", "objetivo", "segmento", "prazo", "faixa", "quem"];
export const resposta = <K extends PerguntaId>(id: K, r: Respostas) => (PERGUNTAS[id].opcoes as Record<string, string>)[r[id] as string];

/** Serviço como aparece nas tabelas do painel ("Ainda não sei" vira "A definir"). */
export const SERVICO_ROTULO: Record<Respostas["need"], string> = {
  site: "Site institucional",
  landing: "Landing page",
  loja: "Loja virtual",
  sistema: "Sistema web",
  app: "Aplicativo",
  naosei: "A definir",
};

/* ============================================================
   Compatibilidade: a mesma conta do formulário Começar (função score de comecar.html).
   Parte de 86, soma os ajustes e fica entre 78 e 94.
   ============================================================ */

export const COMPAT = { base: 86, min: 78, max: 94 } as const;
export type Motivo = { texto: string; pontos: number };
export type Compatibilidade = { total: number; motivos: Motivo[]; limitado: boolean };

const ENCAIXE: Partial<Record<Respostas["need"], Respostas["objetivo"]>> = {
  landing: "contatos",
  loja: "vender",
  site: "credibilidade",
  sistema: "operacao",
  app: "operacao",
};

export function compatibilidade(r: Respostas): Compatibilidade {
  const motivos: Motivo[] = [];
  if (r.need === "naosei") motivos.push({ texto: "Ainda não sabe qual serviço precisa", pontos: -4 });
  else if (ENCAIXE[r.need] !== r.objetivo) motivos.push({ texto: "O serviço escolhido não é o caminho mais comum para esse objetivo", pontos: -3 });
  if (r.prazo === "ontem") motivos.push({ texto: "Precisa para ontem", pontos: -3 });
  if (r.prazo === "sempressa") motivos.push({ texto: "Sem pressa: dá para fazer com calma", pontos: 2 });
  const grande = r.need === "sistema" || r.need === "app";
  if (grande && (r.faixa === "ate3" || r.faixa === "3a6")) motivos.push({ texto: "Investimento curto para um sistema ou aplicativo", pontos: -6 });
  if (grande && r.faixa === "mais25") motivos.push({ texto: "Investimento à altura de um sistema ou aplicativo", pontos: 3 });
  if (r.faixa === "proposta") motivos.push({ texto: "Ainda sem faixa de investimento", pontos: -1 });
  if (r.site === "evoluir") motivos.push({ texto: "Já tem site e quer evoluir", pontos: 2 });
  if (r.site === "naogera") motivos.push({ texto: "Tem site, mas ele não traz clientes", pontos: 1 });
  const bruto = COMPAT.base + motivos.reduce((a, m) => a + m.pontos, 0);
  const total = Math.max(COMPAT.min, Math.min(COMPAT.max, bruto));
  return { total, motivos, limitado: total !== bruto };
}

/* ============================================================
   Status, eventos e leads
   ============================================================ */

export const STATUS = { novo: "Novo", contato: "Em contato", proposta: "Proposta enviada", fechado: "Fechado", perdido: "Perdido" } as const;
export type LeadStatus = keyof typeof STATUS;
export const STATUS_ORDEM: LeadStatus[] = ["novo", "contato", "proposta", "fechado", "perdido"];

export type Utm = { source: string; medium: string; campaign: string };

export type Evento =
  | { tipo: "recebido"; em: string }
  | { tipo: "aviso"; em: string }
  | { tipo: "status"; em: string; status: LeadStatus; de: LeadStatus }
  | { tipo: "nota"; em: string; texto: string; autor: string };

export type Lead = {
  id: string;
  /** Quando o formulário foi enviado. */
  quando: string;
  nome: string;
  respostas: Respostas;
  /** Contato informado pelo cliente na última tela do formulário. */
  contato: { whatsapp: string; email: string };
  /** Aceite da política de privacidade (LGPD). */
  consentimento: { em: string; versao: string };
  /** Página em que o pedido começou e a campanha (UTM), se houver. */
  origem: { caminho: string; utm?: Utm };
  status: LeadStatus;
  compat: Compatibilidade;
  /** Do mais antigo para o mais novo. */
  eventos: Evento[];
};

export const AUTOR_EQUIPE = "Equipe V8";

type Passo = [LeadStatus, string, string?];
type Bruto = { id: string; quando: string; nome: string; r: Respostas; origem: string; utm?: Utm; passos?: Passo[]; notas?: [string, string][] };

const R = (
  need: Respostas["need"],
  site: Respostas["site"],
  objetivo: Respostas["objetivo"],
  segmento: Respostas["segmento"],
  prazo: Respostas["prazo"],
  faixa: Respostas["faixa"],
  quem: Respostas["quem"],
): Respostas => ({ need, site, objetivo, segmento, prazo, faixa, quem });

const DENTISTAS: Utm = { source: "google", medium: "cpc", campaign: "dentistas-2026" };

// 33 pedidos fictícios de 17/8 a 14/10/2026. A primeira resposta sai em até 1 dia útil
// (7/9 e 12/10 são feriados). A campanha de dentistas começou em 21/9.
const BRUTOS: Bruto[] = [
  {
    id: "1001", quando: "2026-08-17 09:12", nome: "Beatriz Carvalho", r: R("site", "naogera", "credibilidade", "advocacia", "90", "6a12", "socio"), origem: "/servicos/sites/",
    passos: [
      ["contato", "2026-08-17 15:40", "Conversa pelo WhatsApp. O site atual não aparece quando alguém procura o escritório pelo nome."],
      ["proposta", "2026-08-20 11:00", "Proposta enviada por e-mail: site com seis páginas e área de artigos."],
      ["fechado", "2026-09-16 10:30", "Proposta aceita. O projeto começa em 21/9."],
    ],
  },
  {
    id: "1002", quando: "2026-08-19 18:40", nome: "Renata Siqueira", r: R("loja", "nao", "vender", "varejo", "90", "12a25", "dono"), origem: "/",
    passos: [
      ["contato", "2026-08-20 09:30", "Vende roupa infantil pelas redes sociais e quer uma loja própria."],
      ["proposta", "2026-08-24 17:00", "Proposta com catálogo, carrinho, frete e pagamento por Pix e cartão."],
      ["fechado", "2026-09-02 14:00", "Contrato assinado. As fotos dos produtos chegam na próxima semana."],
    ],
  },
  {
    id: "1003", quando: "2026-08-25 10:05", nome: "Lucas Barros", r: R("landing", "nao", "contatos", "fitness", "30", "3a6", "dono"), origem: "/servicos/landing-pages/",
    passos: [
      ["contato", "2026-08-25 16:20", "Quer uma página para a aula experimental do estúdio."],
      ["proposta", "2026-08-27 10:00", "Proposta enviada: página única com formulário de agendamento."],
      ["perdido", "2026-09-08 09:00", "Decidiu esperar o próximo semestre."],
    ],
  },
  {
    id: "1004", quando: "2026-08-26 14:30", nome: "Aline Moura", r: R("site", "evoluir", "credibilidade", "arquitetura", "sempressa", "6a12", "dono"), origem: "/blog/primeira-tela-do-site/",
    passos: [
      ["contato", "2026-08-26 17:10", "Leu o artigo sobre a primeira tela e quer refazer a página inicial."],
      ["proposta", "2026-08-31 15:00", "Proposta: nova página inicial e portfólio separado por tipo de obra."],
      ["fechado", "2026-09-18 11:20", "Proposta aceita. Entrega combinada para novembro."],
    ],
  },
  {
    id: "1005", quando: "2026-08-28 08:50", nome: "Ricardo Fontes", r: R("sistema", "evoluir", "operacao", "servicos", "90", "mais25", "socio"), origem: "/servicos/sistemas/",
    passos: [
      ["contato", "2026-08-28 14:00", "Consultoria que controla clientes em planilhas. Quer tudo num lugar só."],
      ["proposta", "2026-09-04 10:00", "Proposta em duas fases: cadastro de clientes e, depois, relatórios."],
    ],
    notas: [["2026-09-21 10:00", "Retorno combinado para depois da reunião de sócios."]],
  },
  {
    id: "1006", quando: "2026-09-01 11:15", nome: "Larissa Duarte", r: R("app", "evoluir", "operacao", "educacao", "sempressa", "mais25", "socio"), origem: "/servicos/aplicativos/",
    passos: [
      ["contato", "2026-09-01 16:30", "Escola de idiomas. Quer um app para avisos e reposição de aulas."],
      ["proposta", "2026-09-09 09:45", "Proposta enviada: app para iOS e Android e painel para a secretaria."],
    ],
  },
  {
    id: "1007", quando: "2026-09-02 19:20", nome: "Eduardo Pires", r: R("landing", "naogera", "credibilidade", "imobiliario", "30", "3a6", "marketing"), origem: "/",
    passos: [
      ["contato", "2026-09-03 09:10", "Marketing da imobiliária quer uma página para um lançamento."],
      ["perdido", "2026-09-10 15:00", "Sem retorno depois de três tentativas de contato."],
    ],
  },
  {
    id: "1008", quando: "2026-09-04 13:00", nome: "Natália Ramos", r: R("loja", "naogera", "vender", "varejo", "90", "12a25", "socio"), origem: "/servicos/lojas-virtuais/",
    passos: [
      ["contato", "2026-09-04 17:45", "A loja atual não vende pelo celular. Quer trocar de plataforma."],
      ["proposta", "2026-09-09 11:00", "Proposta com migração dos produtos e um checkout novo."],
      ["fechado", "2026-09-23 16:10", "Contrato assinado. A migração começa em 28/9."],
    ],
  },
  {
    id: "1009", quando: "2026-09-08 09:35", nome: "Vinícius Cardoso", r: R("naosei", "nao", "contatos", "alimentacao", "ontem", "ate3", "dono"), origem: "/",
    passos: [
      ["contato", "2026-09-08 14:00", "Precisa de algo em uma semana. Explicamos o que cabe nesse prazo."],
      ["perdido", "2026-09-11 10:00", "Preferiu usar só o aplicativo de entregas por enquanto."],
    ],
  },
  {
    id: "1010", quando: "2026-09-09 15:50", nome: "Débora Matos", r: R("site", "nao", "credibilidade", "saude", "90", "6a12", "dono"), origem: "/servicos/sites/",
    passos: [
      ["contato", "2026-09-10 10:00", "Consultório de fisioterapia. Quer receber pedidos de agendamento pelo site."],
      ["proposta", "2026-09-15 14:30", "Proposta: site com páginas de tratamentos e botão de agendamento."],
    ],
  },
  {
    id: "1011", quando: "2026-09-10 10:25", nome: "Marcelo Quintana", r: R("sistema", "evoluir", "operacao", "imobiliario", "90", "12a25", "socio"), origem: "/",
    passos: [
      ["contato", "2026-09-10 15:00", "Reunião de diagnóstico marcada. Hoje usam três planilhas para os imóveis."],
      ["proposta", "2026-09-17 16:00", "Proposta enviada: cadastro de imóveis, clientes e visitas."],
    ],
  },
  {
    id: "1012", quando: "2026-09-12 17:05", nome: "Tatiane Freitas", r: R("landing", "naogera", "contatos", "servicos", "30", "3a6", "dono"), origem: "/blog/sinais-site-perdendo-clientes/",
    passos: [
      ["contato", "2026-09-14 10:00", "Leu o artigo sobre sinais de que o site perde clientes. O formulário dela não enviava nada."],
      ["proposta", "2026-09-16 11:00", "Proposta enviada: landing page com formulário e aviso por e-mail."],
      ["perdido", "2026-09-29 18:00", "Fechou com outro fornecedor."],
    ],
  },
  {
    id: "1013", quando: "2026-09-14 08:30", nome: "Henrique Borges", r: R("site", "evoluir", "credibilidade", "advocacia", "sempressa", "12a25", "socio"), origem: "/servicos/sites/",
    passos: [["contato", "2026-09-14 13:20", "Pediu para retomar a conversa em novembro, depois do recesso do escritório."]],
  },
  {
    id: "1014", quando: "2026-09-16 11:40", nome: "Sabrina Lacerda", r: R("loja", "nao", "vender", "varejo", "90", "6a12", "dono"), origem: "/servicos/lojas-virtuais/",
    passos: [
      ["contato", "2026-09-16 16:00", "Faz bolsas artesanais. Vende por mensagem e quer um catálogo com carrinho."],
      ["proposta", "2026-09-22 10:30", "Proposta: loja com até 60 produtos e pagamento por Pix e cartão."],
    ],
  },
  {
    id: "1015", quando: "2026-09-18 20:15", nome: "Paulo Vieira", r: R("landing", "nao", "contatos", "alimentacao", "30", "ate3", "dono"), origem: "/",
    passos: [
      ["contato", "2026-09-21 09:30", "Lanchonete de bairro. Quer receber encomendas para festas."],
      ["perdido", "2026-09-30 11:00", "Preferiu começar só com o cardápio digital."],
    ],
  },
  {
    id: "1016", quando: "2026-09-21 14:10", nome: "Isabela Cunha", r: R("landing", "naogera", "contatos", "saude", "30", "3a6", "dono"), origem: "/lp/dentistas/", utm: DENTISTAS,
    passos: [
      ["contato", "2026-09-21 17:30", "Clínica odontológica. Chegou pela campanha de dentistas."],
      ["proposta", "2026-09-23 15:00", "Proposta: página de implantes com formulário de avaliação."],
      ["fechado", "2026-10-02 10:15", "Proposta aceita. Página no ar em até 15 dias."],
    ],
  },
  {
    id: "1017", quando: "2026-09-22 09:05", nome: "Otávio Brandão", r: R("site", "evoluir", "credibilidade", "arquitetura", "90", "12a25", "socio"), origem: "/servicos/sites/",
    passos: [
      ["contato", "2026-09-22 13:40", "Escritório com muitas obras entregues. Quer o portfólio organizado por projeto."],
      ["proposta", "2026-09-29 16:20", "Proposta enviada com portfólio e uma página para cada projeto."],
    ],
  },
  {
    id: "1018", quando: "2026-09-24 16:45", nome: "Priscila Neves", r: R("app", "evoluir", "operacao", "fitness", "sempressa", "12a25", "socio"), origem: "/servicos/aplicativos/",
    passos: [["contato", "2026-09-25 10:00", "Quer um app para marcar aulas. Combinamos uma conversa com a equipe do estúdio."]],
  },
  {
    id: "1019", quando: "2026-09-25 10:30", nome: "Leandro Gomes", r: R("landing", "naogera", "contatos", "saude", "30", "3a6", "socio"), origem: "/lp/dentistas/", utm: DENTISTAS,
    passos: [
      ["contato", "2026-09-25 15:10", "Sócio de uma clínica com duas unidades. Quer uma página para cada uma."],
      ["proposta", "2026-09-30 09:30", "Proposta: duas páginas com o mesmo formulário de avaliação."],
      ["fechado", "2026-10-08 14:00", "Contrato assinado. Fotos das clínicas em produção."],
    ],
  },
  {
    id: "1020", quando: "2026-09-28 08:55", nome: "Carolina Reis", r: R("loja", "naogera", "contatos", "varejo", "30", "6a12", "marketing"), origem: "/servicos/lojas-virtuais/",
    passos: [
      ["contato", "2026-09-28 11:30", "Marketing de uma marca de cosméticos. Quer captar revendedoras antes de vender direto."],
      ["proposta", "2026-10-01 17:00", "Proposta: loja com área de cadastro para revendedoras."],
    ],
  },
  {
    id: "1021", quando: "2026-09-29 13:20", nome: "Mariana Lopes", r: R("landing", "nao", "contatos", "saude", "ontem", "3a6", "dono"), origem: "/lp/dentistas/", utm: DENTISTAS,
    passos: [["contato", "2026-09-29 16:00", "A clínica abre em novembro. Quer a página no ar antes da inauguração."]],
  },
  {
    id: "1022", quando: "2026-09-30 19:40", nome: "Rafael Nogueira", r: R("site", "naogera", "credibilidade", "advocacia", "90", "6a12", "socio"), origem: "/blog/landing-page-ou-site/",
    passos: [
      ["contato", "2026-10-01 09:20", "Leu o artigo sobre landing page ou site. Está entre as duas opções."],
      ["perdido", "2026-10-09 17:30", "Decidiu manter o site atual por mais um ano."],
    ],
  },
  {
    id: "1023", quando: "2026-10-01 10:10", nome: "Camila Ferraz", r: R("loja", "evoluir", "vender", "varejo", "90", "mais25", "dono"), origem: "/",
    passos: [
      ["contato", "2026-10-01 14:30", "Marca de moda com loja em plataforma pronta. Quer um checkout mais rápido."],
      ["proposta", "2026-10-07 11:45", "Proposta enviada: loja nova com migração de clientes e pedidos."],
    ],
  },
  {
    id: "1024", quando: "2026-10-03 11:25", nome: "Diego Martins", r: R("sistema", "evoluir", "operacao", "alimentacao", "sempressa", "3a6", "dono"), origem: "/servicos/sistemas/",
    passos: [["contato", "2026-10-05 10:00", "Orçamento curto para um sistema completo. Sugerimos começar pelo controle de pedidos."]],
  },
  {
    id: "1025", quando: "2026-10-05 09:40", nome: "Luciana Prado", r: R("site", "nao", "credibilidade", "imobiliario", "30", "6a12", "dono"), origem: "/",
    passos: [
      ["contato", "2026-10-05 15:00", "Imobiliária pequena, ainda sem site. Quer os imóveis com busca por bairro."],
      ["proposta", "2026-10-09 16:00", "Proposta: site com busca de imóveis e contato direto com o corretor."],
    ],
  },
  {
    id: "1026", quando: "2026-10-06 14:15", nome: "Thiago Almeida", r: R("landing", "naogera", "contatos", "educacao", "30", "3a6", "marketing"), origem: "/servicos/landing-pages/",
    passos: [["contato", "2026-10-07 09:30", "Marketing de um curso técnico. Quer uma página para as matrículas de 2027."]],
  },
  {
    id: "1027", quando: "2026-10-07 10:50", nome: "Fernanda Castro", r: R("site", "nao", "credibilidade", "arquitetura", "sempressa", "6a12", "dono"), origem: "/servicos/sites/",
    passos: [["contato", "2026-10-07 15:20", "Quer mostrar o portfólio de obras. Vai separar as fotos dos projetos."]],
  },
  {
    id: "1028", quando: "2026-10-08 15:35", nome: "Bruno Teixeira", r: R("naosei", "naogera", "contatos", "servicos", "90", "proposta", "socio"), origem: "/",
    passos: [["contato", "2026-10-09 09:10", "Ainda não sabe entre site e landing page. Mandamos o artigo sobre o assunto."]],
  },
  {
    id: "1029", quando: "2026-10-09 11:00", nome: "Patrícia Mendes", r: R("landing", "nao", "contatos", "saude", "30", "3a6", "dono"), origem: "/lp/dentistas/", utm: DENTISTAS,
    passos: [
      ["contato", "2026-10-09 14:30", "Clínica de ortodontia. Quer divulgar a primeira avaliação."],
      ["proposta", "2026-10-13 10:00", "Proposta enviada com página única e formulário de avaliação."],
    ],
  },
  {
    id: "1030", quando: "2026-10-10 09:15", nome: "André Souza", r: R("app", "evoluir", "operacao", "educacao", "90", "mais25", "socio"), origem: "/",
    passos: [["contato", "2026-10-13 10:30", "Colégio quer um app para os pais acompanharem avisos e notas."]],
  },
  {
    id: "1031", quando: "2026-10-12 16:20", nome: "Juliana Rocha", r: R("landing", "naogera", "contatos", "imobiliario", "30", "6a12", "marketing"), origem: "/servicos/landing-pages/",
    passos: [["contato", "2026-10-13 11:15", "Marketing de uma construtora. Quer uma página para o lançamento de um prédio."]],
  },
  { id: "1032", quando: "2026-10-13 18:10", nome: "Gustavo Lima", r: R("site", "naogera", "credibilidade", "servicos", "90", "6a12", "dono"), origem: "/blog/aparecer-no-google/" },
  { id: "1033", quando: "2026-10-14 09:25", nome: "Felipe Antunes", r: R("loja", "nao", "vender", "alimentacao", "30", "6a12", "dono"), origem: "/" },
];

const semAcento = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function montarLead(b: Bruto): Lead {
  const [primeiro, ...resto] = semAcento(b.nome).split(" ");
  const eventos: Evento[] = [
    { tipo: "recebido", em: b.quando },
    { tipo: "aviso", em: b.quando },
  ];
  let atual: LeadStatus = "novo";
  for (const [status, em, nota] of b.passos ?? []) {
    eventos.push({ tipo: "status", em, status, de: atual });
    if (nota) eventos.push({ tipo: "nota", em, texto: nota, autor: AUTOR_EQUIPE });
    atual = status;
  }
  for (const [em, texto] of b.notas ?? []) eventos.push({ tipo: "nota", em, texto, autor: AUTOR_EQUIPE });
  eventos.sort((x, y) => (x.em < y.em ? -1 : x.em > y.em ? 1 : 0));
  const n = Number(b.id);
  return {
    id: b.id,
    quando: b.quando,
    nome: b.nome,
    respostas: b.r,
    // Contatos fictícios: DDD 00 não existe e o domínio .example é reservado para exemplos.
    contato: { whatsapp: `(00) 9${pad(Math.floor(n / 100))}${pad(n % 100)}-${String((n * 37) % 10000).padStart(4, "0")}`, email: `${primeiro}.${resto.at(-1)}@email.example` },
    consentimento: { em: b.quando, versao: "versão 1 da política de privacidade" },
    origem: { caminho: b.origem, utm: b.utm },
    status: atual,
    compat: compatibilidade(b.r),
    eventos,
  };
}

/** Do mais novo para o mais antigo. Com o backend: GET dos leads, já ordenados. */
export const LEADS: Lead[] = BRUTOS.map(montarLead).sort((a, b) => (a.quando < b.quando ? 1 : -1));
export const leadPorId = (id: string) => LEADS.find((l) => l.id === id);

/* ============================================================
   Landing pages do LP Hub (5 de serviço e 2 de campanha)
   ============================================================ */

export type SecaoId = "topo" | "problema" | "incluso" | "como" | "exemplos" | "perguntas" | "chamada";
export type Fundo = "branco" | "azul" | "papel";

/** Seções prontas que montam uma landing page. `fundo` serve para evitar duas faixas azuis seguidas. */
export const SECOES: Record<SecaoId, { nome: string; descricao: string; fundo: Fundo; fixa?: boolean }> = {
  topo: { nome: "Topo", descricao: "Frase principal, botão Começar e a demo em movimento", fundo: "branco", fixa: true },
  problema: { nome: "Problema e solução", descricao: "O que trava o cliente hoje e como a página resolve", fundo: "branco" },
  incluso: { nome: "O que está incluso", descricao: "Cards com o que vem no projeto, em faixa azul", fundo: "azul" },
  como: { nome: "Como funciona", descricao: "Os quatro passos, da conversa ao lançamento", fundo: "branco" },
  exemplos: { nome: "Exemplos", descricao: "Prévias de negócios fictícios no mesmo segmento", fundo: "papel" },
  perguntas: { nome: "Perguntas frequentes", descricao: "Dúvidas comuns sobre este serviço", fundo: "branco" },
  chamada: { nome: "Chamada final", descricao: "Faixa azul com o botão Começar", fundo: "azul" },
};
export const SECOES_PADRAO: { id: SecaoId; ligada: boolean }[] = [
  { id: "topo", ligada: true },
  { id: "problema", ligada: true },
  { id: "incluso", ligada: true },
  { id: "como", ligada: true },
  { id: "exemplos", ligada: true },
  { id: "perguntas", ligada: true },
  { id: "chamada", ligada: true },
];

/** As cinco demos em movimento (mesmos ids do registro de composições). */
export const DEMOS: { id: CompId; servico: string; nome: string; descricao: string }[] = SERVICES.map((s) => ({
  id: DEMO_BY_SERVICE[s.slug as keyof typeof DEMO_BY_SERVICE],
  servico: s.slug,
  nome: s.name,
  descricao: DEMO_LABELS[s.slug].replace(/^Animação: (.)/, (_, c: string) => c.toUpperCase()),
}));

export type LandingPage = {
  slug: string;
  tipo: "servico" | "campanha";
  nome: string;
  caminho: string;
  /** Serviço do botão Começar (/comecar/?servico=...). */
  servico: string;
  titulo: string;
  subtitulo: string;
  demo: CompId;
  secoes: { id: SecaoId; ligada: boolean }[];
  seo: { titulo: string; descricao: string };
  status: "publicada" | "rascunho";
  /** Visitas nos últimos 30 dias (exemplo). */
  visitas: number;
  atualizadaEm: string;
};

const servicoLp = (
  slug: string,
  titulo: string,
  subtitulo: string,
  visitas: number,
  seo: LandingPage["seo"],
  atualizadaEm: string,
  secoes: LandingPage["secoes"] = SECOES_PADRAO,
): LandingPage => {
  const s = SERVICES.find((x) => x.slug === slug)!;
  return {
    slug,
    tipo: "servico",
    nome: s.name,
    caminho: `/servicos/${slug}/`,
    servico: slug,
    titulo,
    subtitulo,
    demo: DEMO_BY_SERVICE[slug as keyof typeof DEMO_BY_SERVICE],
    secoes,
    seo,
    status: "publicada",
    visitas,
    atualizadaEm,
  };
};

/** Com o backend: GET das landing pages com as visitas do período. */
export const LANDING_PAGES: LandingPage[] = [
  servicoLp(
    "landing-pages",
    "Uma página feita para virar contato.",
    "Landing page com um objetivo só, formulário curto e aviso na hora em que o pedido chega.",
    96,
    { titulo: "Landing pages que viram contato · V8 Studio", descricao: "Uma página com um objetivo só, formulário curto e aviso na hora em que o pedido chega. Conte o que você precisa e receba a proposta em até 1 dia útil." },
    "2026-10-02 10:00",
  ),
  servicoLp(
    "sites",
    "Seu negócio explicado em poucos segundos.",
    "Site institucional rápido, fácil de editar e pensado primeiro para o celular.",
    88,
    { titulo: "Sites institucionais · V8 Studio", descricao: "Site rápido, fácil de editar e pensado primeiro para o celular, com cada serviço explicado do jeito que o seu cliente procura." },
    "2026-09-30 15:20",
  ),
  servicoLp(
    "lojas-virtuais",
    "Uma loja aberta todos os dias.",
    "Catálogo, carrinho e pagamento sem atrito, com os pedidos organizados num painel.",
    71,
    { titulo: "Lojas virtuais · V8 Studio", descricao: "Catálogo, carrinho e pagamento sem atrito, com os pedidos organizados num painel. Venda todos os dias, não só no horário comercial." },
    "2026-09-28 09:40",
  ),
  servicoLp(
    "sistemas",
    "Pedidos, agenda e equipe num lugar só.",
    "Sistema sob medida para a rotina da sua empresa, sem planilha espalhada.",
    52,
    { titulo: "Sistemas sob medida · V8 Studio", descricao: "Pedidos, agenda e atendimento num lugar só, do jeito que a sua equipe já trabalha. Sem planilha espalhada." },
    "2026-09-24 14:10",
  ),
  servicoLp(
    "aplicativos",
    "Seu serviço a um toque do cliente.",
    "Aplicativo com avisos, agendamento e acesso rápido ao que o cliente mais usa.",
    47,
    { titulo: "Aplicativos · V8 Studio", descricao: "Seu serviço no celular do cliente, com avisos na hora certa e acesso rápido ao que ele mais usa." },
    "2026-09-24 14:30",
  ),
  {
    slug: "dentistas",
    tipo: "campanha",
    nome: "Dentistas",
    caminho: "/lp/dentistas/",
    servico: "landing-pages",
    titulo: "Mais pacientes pedindo avaliação pela internet.",
    subtitulo: "Landing page para clínicas odontológicas, com pedido de avaliação em poucos toques.",
    demo: "demo-landing",
    secoes: [
      { id: "topo", ligada: true },
      { id: "problema", ligada: true },
      { id: "exemplos", ligada: true },
      { id: "incluso", ligada: true },
      { id: "como", ligada: true },
      { id: "perguntas", ligada: false },
      { id: "chamada", ligada: true },
    ],
    seo: { titulo: "Landing page para dentistas · V8 Studio", descricao: "Página para clínicas odontológicas com pedido de avaliação em poucos toques. Receba a proposta em até 1 dia útil." },
    status: "publicada",
    visitas: 138,
    atualizadaEm: "2026-09-20 18:00",
  },
  {
    slug: "restaurantes",
    tipo: "campanha",
    nome: "Restaurantes",
    caminho: "/lp/restaurantes/",
    servico: "sites",
    titulo: "Seu cardápio na mão de quem está com fome.",
    subtitulo: "Site para restaurantes com cardápio, encomendas e reservas.",
    demo: "demo-site",
    secoes: [
      { id: "topo", ligada: true },
      { id: "exemplos", ligada: true },
      { id: "problema", ligada: false },
      { id: "como", ligada: true },
      { id: "incluso", ligada: true },
      { id: "perguntas", ligada: true },
      { id: "chamada", ligada: true },
    ],
    seo: { titulo: "Site para restaurantes · V8 Studio", descricao: "" },
    status: "rascunho",
    visitas: 0,
    atualizadaEm: "2026-10-13 17:45",
  },
];

/* ============================================================
   Origem dos leads
   ============================================================ */

export type Origem = { chave: string; rotulo: string; detalhe: string; tipo: "inicio" | "servico" | "campanha" | "blog" | "outra" };

export function origemDe(caminho: string): Origem {
  if (caminho === "/") return { chave: "inicio", rotulo: "Página inicial", detalhe: "/", tipo: "inicio" };
  if (caminho.startsWith("/blog/")) {
    const post = POSTS.find((p) => `/blog/${p.slug}/` === caminho);
    return { chave: "blog", rotulo: "Blog", detalhe: post ? post.title : caminho, tipo: "blog" };
  }
  const lp = LANDING_PAGES.find((x) => x.caminho === caminho);
  if (lp) return { chave: lp.slug, rotulo: lp.tipo === "campanha" ? `Campanha ${lp.nome}` : lp.nome, detalhe: lp.caminho, tipo: lp.tipo };
  return { chave: caminho, rotulo: caminho, detalhe: caminho, tipo: "outra" };
}

/** Opções do filtro de origem, na ordem do LP Hub. */
export const ORIGENS: Origem[] = [origemDe("/"), ...LANDING_PAGES.map((lp) => origemDe(lp.caminho)), { chave: "blog", rotulo: "Blog", detalhe: "/blog/", tipo: "blog" }];

/* ============================================================
   Números do painel
   ============================================================ */

/** Primeira segunda-feira do gráfico semanal: nove semanas até a atual. */
export const SEMANAS_INICIO = "2026-08-17";
export const N_SEMANAS = 9;

export type Semana = { inicio: string; fim: string; total: number; parcial: boolean };

export function leadsPorSemana(leads: Lead[]): Semana[] {
  const d0 = diaNum(SEMANAS_INICIO);
  const hoje = diaNum(DEMO_HOJE);
  return Array.from({ length: N_SEMANAS }, (_, i) => {
    const ini = d0 + i * 7;
    const fim = Math.min(ini + 6, hoje);
    return {
      inicio: diaStr(ini),
      fim: diaStr(fim),
      total: leads.filter((l) => {
        const d = diaNum(l.quando);
        return d >= ini && d <= fim;
      }).length,
      parcial: ini + 6 > hoje,
    };
  });
}

const fechadoEm = (l: Lead) => {
  for (let i = l.eventos.length - 1; i >= 0; i--) {
    const e = l.eventos[i];
    if (e.tipo === "status") return e.status === "fechado" ? e.em : null;
  }
  return null;
};

export type Resumo = {
  recebidos: number;
  recebidosAntes: number;
  compatMedia: number;
  compatMediaAntes: number;
  emNegociacao: number;
  propostas: number;
  fechados: number;
  fechadosAntes: number;
};

export function resumo(leads: Lead[]): Resumo {
  const doPeriodo = leads.filter((l) => noIntervalo(l.quando, PERIODO.inicio, PERIODO.fim));
  const antes = leads.filter((l) => noIntervalo(l.quando, PERIODO_ANTERIOR.inicio, PERIODO_ANTERIOR.fim));
  const media = (ls: Lead[]) => (ls.length ? Math.round(ls.reduce((a, l) => a + l.compat.total, 0) / ls.length) : 0);
  const fechadosEntre = (ini: string, fim: string) =>
    leads.filter((l) => {
      const f = fechadoEm(l);
      return f !== null && noIntervalo(f, ini, fim);
    }).length;
  return {
    recebidos: doPeriodo.length,
    recebidosAntes: antes.length,
    compatMedia: media(doPeriodo),
    compatMediaAntes: media(antes),
    emNegociacao: leads.filter((l) => l.status === "contato" || l.status === "proposta").length,
    propostas: leads.filter((l) => l.status === "proposta").length,
    fechados: fechadosEntre(PERIODO.inicio, PERIODO.fim),
    fechadosAntes: fechadosEntre(PERIODO_ANTERIOR.inicio, PERIODO_ANTERIOR.fim),
  };
}

/** Leads do período por origem, da maior para a menor. */
export function leadsPorOrigem(leads: Lead[]) {
  const conta = new Map<string, { origem: Origem; total: number }>();
  for (const l of leads) {
    if (!noIntervalo(l.quando, PERIODO.inicio, PERIODO.fim)) continue;
    const o = origemDe(l.origem.caminho);
    const atual = conta.get(o.chave) ?? { origem: { ...o, detalhe: o.tipo === "blog" ? "Artigos do blog" : o.detalhe }, total: 0 };
    atual.total++;
    conta.set(o.chave, atual);
  }
  return [...conta.values()].sort((a, b) => b.total - a.total || a.origem.rotulo.localeCompare(b.origem.rotulo, "pt-BR"));
}

/** Leads do período que começaram em uma landing page. */
export const leadsDaPagina = (lp: LandingPage, leads: Lead[] = LEADS) =>
  leads.filter((l) => l.origem.caminho === lp.caminho && noIntervalo(l.quando, PERIODO.inicio, PERIODO.fim)).length;

/* ============================================================
   Posts: os artigos publicados vêm de content/posts.ts; aqui ficam os rascunhos de exemplo
   ============================================================ */

export type PostAdmin = Post & { status: "publicado" | "rascunho"; atualizadoEm: string; seoTitulo?: string; seoDescricao?: string };

export const RASCUNHOS: PostAdmin[] = [
  {
    slug: "quanto-tempo-leva-um-site",
    title: "Quanto tempo leva para colocar um site no ar",
    excerpt: "O prazo depende menos do tamanho e mais das decisões do caminho. Veja o que pesa e como ganhar tempo.",
    cover: "Do zero ao ar",
    category: "Estratégia",
    date: "2026-10-20",
    minutes: 3,
    author: "Equipe V8 Studio",
    status: "rascunho",
    atualizadoEm: "2026-10-13 17:20",
    body: [
      "O prazo de um site depende menos do tamanho e mais das decisões que precisam ser tomadas no caminho. Quanto mais claro o começo, mais curto o projeto.",
      "",
      "## O que mais pesa no prazo",
      "",
      "- **Textos e fotos.** Esperar material costuma atrasar mais do que o desenvolvimento.",
      "- **Quantidade de páginas.** Uma landing page tem um objetivo só. Um site institucional tem várias páginas para revisar.",
      "- **Integrações.** Agenda, pagamento e sistemas de atendimento pedem testes a mais.",
      "",
      "## Como ganhar tempo antes de começar",
      "",
      "1. Liste o que o seu cliente precisa ver para escolher você.",
      "2. Separe as fotos que você já tem, mesmo as do celular.",
      "3. Defina quem aprova cada etapa do lado da sua empresa.",
      "",
      "> O prazo exato vem na proposta, por escrito, junto com o escopo.",
      "",
      "## Próximo passo",
      "",
      "Conte o que você precisa no [formulário Começar](/comecar/). A resposta chega em até 1 dia útil.",
    ].join("\n"),
  },
];

/** Artigos publicados (somente leitura de content/posts.ts) e rascunhos, do mais novo para o mais antigo. */
export const POSTS_ADMIN: PostAdmin[] = [
  ...RASCUNHOS,
  ...POSTS.map((p): PostAdmin => ({ ...p, status: "publicado", atualizadoEm: `${p.date} 09:00` })),
];
export const postAdminPorSlug = (slug: string) => POSTS_ADMIN.find((p) => p.slug === slug);
export const CATEGORIAS = [...new Set(POSTS_ADMIN.map((p) => p.category))];

/* ============================================================
   Configurações e usuário
   ============================================================ */

export type Configuracoes = {
  empresa: { nome: string; razaoSocial: string; cnpj: string; cidade: string; dominio: string };
  /** Campo interno: nunca aparece no site. */
  avisos: { destinatarios: string[] };
  prazoResposta: string;
  analise: { ga4: string; gtm: string; metaPixel: string };
};

/** Com o backend: GET e PUT das configurações. Razão social, CNPJ e cidade esperam os dados reais. */
export const CONFIG_PADRAO: Configuracoes = {
  empresa: { nome: "V8 Studio", razaoSocial: "", cnpj: "", cidade: "", dominio: SITE_DOMINIO },
  avisos: { destinatarios: ["comercial@exemplo.example"] },
  prazoResposta: "Respondemos em até 1 dia útil.",
  analise: { ga4: "", gtm: "", metaPixel: "" },
};

export const USUARIO_DEMO = { nome: "Equipe V8", inicial: "E", papel: "Acesso de demonstração" } as const;

export const AVISO_DEMO = "Modo demonstração: dados de exemplo. Os pedidos reais aparecem aqui quando o backend for ligado.";
