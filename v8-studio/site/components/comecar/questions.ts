// Perguntas do formulário "Começar", portadas do protótipo comecar.html.
// As chaves de "need" são os slugs de /servicos/<slug>/ e as de "goal" são as da conversa da Home (?objetivo=).
import type { LeadAnswers, QuestionId } from "@/lib/leads";

export type Choice = {
  value: string;
  label: string;
  hint: string;
  /** Frase que aparece acima da pergunta seguinte, comentando esta escolha. */
  echo: string;
};

export type Question = {
  id: QuestionId;
  title: string;
  /** Colunas no computador. */
  cols: 2 | 3;
  options: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: "need",
    title: "O que você precisa hoje?",
    cols: 2,
    options: [
      { value: "landing-pages", label: "Landing page", hint: "Uma página focada em trazer contatos", echo: "Landing page, então. Uma página com um objetivo só." },
      { value: "sites", label: "Site institucional", hint: "Apresenta a empresa com confiança", echo: "Site institucional é a base de tudo. Vamos acertar o resto." },
      { value: "lojas-virtuais", label: "Loja virtual", hint: "Vitrine de produtos com pagamento", echo: "Loja virtual, então. Vamos falar de venda." },
      { value: "sistemas", label: "Sistema sob medida", hint: "Painéis, cadastros e processos", echo: "Sistema sob medida. Vamos entender o que precisa rodar." },
      { value: "aplicativos", label: "Aplicativo", hint: "Para iPhone e Android, com login", echo: "Aplicativo. Vamos ver o que ele precisa fazer." },
      { value: "naosei", label: "Ainda não sei", hint: "A gente descobre junto", echo: "Sem problema. A gente descobre junto." },
    ],
  },
  {
    id: "currentSite",
    title: "Você já tem site?",
    cols: 3,
    options: [
      { value: "nao", label: "Ainda não tenho", hint: "Vamos começar do zero", echo: "Começar do zero é mais simples do que parece." },
      { value: "naogera", label: "Tenho, mas não traz clientes", hint: "Existe, mas não dá resultado", echo: "Isso é comum. E tem conserto." },
      { value: "evoluir", label: "Tenho e quero evoluir", hint: "Funciona, mas pode render mais", echo: "Ótimo ponto de partida. Evoluir é mais rápido do que refazer." },
    ],
  },
  {
    id: "goal",
    title: "Qual é o objetivo principal?",
    cols: 2,
    options: [
      { value: "contatos", label: "Trazer mais contatos", hint: "Orçamentos e agendamentos", echo: "Contatos. Então cada página precisa pedir o próximo passo." },
      { value: "vender", label: "Vender pela internet", hint: "Catálogo, carrinho e pagamento", echo: "Vender pela internet. O caminho até o pagamento precisa ser curto." },
      { value: "confianca", label: "Passar mais confiança", hint: "Quem somos, o que fazemos", echo: "Confiança se constrói nos detalhes. É aí que a gente entra." },
      { value: "organizar", label: "Organizar o atendimento", hint: "Pedidos, agenda, equipe", echo: "Organizar o atendimento muda a rotina da empresa. Bom objetivo." },
      { value: "celular", label: "Estar no celular do cliente", hint: "Avisos, acesso rápido", echo: "No celular do cliente, cada toque conta." },
    ],
  },
  {
    id: "segment",
    title: "Qual é o seu segmento?",
    cols: 3,
    options: [
      { value: "saude", label: "Saúde", hint: "Clínicas e consultórios", echo: "Saúde. Agendamento fácil e confiança no primeiro clique." },
      { value: "advocacia", label: "Advocacia", hint: "Escritórios e advogados", echo: "Advocacia. Clareza e autoridade, sem exagero." },
      { value: "alimentacao", label: "Alimentação", hint: "Restaurantes e delivery", echo: "Alimentação. Cardápio na mão e pedido em dois toques." },
      { value: "imobiliario", label: "Imobiliário", hint: "Imóveis e corretores", echo: "Imobiliário. Busca rápida e contato direto com o corretor." },
      { value: "fitness", label: "Fitness", hint: "Academias e estúdios", echo: "Fitness. Matrícula simples e aula experimental em destaque." },
      { value: "arquitetura", label: "Arquitetura e design", hint: "Escritórios e designers", echo: "Arquitetura e design. O portfólio precisa falar por você." },
      { value: "varejo", label: "Varejo e moda", hint: "Lojas e marcas de roupa", echo: "Varejo e moda. Produto bem mostrado vende mais." },
      { value: "servicos", label: "Serviços e consultoria", hint: "Agências e consultores", echo: "Serviços e consultoria. Mostrar o método gera confiança." },
      { value: "educacao", label: "Educação", hint: "Escolas, cursos e professores", echo: "Educação. Matrícula simples e conteúdo bem organizado." },
      { value: "outro", label: "Outro segmento", hint: "Você conta mais na conversa", echo: "Cada negócio tem seu jeito. A gente entende o seu." },
    ],
  },
  {
    id: "deadline",
    title: "Para quando você precisa?",
    cols: 2,
    options: [
      { value: "ontem", label: "Para ontem", hint: "Preciso o quanto antes", echo: "Para ontem a gente entende. Vamos priorizar o essencial." },
      { value: "30", label: "Em até 30 dias", hint: "Tenho uma data próxima", echo: "Trinta dias pedem foco no que mais importa." },
      { value: "90", label: "Em até 90 dias", hint: "Dá para planejar com calma", echo: "Noventa dias dão espaço para fazer com calma e testar." },
      { value: "sempressa", label: "Sem pressa", hint: "Quero fazer bem feito", echo: "Sem pressa é bom. Dá para fazer bem feito desde o começo." },
    ],
  },
  {
    id: "budget",
    title: "Quanto você pensa em investir?",
    cols: 2,
    options: [
      { value: "ate3", label: "Até R$ 3 mil", hint: "Para começar com o essencial", echo: "Com esse valor, o foco é fazer o essencial muito bem." },
      { value: "3a6", label: "R$ 3 a 6 mil", hint: "Página ou site enxuto", echo: "Faixa boa para uma entrega enxuta e com qualidade." },
      { value: "6a12", label: "R$ 6 a 12 mil", hint: "Site completo ou loja", echo: "Nessa faixa cabe um projeto completo." },
      { value: "12a25", label: "R$ 12 a 25 mil", hint: "Sistema ou aplicativo mais simples", echo: "Aqui já dá para pensar em algo sob medida." },
      { value: "mais25", label: "Acima de R$ 25 mil", hint: "Projetos maiores, sob medida", echo: "Projeto grande. Vamos tratar com o cuidado que merece." },
      { value: "proposta", label: "Prefiro ouvir uma proposta", hint: "Sem faixa definida ainda", echo: "Tudo bem. A gente monta a proposta e você decide." },
    ],
  },
  {
    id: "role",
    title: "Você é…",
    cols: 2,
    options: [
      { value: "dono", label: "Dono do negócio", hint: "Decido e acompanho de perto", echo: "Falar direto com quem decide acelera tudo." },
      { value: "socio", label: "Sócio ou gestor", hint: "Participo das decisões", echo: "Ótimo. Vamos deixar tudo claro para você apresentar." },
      { value: "marketing", label: "Marketing da empresa", hint: "Cuido da comunicação", echo: "Marketing a bordo. Vamos falar a mesma língua." },
      { value: "agencia", label: "Agência ou parceiro", hint: "Busco um parceiro de produção", echo: "Parceria é bem-vinda. Trabalhamos bem nos bastidores." },
    ],
  },
];

/** Telas: as 7 perguntas, o contato e o resultado. */
export const CONTACT_STEP = QUESTIONS.length;
export const RESULT_STEP = QUESTIONS.length + 1;
export const TOTAL_STEPS = QUESTIONS.length + 2;

export const choiceFor = (id: QuestionId, value: string | undefined) => QUESTIONS.find((q) => q.id === id)?.options.find((o) => o.value === value);

/** Texto de cada resposta como apareceu na tela. */
export function answerLabels(a: LeadAnswers): Record<QuestionId, string> {
  const out = {} as Record<QuestionId, string>;
  for (const q of QUESTIONS) out[q.id] = choiceFor(q.id, a[q.id])?.label ?? a[q.id];
  return out;
}

/** Índice da primeira pergunta sem resposta, ou -1. */
export const firstUnanswered = (a: Partial<LeadAnswers>) => QUESTIONS.findIndex((q) => !a[q.id]);
