"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { spring } from "./lib/physics";
import { useReducedMotion } from "./hooks";
import { FPS, SPRINGS } from "./lib/timing";

type Props = {
  head: React.ReactNode;
  children: React.ReactNode;
  label: string;
};

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === "prev" ? <path d="M17 10H4M9 5l-5 5 5 5" /> : <path d="M3 10h13M11 5l5 5-5 5" />}
  </svg>
);

/** Carrossel de cards: as setas levam ao card seguinte com a mola base (k 170, d 26). */
export function Carousel({ head, children, label }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const anim = useRef(0);
  const reduce = useReducedMotion();
  const [can, setCan] = useState({ prev: false, next: true });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCan({ prev: el.scrollLeft > 4, next: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(anim.current);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const max = el.scrollWidth - el.clientWidth;
    const stops = Array.from(el.children).map((c) => Math.min(max, Math.max(0, (c as HTMLElement).offsetLeft - pad)));
    const from = el.scrollLeft;
    const to = dir > 0 ? (stops.find((s) => s > from + 4) ?? max) : ([...stops].reverse().find((s) => s < from - 4) ?? 0);
    cancelAnimationFrame(anim.current);
    if (reduce) {
      el.scrollLeft = to;
      return;
    }
    el.style.scrollSnapType = "none";
    const t0 = performance.now();
    const tick = (now: number) => {
      const frame = ((now - t0) / 1000) * FPS;
      const v = spring({ frame, fps: FPS, config: SPRINGS.base, from, to });
      el.scrollLeft = v;
      if (frame < 90 && Math.abs(v - to) > 0.5) anim.current = requestAnimationFrame(tick);
      else {
        el.scrollLeft = to;
        el.style.scrollSnapType = "";
      }
    };
    anim.current = requestAnimationFrame(tick);
  };

  return (
    <div className="carousel" role="region" aria-label={label}>
      <div className="container carousel__head">
        {head}
        <div className="carousel__nav">
          <button type="button" className="carousel__btn" aria-label="Anterior" disabled={!can.prev} onClick={() => go(-1)}>
            <Arrow dir="prev" />
          </button>
          <button type="button" className="carousel__btn" aria-label="Próximo" disabled={!can.next} onClick={() => go(1)}>
            <Arrow dir="next" />
          </button>
        </div>
      </div>
      <div ref={track} className="carousel__track" onScroll={update}>
        {children}
      </div>
    </div>
  );
}
