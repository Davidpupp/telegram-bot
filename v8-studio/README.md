# V8 Studio — site institucional e hub de vendas

Protótipo navegável em HTML, CSS e JavaScript puros, sem build. Abra `hub.html` para o índice de pranchas e páginas, ou `index.html` para a home.

## Estrutura

```
v8-studio/
├── hub.html                 índice das pranchas e páginas (entrada do protótipo publicado)
├── index.html               Home (roda a abertura do logo uma vez por sessão)
├── sobre.html               Sobre
├── comecar.html             Formulário gamificado "Começar" (9 telas)
├── privacidade.html         Política de privacidade (link do rodapé)
├── servicos/                landing-pages (modelo completo), sites (variação), lojas-virtuais, sistemas, aplicativos
├── blog/                    index (listagem) e artigo (leitura)
├── admin/                   login, index (dashboard), leads, lead, post (editor), config
├── pranchas/                tokens, componentes, keyframes da abertura
├── video/                   projeto Remotion do filme "Seu cliente procura" (24 s, ver video/README.md)
├── v8-studio-filme*.mp4     filme final: master com som, versão do site sem som (1080p e 720p) e pôsteres
├── assets/styles.css        tokens e componentes (fonte da verdade do sistema visual)
├── assets/app.js            cabeçalho e rodapé injetados, logo, abertura, marquee, carrossel, acordeão
├── BRIEF-AGENTES.md         briefing técnico usado para construir as páginas
└── PROMPTS-IMAGENS.md       prompt exato de cada foto ou vídeo que o site precisa
```

## Regras do sistema visual

- Fundo branco `#FFFFFF`; faixas de azul royal `#2347D6` chapado de borda a borda, nunca duas seguidas.
- Texto `#0B1220`, apoio `#5B6478`, neutro `#F5F7FB`.
- Cards sempre brancos, raio 28 px, sombra `0 24px 64px -24px rgba(13,32,96,.28)` + `0 8px 24px -12px rgba(13,32,96,.16)`; no hover sobem 8 px.
- Botões pílula de 56 px; azul com texto branco, ou branco com texto azul nas faixas azuis.
- Títulos em Bricolage Grotesque 700 (56 a 88 px no desktop); corpo em Inter (16 a 18 px, altura 1,6). Wordmark "STUDIO" em Montserrat 600.
- Grid de 12 colunas, 1200 px, gutters de 24 px; mobile em 375 px com 16 px de gutter.
- Proibido: gradientes, emojis, badges, ícones decorativos, texturas, blobs, modo escuro.

## Logo

A marca oficial (prancha de identidade enviada pelo cliente) foi vetorizada e vive em `assets/app.js` (`V8.LOGO_PATH`): um único `<path>` com `fill-rule: evenodd`. A ordem dos subcaminhos é a ordem em que a abertura desenha o contorno: o V nasce no vértice e sobe, depois a cunha, o 8 e seus contadores.

## Filme

O filme de 24 s foi feito em Remotion, com o roteiro e o mapa de batidas em `video/BEATMAP.md`. A versão do site não tem som, roda em loop perfeito (o último quadro emenda no primeiro) e entra na Home dentro de um card branco. Para refazer ou editar, veja `video/README.md`.

## Fotos

Nenhuma imagem externa é carregada. Cada slot de foto é um `<div class="photo" data-prompt="…">` neutro. Os prompts completos estão em `PROMPTS-IMAGENS.md`. Para colocar a foto real, troque o `div` por `<img>` com `object-fit: cover`, ou use `background-image` no próprio `.photo`.

## Verificação

Com Playwright instalado, `node shot.js <página> <saida.png> <largura>` tira um screenshot e informa se há rolagem horizontal ou erros de JavaScript (script no scratchpad da sessão; reproduza com `@playwright/test` se precisar).
