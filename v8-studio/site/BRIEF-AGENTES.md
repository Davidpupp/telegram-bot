# Briefing para quem constrói páginas do site da V8 Studio

Leia este arquivo inteiro antes de começar. Ele vale para todos os agentes que trabalham em paralelo neste site.

## Projeto

- Raiz do site: `/home/user/telegram-bot/v8-studio/site`. Next.js 16.4.0 (App Router, Turbopack), React 19.3, TypeScript, Remotion 4.0.535 com `@remotion/player`. Exportação estática (`output: "export"`, `trailingSlash: true`).
- Esta versão do Next.js tem mudanças em relação ao que você conhece. Antes de usar uma API do Next, leia o guia em `node_modules/next/dist/docs/01-app/` (por exemplo `03-api-reference/03-file-conventions/dynamic-routes.md`, `03-api-reference/04-functions/generate-static-params.md`, `01-getting-started/14-metadata-and-og-images.md`).
- Rotas dinâmicas: `generateStaticParams` e `export const dynamicParams = false`. `params` é uma Promise: `export default async function Page({ params }: PageProps<"/blog/[slug]">) { const { slug } = await params; }`.
- URLs sempre com barra no fim: `/blog/`, `/servicos/sites/`. Use `next/link`.
- Leia antes: `app/globals.css` (tokens e classes), `app/(site)/page.tsx` (a Home, que é o padrão de qualidade), `motion/` (sistema de movimento) e `content/`.

## Servidor, verificação e capturas

- O servidor de desenvolvimento já está rodando em http://localhost:3000. **Não** inicie outro servidor e **não** rode `next build` (os dois disputam a pasta `.next`).
- Tipos: `npx tsc --noEmit`. Erros em arquivos que não são seus podem ser de outro agente trabalhando ao mesmo tempo: corrija só os seus.
- Lint só dos seus arquivos: `npx eslint <caminhos>`.
- Captura de tela (a abertura do logo é pulada automaticamente):
  `node /tmp/claude-0/-home-user-telegram-bot/15b674f8-4420-506e-a11d-6d598f62bd25/scratchpad/shot-next.js <url> <saida.png> <largura> full skip 2500`
  Grave as imagens em `/tmp/claude-0/-home-user-telegram-bot/15b674f8-4420-506e-a11d-6d598f62bd25/scratchpad/agentes/`. O comando imprime `overflow:true` se houver rolagem horizontal e lista erros do console. Abra a imagem com a ferramenta Read e olhe de verdade. Para páginas longas, recorte com Python (PIL) em pedaços de até 1600 px de altura antes de olhar. Confira em 1440 e em 390 de largura. O botão redondo "N" no canto é do modo de desenvolvimento e pode ser ignorado.

## Divisão de arquivos

- Crie e edite **somente** os arquivos da sua tarefa. Não edite `app/globals.css`, `app/layout.tsx`, `app/(site)/layout.tsx`, `components/site/*`, `components/Markdown.tsx`, `motion/*.tsx`, `motion/lib/*`, `content/services.ts` nem `content/home.ts`. Se precisar de algo neles, diga no relatório final.
- `motion/compositions/registry.ts` é só do agente das demos. `content/posts.ts` é só do agente do blog.
- Estilos próprios de página vão em CSS Modules ao lado do componente (`algo.module.css`), usando os tokens (`var(--color-blue)`, `var(--font-display)`, `var(--radius-card)`, `var(--shadow-card)`, `var(--section)`, `var(--gutter)`). Combine com as classes globais quando servirem.

## Regras de identidade (não negociáveis)

- Branco e azul royal `#2347D6` chapado, como papel. Faixas azuis (`<Flood>`) de borda a borda; nunca duas faixas azuis seguidas. Entre duas azuis, sempre uma seção branca ou `.paper`.
- Cards sempre brancos (`.card`), raio 28, sombra do token, também dentro das faixas azuis.
- Botões em pílula de 56 px (`.btn.btn--primary`; dentro de faixa azul ele fica branco sozinho). CTA principal sempre "Começar", para `/comecar/` (pode levar `?servico=<slug>` ou `?objetivo=<chave>`). Use `<PressLink>` para esses botões.
- Títulos com `h1`/`h2`/`h3` (Bricolage 800), texto Inter, "STUDIO" em Montserrat. Kicker é `.kicker`: frase curta cinza em caixa normal acima do título.
- Proibido: gradientes, emojis, badges, tags e pílulas de rótulo ("novo", "mais pedido"), ícones decorativos, texturas, blobs, formas abstratas, modo escuro, serifas, eyebrows em caixa alta, setas "→" em texto, numeração 01/02/03 fora de sequências reais.
- Nenhum telefone, e-mail, WhatsApp ou rede social da V8 em lugar nenhum. Coletar o contato do cliente em formulário pode.
- Honestidade: nada de números, clientes, depoimentos, prêmios ou pessoas inventados. Negócios e marcas de exemplo são fictícios e a página diz isso ("Exemplo ilustrativo"). Promessas da V8 já usadas no site: "Leva 2 minutos. Sem compromisso." e "Respondemos em até 1 dia útil".
- Fotos: nada de imagem externa nem banco de imagens. Onde entrar foto real, use `<div className="photo" data-prompt="descrição curta" />` e escreva no relatório final o prompt exato em português (ambiente real, tons neutros, luz natural, sem pessoas olhando para a câmera, sem filtros de cor).
- Mockups de telas (sites, lojas, sistemas, apps de clientes) são desenhados em código. Dentro dos mockups, cada marca fictícia pode ter a própria cor.
- Português do Brasil, frases curtas, voz ativa, sem jargão. Nada de lorem ipsum.
- Celular em 375 a 390 px: tudo empilha e nada rola para o lado. Filhos de grid com texto levam `min-width: 0`.

## Movimento: tudo pelo Remotion

Não use `transition` nem `animation` de CSS. Todo movimento sai dos componentes abaixo (todos de cliente; podem ser usados direto em páginas de servidor):

- `KineticText` (`@/motion/KineticText`): `text`, `as` ("h1" | "h2" | "h3" | "p" | "span" | "div"), `id`, `className`, `delay` em quadros de 60 fps, `stagger`. Palavras sobem de uma máscara. Use nos títulos principais de cada seção; `\n` quebra a linha.
- `Reveal` (`@/motion/Reveal`): `as`, `className`, `delay`, `y`, `style`. Sobe e aparece. No máximo um ou dois por seção (parágrafo de apoio, grupo de botões, grade de cards).
- `Flood` (`@/motion/Flood`): faixa que inunda de azul. `as`, `origin={[x, y]}` em frações, `className="section"`, `aria-labelledby`. O texto dentro fica branco e as frases esperam o azul chegar.
- `Lift`, `LiftLink`, `PressLink` (`@/motion/Lift`): hover com mola em cards (`LiftLink` quando o card inteiro é link) e botão que afunda ao clicar.
- `MotionPlayer` (`@/motion/MotionPlayer`): `id` de `motion/compositions/registry.ts`, `label` descrevendo a animação, `inputProps`, `style`. Toca quando aparece e pausa quando sai. Para preencher uma área fixa: `style={{ position: "absolute", inset: 0, aspectRatio: "auto", height: "100%" }}` dentro de um pai com `position: relative`.
- `Marquee` (`@/motion/Marquee`): `speed`, `reverse`; filhos são `.marquee__item`. `MiniSite` e `MINIS` em `@/components/home/MiniSite` são prévias prontas.
- `Carousel` (`@/motion/Carousel`): `head`, `label`; filhos são os cards (`.card-tall`).
- `Steps` (`@/motion/Steps`): `items: { title, text }[]`. `Accordion` (`@/motion/Accordion`): `items: { q, a }[]`.
- Para animações próprias em componentes de cliente: `useTimeline`, `useSpringTo`, `useInView`, `useReducedMotion`, `useMounted` em `@/motion/hooks`, e `sp(frame, inicio, "snappy" | "base" | "heavy" | "text" | "soft")`, `ramp`, `lerp`, `clamp`, `bump`, `SPRINGS` em `@/motion/lib/timing`. **Atenção:** `motion/lib/timing.ts` importa `remotion`, então só pode ser importado por arquivos com `"use client"`. `motion/lib/theme.ts` (cores, fontes, logo) pode ser usado em qualquer lugar.
- Composições do Remotion novas: pasta `motion/compositions/`, peças prontas em `motion/compositions/kit.tsx` (Cursor, Ripple, Logo, Wordmark, Words, SearchPill, ResultCard, Browser, Toast, CheckBadge, pathAt). Todo `<Player>` precisa de `initiallyMuted` (o `MotionPlayer` já faz isso).
- Movimento reduzido: os componentes já tratam. Em código próprio, com `useReducedMotion()` true mostre o estado final.

## Relatório final (resposta para quem te chamou)

- Arquivos criados ou alterados.
- Capturas feitas (caminhos) e o que você corrigiu depois de olhar.
- Lugares de foto com o prompt exato de cada um.
- Pendências e perguntas para o usuário (dados reais da empresa, por exemplo).
- Resultado de `npx tsc --noEmit` e do lint nos seus arquivos.
