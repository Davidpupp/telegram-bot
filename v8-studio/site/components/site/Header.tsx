"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { serviceHref, SERVICES } from "@/content/services";
import { useReducedMotion, useSpringTo, useTimeline } from "@/motion/hooks";
import { PressLink } from "@/motion/Lift";
import { clamp, sp, SPRINGS } from "@/motion/lib/timing";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/blog/", label: "Blog" },
  { href: "/sobre/", label: "Sobre" },
];

function Chevron({ open }: { open: number }) {
  return (
    <svg className="nav__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: `rotate(${open * 180}deg)` }}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

/** Menu do celular: tela branca e itens que sobem como as frases do filme. */
function MobileNav({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: true, duration: 70 });
  const item = (i: number): React.CSSProperties | undefined => {
    if (reduce) return undefined;
    const u = sp(frame, 4 + i * 3, "text");
    return Math.abs(1 - u) < 0.0005 ? undefined : { transform: `translateY(${((1 - u) * 112).toFixed(2)}%)` };
  };
  const fade = reduce ? 1 : clamp(sp(frame, 0, "snappy") * 1.4);
  const items = [
    ...SERVICES.map((s) => ({ href: serviceHref(s.slug), label: s.short, sub: true })),
    ...LINKS.map((l) => ({ ...l, sub: false })),
  ];
  return (
    <nav id="menu-celular" className="mobile-nav" aria-label="Menu" style={{ opacity: fade }}>
      <p className="kicker">Serviços</p>
      {items.map((it, i) => (
        <span key={it.href} className={it.sub ? "sub" : undefined} style={{ display: "block", overflow: "hidden" }}>
          <Link href={it.href} onClick={onClose} aria-current={pathname === it.href ? "page" : undefined} style={{ ...item(i), display: "block" }}>
            {it.label}
          </Link>
        </span>
      ))}
      <PressLink href="/comecar/" className="btn btn--primary">
        Começar
      </PressLink>
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [sub, setSub] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const subV = useSpringTo(sub ? 1 : 0, SPRINGS.snappy);
  const subRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Fecha os menus quando a rota muda (ajuste de estado durante a renderização, sem efeito extra).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(false);
    setSub(false);
  }

  useEffect(() => {
    const root = document.documentElement;
    if (menu) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSub(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const inServices = pathname.startsWith("/servicos/");

  return (
    <>
      <header className={scrolled || menu ? "site-header is-scrolled" : "site-header"}>
        <div className="container">
          <Logo dock />
          <nav className="nav" aria-label="Principal">
            <ul className="nav__list">
              <li
                className="nav__item"
                ref={subRef}
                onPointerEnter={(e) => e.pointerType === "mouse" && setSub(true)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setSub(false)}
                onBlur={(e) => {
                  if (!subRef.current?.contains(e.relatedTarget as Node)) setSub(false);
                }}
              >
                <button
                  type="button"
                  className="nav__link"
                  aria-expanded={sub}
                  aria-controls="submenu-servicos"
                  aria-current={inServices ? "page" : undefined}
                  onClick={() => setSub((v) => !v)}
                >
                  Serviços
                  <Chevron open={subV} />
                </button>
                <div
                  id="submenu-servicos"
                  className="submenu"
                  hidden={!sub && subV < 0.001}
                  style={{ opacity: clamp(subV * 1.3), transform: `translateY(${((1 - subV) * -8).toFixed(2)}px)`, pointerEvents: sub ? "auto" : "none" }}
                >
                  {SERVICES.map((s) => (
                    <Link key={s.slug} href={serviceHref(s.slug)} aria-current={pathname === serviceHref(s.slug) ? "page" : undefined}>
                      <strong>{s.name}</strong>
                      <span>{s.line}</span>
                    </Link>
                  ))}
                </div>
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="nav__link" aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-cta">
            <PressLink href="/comecar/" className="btn btn--primary btn--sm">
              Começar
            </PressLink>
            <button type="button" className="menu-toggle" aria-expanded={menu} aria-controls="menu-celular" aria-label={menu ? "Fechar menu" : "Abrir menu"} onClick={() => setMenu((v) => !v)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>
      {menu ? <MobileNav onClose={() => setMenu(false)} pathname={pathname} /> : null}
    </>
  );
}
