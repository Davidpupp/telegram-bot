"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Markdown, readingMinutes, slugify } from "@/components/Markdown";
import { CATEGORIAS, dataBR, DEMO_HOJE, POSTS_ADMIN, postAdminPorSlug, quandoCurto, type PostAdmin } from "@/content/admin-demo";
import { formatDate } from "@/content/posts";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { horaAgora, PressButton, SaveNotice } from "./controls";
import { CardHead, PageHead } from "./PageHead";
import { CharCount, SearchPreview } from "./SearchPreview";
import { Segmented } from "./Segmented";
import e from "./editor.module.css";
import s from "./ui.module.css";

type Estado = "rascunho" | "publicado";
const SUFIXO = " · V8 Studio";
const SLUG_OK = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Abre o post de ?slug= (publicado ou rascunho); sem slug, começa um post novo. */
export function PostEditorFromQuery() {
  const slug = useSearchParams().get("slug");
  const post = slug ? postAdminPorSlug(slug) : undefined;
  return <PostEditor key={post?.slug ?? "novo"} post={post} />;
}

export function PostEditor({ post }: { post?: PostAdmin }) {
  const [titulo, setTitulo] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugAuto, setSlugAuto] = useState(!post);
  const [status, setStatus] = useState<Estado>(post?.status ?? "rascunho");
  const [categoria, setCategoria] = useState(post?.category ?? CATEGORIAS[0]);
  const [resumo, setResumo] = useState(post?.excerpt ?? "");
  const [capa, setCapa] = useState(post?.cover ?? "");
  const [data, setData] = useState(post?.date ?? DEMO_HOJE);
  const [autor, setAutor] = useState(post?.author ?? "Equipe V8 Studio");
  const [corpo, setCorpo] = useState(post?.body ?? "");
  const [seoTitulo, setSeoTitulo] = useState(post?.seoTitulo ?? "");
  const [seoTituloAuto, setSeoTituloAuto] = useState(!post?.seoTitulo);
  const [seoDesc, setSeoDesc] = useState(post?.seoDescricao ?? "");
  const [seoDescAuto, setSeoDescAuto] = useState(!post?.seoDescricao);
  const [erros, setErros] = useState<{ titulo?: string; slug?: string }>({});
  const [aviso, setAviso] = useState<{ text: string | null; stamp: number }>({ text: null, stamp: 0 });

  // Endereço, título e descrição de SEO seguem o título e o resumo até a pessoa editar à mão.
  const slugFinal = slugAuto ? slugify(titulo) : slug;
  const seoTituloFinal = seoTituloAuto ? (titulo.trim() ? `${titulo.trim()}${SUFIXO}` : "") : seoTitulo;
  const seoDescFinal = seoDescAuto ? resumo : seoDesc;
  const palavras = corpo.split(/\s+/).filter(Boolean).length;

  const salvar = () => {
    const novos: typeof erros = {};
    if (!titulo.trim()) novos.titulo = "Escreva um título para salvar.";
    if (!SLUG_OK.test(slugFinal)) novos.slug = "Use só letras minúsculas, números e hífens, como quanto-custa-um-site.";
    else if (POSTS_ADMIN.some((p) => p.slug === slugFinal && p.slug !== post?.slug)) novos.slug = "Já existe um post com este endereço.";
    setErros(novos);
    if (novos.titulo || novos.slug) {
      document.getElementById(novos.titulo ? "post-titulo" : "post-slug")?.focus();
      setAviso((v) => ({ text: null, stamp: v.stamp }));
      return;
    }
    // TODO backend: POST /api/posts (novo) ou PUT /api/posts/:slug com todos os campos; publicar revalida /blog/.
    const h = horaAgora();
    setAviso((v) => ({ text: `${status === "publicado" ? "Publicado" : "Rascunho salvo"} às ${h}. Na demonstração, nada é gravado.`, stamp: v.stamp + 1 }));
  };

  const meta = post
    ? post.status === "publicado"
      ? `Publicado em ${dataBR(post.date)} · /blog/${post.slug}/`
      : `Rascunho atualizado ${quandoCurto(post.atualizadoEm).toLowerCase()}`
    : "Comece pelo título. O endereço e o título de busca saem dele.";

  return (
    <>
      <PageHead
        kicker="Posts do blog"
        title={post ? "Editar post" : "Novo post"}
        meta={meta}
        actions={
          <div className={e.headActions}>
            <SaveNotice text={aviso.text} stamp={aviso.stamp} />
            <Segmented
              name="post-status"
              legend="Situação do post"
              options={[
                { value: "rascunho", label: "Rascunho" },
                { value: "publicado", label: "Publicado" },
              ]}
              value={status}
              onChange={setStatus}
            />
            <PressButton type="button" className="btn btn--primary btn--sm" onClick={salvar}>
              {status === "publicado" ? "Publicar" : "Salvar rascunho"}
            </PressButton>
          </div>
        }
      />

      <div className={e.stack}>
        <Reveal className={cx("card", e.titleCard)}>
          <div className="field">
            <label htmlFor="post-titulo">Título</label>
            <input
              id="post-titulo"
              className={e.titleInput}
              value={titulo}
              onChange={(ev) => setTitulo(ev.target.value)}
              placeholder="Um título claro, com a palavra que o cliente procura"
              aria-invalid={Boolean(erros.titulo)}
              aria-describedby={erros.titulo ? "erro-titulo" : undefined}
            />
            {erros.titulo ? (
              <p id="erro-titulo" className={s.fieldError}>
                {erros.titulo}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="post-slug">Endereço</label>
            <div className={s.prefix}>
              <span>/blog/</span>
              <input
                id="post-slug"
                value={slugFinal}
                onChange={(ev) => {
                  setSlug(ev.target.value.toLowerCase().replace(/\s+/g, "-"));
                  setSlugAuto(false);
                }}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={Boolean(erros.slug)}
                aria-describedby={erros.slug ? "erro-slug" : "dica-slug"}
              />
            </div>
            {erros.slug ? (
              <p id="erro-slug" className={s.fieldError}>
                {erros.slug}
              </p>
            ) : null}
            <div id="dica-slug" className={s.hintRow}>
              {slugAuto ? (
                <span>Automático, a partir do título.</span>
              ) : (
                <button type="button" className={s.textBtn} onClick={() => setSlugAuto(true)}>
                  Gerar de novo pelo título
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <div className={e.editorGrid}>
          <Reveal as="section" className={cx(s.panel, e.pane)}>
            <div className={e.paneHead}>
              <h2 className={s.cardTitle}>Texto</h2>
              <span className={e.paneHint}>Markdown</span>
            </div>
            <label htmlFor="post-corpo" className="visually-hidden">
              Texto do post em Markdown
            </label>
            <textarea
              id="post-corpo"
              className={e.md}
              value={corpo}
              onChange={(ev) => setCorpo(ev.target.value)}
              placeholder={"Escreva aqui. Use ## para os intertítulos.\n\n## Primeiro intertítulo\n\nUm parágrafo curto, em voz ativa."}
            />
            <p className={e.syntax}>
              <code>## Intertítulo</code> <code>### Subtítulo</code> <code>**negrito**</code> <code>*itálico*</code> <code>- lista</code> <code>1. lista</code> <code>&gt; citação</code>{" "}
              <code>[texto](/caminho/)</code>
            </p>
          </Reveal>
          <Reveal as="section" className={cx(s.panel, e.pane)} delay={4}>
            <div className={e.paneHead}>
              <h2 className={s.cardTitle}>Prévia</h2>
              <span className={e.paneHint} aria-live="polite">
                {readingMinutes(corpo)} min de leitura · {palavras === 1 ? "1 palavra" : `${palavras} palavras`}
              </span>
            </div>
            <div className={e.preview} tabIndex={0} aria-label="Prévia do post">
              <p className={e.previewTitle}>{titulo.trim() || "Título do post"}</p>
              {corpo.trim() ? <Markdown source={corpo} className="prose" /> : <p className={e.previewEmpty}>A prévia aparece aqui enquanto você escreve.</p>}
            </div>
          </Reveal>
        </div>

        <div className={e.split}>
          <Reveal as="section" className="card">
            <CardHead title="Publicação" sub="Como o post aparece na lista do blog." />
            <div className={s.fields}>
              <div className={cx("field", s.full)}>
                <label htmlFor="post-resumo">Resumo</label>
                <textarea id="post-resumo" value={resumo} onChange={(ev) => setResumo(ev.target.value)} rows={3} placeholder="Uma ou duas frases sobre o que a pessoa vai aprender." />
                <div className={s.hintRow}>
                  <span>Aparece no card do blog.</span>
                  <CharCount n={resumo.length} max={160} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="post-categoria">Categoria</label>
                <select id="post-categoria" value={categoria} onChange={(ev) => setCategoria(ev.target.value)}>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="post-data">Data de publicação</label>
                <input id="post-data" type="date" value={data} onChange={(ev) => setData(ev.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="post-capa">Frase da capa</label>
                <input id="post-capa" value={capa} onChange={(ev) => setCapa(ev.target.value)} placeholder="Duas ou três palavras" />
                <div className={s.hintRow}>
                  <span>Vira a capa tipográfica.</span>
                  <CharCount n={capa.length} max={24} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="post-autor">Autor</label>
                <input id="post-autor" value={autor} onChange={(ev) => setAutor(ev.target.value)} />
              </div>
            </div>
          </Reveal>
          <Reveal className={e.previewBox} delay={4}>
            <p className={e.previewLabel}>Como aparece no blog</p>
            <div className={cx("post-card", e.blogCard)}>
              <div className="post-card__cover" aria-hidden="true">
                <span>{capa.trim() || "Capa"}</span>
              </div>
              <div className="post-card__body">
                <p className="post-card__meta">
                  {categoria} · {/^\d{4}-\d{2}-\d{2}$/.test(data) ? formatDate(data) : "sem data"}
                </p>
                <h3>{titulo.trim() || "Título do post"}</h3>
                <p>{resumo.trim() || "O resumo aparece aqui."}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal as="section" className="card">
          <CardHead title="SEO" sub="Título e descrição que aparecem na busca e no compartilhamento." />
          <div className={e.seo}>
            <div className={e.seoFields}>
              <div className="field">
                <label htmlFor="post-seo-titulo">Título de SEO</label>
                <input
                  id="post-seo-titulo"
                  value={seoTituloFinal}
                  onChange={(ev) => {
                    setSeoTitulo(ev.target.value);
                    setSeoTituloAuto(false);
                  }}
                />
                <div className={s.hintRow}>
                  {seoTituloAuto ? (
                    <span>Automático: título do post e o nome da V8.</span>
                  ) : (
                    <button type="button" className={s.textBtn} onClick={() => setSeoTituloAuto(true)}>
                      Usar o título do post
                    </button>
                  )}
                  <CharCount n={seoTituloFinal.length} max={60} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="post-seo-desc">Descrição de SEO</label>
                <textarea
                  id="post-seo-desc"
                  value={seoDescFinal}
                  onChange={(ev) => {
                    setSeoDesc(ev.target.value);
                    setSeoDescAuto(false);
                  }}
                  rows={4}
                />
                <div className={s.hintRow}>
                  {seoDescAuto ? (
                    <span>Automático: o resumo do post.</span>
                  ) : (
                    <button type="button" className={s.textBtn} onClick={() => setSeoDescAuto(true)}>
                      Usar o resumo
                    </button>
                  )}
                  <CharCount n={seoDescFinal.length} max={160} />
                </div>
              </div>
            </div>
            <div className={e.previewBox}>
              <p className={e.previewLabel}>Prévia na busca</p>
              <SearchPreview title={seoTituloFinal} description={seoDescFinal} path={`/blog/${slugFinal || "endereco-do-post"}/`} />
              <p className={s.cardSub}>A busca costuma cortar o título depois de uns 60 caracteres e a descrição depois de uns 160.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
