import { KineticText } from "@/motion/KineticText";
import { Reveal } from "@/motion/Reveal";
import styles from "./article.module.css";

/** Capa tipográfica do artigo: a frase da capa em azul, grande, sobre o papel. Decorativa: o título já está no h1. */
export function ArticleCover({ text }: { text: string }) {
  return (
    <Reveal className={styles.cover} delay={26} y={40}>
      <div className={styles.coverInner} aria-hidden="true">
        <KineticText as="div" text={text} className={styles.coverText} delay={34} stagger={4} />
      </div>
    </Reveal>
  );
}
