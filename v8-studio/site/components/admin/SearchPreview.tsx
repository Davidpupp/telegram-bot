import { SITE_DOMINIO } from "@/content/admin-demo";
import { LogoMark } from "@/components/site/Logo";
import s from "./ui.module.css";

/** Corta como a busca corta: depois do limite, reticências. */
const cortar = (t: string, max: number) => (t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t);

/** Prévia de como a página aparece num resultado de busca. Desenhada em código, sem imitar marca de terceiros. */
export function SearchPreview({ title, description, path }: { title: string; description: string; path: string }) {
  const crumbs = [SITE_DOMINIO, ...path.split("/").filter(Boolean)].join(" › ");
  const t = title.trim();
  const d = description.trim();
  return (
    <figure className={s.serp} style={{ margin: 0 }}>
      <figcaption className="visually-hidden">Prévia do resultado de busca</figcaption>
      <div className={s.serpSite}>
        <span className={s.serpIcon} aria-hidden="true">
          <LogoMark />
        </span>
        <span>
          <strong>V8 Studio</strong>
          <small>{crumbs}</small>
        </span>
      </div>
      <p className={s.serpTitle}>{t ? cortar(t, 60) : <span className={s.serpEmpty}>O título de SEO aparece aqui</span>}</p>
      <p className={s.serpDesc}>{d ? cortar(d, 160) : <span className={s.serpEmpty}>A descrição aparece aqui. Escreva um resumo que convide a clicar.</span>}</p>
    </figure>
  );
}

/** Contador "48 de 60" que fica vermelho quando passa do limite. */
export function CharCount({ n, max }: { n: number; max: number }) {
  return (
    <span className={n > max ? "over" : undefined}>
      {n} de {max}
    </span>
  );
}
