"use client";

import Link from "next/link";
import { useRef } from "react";
import { origemDe, PERGUNTAS, quandoCurto, SERVICO_ROTULO, STATUS } from "@/content/admin-demo";
import { useInView, useMounted, useTimeline } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { sp } from "@/motion/lib/timing";
import type { LeadPainel } from "./store";
import s from "./ui.module.css";

export type Coluna = "lead" | "servico" | "origem" | "compat" | "status" | "quando";
export type Ordem = { by: "quando" | "compat"; dir: "asc" | "desc" };

const TITULO: Record<Coluna, string> = {
  lead: "Lead",
  servico: "Serviço",
  origem: "Origem",
  compat: "Compatibilidade",
  status: "Status",
  quando: "Recebido",
};

/** Compatibilidade como barra (.score). `p` vai de 0 a 1 e faz a barra crescer com a mola. */
export function Score({ n, p = 1 }: { n: number; p?: number }) {
  return (
    <span className="score">
      <b>{n}</b>
      <i aria-hidden="true">
        <span style={{ width: `${(n * Math.min(1, Math.max(0, p))).toFixed(2)}%` }} />
      </i>
    </span>
  );
}

export const statusClass = (st: keyof typeof STATUS) => `status status--${st}`;

function SortButton({ col, ordem, onSort }: { col: "quando" | "compat"; ordem: Ordem; onSort: (o: Ordem) => void }) {
  const ativo = ordem.by === col;
  const prox: Ordem = { by: col, dir: ativo && ordem.dir === "desc" ? "asc" : "desc" };
  return (
    <button type="button" className={s.sortBtn} onClick={() => onSort(prox)}>
      {TITULO[col]}
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" style={{ opacity: ativo ? 1 : 0.35, transform: ativo && ordem.dir === "asc" ? "rotate(180deg)" : undefined }}>
        <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

type Props = {
  leads: LeadPainel[];
  cols: Coluna[];
  caption: string;
  ordem?: Ordem;
  onSort?: (o: Ordem) => void;
  /** Card sem padding: tabela encostada nas bordas do card. */
  inCard?: boolean;
};

/** Tabela de leads com rolagem lateral dentro do próprio contêiner (nunca a página). */
export function LeadTable({ leads, cols, caption, ordem, onSort, inCard }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.15 });
  const mounted = useMounted();
  const frame = useTimeline({ play: inView, duration: 120 });

  return (
    <div ref={ref} className={cx(inCard ? s.scroll : "table-wrap", inCard && s.tableInCard, s.sticky)}>
      <table className="table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {cols.map((c) => {
              const sortable = onSort && ordem && (c === "quando" || c === "compat");
              const ariaSort = sortable && ordem.by === c ? (ordem.dir === "asc" ? "ascending" : "descending") : undefined;
              return (
                <th key={c} scope="col" aria-sort={ariaSort}>
                  {sortable ? <SortButton col={c} ordem={ordem} onSort={onSort} /> : TITULO[c]}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {leads.map((l, i) => {
            const p = mounted ? sp(frame, 4 + Math.min(i, 12) * 2, "base") : 1;
            return (
              <tr key={l.id}>
                {cols.map((c) => {
                  switch (c) {
                    case "lead":
                      return (
                        <td key={c}>
                          <span className={s.leadCell}>
                            <Link href={`/admin/leads/${l.id}/`}>{l.nome}</Link>
                            <span>{PERGUNTAS.segmento.opcoes[l.respostas.segmento]}</span>
                          </span>
                        </td>
                      );
                    case "servico":
                      return (
                        <td key={c} className={s.nowrap}>
                          {SERVICO_ROTULO[l.respostas.need]}
                        </td>
                      );
                    case "origem":
                      return (
                        <td key={c} className={s.nowrap}>
                          {origemDe(l.origem.caminho).rotulo}
                        </td>
                      );
                    case "compat":
                      return (
                        <td key={c}>
                          <Score n={l.compat.total} p={p} />
                        </td>
                      );
                    case "status":
                      return (
                        <td key={c}>
                          <span className={statusClass(l.status)}>{STATUS[l.status]}</span>
                        </td>
                      );
                    case "quando":
                      return (
                        <td key={c} className={s.when}>
                          <time dateTime={l.quando.replace(" ", "T")}>{quandoCurto(l.quando)}</time>
                        </td>
                      );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
