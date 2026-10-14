"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { spring } from "@/motion/lib/physics";
import { useSpringTo } from "@/motion/hooks";
import { FPS, SPRINGS, type SpringPreset } from "@/motion/lib/timing";
import styles from "@/app/pranchas/pranchas.module.css";

const BOARDS = [
  { href: "/pranchas/", label: "Índice" },
  { href: "/pranchas/tokens/", label: "Tokens" },
  { href: "/pranchas/componentes/", label: "Componentes" },
  { href: "/pranchas/movimento/", label: "Movimento" },
  { href: "/pranchas/paginas/", label: "Páginas" },
];

export function BoardNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Pranchas">
      {BOARDS.map((b) => (
        <Link key={b.href} href={b.href} aria-current={pathname === b.href ? "page" : undefined}>
          {b.label}
        </Link>
      ))}
    </nav>
  );
}

/** Repete as animações de dentro: remonta os filhos a cada clique. */
export function Replay({ children, label = "Repetir animação" }: { children: React.ReactNode; label?: string }) {
  const [n, setN] = useState(0);
  return (
    <>
      <div key={n} style={{ display: "contents" }}>
        {children}
      </div>
      <button type="button" className={`btn btn--ghost btn--sm ${styles.replay}`} onClick={() => setN((v) => v + 1)}>
        {label}
      </button>
    </>
  );
}

/** Curva de uma mola do sistema, com uma bolinha que percorre a trilha usando a mesma mola. */
export function SpringCard({ name }: { name: SpringPreset }) {
  const cfg = SPRINGS[name];
  const zeta = cfg.damping / (2 * Math.sqrt(cfg.stiffness * cfg.mass));
  const N = 90;
  const vals = Array.from({ length: N + 1 }, (_, f) => spring({ frame: f, fps: FPS, config: cfg }));
  const settle = vals.findIndex((v, i) => i > 3 && vals.slice(i).every((w) => Math.abs(w - 1) < 0.005));
  const max = Math.max(...vals);
  const W = 260;
  const H = 120;
  const y = (v: number) => H - 14 - (v / Math.max(1.1, max)) * (H - 28);
  const d = vals.map((v, i) => `${i === 0 ? "M" : "L"}${((i / N) * W).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const [on, setOn] = useState(false);
  const p = useSpringTo(on ? 1 : 0, cfg);
  return (
    <div className={`card ${styles.springCard}`}>
      <span className={styles.layer}>Motion / Spring / {name}</span>
      <h3 style={{ margin: 0 }}>{name}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Curva da mola ${name} em 90 quadros`}>
        <line x1="0" x2={W} y1={y(1)} y2={y(1)} stroke="var(--color-line)" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="0" x2={W} y1={H - 14} y2={H - 14} stroke="var(--color-line)" strokeWidth="1.5" />
        <path d={d} fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="small muted">
        Rigidez {cfg.stiffness}, amortecimento {cfg.damping}, massa {cfg.mass}. Razão de amortecimento {zeta.toFixed(2)}
        {zeta < 1 ? `, passa ${((max - 1) * 100).toFixed(1)}% do alvo` : ", sem passar do alvo"}. Assenta em {settle > 0 ? settle : N} quadros ({Math.round(((settle > 0 ? settle : N) / FPS) * 1000)} ms).
      </p>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.ball} style={{ left: `calc(6px + (100% - 36px) * ${p.toFixed(4)})` }} />
      </div>
      <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOn((v) => !v)}>
        Testar a mola
      </button>
    </div>
  );
}
