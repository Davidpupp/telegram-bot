# V8 Studio · site (Next.js + Remotion)

Site da V8 Studio com a mesma estética do filme da marca: folha branca, faixas de azul royal que entram como inundação de cor, cards brancos flutuando e frases que sobem palavra por palavra. Todo o movimento vem do Remotion: as cenas maiores rodam no `<Player>` e as animações da página usam `spring` e `interpolate` do Remotion num relógio de 60 quadros por segundo. Não há `transition` nem `animation` de CSS.

## Ver no seu computador

Precisa do Node.js 20 ou mais novo.

```bash
git fetch origin claude/focused-dijkstra-aucxhq
git checkout claude/focused-dijkstra-aucxhq
cd v8-studio/site
npm install
npm run dev
```

Abra http://localhost:3000. A abertura do logo roda uma vez por sessão do navegador; para ver de novo, abra uma janela anônima.

Para gerar o site estático (pasta `out/`, pronta para qualquer hospedagem):

```bash
npm run build
```

## Estrutura

- `app/(site)/`: páginas públicas com cabeçalho e rodapé. `app/layout.tsx` é o layout raiz.
- `components/site/`: cabeçalho, rodapé e logo. `components/home/`: peças da Home.
- `content/`: textos e dados (serviços, artigos, perguntas).
- `motion/`: o sistema de movimento.
  - `KineticText`, `Reveal`, `Flood`, `Lift`, `Marquee`, `Carousel`, `Steps`, `Accordion`: animações da página feitas com molas do Remotion.
  - `MotionPlayer`: `<Player>` que toca quando aparece na tela e pausa quando sai.
  - `IntroOverlay` e `compositions/LogoIntro`: abertura do logo, que pousa no lugar do logo do cabeçalho.
  - `film/`: o filme do topo da Home, em cinco cenas, que muda conforme o tipo de negócio escolhido pelo visitante.
  - `compositions/`: demonstrações dos serviços e o registro (`registry.ts`) de todas as composições.
  - `lib/`: grade de 60 quadros por segundo, molas, easings, cores e fontes (as mesmas do filme).
- Movimento reduzido: com `prefers-reduced-motion`, a abertura não aparece, as frases e faixas surgem prontas e cada composição mostra um quadro parado.

## Licenças

- Remotion é gratuito para pessoas físicas e empresas com até 3 funcionários. Acima disso é preciso a licença de empresa: https://www.remotion.pro/license
- Fontes Bricolage Grotesque, Inter e Montserrat (SIL Open Font License), em `public/fonts`.
- Negócios, marcas e notificações das animações são exemplos fictícios.
