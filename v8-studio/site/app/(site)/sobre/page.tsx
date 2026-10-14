import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/blog/CtaBand";
import { BrandFilm } from "@/components/sobre/BrandFilm";
import { Expectations } from "@/components/sobre/Expectations";
import { Principles } from "@/components/sobre/Principles";
import { ServiceList } from "@/components/sobre/ServiceList";
import s from "@/components/sobre/sobre.module.css";
import { STEPS } from "@/content/home";
import { absoluteUrl, SITE_NAME } from "@/content/site";
import { Flood } from "@/motion/Flood";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { Steps } from "@/motion/Steps";

const DESCRIPTION =
  "A V8 Studio cria landing pages, sites, lojas virtuais, sistemas e aplicativos para pequenas e médias empresas. Veja como a gente trabalha e o que você pode esperar.";

export const metadata: Metadata = {
  title: "Sobre",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/sobre/") },
  openGraph: { type: "website", url: absoluteUrl("/sobre/"), title: `Sobre a ${SITE_NAME}`, description: DESCRIPTION, siteName: SITE_NAME, locale: "pt_BR" },
};

// Lugares de foto: o prompt de cada um está no data-prompt e no relatório. Trocar por <img> com alt quando a foto existir.
const PHOTO_HERO =
  "Mesa de trabalho num estúdio pequeno, com notebook aberto mostrando o layout de um site, cadernos com rascunhos de telas e um celular ao lado. Luz natural de janela, tons neutros, sem pessoas, sem filtros de cor.";
const PHOTO_REMOTE =
  "Mãos digitando num notebook sobre mesa de madeira clara, com um celular ao lado mostrando a versão para celular de um site. Escritório real, luz natural lateral, tons neutros, rosto fora do quadro, sem filtros de cor.";

export default function SobrePage() {
  return (
    <>
      {/* 1 · Topo: quem é a V8 e o que faz (branco) */}
      <section className={cx("container", s.hero)} aria-labelledby="sobre-title">
        <div className={s.heroGrid}>
          <div className="stack">
            <p className="kicker">Sobre a V8 Studio</p>
            <KineticText as="h1" id="sobre-title" text="Sites que trabalham tanto quanto você." delay={4} />
          </div>
          <div className={s.heroSide}>
            <Reveal as="p" className="lead muted" delay={16}>
              A V8 Studio cria landing pages, sites, lojas virtuais, sistemas e aplicativos para pequenas e médias empresas. Todo projeto começa pela mesma pergunta: o
              que o seu cliente precisa ver para escolher você?
            </Reveal>
            <Reveal className={s.heroCta} delay={24}>
              <PressLink href="/comecar/" className="btn btn--primary">
                Começar
              </PressLink>
              <Link href="/servicos/" className="btn btn--ghost">
                Ver serviços
              </Link>
            </Reveal>
          </div>
        </div>
        <Reveal className={s.heroPhoto} delay={30} y={48}>
          <div className="photo" data-prompt={PHOTO_HERO} aria-hidden="true" />
        </Reveal>
      </section>

      {/* 2 · O que fazemos e para quem (papel) */}
      <section className="section paper" aria-labelledby="para-quem-title">
        <div className={cx("container", s.split)}>
          <div className={s.splitText}>
            <p className="kicker">O que a gente faz</p>
            <KineticText id="para-quem-title" text="Para quem tem um negócio para tocar." />
            <Reveal className={s.copy}>
              <p>
                Clínicas, restaurantes, escritórios, lojas, escolas, oficinas. Negócios em que o dono entende muito do que faz e não tem tempo para virar especialista em
                internet.
              </p>
              <p>
                A gente cuida dessa parte inteira: estratégia, textos, design, desenvolvimento e publicação. Você acompanha, aprova e volta a cuidar do que importa, que é
                atender bem quem chega.
              </p>
            </Reveal>
          </div>
          <Reveal delay={8}>
            <ServiceList />
          </Reveal>
        </div>
      </section>

      {/* 3 · O filme da marca em movimento (azul) */}
      <Flood className="section" origin={[0.82, 0]} aria-labelledby="filme-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="kicker">Em movimento</p>
              <KineticText id="filme-title" text="Da busca ao contato, em 24 segundos." />
            </div>
            <Reveal as="p" className="lead">
              O filme da V8 mostra o caminho que um bom site abre: alguém procura, encontra o seu negócio, entende o que você faz e entra em contato.
            </Reveal>
          </div>
          <BrandFilm />
        </div>
      </Flood>

      {/* 4 · Como a gente trabalha (branco) */}
      <section className="section" aria-labelledby="como-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="kicker">Como a gente trabalha</p>
              <KineticText id="como-title" text="Quatro etapas, tudo combinado por escrito." />
            </div>
            <Reveal as="p" className="lead muted">
              Antes de começar, você sabe o que vai ser feito, em quanto tempo e quanto custa. Depois, acompanha cada etapa até o site estar no ar.
            </Reveal>
          </div>
          <Steps items={STEPS} />
          <div className={s.remote}>
            <Reveal className={s.remotePhoto}>
              <div className="photo" data-prompt={PHOTO_REMOTE} aria-hidden="true" />
            </Reveal>
            <Reveal className={s.remoteText} delay={8}>
              <h3>Tudo online, de qualquer cidade.</h3>
              <p>
                Da primeira conversa à entrega, o projeto acontece pela internet. Você vê cada etapa no computador ou no celular, comenta, pede ajustes dentro do que foi
                combinado e aprova antes de seguir.
              </p>
              <p>Você não precisa sair do seu negócio para acompanhar o seu site.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 · Princípios (azul) */}
      <Flood className="section" origin={[0.15, 0]} aria-labelledby="principios-title">
        <div className="container">
          <div className="section-head">
            <p className="kicker">Princípios</p>
            <KineticText id="principios-title" text="Três coisas que a gente não negocia." />
          </div>
          <Principles />
        </div>
      </Flood>

      {/* 6 · O que você pode esperar (branco) */}
      <section className="section" aria-labelledby="esperar-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="kicker">Na prática</p>
              <KineticText id="esperar-title" text="O que você recebe, do começo ao fim." />
            </div>
            <Reveal as="p" className="lead muted">
              Compromissos que valem para todo projeto, do menor ao maior.
            </Reveal>
          </div>
          <Expectations />
        </div>
      </section>

      {/* 7 · Chamada final (azul, sobe de baixo) */}
      <CtaBand id="sobre-cta" title="Vamos falar do seu negócio?" />
    </>
  );
}
