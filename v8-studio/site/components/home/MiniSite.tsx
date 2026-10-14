import { ArtMark } from "@/motion/film/art";
import { SEGMENTS } from "@/motion/film/segments";

// Prévias de sites de negócios fictícios, desenhadas em código para a vitrine que corre na Home.
type Layout = "split" | "full" | "grid" | "menu" | "form" | "schedule";
type Mini = { key: string; short: string; url: string; color: string; soft: string; headline: string; navCta: string; layout: Layout; art?: Parameters<typeof ArtMark>[0]["art"] };

const S = SEGMENTS;
export const MINIS: Mini[] = [
  { key: "odonto", short: S.odonto.short, url: S.odonto.url, color: S.odonto.color, soft: S.odonto.soft, headline: S.odonto.headline, navCta: S.odonto.navCta, layout: "split", art: "tooth" },
  { key: "restaurante", short: S.restaurante.short, url: S.restaurante.url, color: S.restaurante.color, soft: S.restaurante.soft, headline: S.restaurante.headline, navCta: S.restaurante.navCta, layout: "menu" },
  { key: "advocacia", short: S.advocacia.short, url: S.advocacia.url, color: S.advocacia.color, soft: S.advocacia.soft, headline: S.advocacia.headline, navCta: S.advocacia.navCta, layout: "form" },
  { key: "cafe", short: "Grão", url: "graocafe.com.br", color: "#6B4A2E", soft: "#F3EDE6", headline: "Café torrado toda semana.", navCta: "Pedir", layout: "full" },
  { key: "academia", short: S.academia.short, url: S.academia.url, color: S.academia.color, soft: S.academia.soft, headline: S.academia.headline, navCta: S.academia.navCta, layout: "schedule" },
  { key: "oficina", short: S.oficina.short, url: S.oficina.url, color: S.oficina.color, soft: S.oficina.soft, headline: S.oficina.headline, navCta: S.oficina.navCta, layout: "split", art: "wrench" },
  { key: "moda", short: S.moda.short, url: S.moda.url, color: S.moda.color, soft: S.moda.soft, headline: S.moda.headline, navCta: S.moda.navCta, layout: "grid" },
  { key: "pet", short: "Pet Amigo", url: "petamigo.com.br", color: "#2F7A3D", soft: "#E8F3EA", headline: "Banho e tosa com hora marcada.", navCta: "Agendar", layout: "form" },
];

const Lines = ({ n = 2, light = false }: { n?: number; light?: boolean }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className={`mini__line${i === n - 1 ? " mini__line--short" : ""}${light ? " mini__line--light" : ""}`} />
    ))}
  </>
);

function Body({ m }: { m: Mini }) {
  switch (m.layout) {
    case "split":
      return (
        <>
          <div className="mini__split">
            <div className="mini__hero">
              <div className="mini__h">{m.headline}</div>
              <Lines />
              <div className="mini__btn">{m.navCta}</div>
            </div>
            <div className="mini__img mini__art" style={{ minHeight: 78 }}>
              {m.art ? <ArtMark art={m.art} color={m.color} size={56} /> : null}
            </div>
          </div>
          <div className="mini__cols">
            {[0, 1, 2].map((i) => (
              <div key={i} className="mini__card">
                <Lines />
              </div>
            ))}
          </div>
        </>
      );
    case "full":
      return (
        <div className="mini__img mini__img--p mini__full">
          <div className="mini__h mini__h--light">{m.headline}</div>
          <Lines light />
          <div className="mini__btn mini__btn--light">{m.navCta}</div>
        </div>
      );
    case "grid":
      return (
        <>
          <div className="mini__h" style={{ fontSize: "1.7em" }}>
            {m.headline}
          </div>
          <div className="mini__cols mini__cols--4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mini__product">
                <div className="mini__img" style={{ minHeight: 44 }} />
                <div className="mini__line" />
                <div className="mini__price" />
              </div>
            ))}
          </div>
        </>
      );
    case "menu":
      return (
        <div className="mini__split" style={{ alignItems: "start" }}>
          <div className="mini__hero">
            <div className="mini__h">{m.headline}</div>
            <Lines />
            <div className="mini__btn">{m.navCta}</div>
          </div>
          <div className="mini__list">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mini__row">
                <div className="mini__line" />
                <div className="mini__price" />
              </div>
            ))}
          </div>
        </div>
      );
    case "form":
      return (
        <div className="mini__split">
          <div className="mini__hero">
            <div className="mini__h">{m.headline}</div>
            <Lines n={3} />
          </div>
          <div className="mini__form">
            <div className="mini__field" />
            <div className="mini__field" />
            <div className="mini__field mini__field--tall" />
            <div className="mini__btn" style={{ width: "100%", justifyContent: "center" }}>
              {m.navCta}
            </div>
          </div>
        </div>
      );
    case "schedule":
      return (
        <>
          <div className="mini__h" style={{ fontSize: "1.7em" }}>
            {m.headline}
          </div>
          <div className="mini__table">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className={i % 4 === 1 ? "mini__slot mini__slot--on" : "mini__slot"} />
            ))}
          </div>
        </>
      );
  }
}

/** Uma prévia em moldura de navegador (decorativa: a seção ao redor descreve o conteúdo). */
export function MiniSite({ m }: { m: Mini }) {
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
              <div className="mini__btn">{m.navCta}</div>
            </div>
            <Body m={m} />
          </div>
        </div>
      </div>
    </div>
  );
}
