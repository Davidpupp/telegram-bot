"use client";

import { useRef, useState } from "react";
import { useInView, useMounted, useSpringTo, useTimeline } from "@/motion/hooks";
import { clamp, lerp, sp, SPRINGS } from "@/motion/lib/timing";
import { decimalBR } from "@/content/admin-demo";
import s from "./ui.module.css";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const LINE = hex("#E3E7F0");
const BLUE = hex("#2347D6");
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(t)))).join(", ")})`;

/** Interruptor liga e desliga: a bolinha corre e o trilho ganha azul com a mola rápida. */
export function Switch({ on, onChange, label, disabled }: { on: boolean; onChange: (on: boolean) => void; label: string; disabled?: boolean }) {
  const v = useSpringTo(on ? 1 : 0, SPRINGS.snappy);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      className={s.switch}
      style={{ background: mix(LINE, BLUE, v) }}
      onClick={() => onChange(!on)}
    >
      <span className={s.knob} style={{ transform: `translateX(${(v * 18).toFixed(2)}px)` }} />
    </button>
  );
}

/** Botão que afunda 4% com mola ao ser pressionado (o mesmo gesto do PressLink). */
export function PressButton({ children, style, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [down, setDown] = useState(false);
  const v = useSpringTo(down ? 1 : 0, SPRINGS.snappy);
  return (
    <button
      {...rest}
      style={v === 0 ? style : { ...style, transform: `scale(${(1 - 0.04 * v).toFixed(4)})` }}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
    >
      {children}
    </button>
  );
}

function Pop({ children }: { children: React.ReactNode }) {
  const frame = useTimeline({ play: true, duration: 40 });
  const u = sp(frame, 0, "snappy");
  return (
    <span className={s.savedTxt} style={u >= 0.9995 ? undefined : { opacity: clamp(u * 1.5), transform: `translateY(${((1 - u) * 8).toFixed(2)}px)` }}>
      {children}
    </span>
  );
}

/** Confirmação curta ("Salvo às 14:32") que sobe com mola. `stamp` muda a cada salvamento e reinicia a mola. */
export function SaveNotice({ text, stamp }: { text: string | null; stamp: number }) {
  return (
    <p className={s.saved} role="status">
      {text ? <Pop key={stamp}>{text}</Pop> : null}
    </p>
  );
}

/**
 * Número que conta do zero até o valor com a mola pesada quando aparece na tela.
 * O HTML do servidor já traz o valor final; leitores de tela leem só o valor final.
 */
export function CountUp({ value, delay = 0, decimals = 0, suffix = "" }: { value: number; delay?: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });
  const mounted = useMounted();
  const frame = useTimeline({ play: inView, duration: delay + 110 });
  const u = mounted ? sp(frame, delay, "heavy") : 1;
  const fmt = (n: number) => (decimals ? decimalBR(n, decimals) : String(Math.round(n)));
  return (
    <span ref={ref}>
      <span className="visually-hidden">
        {fmt(value)}
        {suffix}
      </span>
      <span aria-hidden="true">
        {fmt(value * Math.min(u, 1))}
        {suffix}
      </span>
    </span>
  );
}

/** Hora local "14:32" para os avisos de salvo (chamada só em eventos, nunca na renderização). */
export const horaAgora = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
