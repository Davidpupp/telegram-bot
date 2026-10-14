"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { USUARIO_DEMO } from "@/content/admin-demo";
import { LogoMark } from "@/components/site/Logo";
import { cx } from "@/motion/lib/cx";
import { IconConfig, IconLeads, IconPaginas, IconPainel, IconPosts, IconSite } from "./icons";
import s from "./shell.module.css";

const ITENS = [
  { href: "/admin/", label: "Painel", Icon: IconPainel, exact: true },
  { href: "/admin/leads/", label: "Leads", Icon: IconLeads, exact: false },
  { href: "/admin/posts/", label: "Posts", Icon: IconPosts, exact: false },
  { href: "/admin/landing-pages/", label: "Landing pages", Icon: IconPaginas, exact: false },
  { href: "/admin/configuracoes/", label: "Configurações", Icon: IconConfig, exact: false },
];

/** Barra lateral: logo, navegação (página atual com aria-current) e o usuário. No celular vira o topo. */
export function AdminSidebar() {
  const raw = usePathname() ?? "/admin/";
  const path = raw.endsWith("/") ? raw : `${raw}/`;
  return (
    <aside className={cx("admin__side", s.side)}>
      <Link href="/admin/" className={cx("logo", s.brand)} aria-label="V8 Studio, painel">
        <LogoMark />
        <span>Studio</span>
      </Link>
      <nav className={cx("admin__nav", s.nav)} aria-label="Painel">
        {ITENS.map(({ href, label, Icon, exact }) => {
          const current = path === href ? "page" : !exact && path.startsWith(href) ? "true" : undefined;
          return (
            <Link key={href} href={href} aria-current={current}>
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={s.user}>
        <div className="admin__user">
          <i aria-hidden="true">{USUARIO_DEMO.inicial}</i>
          <span className={s.who}>
            <strong>{USUARIO_DEMO.nome}</strong>
            <small>{USUARIO_DEMO.papel}</small>
          </span>
        </div>
        <div className={s.userLinks}>
          <Link href="/" className={s.siteLink}>
            <IconSite />
            Ver o site
          </Link>
          <Link href="/admin/login/">Sair</Link>
        </div>
      </div>
    </aside>
  );
}
