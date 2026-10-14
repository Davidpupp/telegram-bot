// Compatibilidade e indicação do formulário "Começar". Funções puras: o backend pode recalcular com o mesmo código.
import { SERVICE_SLUGS, type BudgetKey, type DeadlineKey, type GoalKey, type LeadAnswers, type SegmentKey, type ServiceSlug } from "@/lib/leads";

/*
 * COMPATIBILIDADE: quanto as respostas combinam com o serviço indicado, de 0 a 100.
 * (Na tela: "Mede o quanto suas respostas combinam com o serviço indicado.")
 *
 * Cada resposta que diz algo sobre o serviço vira uma nota de 0 a 1. A compatibilidade é a média ponderada:
 *
 *   compatibilidade = arredondar(100 × (0,40 × objetivo + 0,25 × investimento + 0,20 × prazo + 0,15 × escolha))
 *
 *   objetivo (40 %)      Quanto o serviço foi feito para o objetivo marcado (tabela GOAL_FIT). Cada objetivo tem
 *                        um serviço que nasce para ele (nota 1); os outros ajudam em parte.
 *   investimento (25 %)  A faixa marcada contra a faixa em que esse tipo de projeto costuma começar (MIN_BUDGET,
 *                        tirada das próprias descrições das faixas). Na faixa ou acima: 1. Uma faixa abaixo: 0,6.
 *                        Duas: 0,3. Três ou mais: 0,1. "Prefiro ouvir uma proposta": 0,7 (não confirma nem descarta).
 *   prazo (20 %)         O prazo marcado contra o tempo que esse tipo de projeto costuma levar (tabela DEADLINE_FIT).
 *   escolha (15 %)       1 quando a pessoa escolheu o serviço; 0,5 quando marcou "Ainda não sei". Nesse caso o
 *                        serviço indicado é o de maior compatibilidade entre os cinco (empate: o que nasce para o objetivo).
 *
 * Site atual, segmento e papel não entram na conta: mudam a proposta, não o quanto o serviço combina.
 * Exemplos: landing page + trazer contatos + 30 dias + R$ 3 a 6 mil = 100. Site institucional + passar confiança +
 * para ontem + até R$ 3 mil = 80. Sistema + passar confiança + 90 dias + R$ 6 a 12 mil = 54.
 */
export const WEIGHTS = { goal: 0.4, budget: 0.25, deadline: 0.2, choice: 0.15 } as const;

type Row = Record<ServiceSlug, number>;

/** Quanto cada serviço foi feito para cada objetivo. */
export const GOAL_FIT: Record<GoalKey, Row> = {
  contatos: { "landing-pages": 1, sites: 0.7, "lojas-virtuais": 0.4, sistemas: 0.3, aplicativos: 0.3 },
  vender: { "landing-pages": 0.6, sites: 0.4, "lojas-virtuais": 1, sistemas: 0.3, aplicativos: 0.6 },
  confianca: { "landing-pages": 0.5, sites: 1, "lojas-virtuais": 0.4, sistemas: 0.2, aplicativos: 0.3 },
  organizar: { "landing-pages": 0.1, sites: 0.2, "lojas-virtuais": 0.4, sistemas: 1, aplicativos: 0.7 },
  celular: { "landing-pages": 0.3, sites: 0.3, "lojas-virtuais": 0.5, sistemas: 0.5, aplicativos: 1 },
};

/** Quanto o prazo marcado combina com o tempo que cada tipo de projeto costuma levar. */
export const DEADLINE_FIT: Record<DeadlineKey, Row> = {
  ontem: { "landing-pages": 0.8, sites: 0.5, "lojas-virtuais": 0.4, sistemas: 0.2, aplicativos: 0.2 },
  "30": { "landing-pages": 1, sites: 0.8, "lojas-virtuais": 0.6, sistemas: 0.4, aplicativos: 0.4 },
  "90": { "landing-pages": 1, sites: 1, "lojas-virtuais": 1, sistemas: 0.8, aplicativos: 0.8 },
  sempressa: { "landing-pages": 1, sites: 1, "lojas-virtuais": 1, sistemas: 1, aplicativos: 1 },
};

/** Ordem das faixas de investimento (1 = até R$ 3 mil … 5 = acima de R$ 25 mil). */
const BUDGET_TIER: Record<Exclude<BudgetKey, "proposta">, number> = { ate3: 1, "3a6": 2, "6a12": 3, "12a25": 4, mais25: 5 };

/** Faixa em que cada tipo de projeto costuma começar. */
export const MIN_BUDGET: Row = { "landing-pages": 1, sites: 2, "lojas-virtuais": 3, sistemas: 4, aplicativos: 4 };

export function budgetFit(budget: BudgetKey, service: ServiceSlug) {
  if (budget === "proposta") return 0.7;
  const gap = MIN_BUDGET[service] - BUDGET_TIER[budget];
  if (gap <= 0) return 1;
  return gap === 1 ? 0.6 : gap === 2 ? 0.3 : 0.1;
}

type Scored = Pick<LeadAnswers, "goal" | "budget" | "deadline">;

/** Compatibilidade de 0 a 100 entre as respostas e um serviço. */
export function compatibility(a: Scored, service: ServiceSlug, chosen: boolean) {
  const sum =
    WEIGHTS.goal * GOAL_FIT[a.goal][service] +
    WEIGHTS.budget * budgetFit(a.budget, service) +
    WEIGHTS.deadline * DEADLINE_FIT[a.deadline][service] +
    WEIGHTS.choice * (chosen ? 1 : 0.5);
  return Math.max(0, Math.min(100, Math.round(sum * 100)));
}

/** Serviço indicado e compatibilidade. Com "Ainda não sei", indica o serviço que mais combina. */
export function recommend(a: LeadAnswers): { service: ServiceSlug; compatibility: number } {
  if (a.need !== "naosei") return { service: a.need, compatibility: compatibility(a, a.need, true) };
  let best: { service: ServiceSlug; compatibility: number } | null = null;
  for (const s of SERVICE_SLUGS) {
    const c = compatibility(a, s, false);
    const better = !best || c > best.compatibility || (c === best.compatibility && GOAL_FIT[a.goal][s] > GOAL_FIT[a.goal][best.service]);
    if (better) best = { service: s, compatibility: c };
  }
  return best!;
}

/* ---------- Frases do resultado ---------- */

/** "Indicamos …" */
export const SERVICE_TITLE: Record<ServiceSlug, string> = {
  "landing-pages": "uma landing page",
  sites: "um site institucional",
  "lojas-virtuais": "uma loja virtual",
  sistemas: "um sistema sob medida",
  aplicativos: "um aplicativo",
};

const SERVICE_PITCH: Record<ServiceSlug, string> = {
  "landing-pages": "uma landing page com um objetivo só, um botão claro e um formulário curto",
  sites: "um site institucional com páginas de serviço, quem somos e contato",
  "lojas-virtuais": "uma loja virtual com catálogo, carrinho e pagamento integrado",
  sistemas: "um sistema sob medida, com painel e cadastros do jeito que a sua equipe trabalha",
  aplicativos: "um aplicativo com login, avisos e acesso rápido ao que o cliente mais usa",
};

const GOAL_PHRASE: Record<GoalKey, string> = {
  contatos: "trazer mais contatos",
  vender: "vender pela internet",
  confianca: "passar mais confiança",
  organizar: "organizar o atendimento",
  celular: "estar no celular do cliente",
};

const SEGMENT_FOCUS: Record<SegmentKey, string> = {
  saude: "Na saúde, o foco é agendamento fácil e credibilidade.",
  advocacia: "Na advocacia, o foco é autoridade e contato rápido.",
  alimentacao: "Na alimentação, o foco é cardápio claro e pedido fácil.",
  imobiliario: "No mercado imobiliário, o foco é busca de imóveis e contato com o corretor.",
  fitness: "No fitness, o foco é matrícula simples e aula experimental.",
  arquitetura: "Na arquitetura e no design, o foco é portfólio e pedido de orçamento.",
  varejo: "No varejo e na moda, o foco é vitrine de produtos e compra sem atrito.",
  servicos: "Em serviços e consultoria, o foco é método claro e prova de resultado.",
  educacao: "Na educação, o foco é matrícula simples e conteúdo organizado.",
  outro: "Na conversa, a gente entende o que o seu cliente precisa ver primeiro.",
};

/** Dois parágrafos curtos que explicam a indicação. */
export function resultLines(a: LeadAnswers, service: ServiceSlug): [string, string] {
  const first = `Para ${GOAL_PHRASE[a.goal]}, a proposta parte de ${SERVICE_PITCH[service]}.`;
  const d = DEADLINE_FIT[a.deadline][service];
  const deadline =
    a.deadline === "sempressa"
      ? "Sem pressa, dá para planejar e testar cada etapa."
      : d >= 0.8
        ? "O prazo que você quer combina com esse tipo de projeto."
        : "O prazo é curto para esse tipo de projeto, então a proposta separa o que entra primeiro.";
  const b = budgetFit(a.budget, service);
  const budget =
    a.budget === "proposta"
      ? "Sem faixa definida, a proposta mostra opções de tamanho e você escolhe."
      : b === 1
        ? "A faixa de investimento comporta esse tipo de projeto."
        : "A faixa de investimento pede um começo enxuto: a proposta mostra o que cabe agora e o que pode vir depois.";
  return [first, `${SEGMENT_FOCUS[a.segment]} ${deadline} ${budget}`];
}
