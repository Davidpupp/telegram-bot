// Negócios de exemplo do filme do topo da Home. O visitante escolhe um e o filme muda: a busca,
// os concorrentes, o site montado e as notificações. Todos os nomes são fictícios.

export type Service = [title: string, desc: string];
export type Competitor = { fav: string; url: string; title: string; desc: string };
export type Art = "tooth" | "plate" | "scales" | "dumbbell" | "wrench" | "hanger";

export type Segment = {
  /** Como aparece na frase "Imagine que você tem ___". */
  label: string;
  query: string;
  brand: string;
  /** Nome curto no menu do site de exemplo. */
  short: string;
  /** Botão do menu do site de exemplo. */
  navCta: string;
  url: string;
  fav: string;
  color: string;
  soft: string;
  resultDesc: string;
  headline: string;
  sub: string;
  cta: string;
  nav: [string, string, string];
  services: [Service, Service, Service];
  competitors: [Competitor, Competitor, Competitor];
  toasts: [string, string, string, string, string];
  art: Art;
};

export const SEGMENTS = {
  odonto: {
    label: "uma clínica odontológica",
    query: "dentista perto de mim",
    brand: "Clínica Vida",
    short: "Vida",
    navCta: "Agendar",
    url: "clinicavida.com.br",
    fav: "V",
    color: "#1B7A6B",
    soft: "#E6F2EF",
    resultDesc: "Seu sorriso em boas mãos. Agende online em poucos cliques.",
    headline: "Seu sorriso em boas mãos.",
    sub: "Clínica odontológica com atendimento de segunda a sábado.",
    cta: "Agendar consulta",
    nav: ["Tratamentos", "Equipe", "Contato"],
    services: [
      ["Limpeza", "Prevenção sem complicação"],
      ["Clareamento", "Sorriso mais claro"],
      ["Implantes", "Planejamento completo"],
    ],
    competitors: [
      { fav: "O", url: "odontocenter.com.br", title: "Odonto Center", desc: "Dentista perto de você. Agende pelo telefone." },
      { fav: "S", url: "sorrisopleno.com.br", title: "Sorriso Pleno", desc: "Clareamento, limpeza e implantes." },
      { fav: "D", url: "dentalmais.com.br", title: "Dental Mais", desc: "Atendimento de segunda a sábado." },
    ],
    toasts: ["Nova consulta agendada", "Novo pedido de orçamento", "Nova mensagem pelo site", "Nova consulta agendada", "Novo contato pelo site"],
    art: "tooth",
  },
  restaurante: {
    label: "um restaurante",
    query: "restaurante italiano aberto agora",
    brand: "Trattoria Nonna",
    short: "Nonna",
    navCta: "Reservar",
    url: "trattorianonna.com.br",
    fav: "N",
    color: "#B4432B",
    soft: "#F8ECE8",
    resultDesc: "Massa fresca todos os dias. Reserve sua mesa online.",
    headline: "Massa fresca todos os dias.",
    sub: "Cozinha italiana no centro, com reservas pelo site.",
    cta: "Reservar mesa",
    nav: ["Cardápio", "A casa", "Contato"],
    services: [
      ["Massas", "Feitas na casa"],
      ["Pizzas", "Forno a lenha"],
      ["Sobremesas", "Receitas da família"],
    ],
    competitors: [
      { fav: "C", url: "cantinaroma.com.br", title: "Cantina Roma", desc: "Massas e vinhos. Peça pelo telefone." },
      { fav: "B", url: "pizzariabella.com.br", title: "Pizzaria Bella", desc: "Pizzas e calzones no centro." },
      { fav: "B", url: "bistrocentral.com.br", title: "Bistrô Central", desc: "Almoço executivo de segunda a sexta." },
    ],
    toasts: ["Nova reserva confirmada", "Novo pedido para retirada", "Nova mensagem pelo site", "Nova reserva confirmada", "Novo pedido para retirada"],
    art: "plate",
  },
  advocacia: {
    label: "um escritório de advocacia",
    query: "advogado trabalhista",
    brand: "Moraes Advocacia",
    short: "Moraes",
    navCta: "Consulta",
    url: "moraesadvocacia.com.br",
    fav: "M",
    color: "#24325A",
    soft: "#E9ECF3",
    resultDesc: "Direito trabalhista e previdenciário. Primeira conversa online.",
    headline: "Seus direitos, bem defendidos.",
    sub: "Escritório de direito trabalhista e previdenciário.",
    cta: "Falar com advogado",
    nav: ["Áreas", "Equipe", "Contato"],
    services: [
      ["Trabalhista", "Rescisões e acordos"],
      ["Previdenciário", "Aposentadoria e INSS"],
      ["Consultoria", "Para empresas"],
    ],
    competitors: [
      { fav: "S", url: "silvaassociados.adv.br", title: "Silva & Associados", desc: "Advocacia em geral. Ligue e agende." },
      { fav: "J", url: "juridicoexpress.com.br", title: "Jurídico Express", desc: "Consultas rápidas por telefone." },
      { fav: "E", url: "escritoriocentral.adv.br", title: "Escritório Central", desc: "Atendimento de segunda a sexta." },
    ],
    toasts: ["Nova consulta solicitada", "Novo caso enviado", "Nova mensagem pelo site", "Nova consulta solicitada", "Novo contato pelo site"],
    art: "scales",
  },
  academia: {
    label: "uma academia",
    query: "academia perto de mim",
    brand: "Pulso Academia",
    short: "Pulso",
    navCta: "Aula grátis",
    url: "pulsoacademia.com.br",
    fav: "P",
    color: "#C2410C",
    soft: "#FBEDE6",
    resultDesc: "Musculação, funcional e aulas coletivas. Aula experimental grátis.",
    headline: "Treine no seu ritmo.",
    sub: "Musculação, funcional e aulas coletivas das 6h às 23h.",
    cta: "Agendar aula grátis",
    nav: ["Planos", "Aulas", "Contato"],
    services: [
      ["Musculação", "Acompanhamento diário"],
      ["Funcional", "Turmas pequenas"],
      ["Pilates", "Aparelhos e solo"],
    ],
    competitors: [
      { fav: "F", url: "fitcenter.com.br", title: "Fit Center", desc: "Academia com planos mensais." },
      { fav: "A", url: "academiaforca.com.br", title: "Academia Força", desc: "Musculação e lutas." },
      { fav: "C", url: "corpoemforma.com.br", title: "Corpo em Forma", desc: "Aberto de segunda a sábado." },
    ],
    toasts: ["Nova aula experimental", "Nova matrícula", "Nova mensagem pelo site", "Nova aula experimental", "Nova matrícula"],
    art: "dumbbell",
  },
  oficina: {
    label: "uma oficina mecânica",
    query: "oficina mecânica de confiança",
    brand: "Auto Prime",
    short: "Auto Prime",
    navCta: "Orçamento",
    url: "autoprime.com.br",
    fav: "A",
    color: "#3F4A5A",
    soft: "#ECEEF1",
    resultDesc: "Revisão, freios e suspensão. Orçamento pelo site.",
    headline: "Seu carro em boas mãos.",
    sub: "Revisão, freios e suspensão com orçamento antes do serviço.",
    cta: "Pedir orçamento",
    nav: ["Serviços", "A oficina", "Contato"],
    services: [
      ["Revisão", "Completa e com checklist"],
      ["Freios", "Pastilhas e discos"],
      ["Suspensão", "Alinhamento incluso"],
    ],
    competitors: [
      { fav: "M", url: "mecanicarapida.com.br", title: "Mecânica Rápida", desc: "Serviços gerais. Ligue para orçar." },
      { fav: "C", url: "carservice.com.br", title: "Car Service", desc: "Troca de óleo e revisão." },
      { fav: "O", url: "oficinadobairro.com.br", title: "Oficina do Bairro", desc: "Atendimento de segunda a sábado." },
    ],
    toasts: ["Novo orçamento pedido", "Novo agendamento", "Nova mensagem pelo site", "Novo orçamento pedido", "Novo agendamento"],
    art: "wrench",
  },
  moda: {
    label: "uma loja de roupas",
    query: "loja de roupas femininas",
    brand: "Ateliê Lume",
    short: "Lume",
    navCta: "Comprar",
    url: "atelielume.com.br",
    fav: "L",
    color: "#8E3B5A",
    soft: "#F5E9EE",
    resultDesc: "Moda feminina com entrega para todo o Brasil.",
    headline: "Peças que vestem bem.",
    sub: "Moda feminina com entrega para todo o Brasil.",
    cta: "Ver coleção",
    nav: ["Coleção", "Sobre", "Contato"],
    services: [
      ["Vestidos", "Coleção de verão"],
      ["Camisas", "Linho e algodão"],
      ["Acessórios", "Bolsas e cintos"],
    ],
    competitors: [
      { fav: "M", url: "modacenter.com.br", title: "Moda Center", desc: "Roupas femininas e masculinas." },
      { fav: "B", url: "boutiquebella.com.br", title: "Boutique Bella", desc: "Vestidos e acessórios." },
      { fav: "L", url: "lojadaesquina.com.br", title: "Loja da Esquina", desc: "Peças a pronta entrega." },
    ],
    toasts: ["Novo pedido recebido", "Pagamento aprovado", "Nova mensagem pelo site", "Novo pedido recebido", "Pagamento aprovado"],
    art: "hanger",
  },
} satisfies Record<string, Segment>;

export type SegmentKey = keyof typeof SEGMENTS;
export const SEGMENT_KEYS = Object.keys(SEGMENTS) as SegmentKey[];
export const COMPETITOR_FAVS = ["#8A93A6", "#9AA1B1", "#AAB0BE"] as const;
