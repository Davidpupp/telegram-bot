import type { Metadata } from "next";
import Link from "next/link";
import { ConvBar } from "@/components/admin/ConvBar";
import l from "@/components/admin/landing.module.css";
import { CardHead, PageHead } from "@/components/admin/PageHead";
import { DEMOS, diaMes, LANDING_PAGES, leadsDaPagina, porcentagem, type LandingPage } from "@/content/admin-demo";
import { cx } from "@/motion/lib/cx";
import { Lift, PressLink } from "@/motion/Lift";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = { title: "Landing pages" };

const taxa = (lp: LandingPage) => (lp.visitas ? leadsDaPagina(lp) / lp.visitas : 0);

function Card({ lp, maior, i }: { lp: LandingPage; maior: number; i: number }) {
  const leads = leadsDaPagina(lp);
  const pub = lp.status === "publicada";
  const demo = DEMOS.find((d) => d.id === lp.demo);
  const editar = `/admin/landing-pages/editor/?slug=${lp.slug}`;
  return (
    <Lift as="article" className={cx("card", l.lpCard)}>
      <h3 className={l.lpTitle}>
        <Link href={editar} className={l.stretch}>
          {lp.tipo === "campanha" ? `Campanha ${lp.nome}` : lp.nome}
        </Link>
      </h3>
      <div className={l.lpTop}>
        <span className={l.path}>{lp.caminho}</span>
        <span className={cx(l.estado, pub ? l.publicada : l.rascunho)}>{pub ? "Publicada" : "Rascunho"}</span>
      </div>
      <dl className={l.nums}>
        <div>
          <dt>Visitas</dt>
          <dd>{lp.visitas}</dd>
        </div>
        <div>
          <dt>Leads</dt>
          <dd>{leads}</dd>
        </div>
        <div>
          <dt>Conversão</dt>
          <dd>{porcentagem(leads, lp.visitas)}</dd>
        </div>
      </dl>
      <ConvBar fracao={maior ? taxa(lp) / maior : 0} delay={i * 4} />
      <div className={l.foot}>
        <span>
          Demo: {demo?.nome ?? lp.demo} · {lp.secoes.filter((x) => x.ligada).length} seções · editada em {diaMes(lp.atualizadaEm)}
        </span>
        {pub ? (
          <Link href={lp.caminho} className={l.ver}>
            Ver página
          </Link>
        ) : null}
      </div>
    </Lift>
  );
}

// TODO backend: GET /api/landing-pages com visitas e leads do período (visitas vêm da análise de tráfego).
export default function LandingPagesPage() {
  const servicos = LANDING_PAGES.filter((x) => x.tipo === "servico");
  const campanhas = LANDING_PAGES.filter((x) => x.tipo === "campanha");
  const visitas = LANDING_PAGES.reduce((a, x) => a + x.visitas, 0);
  const leads = LANDING_PAGES.reduce((a, x) => a + leadsDaPagina(x), 0);
  const maior = Math.max(...LANDING_PAGES.map(taxa));
  return (
    <>
      <PageHead
        kicker="LP Hub"
        title="Landing pages"
        meta={`${visitas} visitas e ${leads} leads nos últimos 30 dias, conversão de ${porcentagem(leads, visitas)}.`}
        actions={
          <PressLink href="/admin/landing-pages/editor/" className="btn btn--primary btn--sm">
            Nova landing page
          </PressLink>
        }
      />
      <section className={l.group} aria-labelledby="lp-servicos">
        <div className={l.groupHead}>
          <CardHead id="lp-servicos" title="Páginas de serviço" sub="Uma por serviço, com endereço fixo em /servicos/." />
        </div>
        <Reveal className={l.lpGrid}>
          {servicos.map((lp, i) => (
            <Card key={lp.slug} lp={lp} maior={maior} i={i} />
          ))}
        </Reveal>
      </section>
      <section className={l.group} aria-labelledby="lp-campanhas">
        <div className={l.groupHead}>
          <CardHead id="lp-campanhas" title="Campanhas" sub="Páginas para um público ou um anúncio, em /lp/. Cada visita guarda a campanha (UTM)." />
        </div>
        <Reveal className={l.lpGrid}>
          {campanhas.map((lp, i) => (
            <Card key={lp.slug} lp={lp} maior={maior} i={i} />
          ))}
        </Reveal>
      </section>
    </>
  );
}
