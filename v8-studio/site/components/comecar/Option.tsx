"use client";

import { useState } from "react";
import { useReducedMotion, useSpringTo } from "@/motion/hooks";
import { clamp, mixShadow, SPRINGS } from "@/motion/lib/timing";

// Três estados com a mesma estrutura de sombra, para a mola misturar número a número:
// borda cinza parada, borda mais escura com sombra no hover, borda azul com halo e sombra do card quando escolhida.
const REST = "inset 0 0 0 2px rgba(227,231,240,1), 0 0 0 0px rgba(35,71,214,0), 0 0px 0px -12px rgba(13,32,96,0)";
const HOVER = "inset 0 0 0 2px rgba(188,197,219,1), 0 0 0 0px rgba(35,71,214,0), 0 16px 32px -18px rgba(13,32,96,0.22)";
const ON = "inset 0 0 0 2px rgba(35,71,214,1), 0 0 0 4px rgba(35,71,214,0.16), 0 24px 48px -22px rgba(13,32,96,0.3)";

type Props = {
  label: string;
  hint: string;
  selected: boolean;
  onChoose: () => void;
  /** Entrada da opção (0 a 1), vinda da linha do tempo da tela. */
  enter?: number;
};

/**
 * Opção de resposta. Afunda com a mola rápida ao toque, sobe 2 px no hover e, quando escolhida,
 * ganha a borda azul com um leve inchaço (a mesma mola, 0 → 1 → 0 na escala).
 */
export function Option({ label, hint, selected, onChoose, enter = 1 }: Props) {
  const reduce = useReducedMotion();
  const [down, setDown] = useState(false);
  const [hover, setHover] = useState(false);
  const p = useSpringTo(down ? 1 : 0, SPRINGS.snappy);
  const h = clamp(useSpringTo(hover ? 1 : 0, SPRINGS.snappy));
  const s = clamp(useSpringTo(selected ? 1 : 0, SPRINGS.snappy));

  const style: React.CSSProperties = { boxShadow: mixShadow(mixShadow(REST, HOVER, h), ON, s) };
  if (!reduce) {
    const swell = selected ? 4 * s * (1 - s) : 0;
    const y = (1 - enter) * 16 - 2 * h;
    const scale = 1 - 0.035 * p + 0.025 * swell;
    if (Math.abs(y) > 0.01 || Math.abs(scale - 1) > 0.0001) style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`;
    if (enter < 0.999) style.opacity = clamp(enter * 1.4);
  }

  return (
    <button
      type="button"
      className="option"
      aria-pressed={selected}
      onClick={onChoose}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => {
        setDown(false);
        setHover(false);
      }}
      style={style}
    >
      <strong>{label}</strong>
      <span>{hint}</span>
    </button>
  );
}
