"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Origem } from "@/content/admin-demo";
import { useInView, useMounted, useTimeline } from "@/motion/hooks";
import { sp } from "@/motion/lib/timing";
import s from "./dashboard.module.css";

/** Barras horizontais que crescem em sequência com a mola base. Cada linha abre a lista já filtrada. */
export function OriginBars({ rows }: { rows: { origem: Origem; total: number }[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { threshold: 0.25 });
  const mounted = useMounted();
  const frame = useTimeline({ play: inView, duration: 130 });
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <ul ref={ref} className={s.origins}>
      {rows.map((r, i) => {
        const u = mounted ? sp(frame, 6 + i * 4, "base") : 1;
        return (
          <li key={r.origem.chave}>
            <Link href={`/admin/leads/?origem=${encodeURIComponent(r.origem.chave)}`} className={s.origin} title={r.origem.detalhe}>
              <span className={s.originTop}>
                <span className={s.originName}>{r.origem.rotulo}</span>
                <span className={s.originN}>
                  {r.total}
                  <span className="visually-hidden">{r.total === 1 ? " lead" : " leads"}</span>
                </span>
              </span>
              <span className={s.track} aria-hidden="true">
                <span className={s.fill} style={{ width: `${((r.total / max) * 100 * Math.min(1, u)).toFixed(2)}%` }} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
