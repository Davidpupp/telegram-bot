"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AUTOR_EQUIPE, LEADS, type Evento, type Lead, type LeadStatus } from "@/content/admin-demo";

// Estado da demonstração: status e notas que a equipe muda no painel valem enquanto a aba estiver aberta
// (a navegação entre as telas do painel não recarrega a página). Nada sai do navegador.
// TODO backend: trocar por PATCH /api/leads/:id (status) e POST /api/leads/:id/notas, e revalidar a lista.

export type EventoPainel = Evento & { novo?: boolean };
export type LeadPainel = Omit<Lead, "eventos"> & { eventos: EventoPainel[] };
type Mudancas = Record<string, { status?: LeadStatus; eventos: EventoPainel[] }>;

let estado: Mudancas = {};
const VAZIO: Mudancas = {};
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());
const assinar = (f: () => void) => {
  ouvintes.add(f);
  return () => {
    ouvintes.delete(f);
  };
};

/** "AAAA-MM-DD HH:MM" no horário de quem está usando o painel. Chamada só em eventos. */
export function agoraLocal() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function registrar(id: string, ev: EventoPainel, status?: LeadStatus) {
  const atual = estado[id] ?? { eventos: [] };
  estado = { ...estado, [id]: { status: status ?? atual.status, eventos: [...atual.eventos, ev] } };
  avisar();
}

export function mudarStatus(lead: LeadPainel, status: LeadStatus) {
  if (lead.status === status) return;
  registrar(lead.id, { tipo: "status", em: agoraLocal(), status, de: lead.status, novo: true }, status);
}

export function adicionarNota(id: string, texto: string) {
  registrar(id, { tipo: "nota", em: agoraLocal(), texto, autor: AUTOR_EQUIPE, novo: true });
}

function aplicar(l: Lead, m?: Mudancas[string]): LeadPainel {
  if (!m) return l;
  return { ...l, status: m.status ?? l.status, eventos: [...l.eventos, ...m.eventos] };
}

function useMudancas() {
  return useSyncExternalStore(
    assinar,
    () => estado,
    () => VAZIO,
  );
}

/** Todos os leads com as mudanças feitas nesta aba. */
export function useLeads(): LeadPainel[] {
  const m = useMudancas();
  return useMemo(() => LEADS.map((l) => aplicar(l, m[l.id])), [m]);
}

/** Um lead com as mudanças feitas nesta aba. */
export function useLead(base: Lead): LeadPainel {
  const m = useMudancas();
  return useMemo(() => aplicar(base, m[base.id]), [base, m]);
}
