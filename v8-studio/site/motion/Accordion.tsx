"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { useSpringTo } from "./hooks";
import { clamp, SPRINGS } from "./lib/timing";

type QA = { q: string; a: string };

function Item({ qa, open, onToggle }: { qa: QA; open: boolean; onToggle: () => void }) {
  const id = useId();
  const v = useSpringTo(open ? 1 : 0, SPRINGS.base);
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.scrollHeight));
    ro.observe(el);
    setH(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  const shown = open || v > 0.001;
  const height = open && v > 0.999 ? "auto" : Math.max(0, h * clamp(v));
  return (
    <div className="accordion__item">
      <h3 style={{ margin: 0, font: "inherit", letterSpacing: "inherit" }}>
        <button type="button" className="accordion__btn" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          {qa.q}
          <span className="accordion__icon" aria-hidden="true" style={{ background: open ? "var(--color-blue)" : "var(--color-paper)", color: open ? "var(--color-white)" : "var(--color-ink)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 8h10" />
              <path d="M8 3v10" style={{ transformOrigin: "8px 8px", transform: `rotate(${(v * 90).toFixed(2)}deg)` }} />
            </svg>
          </span>
        </button>
      </h3>
      <div id={id} className="accordion__panel" role="region" hidden={!shown} style={{ height }}>
        <div ref={inner}>
          <p className="accordion__content" style={{ opacity: clamp(v * 1.4) }}>
            {qa.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Perguntas frequentes: abre uma por vez, com altura e ícone movidos pela mola base. */
export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="accordion">
      {items.map((qa, i) => (
        <Item key={qa.q} qa={qa} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </div>
  );
}
