"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  dataBR,
  hora,
  ORDEM_PERGUNTAS,
  ORIGENS,
  origemDe,
  PERGUNTAS,
  resposta,
  SERVICO_ROTULO,
  STATUS,
  STATUS_ORDEM,
  type LeadStatus,
  type Respostas,
} from "@/content/admin-demo";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { PressButton, SaveNotice } from "./controls";
import { LeadTable, type Ordem } from "./LeadTable";
import { agoraLocal, useLeads, type LeadPainel } from "./store";
import l from "./leads.module.css";
import s from "./ui.module.css";

type Filtros = { q: string; status: "" | LeadStatus; servico: "" | Respostas["need"]; origem: string };
const SEM_FILTRO: Filtros = { q: "", status: "", servico: "", origem: "" };
const SERVICOS = Object.keys(SERVICO_ROTULO) as Respostas["need"][];

function lerFiltros(p: URLSearchParams | null): Filtros {
  if (!p) return SEM_FILTRO;
  const status = p.get("status") ?? "";
  const servico = p.get("servico") ?? "";
  const origem = p.get("origem") ?? "";
  return {
    q: p.get("q") ?? "",
    status: (STATUS_ORDEM as string[]).includes(status) ? (status as LeadStatus) : "",
    servico: (SERVICOS as string[]).includes(servico) ? (servico as Respostas["need"]) : "",
    origem: ORIGENS.some((o) => o.chave === origem) ? origem : "",
  };
}

const normal = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** CSV no padrão do Excel em português: ponto e vírgula, BOM UTF-8 e proteção contra fórmulas. */
function gerarCsv(leads: LeadPainel[]) {
  const cab = ["ID", "Recebido em", "Nome", "WhatsApp", "E-mail", ...ORDEM_PERGUNTAS.map((id) => PERGUNTAS[id].rotulo), "Compatibilidade", "Status", "Origem", "Página de origem", "utm_source", "utm_medium", "utm_campaign"];
  const linhas = leads.map((x) => [
    x.id,
    `${dataBR(x.quando)} ${hora(x.quando)}`,
    x.nome,
    x.contato.whatsapp,
    x.contato.email,
    ...ORDEM_PERGUNTAS.map((id) => resposta(id, x.respostas)),
    String(x.compat.total),
    STATUS[x.status],
    origemDe(x.origem.caminho).rotulo,
    x.origem.caminho,
    x.origem.utm?.source ?? "",
    x.origem.utm?.medium ?? "",
    x.origem.utm?.campaign ?? "",
  ]);
  const cel = (v: string) => {
    const seguro = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return /[";\r\n]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
  };
  return "﻿" + [cab, ...linhas].map((r) => r.map(cel).join(";")).join("\r\n");
}

/** Lê os filtros da URL (?status=, ?servico=, ?origem=, ?q=) uma vez, ao abrir a tela. */
export function LeadsBrowserFromQuery() {
  const params = useSearchParams();
  return <LeadsBrowser inicial={lerFiltros(params)} />;
}

export function LeadsBrowser({ inicial = SEM_FILTRO }: { inicial?: Filtros }) {
  const leads = useLeads();
  const [f, setF] = useState<Filtros>(inicial);
  const [ordem, setOrdem] = useState<Ordem>({ by: "quando", dir: "desc" });
  const [aviso, setAviso] = useState<{ text: string | null; stamp: number }>({ text: null, stamp: 0 });

  const q = normal(f.q.trim());
  const filtrados = leads.filter(
    (x) =>
      (!f.status || x.status === f.status) &&
      (!f.servico || x.respostas.need === f.servico) &&
      (!f.origem || origemDe(x.origem.caminho).chave === f.origem) &&
      (!q || normal(`${x.nome} ${x.contato.email} ${PERGUNTAS.segmento.opcoes[x.respostas.segmento]}`).includes(q)),
  );
  const sinal = ordem.dir === "asc" ? 1 : -1;
  const linhas = [...filtrados].sort((a, b) =>
    ordem.by === "compat" ? sinal * (a.compat.total - b.compat.total) || (a.quando < b.quando ? 1 : -1) : sinal * (a.quando < b.quando ? -1 : a.quando > b.quando ? 1 : 0),
  );
  const ativo = Boolean(f.q || f.status || f.servico || f.origem);

  // TODO backend: GET /api/leads?status=&servico=&origem=&q= com paginação; aqui o filtro roda no navegador.
  const atualizar = (p: Partial<Filtros>) => {
    const novo = { ...f, ...p };
    setF(novo);
    const qs = new URLSearchParams();
    (Object.keys(novo) as (keyof Filtros)[]).forEach((k) => {
      if (novo[k]) qs.set(k, novo[k]);
    });
    const str = qs.toString();
    window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname);
  };

  // TODO backend: GET /api/leads/exportar.csv com os mesmos filtros (o servidor gera e registra quem exportou).
  const exportar = () => {
    const blob = new Blob([gerarCsv(linhas)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-v8-studio-${agoraLocal().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setAviso((v) => ({ text: `Arquivo com ${linhas.length === 1 ? "1 lead" : `${linhas.length} leads`} gerado no seu navegador.`, stamp: v.stamp + 1 }));
  };

  const conta = (st: LeadStatus) => leads.filter((x) => x.status === st).length;

  return (
    <>
      <Reveal className={cx("card", l.filtersCard)}>
        <div className={cx("filters", l.filters)} role="search" aria-label="Filtrar leads">
          <div className={cx(l.f, l.busca, f.q && l.on)}>
            <label htmlFor="f-busca">Buscar</label>
            <input id="f-busca" type="search" value={f.q} placeholder="Nome, e-mail ou segmento" onChange={(e) => atualizar({ q: e.target.value })} autoComplete="off" />
          </div>
          <div className={cx(l.f, f.status && l.on)}>
            <label htmlFor="f-status">Status</label>
            <select id="f-status" value={f.status} onChange={(e) => atualizar({ status: e.target.value as Filtros["status"] })}>
              <option value="">Todos</option>
              {STATUS_ORDEM.map((st) => (
                <option key={st} value={st}>
                  {STATUS[st]} ({conta(st)})
                </option>
              ))}
            </select>
          </div>
          <div className={cx(l.f, f.servico && l.on)}>
            <label htmlFor="f-servico">Serviço</label>
            <select id="f-servico" value={f.servico} onChange={(e) => atualizar({ servico: e.target.value as Filtros["servico"] })}>
              <option value="">Todos</option>
              {SERVICOS.map((sv) => (
                <option key={sv} value={sv}>
                  {SERVICO_ROTULO[sv]}
                </option>
              ))}
            </select>
          </div>
          <div className={cx(l.f, f.origem && l.on)}>
            <label htmlFor="f-origem">Origem</label>
            <select id="f-origem" value={f.origem} onChange={(e) => atualizar({ origem: e.target.value })}>
              <option value="">Todas</option>
              {ORIGENS.map((o) => (
                <option key={o.chave} value={o.chave}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>
          {ativo ? (
            <button type="button" className={cx("btn btn--quiet", l.clear)} onClick={() => atualizar(SEM_FILTRO)}>
              Limpar filtros
            </button>
          ) : null}
        </div>
      </Reveal>

      <div className={l.toolbar}>
        <p className={l.count} aria-live="polite">
          {linhas.length === leads.length ? (
            `${leads.length} leads`
          ) : (
            <>
              {linhas.length} <span>de {leads.length} leads</span>
            </>
          )}
        </p>
        <div className={l.tools}>
          <SaveNotice text={aviso.text} stamp={aviso.stamp} />
          <PressButton type="button" className="btn btn--ghost btn--sm" onClick={exportar} disabled={linhas.length === 0}>
            Exportar CSV
          </PressButton>
        </div>
      </div>

      {linhas.length ? (
        <LeadTable leads={linhas} cols={["lead", "servico", "origem", "compat", "status", "quando"]} caption="Leads filtrados" ordem={ordem} onSort={setOrdem} />
      ) : (
        <div className={cx(s.panel, l.empty)}>
          <p>Nenhum lead com esses filtros.</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => atualizar(SEM_FILTRO)}>
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
