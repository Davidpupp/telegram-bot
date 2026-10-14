# V8 Studio · filme "Seu cliente procura" (Remotion)

Filme de 24 s em 1920×1080 a 60 fps, feito em código com Remotion e com o pipeline da skill `motion-design`: roteiro e mapa de batidas antes do código, stills para revisão, rascunho em 540p, master com desfoque de movimento, varredura de saltos e áudio normalizado. O roteiro completo, cena a cena e batida a batida, está em [BEATMAP.md](BEATMAP.md).

## Arquivos entregues (em `v8-studio/`)

| Arquivo | Uso |
|---|---|
| `v8-studio-filme.mp4` | Master 1080p60 com trilha e efeitos, −14 LUFS. Redes e apresentações. |
| `v8-studio-filme-site.mp4` | 1080p60 sem áudio, para o site (autoplay, mudo, loop perfeito). |
| `v8-studio-filme-site-720.mp4` | 720p30 sem áudio, mais leve, para celular. |
| `v8-studio-filme-poster-logo.jpg` / `-poster-final.jpg` | Pôsteres para o atributo `poster` do vídeo. |

No site:

```html
<video autoplay muted loop playsinline preload="metadata" poster="v8-studio-filme-poster-logo.jpg"
       aria-label="Animação: um cliente procura um dentista, só acha concorrentes; com a V8 ele acha a clínica e agenda.">
  <source src="v8-studio-filme-site.mp4" type="video/mp4">
</video>
```

## Como rodar

```bash
npm i
python3 scripts/fetch_assets.py      # baixa trilha e efeitos do Mixkit (não versionados)
npm run dev                          # Remotion Studio: V8Film e cada cena em V8Film-Cenas
```

Stills para revisão:

```bash
npx remotion render V8Film stills --frames=0,446,780,1080,1336 --image-format=png --props='{"audio":false,"motionBlur":false}'
```

Rascunho rápido (960×540) e master:

```bash
npx remotion render V8Film out/rascunho.mp4 --scale=0.5 --crf=23 --props='{"audio":true,"motionBlur":false}'
npx remotion render V8Film out/master.mp4 --crf=16 --color-space=bt709 --concurrency=4 --props='{"audio":true,"motionBlur":true}'
python3 scripts/finalize.py          # loudnorm −14 LUFS, versões do site, pôsteres e checagem de saltos e da emenda do loop
```

## Estrutura

- `src/V8Film.tsx`: as cinco cenas em `<Series>`, soco de câmera nas batidas depois do drop e desfoque de movimento opcional.
- `src/scenes/`: uma cena por arquivo (Busca, Calma, Site, Clientes, Final), cada uma registrada também como composição própria para editar no Studio. `layout.ts` guarda a grade e as posições compartilhadas entre cenas.
- `src/components/`: cursor, onda de clique, logo V8 vetorizado, frase cinética palavra por palavra, pílula de busca, resultado, navegador, notificação e o site fictício da clínica.
- `src/audio/`: trilha e efeitos. Cada efeito é posicionado pelo pico medido (`scripts/measure_sfx.py`), não pelo início do arquivo.
- `src/lib/`: grade de 130 BPM, molas (presets da skill), easings, gerador com semente, cores e fontes.

## Licenças e créditos

- **Remotion** é gratuito para pessoas físicas e empresas com até 3 funcionários. Acima disso é preciso uma licença de empresa: https://www.remotion.pro/license
- **Trilha**: "Cat Walk", Arulo (Mixkit, licença gratuita de música). **Efeitos**: Mixkit, licença gratuita de efeitos sonoros, incluindo "Car start ignition" (#1559) nas aceleradas do logo. Os arquivos não são redistribuídos neste repositório: `scripts/fetch_assets.py` baixa de novo.
- **Fontes**: Bricolage Grotesque, Inter e Montserrat (SIL Open Font License), em `public/fonts`.
- Clínica Vida, concorrentes e notificações são exemplos ilustrativos. O filme não mostra nenhum número sobre a V8.
