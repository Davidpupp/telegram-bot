"use client";

import { useRef } from "react";
import { useInView, useMounted, useTimeline } from "@/motion/hooks";
import { sp } from "@/motion/lib/timing";
import l from "./landing.module.css";

/** Barra de conversão (relativa à maior entre as páginas) que cresce com a mola base ao aparecer. */
export function ConvBar({ fracao, delay = 0 }: { fracao: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const mounted = useMounted();
  const frame = useTimeline({ play: inView, duration: delay + 90 });
  const u = mounted ? Math.min(1, sp(frame, delay, "base")) : 1;
  return (
    <span ref={ref} className={l.conv} aria-hidden="true">
      <span className={l.convFill} style={{ width: `${(Math.max(0, Math.min(1, fracao)) * 100 * u).toFixed(2)}%` }} />
    </span>
  );
}
