"use client";

import { useEffect, useRef, useState } from "react";
import { useSpringTo } from "@/motion/hooks";
import { SPRINGS } from "@/motion/lib/timing";
import styles from "./blog.module.css";

type Props = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

type Box = { x: number; y: number; w: number };

/**
 * Filtro por categoria: palavras lado a lado e um traço azul que corre até a escolhida com a mola rápida
 * (k 320, d 30). Antes do primeiro clique o traço fica parado no lugar, sem entrada animada.
 */
export function CategoryFilter({ options, value, onChange, label = "Filtrar artigos por categoria" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0 });
  const [touched, setTouched] = useState(false);
  const index = Math.max(0, options.indexOf(value));

  useEffect(() => {
    const measure = () => {
      const b = btns.current[index];
      if (!b) return;
      setBox({ x: b.offsetLeft, y: b.offsetTop + b.offsetHeight, w: b.offsetWidth });
    };
    const ro = new ResizeObserver(measure);
    btns.current.forEach((b) => b && ro.observe(b));
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [index]);

  const x = useSpringTo(box.x, SPRINGS.snappy);
  const y = useSpringTo(box.y, SPRINGS.snappy);
  const w = useSpringTo(box.w, SPRINGS.snappy);
  const s = touched ? { x, y, w } : box;

  return (
    <div ref={wrap} className={styles.filter} role="group" aria-label={label}>
      {options.map((o, i) => (
        <button
          key={o}
          ref={(el) => {
            btns.current[i] = el;
          }}
          type="button"
          className={styles.filterBtn}
          aria-pressed={o === value}
          onClick={() => {
            setTouched(true);
            onChange(o);
          }}
        >
          {o}
        </button>
      ))}
      <span
        className={styles.filterBar}
        aria-hidden="true"
        style={{ width: Math.max(0, s.w), transform: `translate(${s.x.toFixed(2)}px, ${(s.y - 3).toFixed(2)}px)`, opacity: box.w ? 1 : 0 }}
      />
    </div>
  );
}
