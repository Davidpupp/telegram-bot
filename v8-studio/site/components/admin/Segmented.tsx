"use client";

import { useEffect, useRef, useState } from "react";
import type { LeadStatus } from "@/content/admin-demo";
import { useSpringTo } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { SPRINGS } from "@/motion/lib/timing";
import s from "./ui.module.css";

type Box = { x: number; y: number; w: number; h: number };
export type SegOption<T extends string> = { value: T; label: string; status?: LeadStatus };

/** O fundo branco persegue a opção escolhida com a mola base, em qualquer direção (as opções podem quebrar linha). */
function Thumb({ box }: { box: Box }) {
  const x = useSpringTo(box.x, SPRINGS.base);
  const y = useSpringTo(box.y, SPRINGS.base);
  const w = useSpringTo(box.w, SPRINGS.base);
  const h = useSpringTo(box.h, SPRINGS.base);
  return <span aria-hidden="true" className={s.segThumb} style={{ width: w, height: h, transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)` }} />;
}

type Props<T extends string> = {
  name: string;
  legend: string;
  showLegend?: boolean;
  options: SegOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Grupo de rádios em segmentos. O teclado funciona como em qualquer rádio (setas trocam a opção). */
export function Segmented<T extends string>({ name, legend, showLegend = false, options, value, onChange, className }: Props<T>) {
  const wrap = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const key = options.map((o) => o.value).join("|");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const m: Record<string, Box> = {};
      el.querySelectorAll<HTMLElement>("[data-value]").forEach((o) => {
        m[o.dataset.value ?? ""] = { x: o.offsetLeft, y: o.offsetTop, w: o.offsetWidth, h: o.offsetHeight };
      });
      setBoxes(m);
    });
    ro.observe(el);
    el.querySelectorAll("[data-value]").forEach((o) => ro.observe(o));
    return () => ro.disconnect();
  }, [key]);

  const box = boxes[value];
  return (
    <fieldset className={cx(s.segField, className)}>
      <legend className={showLegend ? s.segLegend : "visually-hidden"}>{legend}</legend>
      <div ref={wrap} className={s.seg}>
        {box ? <Thumb box={box} /> : null}
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label key={o.value} className={cx(s.segOpt, on && !box && s.segOptStatic)} data-value={o.value} data-on={on}>
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} />
              {o.status ? <span className={`status status--${o.status}`}>{o.label}</span> : o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
