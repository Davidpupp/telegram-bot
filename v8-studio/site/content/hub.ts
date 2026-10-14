// Conteúdo do hub dos serviços (/servicos/): o escolhedor de duas perguntas, a comparação e as perguntas gerais.
// As landing pages de cada serviço ficam em content/lps.ts.

/** Resposta final do escolhedor: leva a um serviço e explica o porquê. */
export type ChooserLeaf = { key: string; label: string; hint: string; service: string; reason: string };

/** Resposta da primeira pergunta: abre a segunda pergunta, que depende dela. */
export type ChooserBranch = { key: string; label: string; hint: string; question: string; options: ChooserLeaf[] };

export type Chooser = { question: string; options: ChooserBranch[] };

/** O que o escolhedor precisa saber de cada serviço. */
export type ChooserService = {
  slug: string;
  name: string;
  line: string;
  /** Com artigo, para a frase "Comece por ___." */
  singular: string;
  /** Frase bem curta para a lista ao lado das perguntas. */
  hint: string;
  /** Landing page do serviço. */
  href: string;
  /** "Começar" com o serviço já escolhido. */
  start: string;
  demo?: { id: string; label: string };
};

/** Com artigo, para "Comece por uma landing page." */
export const SERVICE_SINGULAR: Record<string, string> = {
  "landing-pages": "uma landing page",
  sites: "um site institucional",
  "lojas-virtuais": "uma loja virtual",
  sistemas: "um sistema sob medida",
  aplicativos: "um aplicativo",
};

/** Frase bem curta de cada serviço, para a lista ao lado das perguntas. */
export const SERVICE_HINT: Record<string, string> = {
  "landing-pages": "Uma página, um objetivo: contato.",
  sites: "A empresa inteira, clara e confiável.",
  "lojas-virtuais": "Catálogo, carrinho e pagamento.",
  sistemas: "Pedidos, agenda e equipe num lugar só.",
  aplicativos: "Seu serviço no celular do cliente.",
};

export const CHOOSER: Chooser = {
  question: "Para quem é o projeto?",
  options: [
    {
      key: "novos",
      label: "Para quem ainda não me conhece",
      hint: "Gente que procura no Google ou vê um anúncio",
      question: "E o que essa pessoa precisa fazer?",
      options: [
        {
          key: "orcamento",
          label: "Pedir um orçamento",
          hint: "Para um serviço ou uma oferta",
          service: "landing-pages",
          reason: "Quem chega de um anúncio precisa de um caminho só. A landing page apresenta a oferta, responde as dúvidas e termina num formulário curto de orçamento.",
        },
        {
          key: "conhecer",
          label: "Conhecer a empresa",
          hint: "Serviços, equipe, endereço e contato",
          service: "sites",
          reason: "Quem ainda não conhece você quer ver o lugar, a equipe e o que você faz antes de chamar. O site institucional mostra tudo isso e ajuda você a ser encontrado no Google.",
        },
        {
          key: "comprar",
          label: "Comprar um produto",
          hint: "Escolher, pagar e receber em casa",
          service: "lojas-virtuais",
          reason: "Se a venda pode acontecer sem conversa, a loja virtual deixa o cliente escolher, pagar e acompanhar a entrega sozinho, a qualquer hora.",
        },
      ],
    },
    {
      key: "clientes",
      label: "Para quem já é meu cliente",
      hint: "Gente que volta para comprar ou agendar",
      question: "Como esse cliente usa o seu serviço?",
      options: [
        {
          key: "semana",
          label: "Agenda ou pede toda semana",
          hint: "Aula, consulta, reserva, pedido",
          service: "aplicativos",
          reason: "Quem volta toda semana ganha tempo com um aplicativo: agenda em poucos toques e recebe o aviso na hora certa.",
        },
        {
          key: "recompra",
          label: "Compra de novo de tempos em tempos",
          hint: "Reposição, novidades, coleções",
          service: "lojas-virtuais",
          reason: "Para quem compra de novo, a loja virtual guarda o cadastro e o endereço, mostra as novidades e deixa a recompra a poucos cliques.",
        },
        {
          key: "acompanha",
          label: "Acompanha um pedido ou um serviço",
          hint: "Andamento, documentos, mensagens",
          service: "sistemas",
          reason: "Uma área do cliente, dentro de um sistema sob medida, mostra o andamento e guarda os documentos, sem a mesma pergunta todo dia no WhatsApp.",
        },
      ],
    },
    {
      key: "equipe",
      label: "Para a minha equipe",
      hint: "Quem atende, vende e organiza o dia",
      question: "O que mais toma tempo da equipe hoje?",
      options: [
        {
          key: "pedidos",
          label: "Anotar e conferir pedidos",
          hint: "Caderno, planilha, mensagens",
          service: "sistemas",
          reason: "Um sistema sob medida junta os pedidos num lugar só, com status, responsável e histórico, do jeito que a sua equipe já trabalha.",
        },
        {
          key: "agenda",
          label: "Organizar a agenda",
          hint: "Horários, encaixes, remarcações",
          service: "sistemas",
          reason: "Com a agenda dentro de um sistema sob medida, todo mundo vê quem atende o quê e quando, sem horário marcado duas vezes.",
        },
        {
          key: "rua",
          label: "Trabalhar na rua",
          hint: "Visitas, entregas, ordens de serviço",
          service: "aplicativos",
          reason: "Para quem trabalha fora, um aplicativo leva a lista do dia, as fotos e as confirmações para o celular da equipe.",
        },
      ],
    },
  ],
};

/** Comparação lado a lado: para quem é, o que entrega e quando escolher. Sem preços nem prazos. */
export const SERVICE_COMPARE: Record<string, { forWho: string; delivers: string; when: string }> = {
  "landing-pages": {
    forWho: "Quem vai anunciar ou tem uma oferta principal para divulgar.",
    delivers: "Uma página com um objetivo só, um botão claro e um formulário curto.",
    when: "Quando você precisa de contatos logo e já sabe o que quer oferecer.",
  },
  sites: {
    forWho: "Empresas com vários serviços que precisam passar confiança.",
    delivers: "Páginas de início, serviços, sobre e contato, com blog e base para o Google.",
    when: "Quando o cliente pesquisa antes de chamar e quer conhecer você.",
  },
  "lojas-virtuais": {
    forWho: "Quem vende produtos e quer vender também fora do horário.",
    delivers: "Catálogo, carrinho, pagamento e frete, com pedidos e estoque num painel.",
    when: "Quando a venda pode acontecer sem conversa, do clique ao pagamento.",
  },
  sistemas: {
    forWho: "Equipes que controlam pedidos, agenda ou clientes em planilhas e mensagens.",
    delivers: "Uma ferramenta feita para o seu processo, com acesso por pessoa e relatórios.",
    when: "Quando o trabalho cresce e o controle manual começa a falhar.",
  },
  aplicativos: {
    forWho: "Negócios com clientes que voltam toda semana ou equipes que trabalham na rua.",
    delivers: "Aplicativo para iPhone e Android, com avisos, cadastro e painel para a equipe.",
    when: "Quando o uso é frequente e um aviso no celular faz diferença.",
  },
};

export const HUB_FAQ = [
  {
    q: "Não sei qual escolher. E agora?",
    a: "Responda as duas perguntas do topo ou clique em Começar e conte o que você quer que aconteça. A proposta já chega com a recomendação e o motivo.",
  },
  {
    q: "Qual é a diferença entre landing page e site?",
    a: "A landing page tem uma página e um objetivo só, como pedir orçamento de um serviço, e costuma receber quem vem de anúncio. O site apresenta a empresa inteira, em várias páginas, para quem pesquisa antes de decidir.",
  },
  {
    q: "Preciso de aplicativo ou um site resolve?",
    a: "Se o cliente usa o seu serviço de vez em quando, um site bem feito no celular resolve. O aplicativo vale a pena quando o uso é frequente e os avisos fazem diferença.",
  },
  {
    q: "Dá para começar com um e crescer depois?",
    a: "Dá. Uma landing page pode virar a primeira página de um site, e uma loja pode ganhar um sistema de pedidos mais tarde. A gente planeja pensando no próximo passo.",
  },
  {
    q: "Posso juntar dois serviços no mesmo projeto?",
    a: "Pode. Uma loja com sistema de estoque, um site com área do cliente, um aplicativo com painel para a equipe. A proposta mostra cada parte separada, por escrito.",
  },
  {
    q: "Quanto custa cada um?",
    a: "Depende do escopo de cada projeto. O investimento vem na proposta, em até 1 dia útil depois do formulário, e pedir a proposta não custa nada.",
  },
];
