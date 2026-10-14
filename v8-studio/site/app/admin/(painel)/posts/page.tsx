import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/admin/PageHead";
import p from "@/components/admin/posts.module.css";
import s from "@/components/admin/ui.module.css";
import { dataBR, POSTS_ADMIN, quandoCurto } from "@/content/admin-demo";
import { postHref } from "@/content/posts";
import { cx } from "@/motion/lib/cx";
import { PressLink } from "@/motion/Lift";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = { title: "Posts" };

// Os artigos publicados são lidos de content/posts.ts (somente leitura); o rascunho é de exemplo.
// TODO backend: GET /api/posts (publicados e rascunhos), com autor e data da última edição.
export default function PostsPage() {
  const publicados = POSTS_ADMIN.filter((x) => x.status === "publicado").length;
  const rascunhos = POSTS_ADMIN.length - publicados;
  return (
    <>
      <PageHead
        kicker="Blog"
        title="Posts"
        meta={`${publicados} publicados e ${rascunhos === 1 ? "1 rascunho" : `${rascunhos} rascunhos`}.`}
        actions={
          <PressLink href="/admin/posts/editor/" className="btn btn--primary btn--sm">
            Novo post
          </PressLink>
        }
      />
      <Reveal className={cx("table-wrap", s.sticky)}>
        <table className="table">
          <caption className="visually-hidden">Posts do blog</caption>
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Categoria</th>
              <th scope="col">Data</th>
              <th scope="col">Leitura</th>
              <th scope="col">Situação</th>
              <th scope="col">
                <span className="visually-hidden">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {POSTS_ADMIN.map((post) => {
              const editar = `/admin/posts/editor/?slug=${post.slug}`;
              const pub = post.status === "publicado";
              return (
                <tr key={post.slug}>
                  <td>
                    <span className={p.titleCell}>
                      <Link href={editar}>{post.title}</Link>
                      <span>/blog/{post.slug}/</span>
                    </span>
                  </td>
                  <td className={p.muted}>{post.category}</td>
                  <td className={p.muted}>{pub ? dataBR(post.date) : `Editado ${quandoCurto(post.atualizadoEm).toLowerCase()}`}</td>
                  <td className={p.muted}>{post.minutes} min</td>
                  <td>
                    <span className={cx(p.estado, pub ? p.publicado : p.rascunho)}>{pub ? "Publicado" : "Rascunho"}</span>
                  </td>
                  <td>
                    <span className={p.acoes}>
                      <Link href={editar} aria-label={`Editar ${post.title}`}>
                        Editar
                      </Link>
                      {pub ? (
                        <Link href={postHref(post.slug)} aria-label={`Ver ${post.title} no blog`}>
                          Ver no blog
                        </Link>
                      ) : null}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Reveal>
    </>
  );
}
