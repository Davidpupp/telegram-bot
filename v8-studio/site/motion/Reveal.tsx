"use client";

import { useContext, useRef } from "react";
import { FloodContext } from "./flood-context";
import { useInView, useReducedMotion, useTimeline } from "./hooks";
import { useIntroGate } from "./intro";
import { cx } from "./lib/cx";
import { clamp, sp } from "./lib/timing";

type Props = {
  as?: "div" | "p" | "section" | "ul" | "li" | "figure" | "span";
  className?: string;
  id?: string;
  children: React.ReactNode;
  /** Quadros (60 fps) antes de começar. */
  delay?: number;
  /** Distância da subida, em pixels. */
  y?: number;
  gate?: boolean;
  threshold?: number;
  style?: React.CSSProperties;
};

/** Bloco que sobe e aparece com a mola suave (k 200, d 22) quando entra na tela. */
export function Reveal({ as = "div", className, id, children, delay = 0, y = 28, gate = true, threshold = 0.2, style }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold });
  const flood = useContext(FloodContext);
  const intro = useIntroGate();
  const reduce = useReducedMotion();
  const play = inView && gate && intro && (flood ? flood.ready : true);
  const frame = useTimeline({ play, duration: delay + 60 });
  const live = reduce || play || frame > 0;

  let s = style;
  if (live && !reduce) {
    const u = sp(frame, delay, "soft");
    if (Math.abs(1 - u) > 0.0005) s = { ...style, opacity: clamp(u * 1.5), transform: `translateY(${((1 - u) * y).toFixed(2)}px)` };
  }
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} id={id} className={cx("reveal", live && "is-live", className)} style={s}>
      {children}
    </Tag>
  );
}
