"use client";

import { useState } from "react";
import { useReducedMotion, useSpringTo } from "@/motion/hooks";
import { SPRINGS } from "@/motion/lib/timing";

/** Botão que afunda 4 % com a mola rápida ao ser pressionado (o mesmo gesto do PressLink). */
export function PressButton({ style, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const reduce = useReducedMotion();
  const [down, setDown] = useState(false);
  const v = useSpringTo(down ? 1 : 0, SPRINGS.snappy);
  return (
    <button
      type="button"
      {...rest}
      style={reduce || v === 0 ? style : { ...style, transform: `scale(${(1 - 0.04 * v).toFixed(4)})` }}
      onPointerDown={(e) => {
        setDown(true);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        setDown(false);
        onPointerUp?.(e);
      }}
      onPointerLeave={(e) => {
        setDown(false);
        onPointerLeave?.(e);
      }}
      onPointerCancel={(e) => {
        setDown(false);
        onPointerCancel?.(e);
      }}
    />
  );
}
