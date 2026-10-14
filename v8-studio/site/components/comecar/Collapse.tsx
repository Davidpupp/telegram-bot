"use client";

import { useEffect, useRef, useState } from "react";
import { useSpringTo } from "@/motion/hooks";
import { clamp, SPRINGS } from "@/motion/lib/timing";

/**
 * Abre e fecha com a mola rápida: a altura vai de 0 à do conteúdo, o conteúdo desce 6 px e aparece.
 * Aberto e parado, fica sem altura fixa (o texto pode mudar à vontade). Fechado, ocupa zero e some
 * para leitores de tela.
 */
export function Collapse({ open, className, children }: { open: boolean; className?: string; children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const v = useSpringTo(open ? 1 : 0, SPRINGS.snappy);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const settled = open && v >= 0.999;
  const outer: React.CSSProperties | undefined = settled ? undefined : { height: Math.max(0, h * clamp(v)), overflow: "hidden" };
  const content: React.CSSProperties | undefined = settled ? undefined : { opacity: clamp(v * 1.4), transform: `translateY(${((1 - v) * -6).toFixed(2)}px)` };

  return (
    <div className={className} style={outer} aria-hidden={open ? undefined : true}>
      <div ref={inner} style={content}>
        {children}
      </div>
    </div>
  );
}

/** O último valor definido: mantém o texto de um aviso enquanto ele fecha. */
export function useLast<T>(value: T | undefined) {
  const [last, setLast] = useState(value);
  if (value !== undefined && value !== last) setLast(value);
  return value ?? last;
}
