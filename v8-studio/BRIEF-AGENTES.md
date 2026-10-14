# V8 Studio — briefing técnico para quem constrói páginas

Site estático em HTML/CSS/JS puro. Raiz: `/home/user/telegram-bot/v8-studio/`.
Design system pronto em `assets/styles.css` (leia inteiro antes de começar) e `assets/app.js`.
Idioma de toda a interface: português do Brasil. Copy real, nunca lorem ipsum.

## Esqueleto obrigatório de toda página pública

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Título curto — V8 Studio</title>
<meta name="description" content="…">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="ROOT/assets/styles.css">
<style>/* só CSS específico da página, usando os tokens */</style>
</head>
<body data-intro>            <!-- data-intro só na home (index.html) -->
<div data-header></div>      <!-- app.js injeta o cabeçalho fixo -->
<main> … </main>
<div data-footer></div>      <!-- app.js injeta o rodapé -->
<script src="ROOT/assets/app.js" data-root="ROOT" defer></script>
</body></html>
```

`ROOT` é o prefixo relativo até a raiz: `""` para páginas na raiz, `"../"` para `servicos/`, `blog/`, `admin/`, `pranchas/`.
No atributo `data-root` use exatamente `""` ou `"../"`. Nos `href`/`src` escreva `assets/...` ou `../assets/...`.

Páginas do admin: `<body class="no-header">`, sem `data-header`/`data-footer`, usam `.admin`, `.admin__side`, `.admin__main`.

## Regras duras de identidade (não negociáveis)
- Fundo da página branco. Faixas azuis = `<section class="band section">` de borda a borda com texto branco. Nunca duas faixas azuis seguidas; entre duas faixas sempre uma seção branca (ou `.paper`).
- Cards sempre brancos (`.card`), raio 28, sombra do token. Dentro das faixas azuis continuam brancos.
- Botões: `.btn.btn--primary` (azul, texto branco). Dentro de `.band` o mesmo botão vira branco com texto azul automaticamente.
- CTA sempre com o texto **"Começar"** e `href` para `comecar.html` (com o ROOT certo). Repita em vários pontos.
- PROIBIDO: gradientes, emojis, badges/tags/pills/etiquetas de texto ("novo", "mais pedido"), ícones decorativos sem função, texturas, blobs, formas abstratas, modo escuro, fontes serifadas, eyebrows em caixa alta, setas "→" em texto, números 01/02/03 fora de sequências reais.
- Tipografia só pelas classes/elementos: `h1`, `h2`, `h3`, `.lead`, `.muted`, `.small`, `.kicker` (frase curta em cinza acima de um título, sentence case).
- Grid: `.container` (max 1200 + gutters) e `.grid` (12 colunas). Espaço entre seções: `.section` (120/72 automático). Não invente paddings de seção.
- Mobile 375px: tudo empilha; nada de rolagem horizontal; use `min-width: 0` em filhos de grid com texto.
- Fotos: NÃO use imagens externas nem stock. Onde a foto real entrar, use `<div class="photo" data-prompt="descrição curta da foto"></div>` (ocupa o container; dentro de `.card-tall__media` já preenche). Liste cada slot de foto no relatório final com um prompt exato em português (ambiente de trabalho real, tons neutros, luz natural, sem pessoas olhando para a câmera, sem sobreposição de cor).
- Interfaces fictícias (telas de clientes) são desenhadas em CSS com as classes `.mini*` dentro de `.browser`/`.phone`. Cada mini-site recebe `style="--p:#hex;--p-soft:#hex"` com paleta própria do segmento. Veja o exemplo abaixo.
- Mockup de notebook: `.laptop > .laptop__screen > .browser` + `.laptop__base`.
- Motion: pouca. `.reveal` em no máximo 1 bloco por seção (o título ou o grupo de cards). Hover nos cards já existe. Nada de animação em todo elemento.

## Componentes prontos (classes)
- Hero: `<section class="hero container">` com `h1`, `p.lead`, `div.cta` (`.btn` + `p.btn-note`).
- Marquee: `<div class="marquee"><div class="marquee__track"><div class="marquee__item">…</div>…</div></div>` e `.marquee.marquee--reverse` para a fileira que roda para a direita. app.js duplica os itens. Cada item: `.browser.browser--wide` com `.mini` dentro.
- Números: `<div class="stats"><div class="stat"><div class="stat__n" data-count="120" data-suffix="+">120+</div><div class="stat__l">projetos entregues</div></div>…</div>`
- Cards de benefício: `.grid` com `div.card` em `grid-column: span 4`.
- Carrossel de cards altos: 
  ```html
  <div class="carousel">
    <div class="section-head section-head--split container"><div><p class="kicker">…</p><h2>…</h2></div><div class="carousel__nav" style="justify-self:end"><button class="carousel__btn" data-dir="prev" aria-label="Anterior"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10H4M9 5l-5 5 5 5"/></svg></button><button class="carousel__btn" data-dir="next" aria-label="Próximo"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h13M11 5l5 5-5 5"/></svg></button></div></div>
    <div class="carousel__track">
      <article class="card-tall">
        <div class="card-tall__head"><h3>Design que converte</h3><p>Uma linha de descrição.</p></div>
        <div class="card-tall__media"><div class="photo" data-prompt="…"></div>
          <div class="card-tall__float">…um pedaço de interface (formulário, gráfico ou menu) com classes .mini__form/.mini__chart/.mini__menu…</div></div>
        <a class="card-tall__arrow" href="…" aria-label="Ver mais" data-arrow></a>
      </article>
    </div>
  </div>
  ```
  O `.carousel__track` já alinha o início ao container e sangra até a borda direita; NÃO o coloque dentro de `.container`.
- Passos ligados por linha: `<div class="steps"><span class="steps__line"></span><div class="step"><h3>Diagnóstico</h3><p>…</p></div>×4</div>` (o número vem do CSS por contador).
- Acordeão: `<div class="accordion"><div class="accordion__item"><button class="accordion__btn" type="button">Pergunta</button><div class="accordion__panel"><div><div class="accordion__content">Resposta</div></div></div></div>…</div>` (o ícone + é inserido pelo JS).
- Barra de progresso: `.progress > .progress__bar` (largura via style).
- Opção do formulário: `<button class="option" type="button"><strong>Título</strong><span>Uma linha de descrição</span></button>`.
- Campos: `.field > label + input`, `.field__hint`, `.check`.
- Tabela: `.table-wrap > table.table`, pontuação `.score > b + i[style="--v:72%"]`, status `.status.status--novo|contato|proposta|fechado|perdido`.
- Moldura de celular: `.phone > .phone__notch + .phone__screen`.
- Seta para links/cards: `<span data-arrow></span>` recebe o SVG da seta.

### Exemplo de mini-site (clínica) para marquee / cards
```html
<div class="browser browser--wide"><div class="browser__bar"><i></i><i></i><i></i><div class="browser__url">clinicavida.com.br</div></div>
<div class="browser__body"><div class="mini" style="--p:#1B7A6B;--p-soft:#E6F2EF">
  <div class="mini__nav"><div class="mini__logo">Vida</div><div class="mini__links"><i></i><i></i><i></i></div><div class="mini__btn">Agendar</div></div>
  <div class="mini__split"><div class="mini__hero"><div class="mini__h">Cuidar de você é o nosso trabalho</div><div class="mini__line"></div><div class="mini__line mini__line--short"></div><div class="mini__btn" style="width:40%">Agendar</div></div><div class="mini__img" style="min-height:60px"></div></div>
  <div class="mini__cols"><div class="mini__card"><div class="mini__line"></div><div class="mini__line mini__line--short"></div></div><div class="mini__card"><div class="mini__line"></div><div class="mini__line mini__line--short"></div></div><div class="mini__card"><div class="mini__line"></div><div class="mini__line mini__line--short"></div></div></div>
</div></div></div>
```
Varie a composição entre segmentos (hero com imagem cheia `.mini__img--p` e `.mini__h--light`, grade de produtos `.mini__cols--2`, lista de menu, formulário). Use `style="--mini-bg:#…"` para fundo escuro ou colorido do mini-site quando couber ao segmento.

## Rodapé e cabeçalho
Já vêm do app.js. Não escreva telefone, e-mail, WhatsApp ou redes sociais em lugar nenhum.

## Verificação antes de entregar
Tire um screenshot desktop (1440) e mobile (375) com:
`node /tmp/claude-0/-home-user-telegram-bot/15b674f8-4420-506e-a11d-6d598f62bd25/scratchpad/shot.js /caminho/absoluto/pagina.html /tmp/claude-0/-home-user-telegram-bot/15b674f8-4420-506e-a11d-6d598f62bd25/scratchpad/nome.png 1440 1 1200`
(e o mesmo com 375). O comando imprime `overflow:true` se houver rolagem horizontal e lista erros de JS; corrija até ficar limpo. Olhe a imagem e corrija o que estiver quebrado, sobreposto ou vazio. Na home, a abertura do logo roda só uma vez por sessão: para fotografar a página já aberta, espere 3500ms.
