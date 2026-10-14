"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FloodContext } from "./flood-context";
import { useInView, useReducedMotion, useTimeline } from "./hooks";
import { cx } from "./lib/cx";
import { E, coverRadius, ramp } from "./lib/timing";

type Props = {
  as?: "section" | "div" | "footer";
  tone?: "blue" | "paper";
  /** Ponto de onde a cor nasce, em frações da faixa (x, y). */
  origin?: [number, number];
  className?: string;
  id?: string;
  children: React.ReactNode;
  "aria-labelledby"?: string;
};

/**
 * Faixa que inunda de cor como as trocas de cena do filme: um círculo nasce num ponto e acelera
 * até limpar o canto mais distante (24 quadros, 0,4 s). O conteúdo de dentro espera o azul chegar.
 */
export function Flood({ as = "section", tone = "blue", origin = [0.5, 0], className, id, children, ...aria }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: inView, duration: 30 });
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const live = reduce || inView;
  const ready = reduce || frame >= 12;
  const p = ramp(frame, 0, 24, E.in);
  const ox = origin[0] * box.w;
  const oy = origin[1] * box.h;
  const r = p * coverRadius(ox, oy, box.w, box.h);
  const bg = live && !reduce && p < 1 ? { clipPath: `circle(${r.toFixed(1)}px at ${ox.toFixed(1)}px ${oy.toFixed(1)}px)` } : undefined;
  const ctx = useMemo(() => ({ ready }), [ready]);
  const Tag = as as "section";

  return (
    <FloodContext.Provider value={ctx}>
      <Tag ref={ref as React.RefObject<HTMLElement>} id={id} className={cx("flood", `flood--${tone}`, tone === "blue" && "band", live && "is-live", className)} {...aria}>
        <div className="flood__bg" style={bg} aria-hidden="true" />
        {children}
      </Tag>
    </FloodContext.Provider>
  );
}
