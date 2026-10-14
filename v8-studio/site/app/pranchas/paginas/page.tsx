import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import styles from "../pranchas.module.css";

export const metadata = { title: "Páginas" };

// Capturas geradas no fim de cada rodada de QA (computador a 1440 px e celular a 390 px), em public/pranchas/paginas/.
const PAGES = [
  { route: "/", file: "home", title: "Home" },
  { route: "/servicos/", file: "servicos", title: "Serviços · LP Hub" },
  { route: "/servicos/landing-pages/", file: "servicos_landing-pages", title: "Landing pages" },
  { route: "/servicos/sites/", file: "servicos_sites", title: "Sites institucionais" },
  { route: "/servicos/lojas-virtuais/", file: "servicos_lojas-virtuais", title: "Lojas virtuais" },
  { route: "/servicos/sistemas/", file: "servicos_sistemas", title: "Sistemas sob medida" },
  { route: "/servicos/aplicativos/", file: "servicos_aplicativos", title: "Aplicativos" },
  { route: "/blog/", file: "blog", title: "Blog" },
  { route: "/blog/landing-page-ou-site/", file: "blog_landing-page-ou-site", title: "Artigo" },
  { route: "/sobre/", file: "sobre", title: "Sobre" },
  { route: "/comecar/", file: "comecar", title: "Começar" },
  { route: "/privacidade/", file: "privacidade", title: "Privacidade" },
  { route: "/admin/login/", file: "admin_login", title: "Admin · Login" },
  { route: "/admin/", file: "admin", title: "Admin · Painel" },
  { route: "/admin/leads/", file: "admin_leads", title: "Admin · Leads" },
  { route: "/admin/posts/editor/", file: "admin_posts_editor", title: "Admin · Editor de post" },
  { route: "/admin/landing-pages/", file: "admin_landing-pages", title: "Admin · LP Hub" },
  { route: "/admin/configuracoes/", file: "admin_configuracoes", title: "Admin · Configurações" },
];

const DIR = path.join(process.cwd(), "public", "pranchas", "paginas");
const has = (f: string) => fs.existsSync(path.join(DIR, f));

export default function PagesBoard() {
  // Só entram as páginas que já têm as duas capturas.
  const ready = PAGES.filter((p) => has(`${p.file}-d.webp`) && has(`${p.file}-m.webp`));
  return (
    <div className="container">
      <div className={styles.head}>
        <p className="kicker">Prancha 4</p>
        <h1>Páginas</h1>
        <p className="lead muted">Cada página no computador e no celular. Role dentro de cada captura para ver a página inteira.</p>
        {ready.length < PAGES.length ? (
          <p className="small muted">
            {ready.length} de {PAGES.length} páginas fotografadas. As outras entram aqui na próxima rodada de capturas.
          </p>
        ) : null}
      </div>
      <div className={styles.pages}>
        {ready.map((p) => (
          <section key={p.file} aria-labelledby={`p-${p.file}`}>
            <div className={styles.groupHead}>
              <span className={styles.layer}>Page / {p.file}</span>
              <h2 id={`p-${p.file}`}>
                <Link href={p.route}>{p.title}</Link>
              </h2>
            </div>
            <div className={styles.pageRow}>
              <figure className={styles.shot} style={{ margin: 0 }}>
                <div className={styles.shotScroll}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/pranchas/paginas/${p.file}-d.webp`} alt={`${p.title} no computador`} loading="lazy" />
                </div>
              </figure>
              <figure className={styles.shot} style={{ margin: 0 }}>
                <div className={styles.shotScroll}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/pranchas/paginas/${p.file}-m.webp`} alt={`${p.title} no celular`} loading="lazy" />
                </div>
              </figure>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
