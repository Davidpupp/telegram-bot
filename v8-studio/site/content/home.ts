// Textos da Home que não cabem direto no JSX.
export const DEMO_BY_SERVICE = {
  "landing-pages": "demo-landing",
  sites: "demo-site",
  "lojas-virtuais": "demo-loja",
  sistemas: "demo-sistema",
  aplicativos: "demo-app",
} as const;

export const DEMO_LABELS: Record<string, string> = {
  "landing-pages": "Animação: uma landing page se monta, alguém preenche o formulário e o pedido chega como notificação.",
  sites: "Animação: o site de um escritório de arquitetura troca de página e recebe uma mensagem pelo contato.",
  "lojas-virtuais": "Animação: um vaso vai para a sacola, a compra é finalizada e o pagamento é aprovado.",
  sistemas: "Animação: um painel marca um pedido como pronto e recebe um pedido novo no topo da lista.",
  aplicativos: "Animação: o app de uma academia recebe um aviso de aula e o aluno confirma a presença.",
};

export const STEPS = [
  { title: "Conversa", text: "Você conta o que vende, para quem e o que precisa acontecer no site. Leva 2 minutos pelo formulário." },
  { title: "Proposta", text: "Em até 1 dia útil você recebe escopo, prazo e investimento, por escrito e sem letra miúda." },
  { title: "Projeto", text: "Desenho, textos e desenvolvimento com revisões combinadas. Você acompanha cada etapa." },
  { title: "Lançamento", text: "Site no ar, medido e pronto para receber contatos. E a gente continua por perto." },
];

export const PROMISES = [
  { big: "1 dia útil", title: "Para receber sua proposta", text: "Você conta o que precisa em 2 minutos e recebe escopo, prazo e investimento por escrito." },
  { big: "Celular primeiro", title: "Desenhado para a tela pequena", text: "É no celular que o seu cliente procura. Cada tela nasce lá e depois cresce para o computador." },
  { big: "100% seu", title: "Domínio, conteúdo e acessos", text: "Tudo fica no seu nome. Você troca textos e fotos e publica no blog sem depender de ninguém." },
];

export const FAQ = [
  {
    q: "Quanto tempo leva para o site ficar pronto?",
    a: "Depende do escopo, e o prazo exato vem na proposta, por escrito. Landing pages são os projetos mais rápidos; sistemas e aplicativos levam mais tempo porque passam por mais etapas de teste.",
  },
  {
    q: "Quanto custa?",
    a: "Cada projeto tem um escopo diferente, então o investimento vem na proposta, em até 1 dia útil depois do formulário. Pedir a proposta não custa nada.",
  },
  {
    q: "Preciso ter textos e fotos prontos?",
    a: "Não. A gente ajuda a escrever os textos e indica o que fotografar. Se você já tiver material, melhor ainda: aproveitamos o que funciona.",
  },
  {
    q: "O site vai aparecer no Google?",
    a: "Todo site sai com a base técnica para a busca: páginas rápidas, títulos e descrições pensados para cada página e mapa do site. A posição depende também de conteúdo e de tempo, e a gente explica o caminho.",
  },
  {
    q: "Consigo editar o site depois?",
    a: "Sim. Você recebe acesso para trocar textos e fotos e publicar no blog sem depender de ninguém. Para mudanças maiores, a gente continua disponível.",
  },
  {
    q: "Vocês atendem empresas de qualquer cidade?",
    a: "Sim. Todo o processo acontece online, da primeira conversa à entrega.",
  },
];
