import { DEMO_CAPTION, demoLabel, LP_NOTE, type LandingHero, type LandingMedia } from "@/content/lps";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { DemoMedia } from "./DemoMedia";
import s from "./HeroSection.module.css";

/** O visual dentro de um card com proporção fixa: demo em movimento ou lugar de foto. */
export function MediaFill({ media }: { media: LandingMedia }) {
  if (media.type === "demo") return <DemoMedia id={media.id} label={media.label ?? demoLabel(media.id)} fill />;
  return <div className="photo" data-prompt={media.prompt} aria-hidden="true" />;
}

export const mediaCaption = (media: LandingMedia) => media.caption ?? (media.type === "demo" ? DEMO_CAPTION : undefined);

/** Topo branco: kicker com o serviço, promessa cinética, apoio, "Começar" e a demo num card grande que flutua. */
export function HeroSection({ hero, href }: { hero: LandingHero; href: string }) {
  const caption = hero.media ? mediaCaption(hero.media) : undefined;
  return (
    <section className={cx("container", s.hero, !hero.media && s.solo)} aria-labelledby="lp-title">
      <div className={s.copy}>
        <p className="kicker">{hero.kicker}</p>
        <KineticText as="h1" id="lp-title" className={s.title} text={hero.title} delay={4} />
        <Reveal as="p" className={cx("lead", s.lead)} delay={18}>
          {hero.lead}
        </Reveal>
        <Reveal className={s.cta} delay={26}>
          <PressLink href={href} className="btn btn--primary">
            Começar
          </PressLink>
          <p className="btn-note">{hero.note ?? LP_NOTE}</p>
        </Reveal>
      </div>
      {hero.media ? (
        <Reveal className={s.media} delay={30} y={48}>
          <div className={s.frame}>
            <MediaFill media={hero.media} />
          </div>
          {caption ? <p className={cx("small muted", s.caption)}>{caption}</p> : null}
        </Reveal>
      ) : null}
    </section>
  );
}
