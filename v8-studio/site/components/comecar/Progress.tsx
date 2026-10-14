"use client";

import { useSpringTo, useTimeline } from "@/motion/hooks";
import { clamp, sp, SPRINGS } from "@/motion/lib/timing";
import styles from "./Quiz.module.css";

/**
 * Barra de progresso e contador "3 de 9". A largura persegue a etapa com a mola base (e cresce do zero
 * quando o formulário aparece); o número rola como um odômetro com a mola rápida.
 */
export function Progress({ step, total }: { step: number; total: number }) {
  const n = step + 1;
  const intro = useTimeline({ play: true, duration: 60 });
  const width = useSpringTo(n / total, SPRINGS.base) * clamp(sp(intro, 6, "base"));
  const roll = useSpringTo(n, SPRINGS.snappy);

  return (
    <div className={styles.top}>
      <div className="progress" role="progressbar" aria-label="Progresso do formulário" aria-valuemin={1} aria-valuemax={total} aria-valuenow={n} aria-valuetext={`Etapa ${n} de ${total}`}>
        <div className="progress__bar" style={{ width: `${(clamp(width) * 100).toFixed(3)}%` }} />
      </div>
      <p className={styles.count} aria-live="polite">
        <span className="visually-hidden">
          Etapa {n} de {total}
        </span>
        <span className={styles.odometer} aria-hidden="true">
          <span className={styles.digits} style={{ transform: `translateY(${(-(roll - 1) * 1.4).toFixed(4)}em)` }}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </span>
        </span>
        <span aria-hidden="true">&nbsp;de {total}</span>
      </p>
    </div>
  );
}
