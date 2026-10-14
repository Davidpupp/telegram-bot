import type { PostSummary } from "@/content/posts";
import { LiftLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import styles from "./blog.module.css";

/** Card de artigo igual ao da Home. `wide` ocupa meia linha e ganha uma capa mais baixa e letras maiores. */
export function PostCard({ post, wide = false }: { post: PostSummary; wide?: boolean }) {
  return (
    <LiftLink href={post.href} className={cx("card card--flush post-card", styles.flush, wide && styles.wide)}>
      <div className="post-card__cover" aria-hidden="true">
        <span>{post.cover}</span>
      </div>
      <div className={cx("post-card__body", styles.cardBody)}>
        <p className="post-card__meta">
          {post.category} · <time dateTime={post.date}>{post.dateLabel}</time>
        </p>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <p className={styles.cardTime}>{post.minutes} min de leitura</p>
      </div>
    </LiftLink>
  );
}
