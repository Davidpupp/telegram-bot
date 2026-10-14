"use client";

import { Fragment, useContext, useRef } from "react";
import { FloodContext } from "./flood-context";
import { useInView, useReducedMotion, useTimeline } from "./hooks";
import { useIntroGate } from "./intro";
import { cx } from "./lib/cx";
import { clamp, sp } from "./lib/timing";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  /** Texto; "\n" quebra a linha. */
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
  /** Quadros (60 fps) antes da primeira palavra. */
  delay?: number;
  /** Quadros entre uma palavra e a seguinte (55 ms = 3,3 quadros, como no filme). */
  stagger?: number;
  /** Condição extra para começar (por exemplo, o fim de outra animação). */
  gate?: boolean;
  threshold?: number;
};

/**
 * Frase cinética do filme: cada palavra sobe de dentro de uma máscara com a mola de texto (k 191, d 20)
 * e uma rotação de 6° que se desfaz. O texto completo já vem no HTML do servidor.
 */
export function KineticText({ text, as = "h2", className, id, delay = 0, stagger = 3.3, gate = true, threshold = 0.3 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold });
  const flood = useContext(FloodContext);
  const intro = useIntroGate();
  const reduce = useReducedMotion();
  const play = inView && gate && intro && (flood ? flood.ready : true);

  const lines = text.split("\n").map((l) => l.split(" ").filter(Boolean));
  const count = lines.reduce((a, l) => a + l.length, 0);
  const frame = useTimeline({ play, duration: delay + count * stagger + 48 });
  const live = reduce || play || frame > 0;

  let k = 0;
  const children = lines.map((words, li) => (
    <Fragment key={li}>
      {li > 0 ? <br /> : null}
      {words.map((w, wi) => {
        const i = k++;
        let style: React.CSSProperties | undefined;
        if (live && !reduce) {
          const u = sp(frame, delay + i * stagger, "text");
          if (Math.abs(1 - u) > 0.0005) style = { transform: `translateY(${((1 - u) * 112).toFixed(2)}%) rotate(${((1 - clamp(u)) * 6).toFixed(2)}deg)` };
        }
        return (
          <Fragment key={wi}>
            {wi > 0 ? " " : null}
            <span className="kw">
              <span className="kw-in" style={style}>
                {w}
              </span>
            </span>
          </Fragment>
        );
      })}
    </Fragment>
  ));

  // O tipo é fixado em h2 só para o TypeScript; a tag real vem de `as`.
  const Tag = as as "h2";
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} id={id} className={cx("kinetic", live && "is-live", className)}>
      {children}
    </Tag>
  );
}
