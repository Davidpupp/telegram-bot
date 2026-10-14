import { LP_FINAL_NOTE, type LandingFinal } from "@/content/lps";
import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { Reveal } from "@/motion/Reveal";

/** Chamada final: faixa azul que sobe de baixo, frase cinética e "Começar". */
export function FinalSection({ final, href, titleId = "lp-final-title" }: { final: LandingFinal; href: string; titleId?: string }) {
  return (
    <Flood className="section cta-band" origin={[0.5, 1]} aria-labelledby={titleId}>
      <div className="container">
        <KineticText id={titleId} text={final.title} />
        {final.lead ? (
          <Reveal as="p" className="lead">
            {final.lead}
          </Reveal>
        ) : null}
        <Reveal className="cta" delay={8}>
          <PressLink href={href} className="btn btn--primary">
            Começar
          </PressLink>
          <p className="btn-note">{final.note ?? LP_FINAL_NOTE}</p>
        </Reveal>
      </div>
    </Flood>
  );
}
