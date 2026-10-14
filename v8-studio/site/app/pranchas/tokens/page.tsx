import { SpringCard } from "@/components/pranchas/BoardTools";
import styles from "../pranchas.module.css";

export const metadata = { title: "Tokens" };

const COLORS = [
  { layer: "Color / White", hex: "#FFFFFF", token: "--color-white", use: "Fundo da página e todos os cards" },
  { layer: "Color / Blue / Royal", hex: "#2347D6", token: "--color-blue", use: "Faixas, botões e acento. A folha de papel azul" },
  { layer: "Color / Blue / Ink", hex: "#1A37AE", token: "--color-blue-ink", use: "Botão azul no hover" },
  { layer: "Color / Ink", hex: "#0B1220", token: "--color-ink", use: "Texto principal" },
  { layer: "Color / Gray", hex: "#5B6478", token: "--color-gray", use: "Texto de apoio e kickers" },
  { layer: "Color / Paper", hex: "#F5F7FB", token: "--color-paper", use: "Seções neutras e fundo das demos" },
  { layer: "Color / Line", hex: "#E3E7F0", token: "--color-line", use: "Bordas, trilhas e divisórias" },
  { layer: "Color / Status / Ok", hex: "#1B8A5A", token: "--color-ok", use: "Só no admin: fechado" },
  { layer: "Color / Status / Warn", hex: "#C98A12", token: "--color-warn", use: "Só no admin: em contato" },
  { layer: "Color / Status / Bad", hex: "#C8323B", token: "--color-bad", use: "Erros de formulário e perdido" },
];

const TYPE = [
  { layer: "Display / H1", spec: "Bricolage Grotesque 800 · 96, 68 e 46 px · entrelinha 0,98 · −0,035 em", style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--h1)", lineHeight: 0.98, letterSpacing: "-0.035em" }, sample: "Seu negócio merece um site que vende." },
  { layer: "Display / H2", spec: "Bricolage Grotesque 800 · 64, 48 e 36 px · 1,02 · −0,03 em", style: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--h2)", lineHeight: 1.02, letterSpacing: "-0.03em" }, sample: "Do primeiro contato ao site no ar." },
  { layer: "Display / H3", spec: "Bricolage Grotesque 700 · 28 e 24 px · 1,12 · −0,02 em", style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--h3)", lineHeight: 1.12, letterSpacing: "-0.02em" }, sample: "Para receber sua proposta" },
  { layer: "Text / Lead", spec: "Inter 400 · 20 px · 1,5", style: { fontSize: "var(--text-lg)", lineHeight: 1.5 }, sample: "Conte o que você precisa em 2 minutos. A resposta chega em até 1 dia útil." },
  { layer: "Text / Body", spec: "Inter 400 · 17 px · 1,6", style: { fontSize: "var(--text-md)", lineHeight: 1.6 }, sample: "Desenho, textos e desenvolvimento com revisões combinadas. Você acompanha cada etapa." },
  { layer: "Text / Kicker", spec: "Inter 500 · 15 px · cinza · caixa normal", style: { fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-gray)" }, sample: "Como funciona" },
  { layer: "Wordmark / Studio", spec: "Montserrat 600 · espaçamento 0,46 em · caixa alta", style: { fontFamily: "var(--font-word)", fontWeight: 600, fontSize: 28, letterSpacing: "0.46em", textTransform: "uppercase" as const }, sample: "Studio" },
];

const LAYOUT = [
  { layer: "Grid / Container", value: "12 colunas · 1200 px · gutter 24 px (16 px no celular)" },
  { layer: "Spacing / Section", value: "120 px no computador · 96 px no tablet · 72 px no celular" },
  { layer: "Header / Height", value: "76 px · 64 px no celular, fixo, branco" },
  { layer: "Button / Height", value: "56 px em pílula · 44 px na versão pequena" },
  { layer: "Radius", value: "Card 28 · opção 22 · campo 16 · navegador 18 · pílula 999" },
];

const SHADOWS = [
  { layer: "Shadow / Card", value: "var(--shadow-card)", use: "Todo card em repouso" },
  { layer: "Shadow / Card hover", value: "var(--shadow-card-hover)", use: "Card que sobe 8 px com a mola rápida" },
  { layer: "Shadow / Float", value: "var(--shadow-float)", use: "Moldura do filme e das demos grandes" },
];

const SPRING_USE: Record<string, string> = {
  snappy: "Hover de cards, botões, submenu, estados de opção",
  base: "Carrossel, acordeão, linha dos passos, cenas das demos",
  heavy: "Logo pousando no cabeçalho, vitrine desacelerando, morph do navegador",
  text: "Frases cinéticas: cada palavra sobe da máscara",
  soft: "Blocos que sobem, pontos dos passos acendendo",
};

export default function TokensBoard() {
  return (
    <div className="container">
      <div className={styles.head}>
        <p className="kicker">Prancha 1</p>
        <h1>Tokens</h1>
        <p className="lead muted">Os valores de base do sistema, definidos em app/globals.css e em motion/lib.</p>
      </div>

      <section className={styles.group} aria-labelledby="t-cor">
        <div className={styles.groupHead}>
          <h2 id="t-cor">Cor</h2>
          <p>Branco e azul royal chapados, como papel. Nada de gradiente. Cores de cliente aparecem só dentro dos mockups.</p>
        </div>
        <div className={styles.swatches}>
          {COLORS.map((c) => (
            <div key={c.layer} className={styles.swatch}>
              <div className={styles.swatchColor} style={{ background: c.hex }} />
              <div className={styles.swatchBody}>
                <span className={styles.layer}>{c.layer}</span>
                <strong className="tnum">{c.hex}</strong>
                <span>{c.use}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="t-tipo">
        <div className={styles.groupHead}>
          <h2 id="t-tipo">Tipografia</h2>
          <p>Bricolage Grotesque nos títulos, Inter no texto e Montserrat só no STUDIO do logo.</p>
        </div>
        {TYPE.map((t) => (
          <div key={t.layer} className={styles.typeRow}>
            <div className={styles.typeMeta}>
              <span className={styles.layer}>{t.layer}</span>
              <span className="small muted">{t.spec}</span>
            </div>
            <div style={t.style}>{t.sample}</div>
          </div>
        ))}
      </section>

      <section className={styles.group} aria-labelledby="t-grade">
        <div className={styles.groupHead}>
          <h2 id="t-grade">Grade, espaço e forma</h2>
        </div>
        <div className={styles.specs}>
          {LAYOUT.map((l) => (
            <div key={l.layer} className={`card ${styles.spec}`}>
              <span className={styles.layer}>{l.layer}</span>
              <p style={{ color: "var(--color-ink)" }}>{l.value}</p>
            </div>
          ))}
        </div>
        <div className={styles.specs} style={{ marginTop: 40 }}>
          {SHADOWS.map((s) => (
            <div key={s.layer} className={styles.spec}>
              <div className={styles.specVisual} style={{ background: "var(--color-white)", boxShadow: s.value }} />
              <span className={styles.layer}>{s.layer}</span>
              <p className="small muted">{s.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.group} aria-labelledby="t-mov">
        <div className={styles.groupHead}>
          <h2 id="t-mov">Movimento</h2>
          <p>
            Tudo se move pelo Remotion num relógio de 60 quadros por segundo, com as mesmas molas do filme da marca. O filme segue uma grade de 130 batidas por minuto: uma batida dura
            27,69 quadros. Não há transições de CSS.
          </p>
        </div>
        <div className={styles.springs}>
          {(["snappy", "base", "heavy", "text", "soft"] as const).map((n) => (
            <div key={n} style={{ display: "grid", gap: 10 }}>
              <SpringCard name={n} />
              <p className="small muted">{SPRING_USE[n]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
