"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/components/Markdown";
import {
  DEMOS,
  LANDING_PAGES,
  leadsDaPagina,
  porcentagem,
  quandoCurto,
  SECOES_PADRAO,
  SITE_DOMINIO,
  type LandingPage,
} from "@/content/admin-demo";
import { SERVICES } from "@/content/services";
import type { CompId } from "@/motion/compositions/registry";
import { cx } from "@/motion/lib/cx";
import { MotionPlayer } from "@/motion/MotionPlayer";
import { Reveal } from "@/motion/Reveal";
import { horaAgora, PressButton, SaveNotice } from "./controls";
import { CardHead, PageHead } from "./PageHead";
import { CharCount, SearchPreview } from "./SearchPreview";
import { faixasAzuisSeguidas, SectionList, type SecaoLp } from "./SectionList";
import { Segmented } from "./Segmented";
import e from "./editor.module.css";
import l from "./landing.module.css";
import s from "./ui.module.css";

type Estado = "publicada" | "rascunho";
const SLUG_OK = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Abre a landing page de ?slug=; sem slug, começa uma página de campanha nova. */
export function LandingEditorFromQuery() {
  const slug = useSearchParams().get("slug");
  const lp = slug ? LANDING_PAGES.find((x) => x.slug === slug) : undefined;
  return <LandingEditor key={lp?.slug ?? "nova"} lp={lp} />;
}

export function LandingEditor({ lp }: { lp?: LandingPage }) {
  const servicoFixo = lp?.tipo === "servico";
  const [nome, setNome] = useState(lp?.nome ?? "");
  const [slug, setSlug] = useState(lp?.slug ?? "");
  const [slugAuto, setSlugAuto] = useState(!lp);
  const [servico, setServico] = useState(lp?.servico ?? SERVICES[0].slug);
  const [titulo, setTitulo] = useState(lp?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(lp?.subtitulo ?? "");
  const [demo, setDemo] = useState<CompId>(lp?.demo ?? "demo-landing");
  const [secoes, setSecoes] = useState<SecaoLp[]>(lp?.secoes ?? SECOES_PADRAO);
  const [seoTitulo, setSeoTitulo] = useState(lp?.seo.titulo ?? "");
  const [seoDesc, setSeoDesc] = useState(lp?.seo.descricao ?? "");
  const [status, setStatus] = useState<Estado>(lp?.status ?? "rascunho");
  const [erros, setErros] = useState<{ nome?: string; slug?: string; titulo?: string }>({});
  const [aviso, setAviso] = useState<{ text: string | null; stamp: number }>({ text: null, stamp: 0 });

  const slugFinal = servicoFixo ? lp!.slug : slugAuto ? slugify(nome) : slug;
  const caminho = servicoFixo ? lp!.caminho : `/lp/${slugFinal || "endereco"}/`;
  const demoInfo = DEMOS.find((d) => d.id === demo) ?? DEMOS[0];
  const leads = lp ? leadsDaPagina(lp) : 0;
  const ligadas = secoes.filter((x) => x.ligada).length;

  const salvar = () => {
    const novos: typeof erros = {};
    if (!servicoFixo) {
      if (!nome.trim()) novos.nome = "Dê um nome para a campanha.";
      if (!SLUG_OK.test(slugFinal)) novos.slug = "Use só letras minúsculas, números e hífens, como dentistas.";
      else if (LANDING_PAGES.some((x) => x.slug === slugFinal && x.slug !== lp?.slug)) novos.slug = "Já existe uma landing page com este endereço.";
    }
    if (!titulo.trim()) novos.titulo = "Escreva a frase principal do topo.";
    setErros(novos);
    const primeiro = novos.nome ? "lp-nome" : novos.slug ? "lp-slug" : novos.titulo ? "lp-titulo" : null;
    if (primeiro) {
      document.getElementById(primeiro)?.focus();
      setAviso((v) => ({ text: null, stamp: v.stamp }));
      return;
    }
    // TODO backend: POST /api/landing-pages (nova) ou PUT /api/landing-pages/:slug; publicar gera a página e revalida o LP Hub.
    const h = horaAgora();
    const azul = faixasAzuisSeguidas(secoes).length ? " Atenção às faixas azuis seguidas." : "";
    setAviso((v) => ({ text: `${status === "publicada" ? "Publicada" : "Rascunho salvo"} às ${h}. Na demonstração, nada é gravado.${azul}`, stamp: v.stamp + 1 }));
  };

  const meta = lp
    ? lp.status === "publicada"
      ? `${lp.visitas} visitas e ${leads === 1 ? "1 lead" : `${leads} leads`} nos últimos 30 dias · conversão de ${porcentagem(leads, lp.visitas)}`
      : `Rascunho atualizado ${quandoCurto(lp.atualizadaEm).toLowerCase()}. Ainda não recebe visitas.`
    : "Uma página de campanha para um público ou um anúncio, montada com as seções prontas.";

  return (
    <>
      <PageHead
        kicker="LP Hub"
        title={lp ? `Editar ${lp.tipo === "campanha" ? `campanha ${lp.nome}` : lp.nome}` : "Nova landing page"}
        meta={meta}
        actions={
          <div className={e.headActions}>
            <SaveNotice text={aviso.text} stamp={aviso.stamp} />
            <Segmented
              name="lp-status"
              legend="Situação da landing page"
              options={[
                { value: "rascunho", label: "Rascunho" },
                { value: "publicada", label: "Publicada" },
              ]}
              value={status}
              onChange={setStatus}
            />
            <PressButton type="button" className="btn btn--primary btn--sm" onClick={salvar}>
              {status === "publicada" ? "Publicar" : "Salvar rascunho"}
            </PressButton>
          </div>
        }
      />

      <div className={l.layout}>
        <div className={l.formCol}>
          <Reveal as="section" className={cx("card", l.oEndereco)}>
            <CardHead
              title="Endereço e serviço"
              sub={servicoFixo ? "Página fixa do site, uma por serviço." : "Campanhas ficam em /lp/ e podem ser criadas sem mexer no código."}
              action={
                lp?.status === "publicada" ? (
                  <Link href={caminho} className={s.link}>
                    Ver página
                  </Link>
                ) : null
              }
            />
            <div className={s.fields}>
              {servicoFixo ? (
                <div className={cx("field", s.full)}>
                  <span className={s.prefixLabel}>Endereço</span>
                  <p className={l.fixed}>
                    {SITE_DOMINIO}
                    {caminho}
                  </p>
                </div>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="lp-nome">Nome da campanha</label>
                    <input
                      id="lp-nome"
                      value={nome}
                      onChange={(ev) => setNome(ev.target.value)}
                      placeholder="Por exemplo: Dentistas"
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={erros.nome ? "erro-lp-nome" : undefined}
                    />
                    {erros.nome ? (
                      <p id="erro-lp-nome" className={s.fieldError}>
                        {erros.nome}
                      </p>
                    ) : null}
                  </div>
                  <div className="field">
                    <label htmlFor="lp-slug">Endereço</label>
                    <div className={s.prefix}>
                      <span>/lp/</span>
                      <input
                        id="lp-slug"
                        value={slugFinal}
                        onChange={(ev) => {
                          setSlug(ev.target.value.toLowerCase().replace(/\s+/g, "-"));
                          setSlugAuto(false);
                        }}
                        spellCheck={false}
                        autoComplete="off"
                        aria-invalid={Boolean(erros.slug)}
                        aria-describedby={erros.slug ? "erro-lp-slug" : undefined}
                      />
                    </div>
                    {erros.slug ? (
                      <p id="erro-lp-slug" className={s.fieldError}>
                        {erros.slug}
                      </p>
                    ) : (
                      <div className={s.hintRow}>
                        {slugAuto ? (
                          <span>Automático, a partir do nome.</span>
                        ) : (
                          <button type="button" className={s.textBtn} onClick={() => setSlugAuto(true)}>
                            Gerar de novo pelo nome
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className={cx("field", s.full)}>
                <label htmlFor="lp-servico">Serviço</label>
                <select id="lp-servico" value={servico} onChange={(ev) => setServico(ev.target.value)} disabled={servicoFixo}>
                  {SERVICES.map((sv) => (
                    <option key={sv.slug} value={sv.slug}>
                      {sv.name}
                    </option>
                  ))}
                </select>
                <p className={l.note}>
                  O botão Começar desta página abre <code>/comecar/?servico={servico}</code>, com o serviço já escolhido.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className={cx("card", l.oTopo)}>
            <CardHead title="Topo" sub="A primeira coisa que a visita lê. Frases curtas, com o que você faz e para quem." />
            <div className={s.fields}>
              <div className={cx("field", s.full)}>
                <label htmlFor="lp-titulo">Título</label>
                <input
                  id="lp-titulo"
                  value={titulo}
                  onChange={(ev) => setTitulo(ev.target.value)}
                  placeholder="Mais pacientes pedindo avaliação pela internet."
                  aria-invalid={Boolean(erros.titulo)}
                  aria-describedby={erros.titulo ? "erro-lp-titulo" : "dica-lp-titulo"}
                />
                {erros.titulo ? (
                  <p id="erro-lp-titulo" className={s.fieldError}>
                    {erros.titulo}
                  </p>
                ) : null}
                <div id="dica-lp-titulo" className={s.hintRow}>
                  <span>Entra palavra por palavra, como no resto do site.</span>
                  <CharCount n={titulo.length} max={60} />
                </div>
              </div>
              <div className={cx("field", s.full)}>
                <label htmlFor="lp-subtitulo">Subtítulo</label>
                <textarea id="lp-subtitulo" value={subtitulo} onChange={(ev) => setSubtitulo(ev.target.value)} rows={3} placeholder="Uma frase que explica o que vem no projeto." />
                <div className={s.hintRow}>
                  <span>Aparece logo abaixo do título.</span>
                  <CharCount n={subtitulo.length} max={160} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className={cx("card", l.oDemo)}>
            <CardHead title="Demo em movimento" sub="A animação que aparece no topo. A prévia ao lado toca a escolhida." />
            <fieldset className={l.demos}>
              <legend className="visually-hidden">Demo em movimento</legend>
              {DEMOS.map((d) => (
                <label key={d.id} className={l.demo}>
                  <input type="radio" name="lp-demo" value={d.id} checked={demo === d.id} onChange={() => setDemo(d.id)} />
                  <strong>{d.nome}</strong>
                  <span>{d.descricao}</span>
                </label>
              ))}
            </fieldset>
          </Reveal>

          <Reveal as="section" className={cx("card", l.oSecoes)}>
            <CardHead title="Seções" sub={`${ligadas} de ${secoes.length} seções ligadas. Use as setas para mudar a ordem.`} />
            <SectionList secoes={secoes} onChange={setSecoes} />
          </Reveal>

          <Reveal as="section" className={cx("card", l.oSeo)}>
            <CardHead title="SEO" sub="Título e descrição desta página na busca e no compartilhamento." />
            <div className={e.seoFields}>
              <div className="field">
                <label htmlFor="lp-seo-titulo">Título de SEO</label>
                <input id="lp-seo-titulo" value={seoTitulo} onChange={(ev) => setSeoTitulo(ev.target.value)} placeholder="Landing page para dentistas · V8 Studio" />
                <div className={s.hintRow}>
                  <span>Aparece na aba do navegador e na busca.</span>
                  <CharCount n={seoTitulo.length} max={60} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="lp-seo-desc">Descrição de SEO</label>
                <textarea id="lp-seo-desc" value={seoDesc} onChange={(ev) => setSeoDesc(ev.target.value)} rows={3} placeholder="Um resumo de uma ou duas frases que convide a clicar." />
                <div className={s.hintRow}>
                  <span>Resumo exibido no resultado de busca.</span>
                  <CharCount n={seoDesc.length} max={160} />
                </div>
              </div>
              <SearchPreview title={seoTitulo} description={seoDesc} path={caminho} />
            </div>
          </Reveal>
        </div>

        <div className={l.previewCol}>
          <Reveal className={l.oPrevia} delay={6}>
            <div className={cx("browser", l.browser)}>
              <div className="browser__bar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span className="browser__url">
                  {SITE_DOMINIO}
                  {caminho}
                </span>
              </div>
              <div className="browser__body">
                <div className={l.hero}>
                  <p className={l.heroTitle}>{titulo.trim() || "O título do topo aparece aqui"}</p>
                  <p className={l.heroSub}>{subtitulo.trim() || "O subtítulo aparece logo abaixo."}</p>
                  <span className={l.heroBtn} aria-hidden="true">
                    Começar
                  </span>
                  <span className={l.heroNote}>Leva 2 minutos. Sem compromisso.</span>
                </div>
                <div className={l.player}>
                  <MotionPlayer id={demo} label={`Prévia da demo: ${demoInfo.descricao}`} restartKey={demo} />
                </div>
              </div>
            </div>
            <p className={l.previewCaption} style={{ marginTop: 14 }}>
              Prévia do topo · demo {demoInfo.nome.toLowerCase()}
            </p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
