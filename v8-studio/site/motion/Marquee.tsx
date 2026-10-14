"use client";

import { useEffect, useRef } from "react";
import { spring } from "remotion";
import { useInView, useReducedMotion } from "./hooks";
import { FPS, SPRINGS } from "./lib/timing";

type Props = {
  children: React.ReactNode;
  /** Velocidade em pixels por segundo. */
  speed?: number;
  reverse?: boolean;
};

/**
 * Faixa que corre sem parar, movida por um relógio de quadros. No hover a velocidade cai a zero
 * com a mola pesada (k 120, d 24) e volta do mesmo jeito. Fora da tela, para de calcular.
 */
export function Marquee({ children, speed = 36, reverse = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const visible = useInView(wrap, { threshold: 0, once: false, rootMargin: "120px 0px" });
  const reduce = useReducedMotion();
  const hover = useRef(false);
  const pos = useRef(0);
  const factor = useRef(1);

  useEffect(() => {
    const el = track.current;
    if (!el || reduce || !visible) return;
    let raf = 0;
    let last = performance.now();
    let target = hover.current ? 0 : 1;
    let from = factor.current;
    let t0 = last;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const want = hover.current ? 0 : 1;
      if (want !== target) {
        target = want;
        from = factor.current;
        t0 = now;
      }
      factor.current = spring({ frame: ((now - t0) / 1000) * FPS, fps: FPS, config: SPRINGS.heavy, from, to: target });
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const period = (el.scrollWidth + gap) / 2;
      let x = pos.current + speed * factor.current * dt;
      if (period > 0 && x >= period) x -= period;
      pos.current = x;
      el.style.transform = `translate3d(${(reverse ? x - period : -x).toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce, speed, reverse]);

  return (
    <div
      ref={wrap}
      className="marquee"
      onPointerEnter={() => {
        hover.current = true;
      }}
      onPointerLeave={() => {
        hover.current = false;
      }}
    >
      <div ref={track} className="marquee__track">
        {children}
        <div style={{ display: "contents" }} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
