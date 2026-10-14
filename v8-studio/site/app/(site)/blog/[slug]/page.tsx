import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCover } from "@/components/blog/ArticleCover";
import styles from "@/components/blog/article.module.css";
import { CtaBand } from "@/components/blog/CtaBand";
import { PostCard } from "@/components/blog/PostCard";
import { Toc, type TocItem } from "@/components/blog/Toc";
import { Markdown, slugify } from "@/components/Markdown";
import { formatDate, getPost, postHref, POSTS, relatedPosts, summarize, type Post } from "@/content/posts";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/content/site";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";

// Só existem os artigos de content/posts.ts; qualquer outro endereço cai na página 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = absoluteUrl(postHref(post.slug));
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      locale: "pt_BR",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      section: post.category,
    },
    twitter: { card: "summary", title: post.title, description: post.excerpt },
  };
}

/** Títulos de seção (##) do texto, com o mesmo id que o <Markdown> gera para cada um. */
const sectionsOf = (body: string): TocItem[] =>
  body
    .split("\n")
    .map((line) => /^##\s+(.*)$/.exec(line.trimEnd()))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ id: slugify(m[1]), label: m[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|\*|`/g, "") }));

/** Dados estruturados do artigo (schema.org BlogPosting). */
function articleJsonLd(post: Post, url: string) {
  const team = post.author.startsWith("Equipe");
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    articleSection: post.category,
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${post.minutes}M`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: team ? { "@type": "Organization", name: SITE_NAME, url: SITE_URL } : { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "Blog", name: `Blog da ${SITE_NAME}`, url: absoluteUrl("/blog/") },
  };
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = absoluteUrl(postHref(post.slug));
  const sections = sectionsOf(post.body);
  const related = relatedPosts(post.slug, 2).map(summarize);
  const start = post.service ? `/comecar/?servico=${post.service}` : "/comecar/";

  return (
    <>
      <article aria-labelledby="artigo-titulo">
        {/* 1 · Topo: trilha, título, resumo e dados do artigo (branco) */}
        <header className={cx("container", styles.head)}>
          <nav aria-label="Você está em">
            <Reveal as="p" className={cx("kicker", styles.crumbs)}>
              <Link href="/blog/">Blog</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/blog/?categoria=${slugify(post.category)}`}>{post.category}</Link>
            </Reveal>
          </nav>
          <KineticText as="h1" id="artigo-titulo" className={styles.title} text={post.title} delay={4} />
          <Reveal as="p" className={cx("lead muted", styles.excerpt)} delay={16}>
            {post.excerpt}
          </Reveal>
          <Reveal as="p" className={styles.meta} delay={22}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min de leitura</span>
            <span aria-hidden="true">·</span>
            <span>{post.author}</span>
          </Reveal>
        </header>

        {/* 2 · Capa tipográfica */}
        <div className="container">
          <ArticleCover text={post.cover} />
        </div>

        {/* 3 · Texto, com o sumário fixo ao lado no computador */}
        <div className={cx("container", styles.layout)}>
          <aside className={styles.aside} aria-label="Sumário e ajuda">
            <div className={styles.asideSticky}>
              <Toc items={sections} />
              <div className={cx("card", styles.help)}>
                <p className={styles.helpTitle}>Quer ajuda para colocar isso em prática?</p>
                <p className={styles.helpText}>Conte o que você precisa em 2 minutos. A proposta chega em até 1 dia útil.</p>
                <PressLink href={start} className="btn btn--primary btn--sm">
                  Começar
                </PressLink>
              </div>
            </div>
          </aside>
          <div className={styles.main}>
            <Markdown className={cx("prose", styles.prose)} source={post.body} />
          </div>
        </div>
      </article>

      {/* 4 · Leia também (branco) */}
      <section className={cx("section", styles.more)} aria-labelledby="leia-title">
        <div className="container">
          <div className={styles.moreInner}>
            <div className="section-head section-head--split">
              <div className="stack">
                <p className="kicker">Continue lendo</p>
                <KineticText id="leia-title" text="Leia também." />
              </div>
              <Reveal style={{ justifySelf: "start" }}>
                <Link href="/blog/" className="btn btn--ghost">
                  Ver todos os artigos
                </Link>
              </Reveal>
            </div>
            <div className={styles.related}>
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 6}>
                  <PostCard post={p} wide />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Chamada final (azul, sobe de baixo) */}
      <CtaBand id="artigo-cta" title="Pronto para colocar em prática?" href={start} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post, url)).replace(/</g, "\\u003c") }} />
    </>
  );
}
