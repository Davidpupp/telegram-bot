import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "O endereço que você abriu não existe no site da V8 Studio.",
};

// Fica fora do grupo (site), então traz o próprio cabeçalho e rodapé. O Next marca a página com noindex.
// Sem CSS Module de propósito: o CSS desta página seria pré-carregado em todas as outras.
export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="site-main">
        <section className="hero container" aria-labelledby="nao-encontrada-title" style={{ paddingBlock: "clamp(64px, 14vh, 152px)" }}>
          <p className="kicker" style={{ marginBottom: 20 }}>
            Erro 404
          </p>
          <KineticText as="h1" id="nao-encontrada-title" text="Essa página não existe." delay={4} />
          <Reveal as="p" className="lead" delay={16}>
            O endereço pode ter mudado ou ter sido digitado com algum erro. Estes caminhos levam você de volta.
          </Reveal>
          <Reveal className="cta" delay={24}>
            <PressLink href="/comecar/" className="btn btn--primary">
              Começar
            </PressLink>
            <div className="row" style={{ justifyContent: "center", gap: 12, marginTop: 16 }}>
              <Link href="/" className="btn btn--ghost">
                Página inicial
              </Link>
              <Link href="/servicos/" className="btn btn--ghost">
                Ver serviços
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
