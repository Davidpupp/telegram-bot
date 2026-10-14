import type { Metadata } from "next";
import Link from "next/link";
import { InlineScript } from "@/components/InlineScript";
import { ChatDemo } from "@/components/home/ChatDemo";
import { HeroFilmStage } from "@/components/home/HeroFilmStage";
import { MINIS, MiniSite } from "@/components/home/MiniSite";
import { DEMO_BY_SERVICE, DEMO_LABELS, FAQ, PROMISES, STEPS } from "@/content/home";
import { formatDate, postHref, POSTS } from "@/content/posts";
import { serviceHref, SERVICES } from "@/content/services";
import { Accordion } from "@/motion/Accordion";
import { Carousel } from "@/motion/Carousel";
import { Flood } from "@/motion/Flood";
import { INTRO_DECIDE_SCRIPT } from "@/motion/intro-constants";
import { IntroOverlay } from "@/motion/IntroOverlay";
import { KineticText } from "@/motion/KineticText";
import { Lift, LiftLink, PressLink } from "@/motion/Lift";
import { Marquee } from "@/motion/Marquee";
import { MotionPlayer } from "@/motion/MotionPlayer";
import { Reveal } from "@/motion/Reveal";
import { Steps } from "@/motion/Steps";

export const metadata: Metadata = {
  title: { absolute: "V8 Studio · Sites que vendem" },
  description:
    "Landing pages, sites, lojas virtuais, sistemas e aplicativos para empresas que querem ser encontradas. Conte o que você precisa em 2 minutos e receba a proposta em até 1 dia útil.",
};

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h13M11 5l5 5-5 5" />
  </svg>
);

export default function Home() {
  return (
    <>
      <InlineScript html={INTRO_DECIDE_SCRIPT} />
      <IntroOverlay />

      {/* 1 · Topo: frase da marca e o filme que muda com o negócio do visitante (branco) */}
      <section className="hero container" aria-labelledby="hero-title">
        <KineticText as="h1" id="hero-title" text="Seu negócio merece um site que vende." delay={4} />
        <Reveal as="p" className="lead" delay={20}>
          A V8 Studio cria landing pages, sites, lojas virtuais, sistemas e aplicativos para empresas que querem ser encontradas e escolhidas.
        </Reveal>
        <Reveal className="cta" delay={28}>
          <PressLink href="/comecar/" className="btn btn--primary">
            Começar
          </PressLink>
          <p className="btn-note">Leva 2 minutos. Sem compromisso.</p>
        </Reveal>
        <HeroFilmStage />
      </section>

      {/* 2 · Vitrine de prévias que corre (branco) */}
      <section className="section showcase" aria-labelledby="vitrine-title">
        <div className="container section-head section-head--split">
          <div className="stack">
            <p className="kicker">Feito sob medida</p>
            <KineticText id="vitrine-title" text="Um site com a cara de cada negócio." />
          </div>
          <Reveal as="p" className="lead muted">
            Clínicas, restaurantes, escritórios, lojas. Cada projeto começa pelo que o seu cliente precisa ver para escolher você.
          </Reveal>
        </div>
        <Marquee speed={34}>
          {MINIS.slice(0, 4).map((m) => (
            <MiniSite key={m.key} m={m} />
          ))}
        </Marquee>
        <Marquee speed={34} reverse>
          {MINIS.slice(4).map((m) => (
            <MiniSite key={m.key} m={m} />
          ))}
        </Marquee>
        <p className="container small muted" style={{ marginTop: 28 }}>
          Prévias ilustrativas de negócios fictícios.
        </p>
      </section>

      {/* 3 · Serviços com demonstrações em movimento (azul) */}
      <Flood className="section" aria-labelledby="servicos-title">
        <Carousel
          label="Serviços"
          head={
            <div className="section-head">
              <p className="kicker">O que a gente faz</p>
              <KineticText id="servicos-title" text="Cinco jeitos de trazer cliente para dentro." />
            </div>
          }
        >
          {SERVICES.map((s) => (
            <LiftLink key={s.slug} href={serviceHref(s.slug)} className="card-tall" aria-label={`${s.name}. ${s.line}`}>
              <div className="card-tall__head">
                <h3>{s.name}</h3>
                <p>{s.line}</p>
              </div>
              <div className="card-tall__media">
                <MotionPlayer
                  id={DEMO_BY_SERVICE[s.slug as keyof typeof DEMO_BY_SERVICE]}
                  label={DEMO_LABELS[s.slug]}
                  style={{ position: "absolute", inset: 0, aspectRatio: "auto", height: "100%", background: "var(--color-paper)" }}
                />
              </div>
              <span className="card-tall__arrow" aria-hidden="true">
                <ArrowIcon />
              </span>
            </LiftLink>
          ))}
        </Carousel>
      </Flood>

      {/* 4 · Como funciona (branco) */}
      <section className="section" aria-labelledby="como-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="kicker">Como funciona</p>
              <KineticText id="como-title" text="Do primeiro contato ao site no ar." />
            </div>
            <Reveal as="p" className="lead muted">
              Quatro etapas, prazos combinados por escrito e você acompanhando tudo.
            </Reveal>
          </div>
          <Steps items={STEPS} />
        </div>
      </section>

      {/* 5 · Conversa (papel) */}
      <section className="section paper" aria-labelledby="conversa-title">
        <div className="container chat-grid">
          <div className="stack" style={{ gap: 20 }}>
            <p className="kicker">Antes de começar</p>
            <KineticText id="conversa-title" text="Conta pra gente o que você precisa." />
            <Reveal as="p" className="lead muted">
              Escolha uma resposta e veja por onde a gente começaria. A conversa de verdade acontece no formulário de 2 minutos.
            </Reveal>
          </div>
          <ChatDemo />
        </div>
      </section>

      {/* 6 · Compromissos (azul) */}
      <Flood className="section" origin={[0.18, 0]} aria-labelledby="compromissos-title">
        <div className="container">
          <div className="section-head">
            <p className="kicker">Compromissos</p>
            <KineticText id="compromissos-title" text="O que você pode esperar da gente." />
          </div>
          <div className="grid">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} className="span-4" delay={i * 6}>
                <Lift className="card promise" style={{ height: "100%" }}>
                  <span className="promise__big">{p.big}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Lift>
              </Reveal>
            ))}
          </div>
        </div>
      </Flood>

      {/* 7 · Blog (branco) */}
      <section className="section" aria-labelledby="blog-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div className="stack">
              <p className="kicker">Blog</p>
              <KineticText id="blog-title" text="Ideias para vender mais pela internet." />
            </div>
            <Reveal style={{ justifySelf: "start" }}>
              <Link href="/blog/" className="btn btn--ghost">
                Ver todos os artigos
              </Link>
            </Reveal>
          </div>
          <div className="grid">
            {POSTS.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} className="span-4" delay={i * 5}>
                <LiftLink href={postHref(p.slug)} className="card card--flush post-card">
                  <div className="post-card__cover" aria-hidden="true">
                    <span>{p.cover}</span>
                  </div>
                  <div className="post-card__body">
                    <p className="post-card__meta">
                      {p.category} · <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </p>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                  </div>
                </LiftLink>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · Perguntas (branco) */}
      <section className="section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container grid">
          <div className="span-5 stack" style={{ alignContent: "start" }}>
            <p className="kicker">Perguntas frequentes</p>
            <KineticText id="faq-title" text="Antes que você pergunte." />
          </div>
          <div className="span-7">
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>

      {/* 9 · Chamada final (azul, sobe de baixo) */}
      <Flood className="section cta-band" origin={[0.5, 1]} aria-labelledby="cta-title">
        <div className="container">
          <KineticText id="cta-title" text="Seu cliente está procurando agora." />
          <Reveal as="p" className="lead">
            Conte o que você precisa em 2 minutos. A resposta chega em até 1 dia útil.
          </Reveal>
          <Reveal className="cta" delay={8}>
            <PressLink href="/comecar/" className="btn btn--primary">
              Começar
            </PressLink>
            <p className="btn-note">Sem compromisso.</p>
          </Reveal>
        </div>
      </Flood>
    </>
  );
}
