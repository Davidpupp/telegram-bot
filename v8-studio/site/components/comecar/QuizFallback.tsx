import { cx } from "@/motion/lib/cx";
import styles from "./Quiz.module.css";

/**
 * O que vai no HTML estático no lugar do formulário. O Quiz lê a URL (useSearchParams), então só existe no
 * navegador: este card tem o mesmo topo e a mesma altura da primeira tela, para nada pular quando ele chega.
 */
export function QuizFallback() {
  return (
    <div className={cx("card", styles.quiz)} aria-busy="true">
      <div className={styles.top} aria-hidden="true">
        <div className="progress">
          <div className="progress__bar" style={{ width: 0 }} />
        </div>
        <p className={styles.count} style={{ visibility: "hidden" }}>
          1 de 9
        </p>
      </div>
      <div className={styles.fallbackStage}>
        <noscript>
          <p className="lead">Para responder, ative o JavaScript do navegador.</p>
        </noscript>
      </div>
    </div>
  );
}
