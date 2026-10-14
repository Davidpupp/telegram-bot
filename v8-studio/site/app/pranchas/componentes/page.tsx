import { MINIS, MiniSite } from "@/components/home/MiniSite";
import { Replay } from "@/components/pranchas/BoardTools";
import { KitBrowser, KitButtonPill, KitPill, KitResult, KitToast } from "@/components/pranchas/KitShowcase";
import { FAQ, STEPS } from "@/content/home";
import { Accordion } from "@/motion/Accordion";
import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { Lift, PressLink } from "@/motion/Lift";
import { Marquee } from "@/motion/Marquee";
import { MotionPlayer } from "@/motion/MotionPlayer";
import { Steps } from "@/motion/Steps";
import styles from "../pranchas.module.css";

export const metadata = { title: "Componentes" };

function Group({ id, title, text, children }: { id: string; title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className={styles.group} aria-labelledby={id}>
      <div className={styles.groupHead}>
        <h2 id={id}>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
      {children}
    </section>
  );
}

const Layer = ({ children }: { children: React.ReactNode }) => <span className={styles.layer}>{children}</span>;

export default function ComponentsBoard() {
  return (
    <div className={`container ${styles.board}`}>
      <div className={styles.head}>
        <p className="kicker">Prancha 2</p>
        <h1>Componentes</h1>
        <p className="lead muted">Cada peça aqui é o componente real do site, com o movimento real. Passe o mouse, clique e use os botões de repetir.</p>
      </div>

      <Group id="c-botoes" title="Botões" text="Pílulas de 56 px. O principal sempre diz Começar. Dentro da faixa azul ele vira branco com texto azul.">
        <div className={styles.stage}>
          <Layer>Button / Primary · Button / Ghost · Button / Small · Button / Quiet</Layer>
          <div className={styles.stageRow}>
            <PressLink href="/comecar/" className="btn btn--primary">
              Começar
            </PressLink>
            <a href="#c-botoes" className="btn btn--ghost">
              Ver todos os artigos
            </a>
            <a href="#c-botoes" className="btn btn--primary btn--sm">
              Começar
            </a>
            <a href="#c-botoes" className="btn btn--quiet">
              Ver landing pages
            </a>
          </div>
        </div>
        <div className={`${styles.stage} band`} style={{ background: "var(--color-blue)", marginTop: 16 }}>
          <Layer>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>Button / Primary / On Blue · Button / Ghost / On Blue</span>
          </Layer>
          <div className={styles.stageRow}>
            <PressLink href="/comecar/" className="btn btn--primary">
              Começar
            </PressLink>
            <a href="#c-botoes" className="btn btn--ghost">
              Saiba mais
            </a>
          </div>
        </div>
      </Group>

      <Group id="c-cards" title="Cards" text="Sempre brancos, raio 28, sombra flutuante. No hover sobem 8 px com a mola rápida.">
        <div className="grid">
          <div className="span-4">
            <Lift className="card" style={{ height: "100%" }}>
              <Layer>Card / Default</Layer>
              <h3 style={{ marginTop: 12 }}>Para receber sua proposta</h3>
              <p>Você conta o que precisa em 2 minutos e recebe escopo, prazo e investimento por escrito.</p>
            </Lift>
          </div>
          <div className="span-4">
            <Lift className="card promise" style={{ height: "100%" }}>
              <Layer>Card / Promise</Layer>
              <span className="promise__big">1 dia útil</span>
              <p>Número grande só quando é um compromisso real.</p>
            </Lift>
          </div>
          <div className="span-4">
            <div className="card-tall" style={{ maxWidth: 360 }}>
              <div className="card-tall__head">
                <Layer>Card / Tall / Demo</Layer>
                <h3>Landing pages</h3>
                <p>Uma página com um objetivo só.</p>
              </div>
              <div className="card-tall__media">
                <MotionPlayer
                  id="demo-landing"
                  label="Animação: uma landing page se monta e recebe um pedido"
                  style={{ position: "absolute", inset: 0, aspectRatio: "auto", height: "100%", background: "var(--color-paper)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Group>

      <Group id="c-kinetic" title="Frase cinética" text="Cada palavra sobe de uma máscara com a mola de texto e 6° de rotação que se desfaz, uma a cada 55 ms.">
        <div className={styles.stage}>
          <Layer>Text / Kinetic / H2</Layer>
          <Replay>
            <KineticText text="Seu cliente está procurando agora." />
          </Replay>
        </div>
      </Group>

      <Group id="c-flood" title="Faixa que inunda" text="O azul nasce num ponto e acelera até limpar o canto mais distante em 0,4 s. As frases de dentro esperam o azul chegar.">
        <Replay label="Repetir a inundação">
          <Flood className={styles.stage} origin={[0.5, 1]}>
            <Layer>
              <span style={{ color: "rgba(255,255,255,0.8)" }}>Band / Flood / Blue</span>
            </Layer>
            <KineticText text="O que você pode esperar da gente." />
          </Flood>
        </Replay>
      </Group>

      <Group id="c-marquee" title="Vitrine que corre" text="Movida por um relógio de quadros. No hover a velocidade cai a zero com a mola pesada.">
        <Layer>Marquee / Mini Sites</Layer>
        <div style={{ marginInline: "calc(var(--gutter) * -1)", marginTop: 12 }}>
          <Marquee speed={34}>
            {MINIS.slice(0, 4).map((m) => (
              <MiniSite key={m.key} m={m} />
            ))}
          </Marquee>
        </div>
      </Group>

      <Group id="c-steps" title="Passos" text="A linha azul avança com a rolagem e cada ponto acende quando ela chega.">
        <Layer>Steps / Four</Layer>
        <div style={{ marginTop: 24 }}>
          <Steps items={STEPS} />
        </div>
      </Group>

      <Group id="c-faq" title="Perguntas" text="Abre uma por vez. Altura e ícone pela mola base.">
        <Layer>Accordion / FAQ</Layer>
        <div style={{ marginTop: 16, maxWidth: 760 }}>
          <Accordion items={FAQ.slice(0, 3)} />
        </div>
      </Group>

      <Group id="c-form" title="Formulário" text="Opções grandes, campos de 56 px e barra de progresso.">
        <div className={styles.stage} style={{ background: "var(--color-white)", boxShadow: "var(--shadow-card)" }}>
          <Layer>Form / Progress · Form / Option · Form / Field · Form / Check</Layer>
          <div className="progress">
            <div className="progress__bar" style={{ width: "44%" }} />
          </div>
          <div className="grid" style={{ gap: 12 }}>
            <button type="button" className="option span-6" aria-pressed="true">
              <strong>Trazer mais contatos</strong>
              <span>Orçamentos e agendamentos</span>
            </button>
            <button type="button" className="option span-6" aria-pressed="false">
              <strong>Vender pela internet</strong>
              <span>Catálogo, carrinho e pagamento</span>
            </button>
          </div>
          <div className="grid" style={{ gap: 16 }}>
            <div className="field span-6">
              <label htmlFor="p-nome">Seu nome</label>
              <input id="p-nome" defaultValue="Marina Costa" />
            </div>
            <div className="field span-6">
              <label htmlFor="p-empresa">Empresa</label>
              <input id="p-empresa" placeholder="Nome da empresa" />
              <span className="field__error">Conte o nome da empresa para a proposta sair certa.</span>
            </div>
          </div>
          <label className="check">
            <input type="checkbox" defaultChecked /> Concordo com o uso dos meus dados para receber a proposta.
          </label>
        </div>
      </Group>

      <Group id="c-tabela" title="Tabela do admin" text="Compatibilidade em barra e status com ponto colorido, sem pílulas de rótulo.">
        <Layer>Table / Leads</Layer>
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Serviço</th>
                <th>Compatibilidade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: "Exemplo · Padaria Sol", s: "Landing page", v: 86, st: "novo", l: "Novo" },
                { n: "Exemplo · Oficina Prime", s: "Sistema", v: 72, st: "contato", l: "Em contato" },
                { n: "Exemplo · Ateliê Lume", s: "Loja virtual", v: 91, st: "proposta", l: "Proposta" },
                { n: "Exemplo · Pulso Academia", s: "Aplicativo", v: 64, st: "fechado", l: "Fechado" },
              ].map((r) => (
                <tr key={r.n}>
                  <td>{r.n}</td>
                  <td>{r.s}</td>
                  <td>
                    <span className="score">
                      <b>{r.v}</b>
                      <i>
                        <span style={{ width: `${r.v}%` }} />
                      </i>
                    </span>
                  </td>
                  <td>
                    <span className={`status status--${r.st}`}>{r.l}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>

      <Group id="c-kit" title="Peças das animações" text="As mesmas peças do filme e das demos, paradas. A pílula de busca e o botão Começar são a mesma forma.">
        <div className={styles.stage}>
          <Layer>Kit / Search Pill · Kit / Button Pill</Layer>
          <div className={styles.stageRow}>
            <KitPill />
            <KitButtonPill />
          </div>
          <Layer>Kit / Result Card / Highlighted</Layer>
          <KitResult />
          <Layer>Kit / Toast</Layer>
          <KitToast />
          <Layer>Kit / Browser</Layer>
          <KitBrowser />
        </div>
      </Group>

      <Group id="c-chat" title="Conversa" text="Bolhas que entram como as notificações do filme.">
        <div className="chat" style={{ minHeight: 0, maxWidth: 640 }}>
          <Layer>Chat / Bubble / V8 · Chat / Bubble / Visitor</Layer>
          <p className="bubble bubble--v8">
            <span className="bubble__who">V8 Studio</span>
            Oi. O que você mais quer que o seu site faça?
          </p>
          <p className="bubble bubble--me">Trazer mais contatos</p>
        </div>
      </Group>
    </div>
  );
}
