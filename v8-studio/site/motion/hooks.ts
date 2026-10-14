"use client";

import { RefObject, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { spring } from "remotion";
import { FPS, SPRINGS } from "./lib/timing";

type SpringConfig = { stiffness: number; damping: number; mass: number };

const noopSubscribe = () => () => {};

/** true depois da hidratação. Antes disso o HTML do servidor fica visível e parado. */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Lê uma media query sem renderização extra; no servidor e na hidratação vale false. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.25, once = true, rootMargin = "0px 0px -8% 0px" }: { threshold?: number; once?: boolean; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once, rootMargin]);
  return inView;
}

/**
 * Relógio de quadros (60 fps) que anda enquanto `play` é true. Linhas do tempo de uma vez param em `duration`;
 * com `duration` infinito o relógio continua (marquee). Com movimento reduzido, devolve o estado final.
 */
export function useTimeline({ play, duration = Infinity, reducedFrame }: { play: boolean; duration?: number; reducedFrame?: number }) {
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const acc = useRef(0);
  useEffect(() => {
    if (reduce || !play) return;
    let raf = 0;
    const t0 = performance.now();
    const base = acc.current;
    const tick = (now: number) => {
      const f = base + ((now - t0) / 1000) * FPS;
      if (f >= duration) {
        acc.current = duration;
        setFrame(duration);
        return;
      }
      acc.current = f;
      setFrame(f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, duration, reduce]);
  if (reduce) return reducedFrame ?? (Number.isFinite(duration) ? duration : 0);
  return frame;
}

/** Valor que persegue `target` com a mola do Remotion (hover, abrir e fechar). Com movimento reduzido, pula direto. */
export function useSpringTo(target: number, config: SpringConfig = SPRINGS.snappy) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(target);
  const s = useRef({ from: target, to: target, t0: 0, v: target });
  useEffect(() => {
    const st = s.current;
    if (reduce) {
      st.v = target;
      st.to = target;
      return;
    }
    if (st.to === target && st.v === target) return;
    st.from = st.v;
    st.to = target;
    st.t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const frame = ((now - st.t0) / 1000) * FPS;
      const v = spring({ frame, fps: FPS, config, from: st.from, to: st.to });
      if (frame > 120 || (frame > 6 && Math.abs(v - st.to) < 0.0008)) {
        st.v = st.to;
        setValue(st.to);
        return;
      }
      st.v = v;
      setValue(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // config é estável (vem de SPRINGS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduce]);
  return reduce ? target : value;
}
