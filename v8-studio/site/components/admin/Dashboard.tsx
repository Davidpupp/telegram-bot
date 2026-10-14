"use client";

import Link from "next/link";
import { leadsPorOrigem, leadsPorSemana, resumo } from "@/content/admin-demo";
import { cx } from "@/motion/lib/cx";
import { Reveal } from "@/motion/Reveal";
import { CountUp } from "./controls";
import { LeadTable } from "./LeadTable";
import { OriginBars } from "./OriginBars";
import { CardHead } from "./PageHead";
import { useLeads } from "./store";
import { WeeklyChart } from "./WeeklyChart";
import d from "./dashboard.module.css";
import s from "./ui.module.css";

/** "+7 sobre os 30 dias anteriores", "−2 ..." ou "Igual aos 30 dias anteriores". */
const comparado = (agora: number, antes: number) => {
  const dif = agora - antes;
  if (dif === 0) return "Igual aos 30 dias anteriores";
  return `${dif > 0 ? "+" : "−"}${Math.abs(dif)} sobre os 30 dias anteriores`;
};

// TODO backend: GET /api/painel?periodo=30d devolve estes mesmos números (resumo, semanas e origens).
export function Dashboard() {
  const leads = useLeads();
  const r = resumo(leads);
  const semanas = leadsPorSemana(leads);
  const origens = leadsPorOrigem(leads);
  const recentes = leads.slice(0, 6);

  const kpis = [
    { n: r.recebidos, l: "Leads recebidos", nota: comparado(r.recebidos, r.recebidosAntes) },
    { n: r.compatMedia, l: "Compatibilidade média", nota: comparado(r.compatMedia, r.compatMediaAntes) },
    { n: r.emNegociacao, l: "Em negociação", nota: `${r.propostas} com proposta enviada, à espera de resposta` },
    { n: r.fechados, l: "Projetos fechados", nota: comparado(r.fechados, r.fechadosAntes) },
  ];

  return (
    <>
      <Reveal className={cx("kpis", d.kpis)}>
        {kpis.map((k, i) => (
          <div key={k.l} className="card kpi">
            <div className="stat__n">
              <CountUp value={k.n} delay={i * 6} />
            </div>
            <div className="stat__l">{k.l}</div>
            <p className={d.kpiNote}>{k.nota}</p>
          </div>
        ))}
      </Reveal>

      <div className={d.grid}>
        <Reveal as="section" className={cx("card", d.chartCard)} delay={6}>
          <CardHead title="Leads por semana" sub="Últimas 9 semanas. A semana atual vai até hoje." />
          <WeeklyChart semanas={semanas} />
        </Reveal>
        <Reveal as="section" className="card" delay={10}>
          <CardHead title="Origem dos leads" sub={`Onde começaram os ${r.recebidos} pedidos dos últimos 30 dias. Toque numa linha para ver a lista.`} />
          <OriginBars rows={origens} />
        </Reveal>
      </div>

      <Reveal as="section" className={s.panel}>
        <div className={s.panelHead}>
          <CardHead
            title="Leads recentes"
            sub="Os seis pedidos mais novos do formulário Começar."
            action={
              <Link href="/admin/leads/" className={s.link}>
                Ver todos os leads
              </Link>
            }
          />
        </div>
        <LeadTable leads={recentes} cols={["lead", "servico", "compat", "status", "quando"]} caption="Leads recentes" inCard />
      </Reveal>
    </>
  );
}
