import type { Metadata } from "next";
import { Toc } from "@/components/blog/Toc";
import { PedidoDados } from "@/components/privacidade/PedidoDados";
import { Policy, POLICY_SECTIONS } from "@/components/privacidade/Policy";
import s from "@/components/privacidade/privacidade.module.css";
import { formatDate } from "@/content/posts";
import { absoluteUrl, PRIVACY_UPDATED, SITE_NAME } from "@/content/site";
import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { Lift } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";

const DESCRIPTION =
  "Como a V8 Studio trata os dados pessoais informados no site, de acordo com a LGPD: o que coletamos, para quê, com quem compartilhamos, por quanto tempo guardamos e como pedir acesso, correção ou exclusão.";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/privacidade/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/privacidade/"),
    title: `Política de privacidade · ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "pt_BR",
  },
};

const SUMMARY = [
  { title: "Só o necessário", text: "Guardamos o que você escreve nos formulários e os registros técnicos de acesso. Nada além disso." },
  { title: "Para responder você", text: "Os dados servem para montar a sua proposta e falar com você sobre o pedido." },
  { title: "Nada é vendido", text: "Não vendemos nem alugamos dados. Só os fornecedores que fazem o site funcionar têm acesso." },
  { title: "Sem rastreamento", text: "O site não usa cookies de rastreamento nem de publicidade." },
];

export default function PrivacidadePage() {
  return (
    <>
      {/* 1 · Topo (branco) */}
      <section className={cx("container", s.hero)} aria-labelledby="privacidade-title">
        <p className="kicker">Política de privacidade</p>
        <KineticText as="h1" id="privacidade-title" text="Seus dados, sem letra miúda." delay={4} />
        <Reveal as="p" className="lead muted" delay={16}>
          Esta página explica quais dados o site da V8 Studio coleta, para que usa, com quem compartilha, por quanto tempo guarda e como você exerce os seus direitos, de
          acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </Reveal>
        <Reveal as="p" className={s.updated} delay={22}>
          Atualizada em <time dateTime={PRIVACY_UPDATED}>{formatDate(PRIVACY_UPDATED)}</time>.
        </Reveal>
      </section>

      {/* 2 · Em resumo (azul) */}
      <Flood className="section" origin={[0.2, 0]} aria-labelledby="resumo-title">
        <div className="container">
          <div className="section-head">
            <p className="kicker">Em resumo</p>
            <KineticText id="resumo-title" text="O essencial em quatro frases." />
          </div>
          <div className={s.summary}>
            {SUMMARY.map((it, i) => (
              <Reveal key={it.title} delay={i * 5}>
                <Lift className={cx("card", s.summaryCard)} style={{ height: "100%" }}>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </Lift>
              </Reveal>
            ))}
          </div>
        </div>
      </Flood>

      {/* 3 · Política completa, com o sumário fixo ao lado no computador (branco) */}
      <section className="section" aria-label="Política completa">
        <div className={cx("container", s.layout)}>
          <aside className={s.aside} aria-label="Sumário">
            <div className={s.asideSticky}>
              <Toc items={[...POLICY_SECTIONS, { id: "pedido", label: "Fazer um pedido" }]} title="Nesta página" />
            </div>
          </aside>
          <div className={s.main}>
            <Policy />
          </div>
        </div>
      </section>

      {/* 4 · Formulário de pedidos sobre dados pessoais (papel) */}
      <section className="section paper" aria-labelledby="pedido">
        <div className={cx("container", s.request)}>
          <div className={s.requestText}>
            <p className="kicker">Pedidos sobre dados pessoais</p>
            <KineticText id="pedido" className={s.anchor} text="Fale com a gente sobre os seus dados." />
            <Reveal as="p" className="lead muted">
              Use este formulário para qualquer pedido previsto na LGPD. Confirmamos o recebimento em até 1 dia útil e respondemos em até 15 dias.
            </Reveal>
          </div>
          <Reveal className={cx("card", s.formCard)} delay={8}>
            <PedidoDados />
          </Reveal>
        </div>
      </section>
    </>
  );
}
