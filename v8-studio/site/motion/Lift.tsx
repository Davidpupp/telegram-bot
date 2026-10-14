"use client";

import Link from "next/link";
import { useState } from "react";
import { useSpringTo } from "./hooks";
import { clamp, mixShadow, SPRINGS } from "./lib/timing";
import { SHADOW, SHADOW_HI } from "./lib/theme";

type Common = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** Quanto o card sobe no hover, em pixels. */
  amount?: number;
};

function useLift(amount: number, style?: React.CSSProperties) {
  const [on, setOn] = useState(false);
  const v = useSpringTo(on ? 1 : 0, SPRINGS.snappy);
  const s: React.CSSProperties | undefined =
    v === 0 ? style : { ...style, transform: `translateY(${(-amount * v).toFixed(2)}px)`, boxShadow: mixShadow(SHADOW, SHADOW_HI, clamp(v)) };
  const handlers = {
    onPointerEnter: () => setOn(true),
    onPointerLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false),
  };
  return { s, handlers };
}

/** Card que sobe com a mola rápida (k 320, d 30) e ganha sombra no hover ou no foco. */
export function Lift({ as = "div", className, style, children, amount = 8 }: Common & { as?: "div" | "article" | "li" }) {
  const { s, handlers } = useLift(amount, style);
  const Tag = as;
  return (
    <Tag className={className} style={s} {...handlers}>
      {children}
    </Tag>
  );
}

/** O mesmo movimento para um card que é um link inteiro. */
export function LiftLink({ href, className, style, children, amount = 8, ...rest }: Common & { href: string; "aria-label"?: string }) {
  const { s, handlers } = useLift(amount, style);
  return (
    <Link href={href} className={className} style={s} {...handlers} {...rest}>
      {children}
    </Link>
  );
}

/** Botão-link que afunda 4 % com mola ao ser pressionado. */
export function PressLink({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode; "aria-label"?: string }) {
  const [down, setDown] = useState(false);
  const v = useSpringTo(down ? 1 : 0, SPRINGS.snappy);
  return (
    <Link
      href={href}
      className={className}
      style={v === 0 ? undefined : { transform: `scale(${(1 - 0.04 * v).toFixed(4)})` }}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
      {...rest}
    >
      {children}
    </Link>
  );
}
