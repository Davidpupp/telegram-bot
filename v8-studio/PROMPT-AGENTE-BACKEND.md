# Prompt para o agente: terminar o site da V8 Studio, o backend e o LP Hub

Copie tudo abaixo da linha e cole como primeira mensagem para o agente.

---

Você vai terminar o site da **V8 Studio**, um estúdio que cria landing pages, sites, lojas virtuais, sistemas e aplicativos para pequenas e médias empresas. A Home já está pronta em Next.js com Remotion. Falta construir as outras páginas, o **LP Hub**, o backend inteiro e deixar tudo publicado e testado. Trabalhe em português do Brasil em toda a interface e nos textos.

## Passo 0 · Instale todas as skills antes de qualquer outra coisa

O usuário usou estas skills para criar o design e o movimento do site. Instale todas, nesta ordem, antes de escrever código. Cada skill fica em `.claude/skills/<nome>/SKILL.md` do projeto (ou `~/.claude/skills/` para valer em todos os projetos); agentes ficam em `.claude/agents/`. Para cada repositório: clone, leia o README e copie todas as pastas de skill que ele oferece.

1. Frontend Design (Anthropic): https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
2. Taste Skill, com todas as variações: https://github.com/leonxlnx/taste-skill
3. Remotion Best Practices, do pull request 769 do repositório de skills da Anthropic: https://github.com/anthropics/skills/pull/769
4. Impeccable, com os dois agentes que vêm junto: https://github.com/pbakaus/impeccable
5. Brandkit (faz parte do Taste Skill): https://github.com/Leonxlnx/taste-skill/blob/main/skills/brandkit/SKILL.md
6. Canvas Design (Anthropic): https://github.com/anthropics/skills/blob/main/skills/canvas-design/SKILL.md
7. Animate: https://github.com/delphi-ai/animate-skill
8. Motion Graphics: https://github.com/Barty-Bart/motion-graphics
9. Claude Motion Design: https://github.com/howseen-ai/claude-motion-design
10. Plugin oficial do Remotion, pelo diretório de plugins do claude.ai: https://claude.ai/customize/plugins/id/c21dd3e3-2c37-4d53-a75a-a465de3f3f6e%40anthropic-plugin-directory (abra o link e instale; no Claude Code, `/plugin` também encontra o plugin "remotion").

Comandos de partida para o item 3, que vem de um pull request:

```bash
git clone https://github.com/anthropics/skills.git /tmp/anthropic-skills
git -C /tmp/anthropic-skills fetch origin pull/769/head:pr-769
git -C /tmp/anthropic-skills checkout pr-769
```

Depois de instalar, estas pastas devem existir em `.claude/skills/`: `frontend-design`; `taste-skill`, `taste-skill-v1`, `taste-skill-v2-experimental`, `brandkit`, `brutalist-skill`, `minimalist-skill`, `soft-skill`, `redesign-skill`, `stitch-skill`, `output-skill`, `image-to-code-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `gpt-tasteskill`; `impeccable`; `canvas-design`; `remotion-best-practices`; `animate`; `explainer-high-energy`, `explainer-default`, `explainer-engaging`, `motion-broll`, `object-separation`, `sound-effects`; `motion-design`. E em `.claude/agents/`: `impeccable-documenter.md` e `impeccable-finish-reviewer.md`.

Cópias exatas de todas elas já estão no repositório, em `.claude/skills` e `.claude/agents`, e no pacote de download, na pasta `skills-claude`. Use essas cópias se algum repositório estiver fora do ar. Confirme a instalação listando as skills disponíveis e só então continue.

O usuário também tem um pacote de conteúdo para motion graphics no Google Drive. Use se precisar: https://drive.google.com/drive/folders/1l1A3hekSEl1ikDK5nk0x9VwHxMbWJsup?usp=drive_link

## Onde está o projeto

- Repositório `Davidpupp/telegram-bot`, branch `claude/focused-dijkstra-aucxhq`, pasta `v8-studio/`.
- A raiz desse repositório é outro projeto, a API da Clínica Mutton. Não mexa nela. Sugira ao usuário mover a pasta `v8-studio` para um repositório só da V8; a criação do repositório "novo-projeto" falhou antes por falta de permissão do app do GitHub.
- `v8-studio/site/`: o site novo. Next.js 16.4.0 com App Router, React 19.3, TypeScript, Remotion 4.0.535 e `@remotion/player`. Leia `v8-studio/site/README.md` e `v8-studio/site/AGENTS.md`. Esta versão do Next.js tem mudanças em relação ao que você conhece: leia o guia correspondente em `node_modules/next/dist/docs/` antes de escrever código.
- `v8-studio/video/`: o filme da marca em Remotion (24 s). `BEATMAP.md` explica a linguagem de movimento. Os arquivos finais estão em `v8-studio/v8-studio-filme*.mp4`.
- Protótipo antigo em HTML puro, para portar: `v8-studio/comecar.html` (formulário de 9 telas), `v8-studio/admin/*.html` (login, painel, leads, detalhe do lead, editor de post, configurações), `v8-studio/privacidade.html` e as pranchas em `v8-studio/pranchas/`. O editor `admin/post.html` usa uma função `esc` que precisa ser conferida e corrigida ao portar.

Para rodar:

```bash
cd v8-studio/site
npm install
npm run dev      # http://localhost:3000
npm run build    # hoje gera o site estático em out/
```

## Regras de identidade (não negociáveis)

- Branco `#FFFFFF` e azul royal `#2347D6` chapado, como uma folha de papel azul. Texto `#0B1220`, apoio `#5B6478`, papel `#F5F7FB`, linha `#E3E7F0`. Os tokens estão em `site/app/globals.css` e `site/motion/lib/theme.ts`.
- Faixas azuis de borda a borda, nunca duas faixas azuis seguidas.
- Cards sempre brancos, raio 28 px, sombra flutuante do token, inclusive dentro das faixas azuis.
- Botões em pílula de 56 px. Todo CTA principal diz "Começar" e leva para `/comecar/`.
- Títulos em Bricolage Grotesque 800, texto em Inter, "STUDIO" em Montserrat 600. Grade de 12 colunas, 1200 px, gutters de 24 px; celular em 375 px com 16 px de margem.
- Proibido: gradientes, emojis, badges, tags e pílulas de rótulo, ícones decorativos, texturas, blobs, formas abstratas, modo escuro, serifas, "eyebrows" em caixa alta e setas "→" em texto.
- Nenhum telefone, e-mail, WhatsApp ou rede social da V8 aparece no site. O contato acontece pelo formulário "Começar". Coletar o contato do cliente no formulário é permitido.
- Honestidade: nada de números, clientes, depoimentos ou pessoas inventados. Negócios das animações são fictícios e marcados como exemplo. Toda informação real sobre a empresa vem do usuário.
- Fotos só reais e neutras. Onde precisar de foto, deixe o lugar marcado e escreva o prompt exato em `v8-studio/PROMPTS-IMAGENS.md` para o usuário produzir.
- Logo oficial: `LOGO_PATH` em `site/motion/lib/theme.ts`. Não desenhe outro.

## Regras do movimento

- Todo movimento vem do Remotion, na mesma estética do filme e sem a parte cômica: molas `spring` e `interpolate` num relógio de 60 quadros por segundo, e composições no `<Player>`. Não use `transition` nem `animation` de CSS.
- Use os componentes que já existem em `site/motion/`: `KineticText` (frase que sobe palavra por palavra), `Reveal`, `Flood` (faixa que inunda de azul), `Lift` e `PressLink` (hover e clique com mola), `Marquee`, `Carousel`, `Steps`, `Accordion`, `MotionPlayer` e `IntroOverlay`. As molas ficam em `site/motion/lib/timing.ts`.
- Novas composições vão em `site/motion/compositions/` e entram no registro `registry.ts`. Quatro entradas são provisórias e apontam para a demo de landing page: `demo-site`, `demo-loja`, `demo-sistema` e `demo-app`. Crie as quatro demos de verdade, no padrão de `DemoLanding.tsx` (800 × 720, loop de cerca de 7 s, marca fictícia, cursor e notificação).
- Todo `<Player>` precisa de `initiallyMuted`. Sem isso o Player espera um clique liberar o áudio do navegador e não anda; foi assim que a abertura do logo travou a página uma vez.
- Código que importa `remotion` só pode rodar em componentes de cliente (`"use client"`). Constantes usadas por componentes de servidor ficam em arquivos sem `"use client"`, como `intro-constants.ts`.
- Respeite `prefers-reduced-motion`: sem abertura, frases e faixas prontas, composições paradas no quadro-pôster.

## O que já está pronto

- Home completa: abertura do logo, filme do topo que muda conforme o tipo de negócio escolhido pelo visitante, vitrine de mini-sites, faixa de serviços com demos, passos, conversa interativa, compromissos, blog, perguntas e chamada final.
- Cabeçalho com submenu de serviços e menu de celular, rodapé, ícone, fontes, sistema de movimento.
- Conteúdo inicial em `site/content/`: serviços, Home e os 6 artigos do blog (título e resumo, sem o texto).
- Lint, TypeScript e build passando.

## Parte A · Páginas que faltam

1. **LP Hub.** Entenda como o hub das landing pages da V8. Confirme com o usuário antes de construir, porque o termo pode significar outra coisa para ele.
   - Página pública `/servicos/` que reúne todas as landing pages, com as demos em movimento e uma pergunta interativa que ajuda o visitante a escolher o serviço certo.
   - Uma landing page por serviço (`/servicos/landing-pages/`, `sites/`, `lojas-virtuais/`, `sistemas/`, `aplicativos/`), todas do mesmo modelo: topo com frase cinética e demo do serviço, problema e solução, o que está incluso, como funciona, exemplos, perguntas específicas e chamada final. A de landing pages é a versão completa; as outras são variações do mesmo modelo.
   - Landing pages de campanha criadas pelo admin sem mexer no código, por exemplo `/lp/dentistas/`, montadas a partir de seções prontas, com SEO próprio e escolha da demo.
   - Cada visita e cada lead guardam de qual landing page e de qual campanha vieram (UTM). O admin mostra visitas, leads e taxa de conversão por landing page.
   - Todo "Começar" de uma landing page abre o formulário com o serviço já escolhido (`/comecar/?servico=...`).
2. **Blog:** listagem `/blog/` e artigo `/blog/<slug>/`. Escreva o texto dos 6 artigos em `content/posts.ts`, úteis e sem estatísticas inventadas. Metadados, Open Graph e JSON-LD de artigo.
3. **Sobre:** história, jeito de trabalhar e lugares de foto com prompt. Nome, cargo e trajetória de pessoas só com dados reais do usuário. O protótipo antigo cita um "Rodrigo Vale"; esse nome é fictício e não pode ir para o ar.
4. **Começar:** porte as 9 telas de `comecar.html` para React com os movimentos do Remotion: barra de progresso com mola, opções que respondem ao toque, anel de "Compatibilidade" calculado pelas respostas com uma fórmula explicada no código, e a mensagem "Respondemos em até 1 dia útil". Aceite `?objetivo=` (vindo da conversa da Home) e `?servico=` (vindo das landing pages).
5. **Privacidade:** política de acordo com a LGPD. A lei exige identificar a empresa (razão social e CNPJ) e oferecer um canal para o titular dos dados. Como o site não mostra e-mail nem telefone, proponha um formulário próprio para pedidos sobre dados pessoais e peça ao usuário os dados reais da empresa. Recomende revisão jurídica.
6. **Admin:** login, painel, leads com filtros, detalhe do lead, editor de post em Markdown com contadores de SEO, editor das landing pages do LP Hub e configurações. Porte o visual de `admin/*.html` para o sistema novo.
7. Página 404 no estilo do site, `sitemap.xml`, `robots.txt` e imagens de compartilhamento.
8. `v8-studio/PROMPTS-IMAGENS.md` com o prompt exato de cada foto do site: ambiente real, tons neutros, luz natural, sem pessoas olhando para a câmera e sem filtros de cor.
9. Atualize as pranchas (`pranchas/` e `hub.html`) para o site novo: tokens, componentes, páginas no computador e no celular e quadros-chave da abertura do logo.

## Parte B · Backend

O site hoje é exportado como estático (`output: "export"` em `next.config.ts`). Para ter formulário funcionando, login e conteúdo editável, mude para Next.js com servidor e mantenha as páginas públicas pré-renderizadas. Recomendação, que você pode ajustar com justificativa:

- Hospedagem na Vercel ou em qualquer servidor Node; banco Postgres (Neon, Supabase ou Railway) com Prisma; validação com zod.
- Route Handlers e Server Actions; páginas públicas estáticas com revalidação quando o conteúdo mudar no admin.
- Login do admin com sessão em cookie `httpOnly`, senha com hash forte e proteção contra força bruta.
- Envio de e-mail (Resend ou SMTP) avisando a equipe da V8 a cada lead novo. O endereço fica nas configurações e nas variáveis de ambiente, nunca na página.
- Imagens do blog e das landing pages num armazenamento de arquivos (Vercel Blob ou S3).

Dados mínimos:

- **Lead:** data, nome, empresa, segmento, objetivo, serviço, respostas do formulário, compatibilidade calculada, forma de contato preferida e o contato informado pelo cliente, consentimento LGPD com data e versão do texto, landing page de origem, UTM, status (novo, em contato, proposta, fechado, perdido), notas e histórico.
- **Post:** slug, título, resumo, texto em Markdown, palavra da capa, categoria, título e descrição de SEO, rascunho ou publicado, data de publicação, autor.
- **Landing page:** slug, serviço, título, seções, demo, SEO, rascunho ou publicada, métricas.
- **Configurações:** dados da empresa, destinatários dos avisos, texto do prazo de resposta, identificadores de análise de tráfego.
- **Usuário do admin:** nome, e-mail, hash da senha, papel.

Rotas mínimas: criar lead pelo formulário com validação, isca contra robôs e limite de envios por IP; listar, filtrar, atualizar e exportar leads em CSV; CRUD de posts, landing pages e configurações; login e logout; apagar ou exportar os dados de um titular a pedido (LGPD).

Segurança: nenhum segredo no repositório (crie `.env.example`), Markdown sanitizado antes de virar HTML, cabeçalhos de segurança, proteção CSRF nas ações do admin e mensagens de erro claras sem expor detalhes internos.

## Parte C · Qualidade e entrega

- `npm run lint`, `npx tsc --noEmit` e `npm run build` passando.
- Testes unitários da validação, do cálculo de compatibilidade e das rotas; um teste ponta a ponta com Playwright do caminho completo: Home, landing page, formulário, lead no admin.
- Capturas de tela de todas as páginas em 375 e 1440 px, sem rolagem horizontal e sem erros no console. Confira também com movimento reduzido.
- Lighthouse no celular com 90 ou mais em desempenho, acessibilidade, boas práticas e SEO. Players só tocam quando aparecem na tela.
- Commits pequenos e claros na branch combinada com o usuário. Não abra pull request sem o usuário pedir.
- No fim, entregue um resumo com o que foi feito, como rodar, as variáveis de ambiente, como publicar e o que ainda depende de decisão do usuário.

## Confirme com o usuário antes de construir

- O que ele chama de "LP Hub", se for diferente do que está descrito acima.
- Onde hospedar, qual domínio e qual banco de dados.
- Dados reais da empresa para Sobre e Privacidade: razão social, CNPJ, responsável pelos dados pessoais, equipe.
- Os compromissos que aparecem na Home: "proposta em até 1 dia útil" e "domínio, conteúdo e acessos no seu nome".
- Licença do Remotion: é grátis para empresas com até 3 funcionários; acima disso, precisa da licença de empresa em https://www.remotion.pro/license
- Quem vai produzir as fotos a partir dos prompts.
