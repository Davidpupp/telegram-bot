"use client";

import { useEffect, useRef, useState } from "react";
import { spring } from "remotion";
import { useReducedMotion, useSpringTo } from "@/motion/hooks";
import { FPS, SPRINGS } from "@/motion/lib/timing";
import styles from "./article.module.css";

export type TocItem = { id: string; label: string };

/** Distância entre o topo da janela e o título da seção depois do salto (cabeçalho fixo + folga). */
const offsetTop = () => {
  const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
  return (Number.isFinite(h) ? h : 76) + 28;
};

/**
 * Sumário da página: marca a seção que está sendo lida com um traço azul que desliza com a mola rápida
 * e, ao clicar, rola até a seção com a mola base (k 170, d 26). Com movimento reduzido, salta direto.
 */
export function Toc({ items, title = "Neste artigo" }: { items: TocItem[]; title?: string }) {
  const list = useRef<HTMLOListElement>(null);
  const anim = useRef(0);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [bar, setBar] = useState({ y: 0, h: 0 });
  const y = useSpringTo(bar.y, SPRINGS.snappy);
  const h = useSpringTo(bar.h, SPRINGS.snappy);

  useEffect(() => {
    const heads = items.map((i) => document.getElementById(i.id));
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = offsetTop() + window.innerHeight * 0.18;
        let a = 0;
        heads.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= line) a = i;
        });
        // No fim da página, a última seção pode não chegar à linha: marca a última.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) a = heads.length - 1;
        const li = list.current?.children[a] as HTMLElement | undefined;
        setActive(a);
        if (li) setBar({ y: li.offsetTop, h: li.offsetHeight });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    cancelAnimationFrame(anim.current);
    const to = Math.max(0, window.scrollY + el.getBoundingClientRect().top - offsetTop());
    const done = () => {
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    try {
      window.history.replaceState(window.history.state, "", `#${id}`);
    } catch {}
    if (reduce) {
      window.scrollTo(0, to);
      done();
      return;
    }
    const from = window.scrollY;
    let t0 = -1; // o relógio começa no primeiro quadro
    // Se a pessoa rolar por conta própria no meio do caminho, a animação para.
    const stop = () => {
      cancelAnimationFrame(anim.current);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    const tick = (now: number) => {
      if (t0 < 0) t0 = now;
      const frame = ((now - t0) / 1000) * FPS;
      const v = spring({ frame, fps: FPS, config: SPRINGS.base, from, to });
      window.scrollTo(0, v);
      if (frame < 90 && Math.abs(v - to) > 0.5) anim.current = requestAnimationFrame(tick);
      else {
        window.scrollTo(0, to);
        stop();
        done();
      }
    };
    anim.current = requestAnimationFrame(tick);
  };

  if (!items.length) return null;
  return (
    <nav className={styles.toc} aria-label={title}>
      <p className={styles.tocTitle}>{title}</p>
      <div className={styles.tocTrack}>
        <span className={styles.tocRail} aria-hidden="true" />
        <span className={styles.tocBar} aria-hidden="true" style={{ transform: `translateY(${y.toFixed(2)}px)`, height: Math.max(0, h) }} />
        <ol ref={list} className={styles.tocList}>
          {items.map((it, i) => (
            <li key={it.id}>
              <a href={`#${it.id}`} aria-current={i === active ? "true" : undefined} onClick={(e) => go(e, it.id)}>
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
