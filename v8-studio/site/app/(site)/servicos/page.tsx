import type { Metadata } from "next";
import { FinalSection } from "@/components/lp/FinalSection";
import { FaqSection } from "@/components/lp/FlowSections";
import { HubChooser } from "@/components/lp/HubChooser";
import { HubCompare, HubServiceGrid, type HubService } from "@/components/lp/HubSections";
import { CHOOSER, HUB_FAQ, SERVICE_COMPARE, SERVICE_HINT, SERVICE_SINGULAR, type ChooserService } from "@/content/hub";
import { demoLabel, SERVICE_LPS, startHref } from "@/content/lps";
import { serviceHref, SERVICES } from "@/content/services";
import { KineticText } from "@/motion/KineticText";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Landing pages, sites institucionais, lojas virtuais, sistemas e aplicativos. Responda duas perguntas, veja qual serviço combina com o seu negócio e compare os cinco lado a lado.",
};

/** Hub das landing pages: escolhedor, os cinco serviços com demo, comparação, perguntas e chamada final. */
export default function ServicesHub() {
  const services = SERVICES.map((info) => {
    const lp = SERVICE_LPS.find((x) => x.slug === info.slug);
    const media = lp?.hero.media;
    const demo = media?.type === "demo" ? { id: media.id, label: media.label ?? demoLabel(media.id) } : undefined;
    return { info, lp, demo };
  });

  const chooserServices: ChooserService[] = services.map(({ info, lp, demo }) => ({
    slug: info.slug,
    name: info.name,
    line: info.line,
    singular: SERVICE_SINGULAR[info.slug] ?? info.name,
    hint: SERVICE_HINT[info.slug] ?? info.line,
    href: serviceHref(info.slug),
    start: startHref(lp ?? { service: info.slug }),
    demo,
  }));

  const hubServices: HubService[] = services.map(({ info, demo }) => ({
    slug: info.slug,
    name: info.name,
    line: info.line,
    demo,
    compare: SERVICE_COMPARE[info.slug],
  }));

  return (
    <>
      {/* Topo branco: a pergunta e o escolhedor */}
      <section className="hero container" aria-labelledby="hub-title">
        <p className="kicker">Serviços</p>
        <KineticText as="h1" id="hub-title" text="Qual é o site certo para o seu negócio?" delay={4} />
        <Reveal as="p" className="lead" delay={18}>
          Landing page, site, loja virtual, sistema ou aplicativo. Responda duas perguntas rápidas e veja por onde começar.
        </Reveal>
        <Reveal delay={28} y={48}>
          <HubChooser chooser={CHOOSER} services={chooserServices} />
        </Reveal>
      </section>

      {/* Os cinco serviços com as demos (azul) */}
      <HubServiceGrid services={hubServices} />

      {/* Comparação (papel) */}
      <HubCompare services={hubServices} />

      {/* Perguntas gerais (branco) */}
      <FaqSection section={{ type: "faq", kicker: "Perguntas frequentes", title: "Ainda em dúvida?", items: HUB_FAQ }} tone="white" titleId="hub-faq-title" />

      {/* Chamada final (azul, sobe de baixo) */}
      <FinalSection
        titleId="hub-final-title"
        href="/comecar/"
        final={{
          title: "Não precisa saber o nome do serviço.",
          lead: "Conte o que você quer que aconteça. A proposta chega com a recomendação, em até 1 dia útil.",
        }}
      />
    </>
  );
}
