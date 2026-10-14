import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { Reveal } from "@/motion/Reveal";

type Props = {
  id: string;
  title: string;
  text?: string;
  /** Destino do "Começar"; pode levar ?servico=<slug>. */
  href?: string;
};

/** Chamada final azul que sobe de baixo, igual à da Home. */
export function CtaBand({ id, title, text = "Conte o que você precisa em 2 minutos. A proposta chega em até 1 dia útil.", href = "/comecar/" }: Props) {
  return (
    <Flood className="section cta-band" origin={[0.5, 1]} aria-labelledby={id}>
      <div className="container">
        <KineticText id={id} text={title} />
        <Reveal as="p" className="lead">
          {text}
        </Reveal>
        <Reveal className="cta" delay={8}>
          <PressLink href={href} className="btn btn--primary">
            Começar
          </PressLink>
          <p className="btn-note">Sem compromisso.</p>
        </Reveal>
      </div>
    </Flood>
  );
}
