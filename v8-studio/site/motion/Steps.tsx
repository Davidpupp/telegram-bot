"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useSpringTo } from "./hooks";
import { clamp, lerp, SPRINGS } from "./lib/timing";

type StepItem = { title: string; text: string };

function Step({ item, index, active }: { item: StepItem; index: number; active: boolean }) {
  const v = useSpringTo(active ? 1 : 0, SPRINGS.soft);
  const dot: React.CSSProperties = {
    background: active ? "var(--color-blue)" : "var(--color-white)",
    color: active ? "var(--color-white)" : "var(--color-gray)",
    boxShadow: active ? "0 10px 24px -10px rgba(35,71,214,0.6)" : "inset 0 0 0 2px var(--color-line)",
    transform: `scale(${lerp(0.9, 1, clamp(v)).toFixed(4)})`,
  };
  return (
    <li className="step" style={{ opacity: lerp(0.45, 1, clamp(v)) }}>
      <span className="step__dot" style={dot} aria-hidden="true">
        {index + 1}
      </span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </li>
  );
}

/**
 * Passos ligados por uma linha azul que avança com a rolagem (perseguida pela mola base).
 * Cada ponto acende quando a linha chega nele.
 */
export function Steps({ items }: { items: StepItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const mobile = useMediaQuery("(max-width: 720px)");
  const [target, setTarget] = useState(0);
  const [rail, setRail] = useState(0);
  const v = useSpringTo(target, SPRINGS.base);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const last = el.lastElementChild as HTMLElement | null;
      if (last) setRail(mobile ? last.offsetTop : last.offsetLeft);
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.45;
      setTarget(clamp((start - r.top) / Math.max(1, r.height + start - end)));
    };
    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [mobile]);

  const n = items.length;
  const railStyle: React.CSSProperties = mobile ? { height: rail, width: 2, left: 24, top: 25, right: "auto" } : { width: rail, left: 25, right: "auto" };
  const lineStyle: React.CSSProperties = mobile ? { height: rail * clamp(v), width: 4, left: 23, top: 25 } : { width: rail * clamp(v), left: 25 };

  return (
    <ol ref={ref} className="steps">
      <span className="steps__rail" style={railStyle} aria-hidden="true" />
      <span className="steps__line" style={lineStyle} aria-hidden="true" />
      {items.map((item, i) => (
        <Step key={item.title} item={item} index={i} active={v >= (n === 1 ? 0 : i / (n - 1)) - 0.03} />
      ))}
    </ol>
  );
}
