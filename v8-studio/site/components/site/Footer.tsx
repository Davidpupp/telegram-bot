import Link from "next/link";
import { serviceHref, SERVICES } from "@/content/services";
import { PressLink } from "@/motion/Lift";
import { Logo } from "./Logo";

/** Rodapé sem telefone, e-mail, WhatsApp ou redes sociais: o contato acontece pelo "Começar". */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="cols">
          <div className="stack" style={{ gap: 20, alignContent: "start" }}>
            <Logo />
            <p className="small muted" style={{ maxWidth: "34ch" }}>
              Landing pages, sites, lojas virtuais, sistemas e aplicativos para empresas que querem ser encontradas.
            </p>
            <div>
              <PressLink href="/comecar/" className="btn btn--primary btn--sm">
                Começar
              </PressLink>
            </div>
          </div>
          <div>
            <h4>Serviços</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s.slug)}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Empresa</h4>
            <ul>
              <li>
                <Link href="/sobre/">Sobre</Link>
              </li>
              <li>
                <Link href="/blog/">Blog</Link>
              </li>
              <li>
                <Link href="/comecar/">Começar um projeto</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/privacidade/">Privacidade</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>© 2026 V8 Studio. Todos os direitos reservados.</span>
          <span>Respondemos todo pedido em até 1 dia útil.</span>
        </div>
      </div>
    </footer>
  );
}
