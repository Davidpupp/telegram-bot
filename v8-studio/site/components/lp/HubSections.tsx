import Link from "next/link";
import { serviceHref } from "@/content/services";
import { Flood } from "@/motion/Flood";
import { LiftLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { DemoMedia } from "./DemoMedia";
import s from "./HubSections.module.css";
import { SectionHead } from "./SectionShell";

export type HubService = {
  slug: string;
  name: string;
  line: string;
  demo?: { id: string; label: string };
  compare: { forWho: string; delivers: string; when: string };
};

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h13M11 5l5 5-5 5" />
  </svg>
);

/** Os cinco serviços na faixa azul: cards brancos com a demo de cada um, levando à landing page. */
export function HubServiceGrid({ services }: { services: HubService[] }) {
  return (
    <Flood className="section" aria-labelledby="hub-servicos-title">
      <div className="container">
        <SectionHead
          kicker="Os cinco serviços"
          title="Veja cada um funcionando."
          titleId="hub-servicos-title"
          lead="Abra um serviço para ver para quem é, o que vem incluso, como funciona e as dúvidas mais comuns."
        />
        <Reveal className={s.grid}>
          {services.map((x, i) => (
            <LiftLink key={x.slug} href={serviceHref(x.slug)} className={cx("card card--flush", s.card, i >= 3 && s.wide)} aria-label={`${x.name}. ${x.line}`}>
              <div className={s.head}>
                <h3>{x.name}</h3>
                <p>{x.line}</p>
              </div>
              <div className={s.media}>{x.demo ? <DemoMedia id={x.demo.id} label={x.demo.label} fill /> : null}</div>
              <span className="card-tall__arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
            </LiftLink>
          ))}
        </Reveal>
      </div>
    </Flood>
  );
}

const COLUMNS = [
  { key: "forWho", label: "Para quem é" },
  { key: "delivers", label: "O que entrega" },
  { key: "when", label: "Quando escolher" },
] as const;

/** Comparação lado a lado. No celular, cada serviço vira um bloco com os rótulos visíveis. */
export function HubCompare({ services }: { services: HubService[] }) {
  return (
    <section className="section paper" aria-labelledby="hub-compare-title">
      <div className="container">
        <SectionHead kicker="Comparação" title="Os cinco, lado a lado." titleId="hub-compare-title" lead="Para quem é, o que entrega e quando escolher cada um. Sem letra miúda." />
        <Reveal>
          <div role="table" aria-label="Comparação entre os serviços" className={cx("card card--flush", s.table)}>
            <div role="rowgroup">
              <div role="row" className={cx(s.row, s.headRow)}>
                <span role="columnheader">Serviço</span>
                {COLUMNS.map((c) => (
                  <span key={c.key} role="columnheader">
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
            <div role="rowgroup" className={s.rows}>
              {services.map((x) => (
                <div role="row" key={x.slug} className={s.row}>
                  <div role="rowheader" className={s.service}>
                    <h3>{x.name}</h3>
                    <Link href={serviceHref(x.slug)} className={s.link}>
                      Ver a página<span className="visually-hidden"> de {x.name.toLowerCase()}</span>
                    </Link>
                  </div>
                  {COLUMNS.map((c) => (
                    <div role="cell" key={c.key} className={s.cell}>
                      <span className={s.label} aria-hidden="true">
                        {c.label}
                      </span>
                      {x.compare[c.key]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
