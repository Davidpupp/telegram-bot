import type { Metadata } from "next";
import { TopBar } from "@/components/comecar/TopBar";
import styles from "@/components/comecar/TopBar.module.css";

export const metadata: Metadata = {
  title: "Começar um projeto",
  description:
    "Responda 7 perguntas rápidas e receba a indicação do serviço certo para o seu negócio: landing page, site, loja virtual, sistema ou aplicativo. Leva 2 minutos. Sem compromisso.",
};

/** Fora do grupo (site): sem cabeçalho e rodapé do site, só o topo mínimo do formulário. */
export default function ComecarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#conteudo">
        Pular para o formulário
      </a>
      <TopBar />
      <main id="conteudo" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
