// Serviços da V8 Studio. Usado no menu, no rodapé, na Home e nas páginas de serviço.
export type ServiceInfo = {
  slug: string;
  name: string;
  /** Nome curto para menus. */
  short: string;
  /** Uma frase para cards e menus. */
  line: string;
};

export const SERVICES: ServiceInfo[] = [
  { slug: "landing-pages", name: "Landing pages", short: "Landing pages", line: "Uma página com um objetivo só: transformar visita em contato." },
  { slug: "sites", name: "Sites institucionais", short: "Sites", line: "Seu negócio apresentado com clareza, do jeito que o cliente procura." },
  { slug: "lojas-virtuais", name: "Lojas virtuais", short: "Lojas virtuais", line: "Catálogo, carrinho e pagamento para vender todos os dias." },
  { slug: "sistemas", name: "Sistemas sob medida", short: "Sistemas", line: "Ferramentas para organizar pedidos, agenda e atendimento." },
  { slug: "aplicativos", name: "Aplicativos", short: "Aplicativos", line: "Seu serviço no celular do cliente, com avisos e acesso rápido." },
];

export const serviceHref = (slug: string) => `/servicos/${slug}/`;
