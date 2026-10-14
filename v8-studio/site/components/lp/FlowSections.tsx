import { MINIS, MiniSite } from "@/components/home/MiniSite";
import { EXAMPLES_NOTE, type ExamplesSection as Examples, type FaqSection as Faq, type LandingTone, type StepsSection as StepsData } from "@/content/lps";
import { Accordion } from "@/motion/Accordion";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { Marquee } from "@/motion/Marquee";
import { Reveal } from "@/motion/Reveal";
import { Steps } from "@/motion/Steps";
import s from "./FlowSections.module.css";
import { MiniStore, STORE_MINIS, type StoreMini } from "./MiniStore";
import { SectionHead, SectionShell } from "./SectionShell";

type Props<T> = { section: T; tone: LandingTone; titleId: string };

/** "Como funciona": etapas ligadas pela linha azul que avança com a rolagem. */
export function StepsSection({ section, tone, titleId }: Props<StepsData>) {
  const n = section.items.length;
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId}>
      <div className="container">
        <SectionHead kicker={section.kicker} title={section.title} titleId={titleId} lead={section.lead} />
        <div className={cx(n === 3 && s.three, n === 5 && s.five)}>
          <Steps items={section.items} />
        </div>
      </div>
    </SectionShell>
  );
}

type Preview = { kind: "site"; m: (typeof MINIS)[number] } | { kind: "store"; m: StoreMini };

/** Prévias pelas chaves do conteúdo, na ordem dada. Sem chaves: as oito da Home. */
function pickPreviews(keys?: string[]): Preview[] {
  const list = keys ?? MINIS.map((m) => m.key);
  return list.flatMap((k): Preview[] => {
    const site = MINIS.find((m) => m.key === k);
    if (site) return [{ kind: "site", m: site }];
    const store = STORE_MINIS.find((m) => m.key === k);
    return store ? [{ kind: "store", m: store }] : [];
  });
}

/** Repete a lista até ter prévias suficientes para a faixa nunca mostrar um buraco em telas largas. */
const fill = (items: Preview[], min = 5) => (items.length === 0 ? [] : Array.from({ length: Math.max(min, items.length) }, (_, i) => items[i % items.length]));

const PreviewItem = ({ p }: { p: Preview }) => (p.kind === "site" ? <MiniSite m={p.m} /> : <MiniStore m={p.m} />);

/** Exemplos: prévias de negócios fictícios correndo na tela, em uma ou duas faixas. */
export function ExamplesSection({ section, tone, titleId }: Props<Examples>) {
  const all = pickPreviews(section.minis);
  const twoRows = all.length >= 8;
  const rowA = fill(twoRows ? all.slice(0, Math.ceil(all.length / 2)) : all);
  const rowB = twoRows ? fill(all.slice(Math.ceil(all.length / 2))) : [];
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId}>
      <div className="container">
        <SectionHead kicker={section.kicker} title={section.title} titleId={titleId} lead={section.lead} />
      </div>
      <Marquee speed={34}>
        {rowA.map((p, i) => (
          <PreviewItem key={`${p.m.key}-${i}`} p={p} />
        ))}
      </Marquee>
      {rowB.length ? (
        <Marquee speed={34} reverse>
          {rowB.map((p, i) => (
            <PreviewItem key={`${p.m.key}-${i}`} p={p} />
          ))}
        </Marquee>
      ) : null}
      <p className={cx("container small muted", s.note)}>{section.note ?? EXAMPLES_NOTE}</p>
    </SectionShell>
  );
}

/** Perguntas frequentes: título à esquerda, acordeão à direita. */
export function FaqSection({ section, tone, titleId }: Props<Faq>) {
  return (
    <SectionShell tone={tone} id={section.id} labelledBy={titleId}>
      <div className="container grid">
        <div className={cx("span-5 stack", s.faqHead)}>
          <p className="kicker">{section.kicker}</p>
          <KineticText id={titleId} text={section.title} />
          {section.lead ? (
            <Reveal as="p" className="muted">
              {section.lead}
            </Reveal>
          ) : null}
        </div>
        <div className="span-7">
          <Accordion items={section.items} />
        </div>
      </div>
    </SectionShell>
  );
}
