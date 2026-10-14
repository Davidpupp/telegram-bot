// Contrato do lead que o formulário "Começar" (/comecar/) monta e envia.
// As chaves das respostas são as mesmas dos links: ?servico=<slug> e ?objetivo=<chave>.

export const SERVICE_SLUGS = ["landing-pages", "sites", "lojas-virtuais", "sistemas", "aplicativos"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const GOAL_KEYS = ["contatos", "vender", "confianca", "organizar", "celular"] as const;
export type GoalKey = (typeof GOAL_KEYS)[number];

/** "naosei" quando a pessoa ainda não sabe o serviço; o formulário indica o que mais combina. */
export type NeedKey = ServiceSlug | "naosei";
export type CurrentSiteKey = "nao" | "naogera" | "evoluir";
export type SegmentKey = "saude" | "advocacia" | "alimentacao" | "imobiliario" | "fitness" | "arquitetura" | "varejo" | "servicos" | "educacao" | "outro";
export type DeadlineKey = "ontem" | "30" | "90" | "sempressa";
export type BudgetKey = "ate3" | "3a6" | "6a12" | "12a25" | "mais25" | "proposta";
export type RoleKey = "dono" | "socio" | "marketing" | "agencia";

/** Uma resposta por pergunta, pela chave da opção escolhida. */
export type LeadAnswers = {
  /** O que você precisa hoje? */
  need: NeedKey;
  /** Você já tem site? */
  currentSite: CurrentSiteKey;
  /** Qual é o objetivo principal? */
  goal: GoalKey;
  /** Qual é o seu segmento? */
  segment: SegmentKey;
  /** Para quando você precisa? */
  deadline: DeadlineKey;
  /** Quanto você pensa em investir? */
  budget: BudgetKey;
  /** Você é… */
  role: RoleKey;
};
export type QuestionId = keyof LeadAnswers;

export type LeadChannel = "whatsapp" | "email";

export type LeadUtm = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
};

export type LeadSource = {
  /** Página de onde a pessoa veio: ?origem=/caminho/ no link ou, quando o navegador informa, a página anterior do próprio site. */
  page: string | null;
  /** Endereço do formulário como foi aberto, com a consulta (ex.: /comecar/?servico=sistemas). */
  formUrl: string;
  /** Site que trouxe a pessoa (origem e caminho, sem a consulta), quando o navegador informa. */
  referrer: string | null;
  /** Pré-seleção que veio no link. */
  preselected: { service: ServiceSlug | null; goal: GoalKey | null };
  utm: LeadUtm;
};

/** Texto do consentimento mostrado ao lado da caixa. Mudou o texto, mude a versão. */
export const CONSENT_TEXT = "Concordo que a V8 Studio use estes dados para responder ao meu pedido, como explica a política de privacidade.";
export const CONSENT_LINK_TEXT = "política de privacidade";
export const CONSENT_VERSION = "2026-10";

export type LeadPayload = {
  /** Versão deste formato. */
  schema: 1;
  /** Quando a pessoa enviou (ISO 8601). */
  createdAt: string;
  answers: LeadAnswers;
  /** As mesmas respostas como apareceram na tela, para o aviso por e-mail e o painel. */
  answerLabels: Record<QuestionId, string>;
  /** Serviço indicado no resultado: a página dele é /servicos/<slug>/. */
  recommendedService: ServiceSlug;
  /** De 0 a 100: quanto as respostas combinam com o serviço indicado (fórmula em components/comecar/score.ts). */
  compatibility: number;
  contact: {
    name: string;
    company: string;
    /** Como a pessoa prefere receber a resposta. */
    channel: LeadChannel;
    /** Com código do país, só dígitos depois do +, quando o canal é WhatsApp (ex.: +5511912345678). */
    whatsapp: string | null;
    email: string | null;
  };
  consent: {
    accepted: true;
    /** Quando a caixa foi marcada (ISO 8601). */
    acceptedAt: string;
    version: string;
    text: string;
  };
  source: LeadSource;
};

export type SubmitLeadResult = { ok: true; id: string } | { ok: false; error: string };

type ParamReader = { get(name: string): string | null };

export const isServiceSlug = (v: string | null): v is ServiceSlug => v !== null && (SERVICE_SLUGS as readonly string[]).includes(v);
export const isGoalKey = (v: string | null): v is GoalKey => v !== null && (GOAL_KEYS as readonly string[]).includes(v);

const clean = (v: string | null, max = 120) => {
  const t = v?.trim();
  return t ? t.slice(0, max) : null;
};

export function readUtm(params: ParamReader): LeadUtm {
  return {
    source: clean(params.get("utm_source")),
    medium: clean(params.get("utm_medium")),
    campaign: clean(params.get("utm_campaign")),
    term: clean(params.get("utm_term")),
    content: clean(params.get("utm_content")),
  };
}

/** Origem do lead a partir da URL do formulário e do referrer. Só roda no navegador (na hora do envio). */
export function readSource(params: ParamReader): LeadSource {
  const { origin, pathname, search } = window.location;
  let page: string | null = null;
  let referrer: string | null = null;

  const origem = clean(params.get("origem"), 300);
  if (origem && origem.startsWith("/") && !origem.startsWith("//")) page = origem;

  try {
    if (document.referrer) {
      const r = new URL(document.referrer);
      referrer = `${r.origin}${r.pathname}`;
      if (!page && r.origin === origin && !r.pathname.startsWith("/comecar")) page = r.pathname;
    }
  } catch {
    // Referrer ilegível: fica sem.
  }

  const servico = params.get("servico");
  const objetivo = params.get("objetivo");
  return {
    page,
    formUrl: `${pathname}${search}`,
    referrer,
    preselected: { service: isServiceSlug(servico) ? servico : null, goal: isGoalKey(objetivo) ? objetivo : null },
    utm: readUtm(params),
  };
}

const STORAGE_KEY = "v8-leads";

const newId = () => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    // Contexto sem crypto.randomUUID (http comum): usa o reserva abaixo.
  }
  return `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Envia o lead. Por enquanto grava no localStorage do navegador (últimos 20) e devolve sucesso,
 * mesmo quando o armazenamento não está disponível (aba anônima, cota cheia).
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitLeadResult> {
  // TODO backend: trocar por POST /api/leads
  const id = newId();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    list.push({ id, ...payload });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-20)));
  } catch {
    // Sem localStorage: o envio de verdade fica com o backend.
  }
  return { ok: true, id };
}
