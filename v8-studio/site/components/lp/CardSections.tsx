import type { AudienceSection as Audience, IncludedSection as Included, LandingTone, OptionsSection as Options } from "@/content/lps";
import { KineticText } from "@/motion/KineticText";
import { Lift } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import s from "./CardSections.module.css";
import { SectionHead, SectionShell } from "./SectionShell";

type Props<T> = { section: T; tone: LandingTone; titleId: string };

/** Colunas da grade conforme a quantidade de cards: 2 ou 4 ficam em 2 por linha, 3 seguem em 3 até o tablet, o resto em 3. */
const gridClass = (n: number) => cx(s.grid, (n === 2 || n === 4) && s.two, n === 1 && s.one, n === 3 && s.trio);

/** "Para quem é": título fixo à esquerda enquanto as situações passam à direita. */
export function AudienceSection({ section, tone, titleId }: Props<Audience>) {
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId} origin={[0.18, 0]}>
      <div className={cx("container", s.audience)}>
        <div className={s.audienceHead}>
          <p className="kicker">{section.kicker}</p>
          <KineticText id={titleId} text={section.title} />
          {section.lead ? (
            <Reveal as="p" className="lead muted">
              {section.lead}
            </Reveal>
          ) : null}
        </div>
        <Reveal className={s.audienceList}>
          {section.items.map((it) => (
            <Lift key={it.title} className={cx("card", s.card, s.situation)}>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </Lift>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}

/** "O que vem incluso": entregáveis em cards brancos, por padrão dentro da faixa azul. */
export function IncludedSection({ section, tone, titleId }: Props<Included>) {
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId} origin={[0.5, 0]}>
      <div className="container">
        <SectionHead kicker={section.kicker} title={section.title} titleId={titleId} lead={section.lead} />
        <Reveal className={gridClass(section.items.length)}>
          {section.items.map((it) => (
            <Lift key={it.title} className={cx("card", s.card)}>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </Lift>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}

/** Grupos de opções em cards com lista (ex.: "Pagamento e frete"). */
export function OptionsSection({ section, tone, titleId }: Props<Options>) {
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId} origin={[0.82, 0]}>
      <div className="container">
        <SectionHead kicker={section.kicker} title={section.title} titleId={titleId} lead={section.lead} />
        <Reveal className={gridClass(section.groups.length)}>
          {section.groups.map((g) => (
            <Lift key={g.title} className={cx("card", s.card)}>
              <h3>{g.title}</h3>
              {g.text ? <p>{g.text}</p> : null}
              <ul className={s.list}>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Lift>
          ))}
        </Reveal>
      </div>
    </SectionShell>
  );
}
