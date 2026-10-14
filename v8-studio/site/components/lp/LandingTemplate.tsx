import { resolveTones, startHref, type LandingContent, type LandingSection, type LandingTone } from "@/content/lps";
import { AudienceSection, IncludedSection, OptionsSection } from "./CardSections";
import { CompareSection, SplitSection } from "./FeatureSections";
import { FinalSection } from "./FinalSection";
import { ExamplesSection, FaqSection, StepsSection } from "./FlowSections";
import { HeroSection } from "./HeroSection";

/** Uma seção do meio, escolhida pelo `type`. */
function Section({ section, tone, titleId }: { section: LandingSection; tone: LandingTone; titleId: string }) {
  switch (section.type) {
    case "audience":
      return <AudienceSection section={section} tone={tone} titleId={titleId} />;
    case "included":
      return <IncludedSection section={section} tone={tone} titleId={titleId} />;
    case "steps":
      return <StepsSection section={section} tone={tone} titleId={titleId} />;
    case "examples":
      return <ExamplesSection section={section} tone={tone} titleId={titleId} />;
    case "faq":
      return <FaqSection section={section} tone={tone} titleId={titleId} />;
    case "compare":
      return <CompareSection section={section} tone={tone} titleId={titleId} />;
    case "options":
      return <OptionsSection section={section} tone={tone} titleId={titleId} />;
    case "split":
      return <SplitSection section={section} tone={tone} titleId={titleId} />;
  }
}

/**
 * Desenha qualquer landing page do modelo (content/lps.ts): topo branco, as seções na ordem do conteúdo
 * e a chamada final azul. Os fundos passam por `resolveTones`, que nunca deixa duas faixas azuis encostadas.
 * Todo "Começar" leva para /comecar/ com o serviço (ou o objetivo) da página.
 */
export function LandingTemplate({ lp, startParams }: { lp: LandingContent; startParams?: Record<string, string> }) {
  const href = startHref(lp, startParams);
  const tones = resolveTones(lp.sections);
  return (
    <>
      <HeroSection hero={lp.hero} href={href} />
      {lp.sections.map((section, i) => (
        <Section key={`${section.type}-${i}`} section={section} tone={tones[i]} titleId={`lp-${section.id ?? i}-title`} />
      ))}
      <FinalSection final={lp.final} href={href} />
    </>
  );
}
