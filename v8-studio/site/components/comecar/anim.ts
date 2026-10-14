"use client";

// Movimento do formulário "Começar": tudo sai das molas de @/motion/lib/timing num relógio de 60 quadros por segundo.
import type { CSSProperties } from "react";
import { clamp, FPS, lerp, sp, type SpringPreset } from "@/motion/lib/timing";

/**
 * Sobe e aparece com a mola suave a partir do quadro `start` de uma linha do tempo (useTimeline).
 * Quando a mola assenta, devolve undefined: o elemento fica sem estilo e o texto, nítido.
 */
export function rise(frame: number, start: number, dist = 14, preset: SpringPreset = "soft"): CSSProperties | undefined {
  const u = sp(frame, start, preset);
  if (Math.abs(1 - u) < 0.0005) return undefined;
  return { opacity: clamp(u * 1.5), transform: `translateY(${((1 - u) * dist).toFixed(2)}px)` };
}

/**
 * Rola a janela até `y` com a mola base. Para se a pessoa rolar, tocar ou usar o teclado no meio.
 * Com movimento reduzido, pula direto. Devolve a função que interrompe.
 */
export function springScrollTo(y: number, reduce: boolean) {
  const from = window.scrollY;
  const to = Math.max(0, Math.round(y));
  if (reduce || Math.abs(to - from) < 2) {
    window.scrollTo(0, to);
    return () => {};
  }
  let raf = 0;
  const events = ["wheel", "touchstart", "keydown"] as const;
  const stop = () => {
    cancelAnimationFrame(raf);
    events.forEach((ev) => window.removeEventListener(ev, stop));
  };
  events.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
  const t0 = performance.now();
  const tick = (now: number) => {
    const f = ((now - t0) / 1000) * FPS;
    const v = lerp(from, to, sp(f, 0, "base"));
    window.scrollTo(0, v);
    if (f < 90 && Math.abs(v - to) > 0.5) raf = requestAnimationFrame(tick);
    else {
      window.scrollTo(0, to);
      stop();
    }
  };
  raf = requestAnimationFrame(tick);
  return stop;
}
