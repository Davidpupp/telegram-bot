"use client";

import { useEffect, useRef, useState } from "react";
import { diaMesCurto, type Semana } from "@/content/admin-demo";
import { useInView, useMounted, useSpringTo, useTimeline } from "@/motion/hooks";
import { clamp, sp, SPRINGS } from "@/motion/lib/timing";
import s from "./dashboard.module.css";

const MIN_H = 268;
const PAD = { l: 34, r: 20, t: 34, b: 36 };
const leads = (n: number) => (n === 1 ? "1 lead" : `${n} leads`);
const rotuloSemana = (w: Semana) => (w.parcial ? `Semana atual, desde ${diaMesCurto(w.inicio)}` : `Semana de ${diaMesCurto(w.inicio)} a ${diaMesCurto(w.fim)}`);

/** Ponto da linha: aparece com a mola rápida e cresce um pouco quando a semana está em foco. */
function Ponto({ x, y, show, active, hollow }: { x: number; y: number; show: number; active: boolean; hollow: boolean }) {
  const a = useSpringTo(active ? 1 : 0, SPRINGS.snappy);
  const r = (4 + 2 * a) * clamp(show);
  if (r <= 0.05) return null;
  return <circle cx={x} cy={y} r={r} fill={hollow ? "var(--color-white)" : "var(--color-blue)"} stroke={hollow ? "var(--color-blue)" : "var(--color-white)"} strokeWidth={2} />;
}

/**
 * Leads por semana: linha de 2 px que se desenha com a mola pesada quando entra na tela, pontos que acendem
 * em sequência e rótulo só no pico e na semana atual. Passar o mouse, tocar ou usar as setas mostra cada semana.
 */
export function WeeklyChart({ semanas }: { semanas: Semana[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [{ w, h: H }, setDims] = useState({ w: 640, h: MIN_H });
  const [ativo, setAtivo] = useState<number | null>(null);
  const mounted = useMounted();
  const inView = useInView(wrap, { threshold: 0.35 });
  const frame = useTimeline({ play: inView, duration: 160 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDims({ w: Math.max(260, Math.round(e.contentRect.width)), h: Math.max(MIN_H, Math.round(e.contentRect.height)) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = semanas.length;
  const max = Math.max(1, ...semanas.map((x) => x.total));
  const passo = max <= 4 ? 1 : 2;
  const topo = Math.ceil((max + 1) / passo) * passo;
  const ticks = Array.from({ length: topo / passo + 1 }, (_, i) => i * passo);
  const x = (i: number) => PAD.l + (i * (w - PAD.l - PAD.r)) / Math.max(1, n - 1);
  const y = (v: number) => PAD.t + (1 - v / topo) * (H - PAD.t - PAD.b);
  const linha = semanas.map((sem, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(sem.total).toFixed(1)}`).join(" ");
  const area = `${linha} L${x(n - 1).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;

  const pico = semanas.findIndex((sem) => sem.total === max);
  const rotulados = new Set([pico, n - 1]);
  const draw = mounted ? sp(frame, 8, "heavy") : 1;
  const lavado = mounted ? sp(frame, 30, "soft") : 1;
  const legenda = mounted ? sp(frame, 54, "soft") : 1;
  const estreito = w < 460;

  const mover = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const px = clientX - el.getBoundingClientRect().left;
    const i = Math.round(((px - PAD.l) / (w - PAD.l - PAD.r)) * (n - 1));
    setAtivo(Math.max(0, Math.min(n - 1, i)));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const d = e.key === "ArrowRight" ? 1 : -1;
      setAtivo((a) => Math.max(0, Math.min(n - 1, (a ?? n - 1) + (a === null ? 0 : d))));
    } else if (e.key === "Home") setAtivo(0);
    else if (e.key === "End") setAtivo(n - 1);
    else if (e.key === "Escape") setAtivo(null);
  };

  const sel = ativo === null ? null : semanas[ativo];
  const tipX = ativo === null ? 0 : Math.max(84, Math.min(w - 84, x(ativo)));

  return (
    <div className={s.chartBox}>
      <div
        ref={wrap}
        className={s.chart}
        tabIndex={0}
        role="group"
        aria-label="Gráfico de leads por semana. Use as setas para ver cada semana."
        onPointerMove={(e) => mover(e.clientX)}
        onPointerDown={(e) => mover(e.clientX)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setAtivo(null)}
        onKeyDown={onKey}
        onFocus={() => setAtivo((a) => a ?? n - 1)}
        onBlur={() => setAtivo(null)}
      >
        <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={w - PAD.r} y1={y(t)} y2={y(t)} className={t === 0 ? s.baseline : s.gridline} />
              <text x={PAD.l - 12} y={y(t)} dy="0.32em" textAnchor="end" className={s.tick}>
                {t}
              </text>
            </g>
          ))}
          {semanas.map((sem, i) =>
            estreito && i % 2 === 1 && i !== n - 1 ? null : (
              <text key={sem.inicio} x={x(i)} y={H - 10} textAnchor="middle" className={ativo === i ? s.tickOn : s.tick}>
                {diaMesCurto(sem.inicio)}
              </text>
            ),
          )}
          <path d={area} fill="var(--color-blue)" opacity={(0.1 * clamp(lavado)).toFixed(3)} />
          {ativo !== null ? <line x1={x(ativo)} x2={x(ativo)} y1={PAD.t - 8} y2={y(0)} className={s.cross} /> : null}
          <path
            d={linha}
            pathLength={1}
            fill="none"
            stroke="var(--color-blue)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            strokeDashoffset={(1 - clamp(draw)).toFixed(4)}
          />
          {semanas.map((sem, i) => (
            <Ponto
              key={sem.inicio}
              x={x(i)}
              y={y(sem.total)}
              show={mounted ? sp(frame, 10 + i * 5, "snappy") : 1}
              active={ativo === i}
              hollow={sem.parcial}
            />
          ))}
          {[...rotulados].map((i) =>
            ativo === i ? null : (
              <text key={i} x={x(i)} y={y(semanas[i].total) - 14} textAnchor="middle" className={s.valueLabel} opacity={clamp(legenda).toFixed(3)}>
                {semanas[i].total}
              </text>
            ),
          )}
        </svg>
        {sel && ativo !== null ? (
          <div className={s.tip} style={{ left: tipX, top: y(sel.total) - 14 }} aria-hidden="true">
            <strong>{sel.parcial ? `${leads(sel.total)} até hoje` : leads(sel.total)}</strong>
            <span>{rotuloSemana(sel)}</span>
          </div>
        ) : null}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {sel ? `${rotuloSemana(sel)}: ${leads(sel.total)}.` : ""}
      </p>
      <table className="visually-hidden">
        <caption>Leads por semana</caption>
        <thead>
          <tr>
            <th scope="col">Semana</th>
            <th scope="col">Leads</th>
          </tr>
        </thead>
        <tbody>
          {semanas.map((sem) => (
            <tr key={sem.inicio}>
              <th scope="row">{rotuloSemana(sem)}</th>
              <td>{sem.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
