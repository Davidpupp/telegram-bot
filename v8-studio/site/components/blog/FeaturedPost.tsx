import type { PostSummary } from "@/content/posts";
import { LiftLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import styles from "./blog.module.css";

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h13M11 5l5 5-5 5" />
  </svg>
);

/** Artigo em destaque: o card grande do topo da listagem, com a capa tipográfica ao lado do texto. */
export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <LiftLink href={post.href} className={cx("card card--flush", styles.flush, styles.featured)} amount={6}>
      <div className={styles.featuredCover} aria-hidden="true">
        <span>{post.cover}</span>
      </div>
      <div className={styles.featuredBody}>
        <div className={styles.featuredText}>
          <p className={styles.meta}>
            {post.category} · <time dateTime={post.date}>{post.dateLabel}</time>
          </p>
          <h3 className={styles.featuredTitle}>{post.title}</h3>
          <p className={styles.featuredExcerpt}>{post.excerpt}</p>
        </div>
        <div className={styles.featuredFoot}>
          <span className={styles.featuredTime}>{post.minutes} min de leitura</span>
          <span className={styles.featuredGo}>
            Ler o artigo
            <span className={styles.arrow} aria-hidden="true">
              <ArrowIcon />
            </span>
          </span>
        </div>
      </div>
    </LiftLink>
  );
}
