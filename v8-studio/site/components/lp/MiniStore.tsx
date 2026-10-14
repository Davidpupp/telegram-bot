import { cx } from "@/motion/lib/cx";
import s from "./MiniStore.module.css";

// Prévias de lojas virtuais fictícias, no mesmo molde das prévias da Home (components/home/MiniSite.tsx):
// moldura de navegador, classes .mini* globais e a cor de cada marca. Decorativas: a seção ao redor diz que são exemplos.
type StoreLayout = "shelf" | "product" | "checkout";
export type StoreMini = { key: string; short: string; url: string; color: string; soft: string; headline: string; layout: StoreLayout };

export const STORE_MINIS: StoreMini[] = [
  { key: "broto", short: "Broto", url: "brotoplantas.com.br", color: "#2F6B3A", soft: "#E7F1E8", headline: "Plantas que chegam bem.", layout: "shelf" },
  { key: "doceforno", short: "Doce Forno", url: "doceforno.com.br", color: "#B23A48", soft: "#F8E7E9", headline: "Bolo de cenoura com calda", layout: "product" },
  { key: "pedal", short: "Pedal Leve", url: "pedalleve.com.br", color: "#0E6E78", soft: "#E2F1F2", headline: "Finalizar compra", layout: "checkout" },
];

const Lines = ({ n = 2 }: { n?: number }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className={cx("mini__line", i === n - 1 && "mini__line--short")} />
    ))}
  </>
);

function Body({ m }: { m: StoreMini }) {
  switch (m.layout) {
    case "shelf":
      return (
        <>
          <div className="mini__h" style={{ fontSize: "1.7em" }}>
            {m.headline}
          </div>
          <div className={s.chips}>
            {["Todas", "Sol", "Sombra", "Vasos"].map((c, i) => (
              <span key={c} className={cx(s.chip, i === 0 && s.chipOn)}>
                {c}
              </span>
            ))}
          </div>
          <div className="mini__cols mini__cols--4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mini__product">
                <div className="mini__img" style={{ minHeight: 40 }} />
                <div className="mini__line" />
                <div className="mini__price" />
                <div className={s.add}>Comprar</div>
              </div>
            ))}
          </div>
        </>
      );
    case "product":
      return (
        <div className={s.product}>
          <div className={s.gallery}>
            <div className="mini__img" style={{ minHeight: 0, height: "100%" }} />
            <div className={s.thumbs}>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className={s.info}>
            <div className="mini__h" style={{ fontSize: "1.45em" }}>
              {m.headline}
            </div>
            <div className={s.price} />
            <Lines n={2} />
            <div className={s.chips}>
              {["Inteiro", "Metade"].map((c, i) => (
                <span key={c} className={cx(s.chip, i === 0 && s.chipOn)}>
                  {c}
                </span>
              ))}
            </div>
            <div className="mini__btn" style={{ width: "100%", justifyContent: "center" }}>
              Adicionar à sacola
            </div>
          </div>
        </div>
      );
    case "checkout":
      return (
        <div className={s.checkout}>
          <div className={s.order}>
            <div className={s.label}>Seu pedido</div>
            {[0, 1].map((i) => (
              <div key={i} className={s.orderRow}>
                <div className="mini__img" style={{ minHeight: 0, height: "100%" }} />
                <div className={s.orderText}>
                  <div className="mini__line" />
                  <div className="mini__line mini__line--short" />
                </div>
                <div className="mini__price" style={{ width: "100%" }} />
              </div>
            ))}
            <div className={s.total}>
              <div className="mini__line" style={{ width: "40%" }} />
              <div className={s.price} style={{ width: "30%" }} />
            </div>
          </div>
          <div className={cx("mini__form", s.pay)}>
            <div className={s.label}>Pagamento</div>
            {["Pix", "Cartão", "Boleto"].map((p, i) => (
              <div key={p} className={cx(s.radio, i === 0 && s.radioOn, i === 2 && s.extra)}>
                <i />
                {p}
              </div>
            ))}
            <div className="mini__btn" style={{ width: "100%", justifyContent: "center" }}>
              {m.headline}
            </div>
          </div>
        </div>
      );
  }
}

/** Uma prévia de loja em moldura de navegador, pronta para o <Marquee>. */
export function MiniStore({ m }: { m: StoreMini }) {
  return (
    <div className="marquee__item">
      <div className="browser browser--wide">
        <div className="browser__bar">
          <i />
          <i />
          <i />
          <div className="browser__url">{m.url}</div>
        </div>
        <div className="browser__body">
          <div className="mini" style={{ "--p": m.color, "--p-soft": m.soft } as React.CSSProperties}>
            <div className="mini__nav">
              <div className="mini__logo">{m.short}</div>
              <div className="mini__links">
                <i />
                <i />
                <i />
              </div>
              <div className="mini__btn">Sacola</div>
            </div>
            <Body m={m} />
          </div>
        </div>
      </div>
    </div>
  );
}
