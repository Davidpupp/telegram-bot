import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { cx } from "@/motion/lib/cx";
import styles from "./TopBar.module.css";

/** Topo mínimo do formulário: o logo e a volta para o site. Sem menu, para nada tirar a atenção das perguntas. */
export function TopBar() {
  return (
    <header className={styles.bar}>
      <div className={cx("container", styles.inner)}>
        <Logo />
        <Link href="/" className={styles.back}>
          Voltar ao site
        </Link>
      </div>
    </header>
  );
}
