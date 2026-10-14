"use client";

import { useState, useSyncExternalStore } from "react";
import { slugify } from "@/components/Markdown";
import type { PostSummary } from "@/content/posts";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import styles from "./blog.module.css";
import { CategoryFilter } from "./CategoryFilter";
import { FeaturedPost } from "./FeaturedPost";
import { PostCard } from "./PostCard";

const ALL = "Todos";

// A categoria pode vir no endereço (/blog/?categoria=estrategia), por exemplo do topo de um artigo.
const noopSubscribe = () => () => {};
const readSearch = () => window.location.search;

/**
 * Quantos cards da grade ocupam meia linha. As linhas descem em tamanho: o destaque inteiro,
 * depois pares e por fim trios (5 artigos = 2 + 3; 4 = 2 + 2; 7 = 2 + 2 + 3).
 */
const wideCount = (n: number) => (n % 3 === 2 ? 2 : n % 3 === 1 ? Math.min(n, 4) : 0);

/** Listagem do blog: filtro por categoria, o artigo mais novo em destaque e os demais em cards. */
export function BlogIndex({ posts, categories }: { posts: PostSummary[]; categories: string[] }) {
  const search = useSyncExternalStore(noopSubscribe, readSearch, () => "");
  const fromUrl = categories.find((c) => slugify(c) === new URLSearchParams(search).get("categoria"));
  const [picked, setPicked] = useState<string | null>(null);
  const cat = picked ?? fromUrl ?? ALL;

  const list = cat === ALL ? posts : posts.filter((p) => p.category === cat);
  const [first, ...rest] = list;
  const wide = wideCount(rest.length);
  const count = `${list.length} ${list.length === 1 ? "artigo" : "artigos"}${cat === ALL ? "" : ` em ${cat}`}`;

  const choose = (c: string) => {
    setPicked(c);
    try {
      const url = new URL(window.location.href);
      if (c === ALL) url.searchParams.delete("categoria");
      else url.searchParams.set("categoria", slugify(c));
      window.history.replaceState(window.history.state, "", url);
    } catch {}
  };

  return (
    <>
      <Reveal className={styles.filterRow} delay={24}>
        <CategoryFilter options={[ALL, ...categories]} value={cat} onChange={choose} />
        <p className={styles.count} aria-live="polite">
          {count}
        </p>
      </Reveal>

      {/* A chave troca com a categoria: os cards saem e entram de novo com a mola suave. */}
      <div key={cat} className={styles.list}>
        {first ? (
          <Reveal y={36}>
            <FeaturedPost post={first} />
          </Reveal>
        ) : null}
        {rest.length ? (
          <div className={styles.cards}>
            {rest.map((p, i) => {
              const isWide = i < wide;
              const tabletFull = rest.length % 2 === 1 && i === rest.length - 1;
              return (
                <Reveal key={p.slug} className={cx(isWide && styles.cellWide, tabletFull && styles.cellTabletFull)} delay={(i % 3) * 5}>
                  <PostCard post={p} wide={isWide} />
                </Reveal>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}
