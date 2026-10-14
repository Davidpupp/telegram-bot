import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import styles from "@/components/blog/blog.module.css";
import { CtaBand } from "@/components/blog/CtaBand";
import { CATEGORIES, POSTS, summarize } from "@/content/posts";
import { absoluteUrl, SITE_NAME } from "@/content/site";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";

const DESCRIPTION =
  "Artigos práticos sobre sites, landing pages, lojas virtuais e busca no Google, para quem tem um pequeno ou médio negócio e quer vender mais pela internet.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/blog/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog/"),
    title: `Blog · ${SITE_NAME}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    locale: "pt_BR",
  },
};

export default function BlogPage() {
  return (
    <>
      {/* 1 · Título, filtro e artigos (branco) */}
      <section className={cx("container", styles.hero)} aria-labelledby="blog-title">
        <div className="section-head section-head--split">
          <div className="stack">
            <p className="kicker">Blog</p>
            <KineticText as="h1" id="blog-title" text="Ideias para vender mais pela internet." delay={4} />
          </div>
          <Reveal as="p" className="lead muted" delay={16}>
            Artigos curtos e práticos sobre sites, lojas virtuais e busca, escritos para quem toca um negócio e não tem tempo a perder.
          </Reveal>
        </div>
        <h2 className="visually-hidden">Artigos</h2>
        <BlogIndex posts={POSTS.map(summarize)} categories={CATEGORIES} />
      </section>

      {/* 2 · Chamada final (azul, sobe de baixo) */}
      <CtaBand id="blog-cta" title="Prefere que a gente faça por você?" />
    </>
  );
}
