import { Frame } from "@/components/pranchas/Frame";
import styles from "../pranchas.module.css";

export const metadata = { title: "Movimento" };

const ms = (f: number) => `${Math.round((f / 60) * 1000)} ms`;

const INTRO = [
  { f: 0, t: "Tela branca. A página já está carregada por baixo." },
  { f: 20, t: "A caneta começa no vértice do V e sobe." },
  { f: 44, t: "O V fechado; a câmera recua devagar." },
  { f: 70, t: "A cunha e o 8 sendo desenhados num traço contínuo." },
  { f: 92, t: "Contorno completo, incluindo os dois contadores do 8." },
  { f: 98, t: "O azul preenche o logo a partir do vértice do V." },
  { f: 112, t: "Logo cheio; STUDIO sobe letra por letra." },
  { f: 132, t: "Pausa de leitura." },
  { f: 152, t: "STUDIO desce e some; o logo começa a encolher." },
  { f: 168, t: "Com a mola pesada, o logo segue para o cabeçalho." },
  { f: 186, t: "No lugar exato do logo do cabeçalho; o branco some." },
  { f: 199, t: "Página revelada. As frases do topo começam a subir." },
];

const FILM = [
  { f: 20, t: "Pílula de busca vazia; \"Seu cliente procura.\" sobe." },
  { f: 120, t: "O cursor clicou na pílula e a busca é digitada." },
  { f: 232, t: "Resultados: só outras empresas." },
  { f: 304, t: "O cliente vai embora com a primeira; a pílula vira um ponto." },
  { f: 330, t: "O ponto inunda a tela de azul." },
  { f: 372, t: "\"Com um site da V8,\"" },
  { f: 440, t: "Logo e STUDIO sobem com mola firme." },
  { f: 478, t: "A câmera mergulha na cintura do 8." },
  { f: 566, t: "\"ele encontra você.\" A mesma busca volta." },
  { f: 604, t: "O negócio desce para o primeiro lugar, sem rebote." },
  { f: 720, t: "O cartão virou navegador e o site se monta." },
  { f: 804, t: "Clique no botão principal do site." },
  { f: 872, t: "O azul nasce do botão; ele vira a primeira notificação." },
  { f: 976, t: "\"Clientes chegando.\" Notificações empilham em ordem." },
  { f: 1046, t: "O branco sobe a partir da pilha." },
  { f: 1140, t: "Logo e STUDIO no fechamento." },
  { f: 1262, t: "Frase da marca e o botão Começar, que recebe o clique." },
  { f: 1430, t: "Começar volta a ser a pílula: o último quadro emenda no primeiro." },
];

const DEMOS = [
  { id: "demo-landing" as const, title: "Landing pages", frames: [80, 200, 300] },
  { id: "demo-site" as const, title: "Sites institucionais", frames: [80, 200, 300] },
  { id: "demo-loja" as const, title: "Lojas virtuais", frames: [80, 200, 300] },
  { id: "demo-sistema" as const, title: "Sistemas", frames: [80, 200, 300] },
  { id: "demo-app" as const, title: "Aplicativos", frames: [80, 200, 300] },
];

const SPECS = [
  ["Text / Kinetic", "Entra na tela", "Mola text (191/20), 3,3 quadros entre palavras, 6° de rotação", "Espera a abertura do logo e o azul da faixa"],
  ["Band / Flood", "Entra na tela", "Círculo acelera em 24 quadros (cúbica de entrada)", "Nasce do topo, de um ponto lateral ou de baixo"],
  ["Block / Reveal", "Entra na tela", "Mola soft (200/22), sobe 28 px", "No máximo dois por seção"],
  ["Card / Lift", "Hover e foco", "Mola snappy (320/30), sobe 8 px e mistura a sombra", "Também no foco do teclado"],
  ["Button / Press", "Clique", "Mola snappy, afunda 4 %", "Só nos botões Começar"],
  ["Marquee", "Sempre, fora do hover", "34 px/s; desacelera com a mola heavy", "Para de calcular fora da tela"],
  ["Carousel", "Setas", "Mola base (170/26) até o próximo card", "Volta a encaixar no fim"],
  ["Steps", "Rolagem", "Linha persegue a rolagem com a mola base; pontos com soft", "Vertical no celular"],
  ["Accordion", "Clique", "Altura e ícone com a mola base", "Um aberto por vez"],
  ["Player", "Entra e sai da tela", "Toca a 60 fps, sem som, em loop", "Pausa fora da tela; pôster com movimento reduzido"],
  ["Logo / Intro", "Primeira visita da sessão", "Traço 8–92, preenchimento 84–106, STUDIO 100–126, pouso 150 com heavy, fundo some 182–198", "Pular abertura e tecla Esc; trava de segurança em 6 s"],
];

export default function MotionBoard() {
  return (
    <div className="container">
      <div className={styles.head}>
        <p className="kicker">Prancha 3</p>
        <h1>Movimento</h1>
        <p className="lead muted">Quadros-chave renderizados pelo próprio Remotion a partir das composições do site, a 60 quadros por segundo.</p>
      </div>

      <section className={styles.group} aria-labelledby="m-intro">
        <div className={styles.groupHead}>
          <span className={styles.layer}>Logo / Intro · 200 quadros · 3,3 s</span>
          <h2 id="m-intro">Abertura do logo</h2>
          <p>Roda uma vez por sessão, só na Home, e nunca com movimento reduzido. Termina exatamente sobre o logo do cabeçalho.</p>
        </div>
        <div className={styles.frames}>
          {INTRO.map((k) => (
            <figure key={k.f} className={styles.frame} style={{ margin: 0 }}>
              <div className={styles.frameImg}>
                <Frame comp="logo-intro" frame={k.f} />
              </div>
              <span className={styles.layer}>
                Quadro {k.f} · {ms(k.f)}
              </span>
              <p>{k.t}</p>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="m-film">
        <div className={styles.groupHead}>
          <span className={styles.layer}>Film / Hero · 1440 quadros · 24 s · loop</span>
          <h2 id="m-film">Filme do topo da Home</h2>
          <p>Cinco cenas alternando branco e azul. O negócio de exemplo muda conforme a escolha do visitante; aqui, a clínica odontológica.</p>
        </div>
        <div className={styles.frames}>
          {FILM.map((k) => (
            <figure key={k.f} className={styles.frame} style={{ margin: 0 }}>
              <div className={styles.frameImg}>
                <Frame comp="hero-film" frame={k.f} inputProps={{ seg: "odonto" }} />
              </div>
              <span className={styles.layer}>
                Quadro {k.f} · {ms(k.f)}
              </span>
              <p>{k.t}</p>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="m-demos">
        <div className={styles.groupHead}>
          <span className={styles.layer}>Demo / Services · 800 × 720</span>
          <h2 id="m-demos">Demos dos serviços</h2>
          <p>Uma por serviço, em loop, nos cards da Home, no hub de serviços e no topo de cada landing page.</p>
        </div>
        {DEMOS.map((d) => (
          <div key={d.id} style={{ marginBottom: 40 }}>
            <h3 style={{ marginBottom: 16 }}>{d.title}</h3>
            <div className={styles.frames}>
              {d.frames.map((f) => (
                <figure key={f} className={styles.frame} style={{ margin: 0 }}>
                  <div className={styles.frameImg}>
                    <Frame comp={d.id} frame={f} />
                  </div>
                  <span className={styles.layer}>
                    {d.id} · quadro {f}
                  </span>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.group} aria-labelledby="m-spec">
        <div className={styles.groupHead}>
          <h2 id="m-spec">Especificação das interações</h2>
          <p>Todas usam as molas da prancha de tokens. Nenhuma usa transição de CSS.</p>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Camada</th>
                <th>Quando</th>
                <th>Movimento</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {SPECS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
