import type { CompareSection as Compare, LandingTone, SplitSection as Split } from "@/content/lps";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { CompareRows } from "./CompareRows";
import s from "./FeatureSections.module.css";
import { MediaFill, mediaCaption } from "./HeroSection";
import { PhonePair } from "./PhonePair";
import { SectionHead, SectionShell } from "./SectionShell";

type Props<T> = { section: T; tone: LandingTone; titleId: string };

/** Antes e depois, linha a linha (ex.: "Do papel para o sistema"). */
export function CompareSection({ section, tone, titleId }: Props<Compare>) {
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId} origin={[0.82, 0]}>
      <div className="container">
        <SectionHead kicker={section.kicker} title={section.title} titleId={titleId} lead={section.lead} />
        <CompareRows beforeTitle={section.beforeTitle} afterTitle={section.afterTitle} rows={section.rows} label={`${section.beforeTitle} e ${section.afterTitle.toLowerCase()}`} />
      </div>
    </SectionShell>
  );
}

/** Texto com pontos de um lado e um visual do outro (dois celulares, uma demo ou um lugar de foto). */
export function SplitSection({ section, tone, titleId }: Props<Split>) {
  const v = section.visual;
  const caption = !v ? undefined : v.type === "phones" ? v.caption : mediaCaption(v);
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId}>
      <div className={cx("container", s.split, section.flip && s.flip, !v && s.noVisual)}>
        <div className={s.copy}>
          <p className="kicker">{section.kicker}</p>
          <KineticText id={titleId} text={section.title} />
          {section.lead ? (
            <Reveal as="p" className="lead muted">
              {section.lead}
            </Reveal>
          ) : null}
          <Reveal as="ul" className={s.points} delay={6}>
            {section.points.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
        {v ? (
          <figure className={s.visual}>
            {v.type === "phones" ? (
              <PhonePair app={v.app} label={v.label} />
            ) : (
              <div className={s.frame}>
                <MediaFill media={v} />
              </div>
            )}
            {caption ? <figcaption className="small muted">{caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </SectionShell>
  );
}
