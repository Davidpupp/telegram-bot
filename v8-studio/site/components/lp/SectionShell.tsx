import type { LandingTone } from "@/content/lps";
import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";

/** Seção com o fundo do modelo: branco, papel ou a faixa que inunda de azul. */
export function SectionShell({
  tone,
  id,
  labelledBy,
  origin,
  className,
  children,
}: {
  tone: LandingTone;
  id?: string;
  labelledBy: string;
  /** Ponto de onde o azul nasce (só na faixa azul). */
  origin?: [number, number];
  className?: string;
  children: React.ReactNode;
}) {
  if (tone === "blue") {
    return (
      <Flood className={cx("section", className)} origin={origin} id={id} aria-labelledby={labelledBy}>
        {children}
      </Flood>
    );
  }
  return (
    <section id={id} className={cx("section", tone === "paper" && "paper", className)} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

/** Kicker, título cinético e apoio. Com apoio, o título e o parágrafo dividem a linha em telas largas. */
export function SectionHead({ kicker, title, titleId, lead, stacked = false }: { kicker: string; title: string; titleId: string; lead?: string; stacked?: boolean }) {
  return (
    <div className={cx("section-head", lead && !stacked && "section-head--split")}>
      <div className="stack">
        <p className="kicker">{kicker}</p>
        <KineticText id={titleId} text={title} />
      </div>
      {lead ? (
        <Reveal as="p" className="lead muted">
          {lead}
        </Reveal>
      ) : null}
    </div>
  );
}
