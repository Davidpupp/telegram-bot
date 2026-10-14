import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { C, FONT, SHADOW_HI } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import { Browser, Cursor, Ripple, Toast, Words, pathAt } from "./kit";

// Demonstração "Sistemas sob medida" (800 × 720, 7,3 s, loop): o painel de pedidos de uma confeitaria
// fictícia se monta, os números contam, as linhas entram, o cursor marca um pedido como pronto e um
// pedido novo chega no topo da lista.
const BRAND = { name: "Violeta", full: "Violeta Confeitaria", url: "painel.violetaconfeitaria.com.br", color: "#6A3FB5", soft: "#F0EBFA" };
const B = { x: 40, y: 40, w: 720, h: 640, bar: 60 };
const OX = B.x;
const OY = B.y + B.bar;

type Status = "novo" | "agendado" | "preparo" | "pronto" | "entregue";
const STATUS: Record<Status, { label: string; color: string }> = {
  novo: { label: "Novo", color: BRAND.color },
  agendado: { label: "Agendado", color: "#8A93A6" },
  preparo: { label: "Em preparo", color: "#C98A12" },
  pronto: { label: "Pronto", color: "#1B8A5A" },
  entregue: { label: "Entregue", color: C.gray },
};
type Row = { name: string; item: string; time: string; status: Status };
const ROWS: Row[] = [
  { name: "Rafael Dias", item: "Bolo de chocolate", time: "16:00", status: "agendado" },
  { name: "Lia Campos", item: "Brigadeiros (50)", time: "14:00", status: "preparo" },
  { name: "Paulo Mendes", item: "Torta de limão", time: "11:30", status: "preparo" },
  { name: "Ana Ribeiro", item: "Bolo de cenoura", time: "10:00", status: "pronto" },
];
const NEW_ROW: Row = { name: "Carla Nunes", item: "Bolo de aniversário", time: "17:00", status: "novo" };
const EDIT = 1;

const COL = { name: 214, time: 452, status: 548 };
const TABLE = { head: 210, top: 244, row: 62 };
const MENU = { x: 526, y: TABLE.top + (EDIT + 1) * TABLE.row + 4, w: 170, opt: 42 };
const MENU_OPTS: Status[] = ["preparo", "pronto", "entregue"];
const STATUS_AT = { x: OX + COL.status + 64, y: OY + TABLE.top + EDIT * TABLE.row + 34 };
const OPT_AT = { x: OX + MENU.x + 70, y: OY + MENU.y + 6 + MENU.opt * 1.5 + 4 };

const KPIS = [
  { label: "Pedidos", value: 24 },
  { label: "Prontos", value: 15 },
  { label: "Entregas", value: 6 },
];

const T = {
  open: 142,
  pick: 174,
  arrive: 232,
  toast: 280,
  exit: 376,
};

const rise = (v: number, dy: number): React.CSSProperties => ({ opacity: clamp(v * 1.5), transform: `translateY(${(1 - v) * dy}px)` });

/** Número que troca de valor rolando dentro de uma máscara (o antigo sobe, o novo vem de baixo). */
const Roll: React.FC<{ from: string; to: string; p: number; style: React.CSSProperties }> = ({ from, to, p, style }) => (
  <div style={{ position: "relative", overflow: "hidden", padding: "0.1em 0", margin: "-0.1em 0", ...style }}>
    <div style={{ transform: `translateY(${-110 * p}%)` }}>{from}</div>
    <div style={{ position: "absolute", left: 0, top: "0.1em", transform: `translateY(${110 * (1 - p)}%)` }}>{to}</div>
  </div>
);

const Dot: React.FC<{ color: string }> = ({ color }) => <div style={{ width: 12, height: 12, borderRadius: 6, background: color, flex: "none" }} />;

const DemoSistema: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, T.exit, T.exit + 32, E.in);
  const pageIn = sp(f, 0, "base");

  const menu = sp(f, T.open, "snappy") * (1 - sp(f, T.pick + 2, "snappy"));
  const changed = sp(f, T.pick + 4, "text");
  const shift = sp(f, T.arrive, "base");
  const glow = 1 - ramp(f, T.arrive + 70, T.arrive + 130);
  const toast = sp(f, T.toast, "base");

  // Números: contam de zero com mola firme; depois um valor sobe uma casa quando algo muda.
  const kpi = (i: number) => {
    const start = 30 + i * 8;
    const n = Math.round(KPIS[i].value * sp(f, start + 4, "heavy"));
    const bumpAt = i === 1 ? T.pick + 10 : i === 0 ? T.arrive + 12 : -1;
    const p = bumpAt > 0 ? sp(f, bumpAt, "text") : 0;
    return { n, p, start };
  };

  const keys: [number, number, number][] = [
    [104, 770, 770],
    [138, STATUS_AT.x, STATUS_AT.y],
    [150, STATUS_AT.x, STATUS_AT.y],
    [170, OPT_AT.x, OPT_AT.y],
    [188, OPT_AT.x, OPT_AT.y],
    [228, 900, 830],
  ];
  const cur = pathAt(f, keys);

  const rowView = (r: Row, y: number, status: React.ReactNode, extra: React.CSSProperties = {}, highlight = 0) => (
    <div style={{ position: "absolute", left: COL.name - 14, width: 696 - COL.name + 14, top: y, height: TABLE.row, ...extra }}>
      <div style={{ position: "absolute", inset: "4px 0", borderRadius: 14, background: BRAND.soft, opacity: highlight }} />
      <div style={{ position: "absolute", left: 14, top: 9, fontFamily: FONT.ui, fontWeight: 600, fontSize: 19, color: C.ink, whiteSpace: "nowrap" }}>{r.name}</div>
      <div style={{ position: "absolute", left: 14, top: 33, fontFamily: FONT.ui, fontSize: 18, color: C.gray, whiteSpace: "nowrap" }}>{r.item}</div>
      <div style={{ position: "absolute", left: COL.time - COL.name + 14, top: 19, fontFamily: FONT.ui, fontWeight: 500, fontSize: 19, color: C.ink }}>{r.time}</div>
      <div style={{ position: "absolute", left: COL.status - COL.name + 14, top: 19, height: 24, display: "flex", alignItems: "center", gap: 10 }}>{status}</div>
    </div>
  );

  const staticStatus = (s: Status) => (
    <>
      <Dot color={STATUS[s].color} />
      <span style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 19, color: C.ink, whiteSpace: "nowrap" }}>{STATUS[s].label}</span>
    </>
  );

  const editedStatus = (
    <>
      <Dot color={interpolateColors(clamp(changed), [0, 1], [STATUS.preparo.color, STATUS.pronto.color])} />
      <Roll from={STATUS.preparo.label} to={STATUS.pronto.label} p={changed} style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 19, lineHeight: "24px", color: C.ink, whiteSpace: "nowrap", width: 110 }} />
    </>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}>
        <div style={{ opacity: clamp(pageIn * 1.5), transform: `translateY(${(1 - pageIn) * 40}px)` }}>
          <Browser x={B.x} y={B.y} w={B.w} h={B.h} bar={B.bar} url={BRAND.url} radius={26}>
            {/* Barra lateral */}
            <div style={{ position: "absolute", left: 0, top: 0, width: 190, bottom: 0, background: C.paper, boxShadow: `inset -2px 0 0 ${C.line}` }}>
              <div style={{ position: "absolute", left: 24, top: 22, fontFamily: FONT.display, fontWeight: 800, fontSize: 28, color: BRAND.color, letterSpacing: "-0.03em" }}>
                {BRAND.name}
              </div>
              {["Pedidos", "Agenda", "Clientes", "Estoque"].map((label, i) => (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: 12,
                    width: 164,
                    top: 84 + i * 50,
                    height: 42,
                    borderRadius: 12,
                    background: i === 0 ? BRAND.soft : "transparent",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 14,
                    fontFamily: FONT.ui,
                    fontWeight: i === 0 ? 600 : 500,
                    fontSize: 19,
                    color: i === 0 ? BRAND.color : C.gray,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Título e números */}
            <Words text="Pedidos de hoje" frame={f} start={12} size={42} color={C.ink} align="left" x={COL.name} y={22} width={482} />
            {KPIS.map((k, i) => {
              const v = kpi(i);
              return (
                <div
                  key={k.label}
                  style={{
                    position: "absolute",
                    left: COL.name + i * 166,
                    top: 86,
                    width: 150,
                    height: 100,
                    borderRadius: 18,
                    background: C.white,
                    boxShadow: `inset 0 0 0 2px ${C.line}`,
                    ...rise(sp(f, v.start, "snappy"), 30),
                  }}
                >
                  <div style={{ position: "absolute", left: 18, top: 14, fontFamily: FONT.ui, fontWeight: 500, fontSize: 18, color: C.gray }}>{k.label}</div>
                  <Roll
                    from={String(v.n)}
                    to={String(k.value + 1)}
                    p={v.p}
                    style={{ position: "absolute", left: 18, top: 42, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: "44px", letterSpacing: "-0.02em", color: C.ink, fontVariantNumeric: "tabular-nums" }}
                  />
                </div>
              );
            })}

            {/* Tabela */}
            <div style={{ opacity: ramp(f, 58, 70) }}>
              {[
                ["Cliente", COL.name],
                ["Entrega", COL.time],
                ["Status", COL.status],
              ].map(([label, x]) => (
                <div key={label} style={{ position: "absolute", left: x, top: TABLE.head, fontFamily: FONT.ui, fontWeight: 500, fontSize: 18, color: C.gray }}>
                  {label}
                </div>
              ))}
              <div style={{ position: "absolute", left: COL.name, right: 24, top: TABLE.top - 4, height: 2, background: C.line }} />
            </div>
            {/* Corpo da tabela recortado logo abaixo do cabeçalho: o pedido novo entra empurrando a lista. */}
            <div style={{ position: "absolute", left: 0, right: 0, top: TABLE.top - 2, bottom: 0, overflow: "hidden" }}>
              {ROWS.map((r, i) => {
                const v = sp(f, 64 + i * 8, "snappy");
                const y = 2 + (i + shift) * TABLE.row;
                return (
                  <React.Fragment key={r.name}>
                    {rowView(r, y, i === EDIT ? editedStatus : staticStatus(r.status), rise(v, 24))}
                    <div style={{ position: "absolute", left: COL.name, right: 24, top: y + TABLE.row - 1, height: 2, background: C.line, opacity: clamp(v * 1.5) }} />
                  </React.Fragment>
                );
              })}
              {f >= T.arrive ? (
                <>
                  {rowView(NEW_ROW, 2 + (shift - 1) * TABLE.row, staticStatus(NEW_ROW.status), {}, glow)}
                  <div style={{ position: "absolute", left: COL.name, right: 24, top: 1 + shift * TABLE.row, height: 2, background: C.line }} />
                </>
              ) : null}
            </div>

            {/* Menu de status: opaco, desenrola para baixo e recolhe (nada da tabela aparece através dele) */}
            {f >= T.open && f < T.pick + 30 && menu > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  left: MENU.x,
                  top: MENU.y,
                  width: MENU.w,
                  height: (MENU.opt * 3 + 12) * clamp(menu),
                  borderRadius: 16,
                  background: C.white,
                  boxShadow: SHADOW_HI,
                  overflow: "hidden",
                  opacity: clamp(menu * 5),
                  zIndex: 50,
                }}
              >
                {MENU_OPTS.map((s, k) => (
                  <div
                    key={s}
                    style={{
                      position: "absolute",
                      left: 6,
                      right: 6,
                      top: 6 + k * MENU.opt,
                      height: MENU.opt,
                      borderRadius: 10,
                      background: k === 1 && f >= 166 ? C.paper : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      paddingLeft: 12,
                    }}
                  >
                    {staticStatus(s)}
                  </div>
                ))}
              </div>
            ) : null}
          </Browser>
        </div>
        {f >= T.toast ? <Toast x={270} y={lerp(-130, 22, toast)} w={500} h={96} title="Agenda atualizada" sub={`${BRAND.full} · agora`} z={60} /> : null}
        <Ripple x={STATUS_AT.x} y={STATUS_AT.y} frame={f} start={T.open} color={BRAND.color} />
        <Ripple x={OPT_AT.x} y={OPT_AT.y} frame={f} start={T.pick} color={BRAND.color} />
        <Cursor
          x={cur.x}
          y={cur.y}
          size={48}
          scale={1 - 0.14 * (bump(f, T.open, 9) + bump(f, T.pick, 9))}
          opacity={ramp(f, 104, 108) * (1 - ramp(f, 214, 228))}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default DemoSistema;
