"use client";

import { useState } from "react";
import { CONFIG_PADRAO, type Configuracoes } from "@/content/admin-demo";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { horaAgora, PressButton, SaveNotice } from "./controls";
import { CardHead } from "./PageHead";
import { CharCount } from "./SearchPreview";
import c from "./settings.module.css";
import s from "./ui.module.css";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Formatos dos códigos de medição. Vazio vale (quem não usa deixa em branco). */
const FORMATOS = {
  ga4: { re: /^G-[A-Z0-9]{6,12}$/, erro: "O ID do Google Analytics começa com G-, como G-AB12CD34EF." },
  gtm: { re: /^GTM-[A-Z0-9]{5,9}$/, erro: "O ID do Tag Manager começa com GTM-, como GTM-AB12CDE." },
  metaPixel: { re: /^\d{15,16}$/, erro: "O ID do pixel tem 15 ou 16 números." },
} as const;
type Codigo = keyof typeof FORMATOS;

const cnpjMascara = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export function SettingsForm() {
  const [cfg, setCfg] = useState<Configuracoes>(CONFIG_PADRAO);
  const [novo, setNovo] = useState("");
  const [erroNovo, setErroNovo] = useState("");
  const [tocados, setTocados] = useState<Partial<Record<Codigo, boolean>>>({});
  const [aviso, setAviso] = useState<{ text: string | null; stamp: number }>({ text: null, stamp: 0 });

  const empresa = (k: keyof Configuracoes["empresa"], v: string) => setCfg((x) => ({ ...x, empresa: { ...x.empresa, [k]: v } }));
  const analise = (k: Codigo, v: string) => setCfg((x) => ({ ...x, analise: { ...x.analise, [k]: v.trim().toUpperCase() } }));
  const erroCodigo = (k: Codigo) => {
    const v = cfg.analise[k];
    return v && !FORMATOS[k].re.test(v) ? FORMATOS[k].erro : "";
  };

  const adicionar = () => {
    const e = novo.trim().toLowerCase();
    if (!EMAIL_OK.test(e)) return setErroNovo("Digite um e-mail válido, como nome@empresa.com.br.");
    if (cfg.avisos.destinatarios.includes(e)) return setErroNovo("Este e-mail já recebe os avisos.");
    setCfg((x) => ({ ...x, avisos: { destinatarios: [...x.avisos.destinatarios, e] } }));
    setNovo("");
    setErroNovo("");
  };
  const remover = (e: string) => setCfg((x) => ({ ...x, avisos: { destinatarios: x.avisos.destinatarios.filter((y) => y !== e) } }));

  const salvar = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTocados({ ga4: true, gtm: true, metaPixel: true });
    const invalido = (Object.keys(FORMATOS) as Codigo[]).find((k) => erroCodigo(k));
    if (invalido) {
      document.getElementById(`cfg-${invalido}`)?.focus();
      setAviso((v) => ({ text: null, stamp: v.stamp }));
      return;
    }
    // TODO backend: PUT /api/configuracoes. Os destinatários dos avisos ficam só no servidor (e no .env), nunca no HTML do site.
    setAviso((v) => ({ text: `Alterações salvas às ${horaAgora()}. Na demonstração, nada é gravado.`, stamp: v.stamp + 1 }));
  };

  return (
    <form className={c.stack} onSubmit={salvar} noValidate>
      <Reveal as="section" className="card">
        <CardHead title="Dados da empresa" sub="Aparecem na política de privacidade e nos dados que a busca lê. Preencha com os dados reais antes de publicar." />
        <div className={s.fields}>
          <div className="field">
            <label htmlFor="cfg-nome">Nome da empresa</label>
            <input id="cfg-nome" value={cfg.empresa.nome} onChange={(e) => empresa("nome", e.target.value)} autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="cfg-razao">Razão social</label>
            <input id="cfg-razao" value={cfg.empresa.razaoSocial} onChange={(e) => empresa("razaoSocial", e.target.value)} placeholder="Como está no CNPJ" />
          </div>
          <div className="field">
            <label htmlFor="cfg-cnpj">CNPJ</label>
            <input id="cfg-cnpj" value={cfg.empresa.cnpj} onChange={(e) => empresa("cnpj", cnpjMascara(e.target.value))} inputMode="numeric" placeholder="00.000.000/0000-00" />
          </div>
          <div className="field">
            <label htmlFor="cfg-cidade">Cidade e estado</label>
            <input id="cfg-cidade" value={cfg.empresa.cidade} onChange={(e) => empresa("cidade", e.target.value)} placeholder="Cidade, UF" />
          </div>
          <div className={cx("field", s.full)}>
            <label htmlFor="cfg-dominio">Domínio do site</label>
            <input id="cfg-dominio" value={cfg.empresa.dominio} onChange={(e) => empresa("dominio", e.target.value.trim().toLowerCase())} spellCheck={false} />
            <div className={s.hintRow}>
              <span>Usado nos links de compartilhamento e no mapa do site.</span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="card">
        <CardHead title="Aviso de lead novo" sub="Quem recebe um e-mail a cada pedido que chega pelo formulário Começar." />
        {cfg.avisos.destinatarios.length ? (
          <ul className={c.recipients} aria-label="Quem recebe o aviso">
            {cfg.avisos.destinatarios.map((e) => (
              <li key={e} className={c.recipient}>
                <span>{e}</span>
                <button type="button" className={c.remove} onClick={() => remover(e)} aria-label={`Remover ${e}`}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={cx(c.empty, c.recipients)}>Ninguém recebe os avisos. Adicione pelo menos um e-mail.</p>
        )}
        <div className={c.addRow}>
          <div className="field">
            <label htmlFor="cfg-novo" className="visually-hidden">
              E-mail para receber o aviso
            </label>
            <input
              id="cfg-novo"
              type="email"
              value={novo}
              placeholder="nome@empresa.com.br"
              onChange={(e) => setNovo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionar();
                }
              }}
              aria-invalid={Boolean(erroNovo)}
              aria-describedby={erroNovo ? "erro-cfg-novo" : undefined}
            />
            {erroNovo ? (
              <p id="erro-cfg-novo" className={s.fieldError}>
                {erroNovo}
              </p>
            ) : null}
          </div>
          <PressButton type="button" className="btn btn--ghost" onClick={adicionar}>
            Adicionar
          </PressButton>
        </div>
        <p className={c.internal}>Campo interno do painel. Estes endereços nunca aparecem no site.</p>
      </Reveal>

      <Reveal as="section" className="card">
        <CardHead title="Prazo de resposta" sub="A promessa que o cliente lê depois de enviar o pedido. Mude só se a equipe consegue cumprir." />
        <div className={c.promiseGrid}>
          <div className="field">
            <label htmlFor="cfg-prazo">Texto do prazo</label>
            <input id="cfg-prazo" value={cfg.prazoResposta} onChange={(e) => setCfg((x) => ({ ...x, prazoResposta: e.target.value }))} />
            <div className={s.hintRow}>
              <span>Aparece no fim do formulário Começar e no rodapé.</span>
              <CharCount n={cfg.prazoResposta.length} max={60} />
            </div>
          </div>
          <div className={c.promise} aria-label="Prévia do prazo no site">
            <span className="btn btn--primary btn--sm" aria-hidden="true">
              Começar
            </span>
            <p>{cfg.prazoResposta.trim() || "Escreva o prazo de resposta."}</p>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="card">
        <CardHead title="Análise de tráfego" sub="Códigos das ferramentas de medição. Deixe em branco o que você não usa." />
        <div className={s.fields}>
          {(
            [
              ["ga4", "Google Analytics 4", "G-XXXXXXXXXX"],
              ["gtm", "Google Tag Manager", "GTM-XXXXXXX"],
              ["metaPixel", "Pixel da Meta", "Só números"],
            ] as const
          ).map(([k, rotulo, ph]) => {
            const erro = tocados[k] ? erroCodigo(k) : "";
            return (
              <div key={k} className="field">
                <label htmlFor={`cfg-${k}`}>{rotulo}</label>
                <input
                  id={`cfg-${k}`}
                  value={cfg.analise[k]}
                  placeholder={ph}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(e) => analise(k, e.target.value)}
                  onBlur={() => setTocados((t) => ({ ...t, [k]: true }))}
                  aria-invalid={Boolean(erro)}
                  aria-describedby={erro ? `erro-cfg-${k}` : undefined}
                />
                {erro ? (
                  <p id={`erro-cfg-${k}`} className={s.fieldError}>
                    {erro}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className={c.internal}>Com qualquer ferramenta ligada, a política de privacidade precisa citar o nome dela e para que serve.</p>
      </Reveal>

      <div className={c.saveBar}>
        <PressButton type="submit" className="btn btn--primary">
          Salvar alterações
        </PressButton>
        <SaveNotice text={aviso.text} stamp={aviso.stamp} />
      </div>
    </form>
  );
}
