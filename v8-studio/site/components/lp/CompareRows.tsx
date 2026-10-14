"use client";

import { useRef } from "react";
import { useInView, useReducedMotion, useTimeline } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { clamp, lerp, sp } from "@/motion/lib/timing";
import s from "./CompareRows.module.css";

type Row = { before: string; after: string };

const START = 10;
const GAP = 22;
// Tinta do texto (#0B1220) indo para o cinza de apoio (#5B6478) enquanto o risco aparece.
const INK = [11, 18, 32];
const GRAY = [91, 100, 120];
const mix = (t: number) => `rgb(${INK.map((c, i) => Math.round(lerp(c, GRAY[i], t))).join(",")})`;

/**
 * Antes e depois, linha a linha. Quando a tabela aparece, cada "antes" é riscado e o "depois" sobe ao lado,
 * um de cada vez (molas base e suave). Sem JavaScript ou com movimento reduzido, mostra o estado final.
 */
export function CompareRows({ beforeTitle, afterTitle, rows, label }: { beforeTitle: string; afterTitle: string; rows: Row[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: inView, duration: START + rows.length * GAP + 60 });
  const live = reduce || inView || frame > 0;
  const animate = live && !reduce;

  return (
    <div ref={ref} role="table" aria-label={label} className={cx("card card--flush", s.table, live && s.live)}>
      <div role="rowgroup">
        <div role="row" className={cx(s.row, s.head)}>
          <span role="columnheader" className={s.headBefore}>
            {beforeTitle}
          </span>
          <span role="columnheader">{afterTitle}</span>
        </div>
      </div>
      <div role="rowgroup" className={s.body}>
        {rows.map((r, i) => {
          const a = START + i * GAP;
          const strike = animate ? clamp(sp(frame, a, "base")) : 1;
          const rise = animate ? sp(frame, a + 8, "soft") : 1;
          const before: React.CSSProperties | undefined =
            strike < 0.999 ? { color: mix(strike), textDecorationColor: `rgba(91,100,120,${(0.75 * strike).toFixed(3)})` } : undefined;
          const after: React.CSSProperties | undefined =
            Math.abs(1 - rise) > 0.0005 ? { opacity: clamp(rise * 1.5), transform: `translateY(${((1 - rise) * 14).toFixed(2)}px)` } : undefined;
          return (
            <div role="row" key={r.before} className={s.row}>
              <div role="cell" className={s.cell}>
                <span className={s.label} aria-hidden="true">
                  {beforeTitle}
                </span>
                <span className={s.before} style={before}>
                  {r.before}
                </span>
              </div>
              <div role="cell" className={s.cell}>
                <span className={s.label} aria-hidden="true">
                  {afterTitle}
                </span>
                <span className={s.after} style={after}>
                  <i aria-hidden="true" />
                  {r.after}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
