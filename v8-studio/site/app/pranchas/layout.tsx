import type { Metadata } from "next";
import { Logo } from "@/components/site/Logo";
import { BoardNav } from "@/components/pranchas/BoardTools";
import styles from "./pranchas.module.css";

export const metadata: Metadata = {
  title: { default: "Pranchas", template: "%s · Pranchas V8" },
  robots: { index: false, follow: false },
};

/** Pranchas do sistema visual: tokens, componentes, movimento e páginas, ao vivo. */
export default function PranchasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={styles.top}>
        <div className={`container ${styles.topIn}`}>
          <Logo />
          <BoardNav />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
