// Artigos do blog. `body` é Markdown simples (##, ###, parágrafos, listas com "- ", **negrito**, [links](/caminho/)).
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Palavra grande da capa tipográfica. */
  cover: string;
  category: string;
  date: string; // AAAA-MM-DD
  minutes: number;
  author: string;
  body: string;
};

export const POSTS: Post[] = [
  {
    slug: "landing-page-ou-site",
    title: "Landing page ou site completo: por onde começar?",
    excerpt: "As duas resolvem problemas diferentes. Veja qual faz mais sentido para o momento do seu negócio.",
    cover: "Uma página ou várias?",
    category: "Estratégia",
    date: "2026-10-06",
    minutes: 6,
    author: "Equipe V8 Studio",
    body: "",
  },
  {
    slug: "sinais-site-perdendo-clientes",
    title: "Cinco sinais de que o seu site está perdendo clientes",
    excerpt: "Visitas que não viram contato quase sempre têm a mesma causa. Dá para perceber em poucos minutos.",
    cover: "Cadê os contatos?",
    category: "Conversão",
    date: "2026-09-22",
    minutes: 5,
    author: "Equipe V8 Studio",
    body: "",
  },
  {
    slug: "primeira-tela-do-site",
    title: "O que escrever na primeira tela do seu site",
    excerpt: "Você tem poucos segundos para dizer o que faz, para quem e qual o próximo passo. Um roteiro simples.",
    cover: "Primeiros segundos",
    category: "Texto",
    date: "2026-09-08",
    minutes: 4,
    author: "Equipe V8 Studio",
    body: "",
  },
  {
    slug: "aparecer-no-google",
    title: "Como aparecer quando alguém procura o seu serviço",
    excerpt: "O básico que todo site precisa ter para ser encontrado na busca, explicado sem jargão.",
    cover: "Ser encontrado",
    category: "Busca",
    date: "2026-08-25",
    minutes: 7,
    author: "Equipe V8 Studio",
    body: "",
  },
  {
    slug: "preparar-loja-virtual",
    title: "Loja virtual: o que preparar antes de começar",
    excerpt: "Fotos, descrições, frete e pagamento. Uma lista para chegar ao projeto com tudo encaminhado.",
    cover: "Antes da loja",
    category: "Lojas virtuais",
    date: "2026-08-11",
    minutes: 6,
    author: "Equipe V8 Studio",
    body: "",
  },
  {
    slug: "site-celular-primeiro",
    title: "Por que o seu site precisa ser pensado primeiro para o celular",
    excerpt: "É no celular que o seu cliente procura. O que muda quando o projeto começa pela tela pequena.",
    cover: "Tela pequena primeiro",
    category: "Design",
    date: "2026-07-28",
    minutes: 5,
    author: "Equipe V8 Studio",
    body: "",
  },
];

export const postHref = (slug: string) => `/blog/${slug}/`;

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
/** "6 de outubro de 2026" (sem depender do fuso do servidor). */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
};
