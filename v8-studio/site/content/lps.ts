import { DEMO_BY_SERVICE, DEMO_LABELS } from "@/content/home";
import type { CompId } from "@/motion/compositions/registry";

// Landing pages da V8 Studio: as 5 páginas de serviço (/servicos/<slug>/) e, depois, as de campanha
// criadas no admin (/lp/<slug>/). Tudo aqui é dado simples, serializável em JSON, para o admin montar
// páginas sem mexer no código. O desenho fica em components/lp/LandingTemplate.tsx.

/* ============================================================
   Modelo
   ============================================================ */

/** Fundo de uma seção. "blue" é a faixa que inunda de azul e só vale nas seções de cards. */
export type LandingTone = "white" | "paper" | "blue";

/** Título curto e uma frase: card, etapa, ponto de destaque. */
export type LandingItem = { title: string; text: string };

/** Pergunta e resposta do acordeão. */
export type LandingQA = { q: string; a: string };

/** Visual do card grande do topo (e de seções em duas colunas). */
export type LandingMedia =
  /** Composição do Remotion registrada em motion/compositions/registry.ts. `label` descreve a animação para leitores de tela (padrão: a descrição da Home para essa demo). */
  | { type: "demo"; id: CompId; label?: string; caption?: string }
  /** Lugar de foto real: `prompt` diz o que fotografar (o relatório entrega o prompt ao usuário). */
  | { type: "photo"; prompt: string; caption?: string };

/** Tela de aplicativo fictício desenhada em código, aberta num iPhone e num Android. */
export type PhoneApp = {
  /** Marca fictícia. */
  name: string;
  /** Cor da marca e o tom claro dela. */
  color: string;
  soft: string;
  /** Título da tela e uma linha de apoio opcional abaixo dele. */
  title: string;
  subtitle?: string;
  /** Linhas da lista (3 ou 4 cabem bem). */
  rows: { title: string; meta: string }[];
  /** Botão no pé da tela. */
  action: string;
  /** Avisos que chegam nos dois celulares, um de cada vez. `row` destaca a linha correspondente. */
  notices: { title: string; text: string; row?: number }[];
};

/** Visual de uma seção "split": dois celulares, uma demo ou um lugar de foto. */
export type SplitVisual = { type: "phones"; app: PhoneApp; label: string; caption?: string } | LandingMedia;

/** Campos comuns a todas as seções do meio. */
type SectionBase = {
  /** Âncora opcional (vira o id da seção). */
  id?: string;
  /** Frase curta cinza acima do título. */
  kicker: string;
  /** Título cinético (h2). "\n" força a quebra de linha; em geral, deixe o navegador equilibrar. */
  title: string;
  /** Parágrafo de apoio, ao lado do título em telas largas. */
  lead?: string;
};

/** "Para quem é": situações reais de quem precisa do serviço, em cards (3 é o ideal). */
export type AudienceSection = SectionBase & { type: "audience"; tone?: LandingTone; items: LandingItem[] };

/** "O que vem incluso": entregáveis em cards brancos. Por padrão é a faixa azul. Use 3 ou 6. */
export type IncludedSection = SectionBase & { type: "included"; tone?: LandingTone; items: LandingItem[] };

/** "Como funciona": etapas ligadas por uma linha que avança com a rolagem (3 a 5). */
export type StepsSection = SectionBase & { type: "steps"; tone?: "white" | "paper"; items: LandingItem[] };

/**
 * Exemplos: prévias de negócios fictícios correndo na tela.
 * `minis` são chaves de MINIS (components/home/MiniSite.tsx: odonto, restaurante, advocacia, cafe, academia,
 * oficina, moda, pet) ou de STORE_MINIS (components/lp/MiniStore.tsx: broto, doceforno, pedal). Sem `minis`, mostra todas as da Home.
 */
export type ExamplesSection = SectionBase & { type: "examples"; tone?: "white" | "paper"; minis?: string[]; note?: string };

/** Perguntas frequentes do serviço ou da campanha. */
export type FaqSection = SectionBase & { type: "faq"; tone?: "white" | "paper"; items: LandingQA[] };

/** Antes e depois, linha a linha (ex.: "Do papel para o sistema"). O "antes" é riscado quando a seção aparece. */
export type CompareSection = SectionBase & {
  type: "compare";
  tone?: LandingTone;
  beforeTitle: string;
  afterTitle: string;
  rows: { before: string; after: string }[];
};

/** Grupos de opções em cards com lista (ex.: "Pagamento e frete"). */
export type OptionsSection = SectionBase & {
  type: "options";
  tone?: LandingTone;
  groups: { title: string; text?: string; items: string[] }[];
};

/** Texto com pontos de um lado e um visual do outro (ex.: "iPhone e Android"). `flip` põe o visual à esquerda. */
export type SplitSection = SectionBase & { type: "split"; tone?: "white" | "paper"; points: LandingItem[]; visual?: SplitVisual; flip?: boolean };

/** Qualquer seção do meio da página. O `type` escolhe o desenho. */
export type LandingSection =
  | AudienceSection
  | IncludedSection
  | StepsSection
  | ExamplesSection
  | FaqSection
  | CompareSection
  | OptionsSection
  | SplitSection;

/** Topo branco: kicker, frase cinética (h1), apoio, "Começar" e o visual. */
export type LandingHero = {
  /** Nome do serviço ou da campanha. */
  kicker: string;
  /** A promessa (h1 cinético). */
  title: string;
  lead: string;
  /** Nota abaixo do botão. Padrão: "Leva 2 minutos. Sem compromisso." */
  note?: string;
  media?: LandingMedia;
};

/** Chamada final: faixa azul que sobe de baixo, com "Começar". */
export type LandingFinal = { title: string; lead?: string; note?: string };

/** Uma landing page inteira. O topo e a chamada final são fixos; o meio é a lista `sections`, na ordem. */
export type LandingContent = {
  /** Fim do endereço: /servicos/<slug>/ ou /lp/<slug>/. */
  slug: string;
  /** Slug do serviço (content/services.ts). Todo "Começar" da página leva ?servico=<service>. */
  service?: string;
  /** Chave de objetivo para o "Começar" (?objetivo=), para campanhas que não são de um serviço só. */
  objective?: string;
  /** Título curto (o site acrescenta " · V8 Studio") e descrição para a busca e o compartilhamento. */
  seo: { title: string; description: string };
  hero: LandingHero;
  sections: LandingSection[];
  final: LandingFinal;
};

/* ============================================================
   Regras usadas pelo modelo
   ============================================================ */

export const LP_NOTE = "Leva 2 minutos. Sem compromisso.";
export const LP_FINAL_NOTE = "Sem compromisso.";
export const DEMO_CAPTION = "Exemplo ilustrativo. A marca da animação é fictícia.";
export const EXAMPLES_NOTE = "Prévias ilustrativas de negócios fictícios.";

/** Descrição de uma demo para leitores de tela: a mesma que a Home usa para o serviço dessa demo. */
export function demoLabel(id: string) {
  const slug = (Object.keys(DEMO_BY_SERVICE) as (keyof typeof DEMO_BY_SERVICE)[]).find((k) => DEMO_BY_SERVICE[k] === id);
  return (slug && DEMO_LABELS[slug]) || "Animação ilustrativa do serviço.";
}

/** Endereço do "Começar": sempre /comecar/, com o serviço ou o objetivo já escolhidos (e parâmetros extras, como a campanha). */
export function startHref(lp: Pick<LandingContent, "service" | "objective">, extra?: Record<string, string>) {
  const q = new URLSearchParams();
  if (lp.service) q.set("servico", lp.service);
  if (lp.objective) q.set("objetivo", lp.objective);
  for (const [k, v] of Object.entries(extra ?? {})) q.set(k, v);
  const s = q.toString();
  return s ? `/comecar/?${s}` : "/comecar/";
}

const DEFAULT_TONE: Record<LandingSection["type"], LandingTone> = {
  audience: "white",
  included: "blue",
  steps: "white",
  examples: "paper",
  faq: "white",
  compare: "paper",
  options: "white",
  split: "white",
};
const BLUE_OK = new Set<LandingSection["type"]>(["audience", "included", "options", "compare"]);

/**
 * Fundo final de cada seção. Garante a regra da identidade: nunca duas faixas azuis seguidas
 * (o topo é branco e a chamada final é azul). Uma seção azul encostada em outra azul vira papel;
 * duas seções de papel seguidas: a segunda vira branca.
 */
export function resolveTones(sections: LandingSection[]): LandingTone[] {
  const wanted = sections.map((s) => {
    const t = s.tone ?? DEFAULT_TONE[s.type];
    return t === "blue" && !BLUE_OK.has(s.type) ? "white" : t;
  });
  const out: LandingTone[] = [];
  wanted.forEach((t, i) => {
    const prev = i === 0 ? "white" : out[i - 1];
    const next = i === wanted.length - 1 ? "blue" : wanted[i + 1];
    let tone = t;
    if (tone === "blue" && (prev === "blue" || next === "blue")) tone = "paper";
    if (tone === "paper" && prev === "paper") tone = "white";
    out.push(tone);
  });
  return out;
}

/* ============================================================
   As 5 landing pages de serviço
   ============================================================ */

const STEPS_KICKER = "Como funciona";
const FAQ_KICKER = "Perguntas frequentes";

export const SERVICE_LPS: LandingContent[] = [
  /* ---------- Landing pages (versão completa do modelo) ---------- */
  {
    slug: "landing-pages",
    service: "landing-pages",
    seo: {
      title: "Landing pages",
      description:
        "Landing pages com um objetivo só: transformar a visita do anúncio em pedido de orçamento. Conte o que você precisa em 2 minutos e receba a proposta em até 1 dia útil.",
    },
    hero: {
      kicker: "Landing pages",
      title: "A página que transforma visita em contato.",
      lead: "Uma página com um objetivo só, um botão claro e um formulário curto. Quem chega pelo anúncio entende a oferta em segundos e pede orçamento sem se perder.",
      media: {
        type: "demo",
        id: "demo-landing",
      },
    },
    sections: [
      {
        type: "audience",
        kicker: "Para quem é",
        title: "Quando uma página só resolve.",
        lead: "Três situações em que a landing page costuma ser o melhor começo.",
        items: [
          {
            title: "Você vai anunciar no Google ou no Instagram",
            text: "O anúncio traz a visita. A landing page recebe essa pessoa com a mesma promessa do anúncio e um caminho só: pedir orçamento.",
          },
          {
            title: "Você tem um serviço principal para vender",
            text: "A página fala só dele: o que é, para quem é, como funciona e como pedir. Sem menu levando o cliente para outro lugar.",
          },
          {
            title: "Você vai lançar algo com data marcada",
            text: "Um curso, um evento, uma unidade nova, uma promoção. A página fica pronta antes da divulgação e sai do ar quando a campanha acaba.",
          },
        ],
      },
      {
        type: "included",
        kicker: "O que vem incluso",
        title: "Tudo o que a página precisa para trazer contato.",
        lead: "Do texto à medição, a página sai pronta para receber quem vem do anúncio.",
        items: [
          { title: "Texto que vende", text: "A gente escreve com você a promessa, os benefícios, as dúvidas comuns e o convite para pedir orçamento." },
          { title: "Celular primeiro", text: "Cada bloco é desenhado para a tela pequena, onde o anúncio é visto, e depois cresce para o computador." },
          { title: "Formulário curto", text: "Só os campos que importam. O pedido chega para você na hora, com nome, contato e o que a pessoa precisa." },
          { title: "Botão de WhatsApp", text: "Se o seu atendimento é pelo WhatsApp, o botão abre a conversa com uma mensagem pronta sobre a oferta." },
          { title: "Medição das visitas", text: "Você vê quantas pessoas chegaram, de qual anúncio vieram e quantas pediram orçamento." },
          { title: "Leve e no seu nome", text: "A página abre rápido no celular e vai ao ar no seu domínio, com tudo registrado no seu nome." },
        ],
      },
      {
        type: "steps",
        kicker: STEPS_KICKER,
        title: "Da oferta à página no ar.",
        lead: "Quatro etapas, com prazo combinado por escrito na proposta.",
        items: [
          { title: "Oferta", text: "Você conta o que quer vender, para quem e o que precisa acontecer depois do clique." },
          { title: "Texto e desenho", text: "A gente escreve e desenha a página inteira. Você revisa e pede os ajustes." },
          { title: "Testes", text: "Formulário, WhatsApp e medição ligados e testados no celular e no computador." },
          { title: "No ar", text: "Página publicada no seu domínio e pronta para receber quem vem dos anúncios." },
        ],
      },
      {
        type: "examples",
        kicker: "Exemplos",
        title: "Uma página para cada oferta.",
        lead: "Orçamento, consulta, agendamento, pedido. A página muda conforme o que o seu cliente precisa fazer.",
        minis: ["advocacia", "pet", "odonto", "oficina", "cafe"],
      },
      {
        type: "faq",
        kicker: FAQ_KICKER,
        title: "Dúvidas sobre landing pages.",
        items: [
          {
            q: "Qual é a diferença entre landing page e site?",
            a: "A landing page tem uma página e um objetivo só, pensada para quem chega de um anúncio ou de uma campanha. O site apresenta a empresa inteira, em várias páginas, para quem pesquisa antes de decidir.",
          },
          {
            q: "Preciso anunciar para a página dar resultado?",
            a: "A página recebe a visita, mas alguém precisa levar as pessoas até ela: anúncios, redes sociais, e-mail ou o link na bio. Se você nunca anunciou, a gente explica por onde começar.",
          },
          {
            q: "Como os pedidos chegam até mim?",
            a: "Do jeito que você preferir: por e-mail, no WhatsApp ou pelos dois. A gente testa o caminho inteiro antes de publicar.",
          },
          {
            q: "E quando a campanha mudar?",
            a: "Você troca textos, fotos e condições sem depender de ninguém. Para uma oferta nova, vale uma página nova: a mensagem fica mais certeira e você vê qual anúncio traz mais contato.",
          },
          {
            q: "Quanto tempo leva?",
            a: "Landing pages são os projetos mais rápidos da V8. O prazo exato vem na proposta, por escrito.",
          },
          {
            q: "Quanto custa?",
            a: "Depende do que a página precisa ter. O investimento vem na proposta, em até 1 dia útil depois do formulário, e pedir a proposta não custa nada.",
          },
        ],
      },
    ],
    final: {
      title: "Sua próxima campanha merece uma página só dela.",
      lead: "Conte o que você quer vender em 2 minutos. A resposta chega em até 1 dia útil.",
    },
  },

  /* ---------- Sites institucionais: exemplos sobem para logo depois do "Para quem é" ---------- */
  {
    slug: "sites",
    service: "sites",
    seo: {
      title: "Sites institucionais",
      description:
        "Sites institucionais que apresentam o seu negócio com clareza, do jeito que o cliente procura. Conte como é a sua empresa em 2 minutos e receba a proposta em até 1 dia útil.",
    },
    hero: {
      kicker: "Sites institucionais",
      title: "O site que responde antes do cliente perguntar.",
      lead: "O que você faz, onde fica, como funciona e por que escolher você, em páginas claras e rápidas no celular. Quem pesquisa entende, confia e chama.",
      media: {
        type: "demo",
        id: "demo-site",
      },
    },
    sections: [
      {
        type: "audience",
        kicker: "Para quem é",
        title: "Para quem é pesquisado antes de ser escolhido.",
        lead: "Três situações em que um site institucional faz falta.",
        items: [
          {
            title: "O cliente pesquisa antes de chamar",
            text: "Clínicas, escritórios, oficinas, escolas. Antes de ligar, a pessoa quer ver o lugar, a equipe e o que você faz. Sem site, ela escolhe quem mostrou.",
          },
          {
            title: "Você oferece vários serviços",
            text: "Cada serviço ganha a sua página, com explicação, dúvidas comuns e um jeito fácil de pedir. O cliente acha o que procura sem precisar perguntar.",
          },
          {
            title: "O site atual ficou para trás",
            text: "Lento, difícil de ler no celular, com informação velha. Um site novo, que você mesmo atualiza, volta a trabalhar a seu favor.",
          },
        ],
      },
      {
        type: "examples",
        kicker: "Exemplos",
        title: "Cada negócio com o seu jeito.",
        lead: "Clínica, restaurante, escritório, academia, oficina. A estrutura muda conforme o que o cliente precisa ver primeiro.",
        minis: ["odonto", "restaurante", "advocacia", "academia", "oficina", "pet"],
      },
      {
        type: "included",
        kicker: "O que vem incluso",
        title: "O que todo bom site precisa ter.",
        lead: "Páginas, textos e a base para a busca, prontos para você atualizar sozinho.",
        items: [
          { title: "Páginas principais", text: "Início, serviços, sobre e contato, organizados do jeito que o seu cliente procura." },
          { title: "Textos escritos com você", text: "A gente transforma o que você sabe do seu negócio em textos curtos e fáceis de ler." },
          { title: "Base para o Google", text: "Páginas rápidas, com título, descrição e mapa do site pensados para a busca." },
          { title: "Celular primeiro", text: "Cada página nasce na tela pequena e depois cresce para o computador." },
          { title: "Blog para publicar", text: "Você publica artigos e novidades sozinho, sem depender de ninguém." },
          { title: "Contato a um toque", text: "Formulário, endereço com mapa, horário e WhatsApp em todas as páginas." },
        ],
      },
      {
        type: "steps",
        kicker: STEPS_KICKER,
        title: "Do mapa do site ao site no ar.",
        lead: "Quatro etapas, com prazo combinado por escrito e você acompanhando tudo.",
        items: [
          { title: "Mapa do site", text: "Definimos juntos as páginas, o que cada uma precisa dizer e o que o cliente deve fazer nela." },
          { title: "Textos e fotos", text: "A gente escreve os textos e indica o que fotografar. Se você já tem material, aproveitamos o que funciona." },
          { title: "Desenho e desenvolvimento", text: "Você acompanha o site tomando forma e revisa cada página antes de publicar." },
          { title: "Lançamento", text: "Site no ar no seu domínio, com o mapa do site enviado ao Google e você pronto para atualizar." },
        ],
      },
      {
        type: "faq",
        kicker: FAQ_KICKER,
        title: "Dúvidas sobre sites.",
        items: [
          {
            q: "Quantas páginas o meu site precisa ter?",
            a: "Depende do que você oferece. Um bom ponto de partida é início, serviços, sobre e contato, e o site cresce com o tempo. O mapa do site é a primeira coisa que a gente define junto.",
          },
          {
            q: "O site vai aparecer no Google?",
            a: "Todo site sai com a base técnica para a busca: páginas rápidas, títulos e descrições para cada página e mapa do site. A posição depende também de conteúdo e de tempo, e a gente explica o caminho.",
          },
          {
            q: "Consigo atualizar o site sozinho?",
            a: "Sim. Você troca textos e fotos e publica no blog sem depender de ninguém. Para mudanças maiores, a gente continua por perto.",
          },
          {
            q: "Já tenho domínio. Dá para usar?",
            a: "Dá. O site vai ao ar no domínio que você já tem, e tudo continua no seu nome.",
          },
          {
            q: "Preciso de fotos profissionais?",
            a: "Ajuda, mas não é obrigatório para começar. A gente indica o que fotografar e como, e o site pode estrear com as fotos que você já tem.",
          },
          {
            q: "E se depois eu quiser vender pelo site?",
            a: "O site pode ganhar uma loja virtual ou uma área do cliente mais tarde. A gente planeja a estrutura pensando nesse próximo passo.",
          },
        ],
      },
    ],
    final: {
      title: "Seja a melhor resposta para quem pesquisa você.",
      lead: "Conte como é o seu negócio em 2 minutos. A proposta chega em até 1 dia útil.",
    },
  },

  /* ---------- Lojas virtuais: ganha "Pagamento e frete" ---------- */
  {
    slug: "lojas-virtuais",
    service: "lojas-virtuais",
    seo: {
      title: "Lojas virtuais",
      description:
        "Lojas virtuais com catálogo, carrinho, pagamento e frete para vender todos os dias, a qualquer hora. Conte o que você vende em 2 minutos e receba a proposta em até 1 dia útil.",
    },
    hero: {
      kicker: "Lojas virtuais",
      title: "Venda todos os dias, até com a loja fechada.",
      lead: "Catálogo organizado, carrinho simples e pagamento sem atrito. O cliente escolhe, paga e acompanha a entrega, e o pedido chega para você pronto para separar.",
      media: {
        type: "demo",
        id: "demo-loja",
      },
    },
    sections: [
      {
        type: "audience",
        kicker: "Para quem é",
        title: "Para quem quer vender além do balcão.",
        lead: "Três situações em que a loja virtual paga o próprio trabalho.",
        items: [
          {
            title: "Você já vende pelo WhatsApp ou pelo Instagram",
            text: "E perde tempo mandando foto, preço e chave Pix um por um. Na loja, o cliente escolhe sozinho e o pedido chega pronto.",
          },
          {
            title: "Sua loja física tem hora para fechar",
            text: "O cliente vê o que tem no estoque, compra à noite e retira no dia seguinte ou recebe em casa.",
          },
          {
            title: "Você quer depender menos do marketplace",
            text: "No marketplace, o cliente é do marketplace. Na loja própria, o cadastro, a marca e a recompra ficam com você.",
          },
        ],
      },
      {
        type: "included",
        kicker: "O que vem incluso",
        title: "Tudo o que a loja precisa para vender.",
        lead: "Da vitrine ao pedido enviado, com você no controle de cada etapa.",
        items: [
          { title: "Catálogo organizado", text: "Categorias, busca, fotos e variações de tamanho e cor, fáceis de achar no celular." },
          { title: "Carrinho em poucos passos", text: "Do produto ao pagamento sem desvio, e sem cadastro obrigatório antes da compra." },
          { title: "Pedidos e estoque", text: "Você cadastra produtos, acompanha cada pedido e o estoque baixa sozinho a cada venda." },
          { title: "Avisos para o cliente", text: "E-mails de pedido recebido, pagamento aprovado e pedido enviado, com o código de rastreio." },
          { title: "Cupons e promoções", text: "Desconto por cupom, frete grátis acima de um valor e preço promocional com data para acabar." },
          { title: "Produtos no Google", text: "Cada produto com a sua página, título, descrição e foto, pronta para aparecer na busca." },
        ],
      },
      {
        type: "options",
        kicker: "Pagamento e frete",
        title: "O cliente paga e recebe do jeito que preferir.",
        lead: "Na proposta, a gente indica a plataforma de pagamento e as formas de entrega que fazem sentido para o que você vende.",
        tone: "paper",
        groups: [
          { title: "Pagamento", text: "Confirmação automática, sem conferir comprovante.", items: ["Pix", "Cartão de crédito, com parcelamento", "Boleto bancário"] },
          { title: "Frete", text: "Calculado pelo CEP, ainda no carrinho.", items: ["Correios e transportadoras", "Entrega própria por bairro", "Retirada na loja"] },
          { title: "Depois da compra", text: "O cliente acompanha sem precisar perguntar.", items: ["Status do pedido por e-mail", "Código de rastreio", "Histórico de compras na conta"] },
        ],
      },
      {
        type: "steps",
        kicker: STEPS_KICKER,
        title: "Do catálogo à primeira venda.",
        lead: "Quatro etapas, com prazo combinado por escrito na proposta.",
        items: [
          { title: "Catálogo", text: "Você manda a lista de produtos, fotos e preços. A gente organiza categorias e variações." },
          { title: "Pagamento e frete", text: "Escolhemos juntos as formas de pagamento e de entrega e ligamos tudo à loja." },
          { title: "Desenho e testes", text: "Loja desenhada para o celular e testada com compras de verdade antes de abrir." },
          { title: "Loja aberta", text: "Loja no ar, com você pronto para cadastrar produtos e acompanhar os pedidos." },
        ],
      },
      {
        type: "examples",
        kicker: "Exemplos",
        title: "Uma vitrine com a cara da sua marca.",
        lead: "Roupas, plantas, café, doces, bicicletas. Cada loja organiza o catálogo do jeito que o cliente compra.",
        minis: ["moda", "broto", "cafe", "doceforno", "pedal"],
      },
      {
        type: "faq",
        kicker: FAQ_KICKER,
        title: "Dúvidas sobre lojas virtuais.",
        items: [
          {
            q: "Quais formas de pagamento a loja aceita?",
            a: "Pix, cartão de crédito com parcelamento e boleto, por meio de uma plataforma de pagamento. A gente indica a que faz mais sentido para o que você vende.",
          },
          {
            q: "Como funciona o frete?",
            a: "O cliente digita o CEP no carrinho e vê as opções de entrega com preço e prazo. Dá para combinar Correios, transportadoras, entrega própria e retirada na loja.",
          },
          {
            q: "Consigo controlar o estoque pela loja?",
            a: "Sim. O estoque baixa sozinho a cada venda, e o produto esgotado aparece como indisponível até você repor.",
          },
          {
            q: "Os clientes e os pedidos são meus?",
            a: "São. Cadastro de clientes, histórico de pedidos e domínio ficam no seu nome.",
          },
          {
            q: "Dá para vender também pelo Instagram?",
            a: "Dá. O link da loja vai na bio e nos stories, e o cliente compra direto pelo celular, sem trocar mensagem.",
          },
          {
            q: "Quanto tempo leva para a loja abrir?",
            a: "Depende do tamanho do catálogo e das formas de pagamento e de entrega. O prazo exato vem na proposta, por escrito.",
          },
        ],
      },
    ],
    final: {
      title: "Abra uma loja que nunca fecha.",
      lead: "Conte o que você vende em 2 minutos. A proposta chega em até 1 dia útil.",
    },
  },

  /* ---------- Sistemas sob medida: ganha "Do papel para o sistema"; sem exemplos de sites ---------- */
  {
    slug: "sistemas",
    service: "sistemas",
    seo: {
      title: "Sistemas sob medida",
      description:
        "Sistemas sob medida para organizar pedidos, agenda e atendimento num lugar só, do jeito que a sua equipe já trabalha. Proposta em até 1 dia útil, dividida em etapas.",
    },
    hero: {
      kicker: "Sistemas sob medida",
      title: "Pedidos, agenda e equipe num lugar só.",
      lead: "Um sistema feito para o jeito que a sua empresa já trabalha. Sem adaptar o processo a um programa pronto, sem planilha perdida e sem pedido esquecido no WhatsApp.",
      media: {
        type: "demo",
        id: "demo-sistema",
      },
    },
    sections: [
      {
        type: "audience",
        kicker: "Para quem é",
        title: "Para quando a planilha já não dá conta.",
        lead: "Três sinais de que o trabalho cresceu mais que o controle.",
        items: [
          {
            title: "Os pedidos chegam por todo lado",
            text: "WhatsApp, telefone, e-mail, balcão. Cada um anota de um jeito, e alguma coisa sempre se perde no caminho.",
          },
          {
            title: "A agenda vive em conflito",
            text: "Horário marcado duas vezes, encaixe que ninguém viu, cliente esperando. A agenda certa resolve antes do problema acontecer.",
          },
          {
            title: "Programa pronto não serve",
            text: "Você já testou sistemas prontos e todos pedem para mudar o seu processo. Sob medida, o sistema se adapta a você.",
          },
        ],
      },
      {
        type: "compare",
        kicker: "Do papel para o sistema",
        title: "O mesmo trabalho, sem o retrabalho.",
        lead: "O que muda no dia a dia quando tudo fica num lugar só.",
        beforeTitle: "Hoje",
        afterTitle: "Com o sistema",
        rows: [
          { before: "Pedido anotado no caderno e repassado por mensagem", after: "Pedido registrado uma vez e visível para toda a equipe" },
          { before: "Planilha com várias versões, cada uma num computador", after: "Uma versão só dos dados, acessível de qualquer lugar" },
          { before: "Agenda no papel, conferida por telefone", after: "Agenda on-line, sem horário marcado duas vezes" },
          { before: "Relatório montado à mão no fim do mês", after: "Números do mês prontos quando você precisar" },
        ],
      },
      {
        type: "included",
        kicker: "O que vem incluso",
        title: "O que vem no seu sistema.",
        lead: "Feito em etapas, com cada parte entrando em uso assim que fica pronta.",
        items: [
          { title: "Feito para o seu processo", text: "Telas e etapas desenhadas a partir de como a sua equipe já trabalha, e não o contrário." },
          { title: "Acesso por pessoa", text: "Cada um entra com o próprio usuário e vê só o que precisa: atendimento, financeiro ou gerência." },
          { title: "No computador e no celular", text: "Abre no navegador, sem instalar nada, de dentro da empresa ou da rua." },
          { title: "Relatórios na hora", text: "Pedidos, vendas e agenda em telas simples, sem montar planilha no fim do mês." },
          { title: "Ligado ao que você já usa", text: "Loja virtual, emissão de nota, planilhas e WhatsApp, quando o serviço permite integração." },
          { title: "Dados guardados com cuidado", text: "Cópias de segurança automáticas e registro de quem mudou cada informação." },
        ],
      },
      {
        type: "steps",
        kicker: STEPS_KICKER,
        title: "Do papel ao sistema, sem parar a empresa.",
        lead: "Quatro etapas, com o prazo de cada uma combinado por escrito.",
        items: [
          { title: "Entendimento", text: "A gente conversa com quem vai usar e desenha o fluxo de hoje: quem faz o quê, quando e com qual informação." },
          { title: "Protótipo", text: "Você clica nas telas antes de qualquer programação e ajusta o que não fizer sentido." },
          { title: "Entrega em partes", text: "O sistema chega em etapas. A primeira parte já entra em uso enquanto a próxima é construída." },
          { title: "Implantação", text: "Importamos os dados das planilhas, treinamos a equipe e acompanhamos o começo do uso." },
        ],
      },
      {
        type: "faq",
        kicker: FAQ_KICKER,
        title: "Dúvidas sobre sistemas.",
        items: [
          {
            q: "Por que não usar um sistema pronto?",
            a: "Às vezes um sistema pronto resolve, e a gente diz isso na conversa. O sob medida vale a pena quando o seu processo é o seu diferencial ou quando os prontos obrigam a equipe a trabalhar de um jeito que não funciona.",
          },
          {
            q: "Dá para aproveitar as minhas planilhas?",
            a: "Dá. A gente importa clientes, produtos e históricos das planilhas para o sistema novo, e ninguém começa do zero.",
          },
          {
            q: "Preciso instalar alguma coisa?",
            a: "Não. O sistema abre no navegador do computador ou do celular, com usuário e senha para cada pessoa.",
          },
          {
            q: "E se o meu processo mudar depois?",
            a: "O sistema é seu e cresce com a empresa. Novas telas e ajustes entram em etapas, combinadas por escrito.",
          },
          {
            q: "Os dados ficam seguros?",
            a: "Ficam num servidor com cópias de segurança automáticas, acesso por senha e registro de quem mudou cada informação.",
          },
          {
            q: "Quanto tempo leva?",
            a: "Depende do tamanho do processo. A proposta divide o projeto em etapas, com o prazo de cada uma por escrito.",
          },
        ],
      },
    ],
    final: {
      title: "Chega de pedido perdido.",
      lead: "Conte como a sua equipe trabalha hoje. A proposta chega em até 1 dia útil, dividida em etapas.",
    },
  },

  /* ---------- Aplicativos: ganha "iPhone e Android"; sem exemplos de sites ---------- */
  {
    slug: "aplicativos",
    service: "aplicativos",
    seo: {
      title: "Aplicativos",
      description:
        "Aplicativos para iPhone e Android com avisos, cadastro e acesso rápido: o seu serviço no celular do cliente. Conte o que o app precisa fazer e receba a proposta em até 1 dia útil.",
    },
    hero: {
      kicker: "Aplicativos",
      title: "Seu serviço a um toque do cliente.",
      lead: "Um aplicativo para iPhone e Android que deixa o cliente agendar, pedir e acompanhar tudo pelo celular, com avisos na hora certa.",
      media: {
        type: "demo",
        id: "demo-app",
      },
    },
    sections: [
      {
        type: "audience",
        kicker: "Para quem é",
        title: "Para negócios que o cliente usa toda semana.",
        lead: "Três situações em que estar no celular faz diferença.",
        items: [
          {
            title: "O cliente volta com frequência",
            text: "Academia, salão, clínica, delivery. Quem usa toda semana quer abrir, resolver e fechar em poucos toques.",
          },
          {
            title: "Um aviso na hora certa muda tudo",
            text: "Lembrete de horário, pedido saindo, aula cancelada. O aviso aparece na tela do celular no momento em que importa.",
          },
          {
            title: "Sua equipe trabalha na rua",
            text: "Entregas, visitas técnicas, vendas externas. O aplicativo leva a lista do dia, as fotos e as confirmações para o celular de quem está fora.",
          },
        ],
      },
      {
        type: "included",
        kicker: "O que vem incluso",
        title: "O que vem no seu aplicativo.",
        lead: "O app do cliente e a área da equipe, ligados um ao outro.",
        items: [
          { title: "iPhone e Android", text: "Um aplicativo só, publicado na App Store e no Google Play." },
          { title: "Avisos no celular", text: "Notificações para lembrar, confirmar e chamar o cliente de volta na hora certa." },
          { title: "Cadastro e acesso", text: "Entrada com e-mail, Google ou Apple, com os dados do cliente guardados com segurança." },
          { title: "Painel para a equipe", text: "Uma área no computador para acompanhar pedidos, agenda e clientes do aplicativo." },
          { title: "Pagamento no aplicativo", text: "Pix e cartão dentro do app, quando o seu serviço cobra pelo celular." },
          { title: "Atualizações", text: "Correções e novidades publicadas nas lojas e entregues ao cliente como qualquer atualização." },
        ],
      },
      {
        type: "split",
        kicker: "iPhone e Android",
        title: "Um aplicativo, os dois celulares.",
        lead: "Feito uma vez e publicado nas duas lojas, com o jeito de usar que cada celular já tem.",
        tone: "paper",
        points: [
          { title: "Uma base para os dois", text: "O mesmo aplicativo roda no iPhone e no Android, e cada novidade chega aos dois juntos." },
          { title: "A gente cuida das lojas", text: "Envio, revisão e publicação na App Store e no Google Play, na conta da sua empresa." },
          { title: "Do jeito de cada celular", text: "Gestos, teclado e avisos funcionam como o cliente já está acostumado." },
        ],
        visual: {
          type: "phones",
          label: "Ilustração: o mesmo aplicativo de uma academia fictícia aberto num iPhone e num Android, recebendo o mesmo aviso ao mesmo tempo.",
          caption: "Exemplo ilustrativo. A marca é fictícia.",
          // Mesma academia fictícia da demo do topo (motion/compositions/DemoApp.tsx).
          app: {
            name: "Vigor",
            color: "#0F766E",
            soft: "#E2F1EE",
            title: "Suas aulas",
            subtitle: "Hoje, quinta-feira",
            rows: [
              { title: "Pilates", meta: "7h · Sala 1" },
              { title: "Funcional", meta: "18h · Sala 2" },
              { title: "Spinning", meta: "20h · Sala 3" },
              { title: "Yoga", meta: "21h · Sala 1" },
            ],
            action: "Agendar aula",
            notices: [
              { title: "Funcional hoje às 18h", text: "Confirme sua presença.", row: 1 },
              { title: "Vaga liberada no Spinning", text: "Hoje às 20h, na sala 3.", row: 2 },
            ],
          },
        },
      },
      {
        type: "steps",
        kicker: STEPS_KICKER,
        title: "Da ideia ao aplicativo na loja.",
        lead: "Quatro etapas, com prazo combinado por escrito na proposta.",
        items: [
          { title: "Funções essenciais", text: "Definimos o que o aplicativo precisa fazer primeiro. O resto entra nas próximas versões." },
          { title: "Protótipo no celular", text: "Você testa as telas no seu celular antes de a programação começar." },
          { title: "Desenvolvimento e testes", text: "Aplicativo construído e testado em iPhones e Androids de verdade." },
          { title: "Publicação", text: "Envio para a App Store e o Google Play, acompanhamento da revisão e lançamento." },
        ],
      },
      {
        type: "faq",
        kicker: FAQ_KICKER,
        title: "Dúvidas sobre aplicativos.",
        items: [
          {
            q: "Preciso mesmo de um aplicativo?",
            a: "Nem sempre. Se o cliente usa o seu serviço de vez em quando, um site bem feito no celular resolve. O aplicativo vale a pena quando o uso é frequente e os avisos fazem diferença.",
          },
          {
            q: "Funciona no iPhone e no Android?",
            a: "Sim. O aplicativo sai de uma mesma base e é publicado nas duas lojas: App Store e Google Play.",
          },
          {
            q: "Quem publica nas lojas?",
            a: "A gente cuida do envio e acompanha a revisão de cada loja. As contas e o aplicativo ficam no nome da sua empresa.",
          },
          {
            q: "Dá para cobrar pelo aplicativo?",
            a: "Dá, com Pix e cartão. Para conteúdo digital vendido dentro do app, as lojas têm regras próprias, e a gente orienta o melhor caminho.",
          },
          {
            q: "Como o aplicativo é atualizado?",
            a: "Correções e novidades são publicadas nas lojas e chegam ao celular do cliente como qualquer atualização.",
          },
          {
            q: "Quanto tempo leva?",
            a: "Aplicativos passam por mais etapas de teste e pela revisão das lojas, por isso levam mais tempo que um site. O prazo exato vem na proposta, por escrito.",
          },
        ],
      },
    ],
    final: {
      title: "Coloque o seu negócio no bolso do cliente.",
      lead: "Conte o que o seu aplicativo precisa fazer em 2 minutos. A proposta chega em até 1 dia útil.",
    },
  },
];

/** Landing page de um serviço pelo slug. */
export const serviceLp = (slug: string) => SERVICE_LPS.find((lp) => lp.slug === slug);
