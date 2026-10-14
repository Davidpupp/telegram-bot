import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { C, FONT } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp, typedCount, typingSchedule } from "../lib/timing";
import { Browser, CheckBadge, Cursor, Ripple, Toast, Words, pathAt } from "./kit";

// Demonstração "Sites institucionais" (800 × 720, 8 s, loop): o site de um escritório de arquitetura
// fictício se monta, o cursor navega pelo menu (Início, Serviços, Contato), o visitante escreve uma
// mensagem e ela chega como notificação.
const BRAND = { name: "Esquadro", full: "Esquadro Arquitetura", url: "esquadro.arq.br", color: "#4F5F22", soft: "#EEF1E2" };
const B = { x: 40, y: 40, w: 720, h: 640, bar: 60 };
const OX = B.x;
const OY = B.y + B.bar;

// Menu: posição e largura medidas do texto (Inter 500, 20 px).
const NAV = [
  { label: "Início", x: 405, w: 51 },
  { label: "Serviços", x: 490, w: 84 },
  { label: "Contato", x: 608, w: 76 },
];
const NAV_Y = 30;
const navTarget = (i: number) => ({ x: OX + NAV[i].x + NAV[i].w / 2 + 6, y: OY + NAV_Y + 16 });

// Formulário de contato (coordenadas do conteúdo do navegador).
const FORM = { x: 36, y: 214, w: 648, h: 292 };
const FIELD = { x: OX + FORM.x + 470, y: OY + FORM.y + 112 };
const SEND = { x: OX + FORM.x + FORM.w / 2 + 24, y: OY + FORM.y + 226 };
const MESSAGE = "Quero projetar minha casa.";

const T = {
  toServ: 96,
  toCont: 186,
  field: 262,
  send: 352,
  toast: 378,
  exit: 428,
};
const TYPING = typingSchedule(MESSAGE, 270, 2.05, 11);

const line = (color: string, w = 8) => ({
  fill: "none",
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** Desenho em traço da página inicial: casa, árvore e arbusto. `p` desenha o traço de 0 a 1. */
const HouseScene: React.FC<{ p: number }> = ({ p }) => {
  const s = { ...line(BRAND.color, 7), pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - clamp(p) };
  return (
    <svg viewBox="0 0 400 220" width={400} height={220} style={{ overflow: "visible" }}>
      <path d="M20 196 L380 196" {...s} />
      <path d="M44 196 Q44 166 70 166 Q96 166 96 196" {...s} />
      <path d="M120 196 L120 106 L200 46 L280 106 L280 196" {...s} />
      <path d="M186 196 L186 148 Q186 140 194 140 L206 140 Q214 140 214 148 L214 196" {...s} />
      <rect x={140} y={118} width={30} height={30} rx={5} {...s} />
      <rect x={230} y={118} width={30} height={30} rx={5} {...s} />
      <circle cx={330} cy={126} r={30} {...s} />
      <path d="M330 156 L330 196" {...s} />
    </svg>
  );
};

/** Desenhos dos três serviços. */
const ServiceArt: React.FC<{ kind: 0 | 1 | 2 }> = ({ kind }) => {
  const s = line(BRAND.color, 9);
  return (
    <svg viewBox="0 0 220 220" width={116} height={116} style={{ overflow: "visible" }}>
      {kind === 0 ? (
        <>
          <path d="M24 192 L196 192" {...s} />
          <path d="M52 192 L52 104 L110 56 L168 104 L168 192 Z" {...s} fill={C.white} />
          <path d="M96 192 L96 146 L124 146 L124 192" {...s} />
        </>
      ) : kind === 1 ? (
        <>
          <rect x={58} y={52} width={104} height={78} rx={20} {...s} fill={C.white} />
          <rect x={58} y={122} width={104} height={46} rx={8} {...s} fill={C.white} />
          <rect x={26} y={104} width={36} height={66} rx={14} {...s} fill={C.white} />
          <rect x={158} y={104} width={36} height={66} rx={14} {...s} fill={C.white} />
          <path d="M44 172 L44 194 M176 172 L176 194" {...s} />
        </>
      ) : (
        <>
          <path d="M160 74 L186 74 Q194 74 194 82 L194 112 Q194 120 186 120 L118 120 Q110 120 110 128 L110 142" {...s} />
          <rect x={30} y={50} width={130} height={50} rx={18} {...s} fill={C.white} />
          <rect x={98} y={142} width={24} height={60} rx={10} {...s} fill={C.white} />
        </>
      )}
    </svg>
  );
};

/** Bloco que sobe e aparece com mola. */
const rise = (v: number, dy: number): React.CSSProperties => ({ opacity: clamp(v * 1.5), transform: `translateY(${(1 - v) * dy}px)` });

const SERVICES: [string, string][] = [
  ["Casas", "Do terreno à chave."],
  ["Interiores", "Ambientes sob medida."],
  ["Reformas", "Obra acompanhada."],
];

const DemoSite: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, T.exit, T.exit + 32, E.in);
  const pageIn = sp(f, 0, "base");

  // Troca de página: a anterior sai para a esquerda, a nova entra pela direita.
  const out1 = sp(f, T.toServ, "snappy");
  const in1 = sp(f, T.toServ + 4, "base");
  const out2 = sp(f, T.toCont, "snappy");
  const in2 = sp(f, T.toCont + 4, "base");

  // Sublinhado do menu desliza de item em item.
  const u0 = sp(f, 14, "snappy");
  const u1 = sp(f, T.toServ, "snappy");
  const u2 = sp(f, T.toCont, "snappy");
  const ux = NAV[0].x + (NAV[1].x - NAV[0].x) * u1 + (NAV[2].x - NAV[1].x) * u2;
  const uw = (NAV[0].w + (NAV[1].w - NAV[0].w) * u1 + (NAV[2].w - NAV[1].w) * u2) * clamp(u0);
  const active = [1 - u1, u1 - u2, u2];
  const url = f < T.toServ ? BRAND.url : f < T.toCont ? `${BRAND.url}/servicos` : `${BRAND.url}/contato`;

  // Contato: foco, digitação, envio.
  const focus = f >= T.field && f < T.send + 4 ? 1 : 0;
  const typed = MESSAGE.slice(0, typedCount(f, TYPING));
  const typing = f >= TYPING[0] - 2 && f <= TYPING[TYPING.length - 1] + 6;
  const caret = focus > 0 && (typing || f % 40 < 24);
  const press = bump(f, T.send, 12);
  const sent = sp(f, T.send + 8, "snappy");
  const toast = sp(f, T.toast, "base");

  const S = navTarget(1);
  const K = navTarget(2);
  const keys: [number, number, number][] = [
    [52, 770, 770],
    [90, S.x, S.y],
    [150, S.x, S.y],
    [180, K.x, K.y],
    [226, K.x, K.y],
    [256, FIELD.x, FIELD.y],
    [326, FIELD.x, FIELD.y],
    [346, SEND.x, SEND.y],
    [372, SEND.x, SEND.y],
    [418, 900, 830],
  ];
  const cur = pathAt(f, keys);
  const clicks = [T.toServ, T.toCont, T.field, T.send];

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}>
      <div style={{ opacity: clamp(pageIn * 1.5), transform: `translateY(${(1 - pageIn) * 40}px)` }}>
        <Browser x={B.x} y={B.y} w={B.w} h={B.h} bar={B.bar} url={url} radius={26}>
          {/* Menu */}
          <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT.display, fontWeight: 800, fontSize: 30, color: BRAND.color, letterSpacing: "-0.03em" }}>
            {BRAND.name}
          </div>
          {NAV.map((n, i) => (
            <div
              key={n.label}
              style={{
                position: "absolute",
                left: n.x,
                top: NAV_Y,
                fontFamily: FONT.ui,
                fontWeight: 500,
                fontSize: 20,
                lineHeight: "26px",
                whiteSpace: "nowrap",
                color: interpolateColors(clamp(active[i]), [0, 1], [C.gray, C.ink]),
              }}
            >
              {n.label}
            </div>
          ))}
          <div style={{ position: "absolute", left: ux, top: NAV_Y + 34, width: uw, height: 3, borderRadius: 2, background: BRAND.color }} />

          {/* Início */}
          {f < T.toServ + 30 ? (
            <div style={{ position: "absolute", inset: 0, opacity: clamp(1 - out1 * 1.6), transform: `translateX(${-70 * out1}px)` }}>
              <Words text={"Arquitetura\npara viver bem."} frame={f} start={12} size={54} color={C.ink} align="left" x={36} y={96} width={648} letterSpacing="-0.035em" />
              <div style={{ position: "absolute", left: 36, top: 224, fontFamily: FONT.ui, fontSize: 20, color: C.gray, ...rise(sp(f, 26, "soft"), 16) }}>
                Casas, interiores e reformas do projeto à obra.
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 36,
                  top: 272,
                  width: 648,
                  height: 280,
                  borderRadius: 22,
                  background: BRAND.soft,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 30,
                  ...rise(sp(f, 34, "soft"), 50),
                }}
              >
                <HouseScene p={sp(f, 44, "heavy")} />
              </div>
            </div>
          ) : null}

          {/* Serviços */}
          {f >= T.toServ && f < T.toCont + 30 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: clamp(in1 * 1.6) * clamp(1 - out2 * 1.6),
                transform: `translateX(${90 * (1 - in1) - 70 * out2}px)`,
              }}
            >
              <Words text="Do projeto à obra." frame={f} start={T.toServ + 10} size={54} color={C.ink} align="left" x={36} y={96} width={648} letterSpacing="-0.035em" />
              <div style={{ position: "absolute", left: 36, top: 166, fontFamily: FONT.ui, fontSize: 20, color: C.gray, ...rise(sp(f, T.toServ + 22, "soft"), 16) }}>
                Cada etapa com prazo e orçamento claros.
              </div>
              {SERVICES.map(([t, d], i) => (
                <div
                  key={t}
                  style={{
                    position: "absolute",
                    left: 36 + i * 222,
                    top: 214,
                    width: 204,
                    height: 290,
                    borderRadius: 22,
                    background: C.white,
                    boxShadow: `inset 0 0 0 2px ${C.line}`,
                    overflow: "hidden",
                    ...rise(sp(f, T.toServ + 28 + i * 8, "soft"), 60),
                  }}
                >
                  <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 168, background: BRAND.soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ServiceArt kind={i as 0 | 1 | 2} />
                  </div>
                  <div style={{ position: "absolute", left: 20, top: 184, fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, lineHeight: "30px", color: C.ink }}>{t}</div>
                  <div style={{ position: "absolute", left: 20, right: 14, top: 218, fontFamily: FONT.ui, fontSize: 19, lineHeight: "25px", color: C.gray }}>{d}</div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Contato */}
          {f >= T.toCont ? (
            <div style={{ position: "absolute", inset: 0, opacity: clamp(in2 * 1.6), transform: `translateX(${90 * (1 - in2)}px)` }}>
              <Words text="Conte sua ideia." frame={f} start={T.toCont + 10} size={54} color={C.ink} align="left" x={36} y={96} width={648} letterSpacing="-0.035em" />
              <div style={{ position: "absolute", left: 36, top: 166, fontFamily: FONT.ui, fontSize: 20, color: C.gray, ...rise(sp(f, T.toCont + 22, "soft"), 16) }}>
                Escreva o que você quer construir ou reformar.
              </div>
              <div
                style={{
                  position: "absolute",
                  left: FORM.x,
                  top: FORM.y,
                  width: FORM.w,
                  height: FORM.h,
                  borderRadius: 24,
                  background: C.white,
                  boxShadow: `inset 0 0 0 2px ${C.line}`,
                  ...rise(sp(f, T.toCont + 28, "soft"), 50),
                }}
              >
                <div style={{ position: "absolute", left: 32, top: 26, fontFamily: FONT.ui, fontWeight: 600, fontSize: 19, color: C.ink }}>Sua mensagem</div>
                <div
                  style={{
                    position: "absolute",
                    left: 32,
                    right: 32,
                    top: 62,
                    height: 104,
                    borderRadius: 16,
                    boxShadow: `inset 0 0 0 2px ${focus ? BRAND.color : C.line}${focus ? `, 0 0 0 4px ${BRAND.soft}` : ""}`,
                    padding: "16px 18px",
                    fontFamily: FONT.ui,
                    fontSize: 20,
                    lineHeight: "28px",
                    color: C.ink,
                  }}
                >
                  {typed}
                  <span style={{ display: "inline-block", width: 2, height: 24, marginLeft: 2, verticalAlign: "-5px", background: BRAND.color, opacity: caret ? 1 : 0 }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 32,
                    right: 32,
                    top: 196,
                    height: 60,
                    borderRadius: 30,
                    background: interpolateColors(clamp(sent), [0, 1], [BRAND.color, BRAND.soft]),
                    overflow: "hidden",
                    transform: `scale(${1 - 0.04 * press})`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: FONT.ui,
                      fontWeight: 600,
                      fontSize: 20,
                      color: C.white,
                      transform: `translateY(${-60 * sent}px)`,
                    }}
                  >
                    Enviar mensagem
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      fontFamily: FONT.ui,
                      fontWeight: 600,
                      fontSize: 20,
                      color: BRAND.color,
                      transform: `translateY(${60 * (1 - sent)}px)`,
                    }}
                  >
                    <CheckBadge size={30} bg={BRAND.color} fg={C.white} />
                    Mensagem enviada
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Browser>
      </div>
      {f >= T.toast ? <Toast x={270} y={lerp(-130, 22, toast)} w={500} h={96} title="Nova mensagem pelo site" sub={`${BRAND.full} · agora`} z={60} /> : null}
      <Ripple x={S.x} y={S.y} frame={f} start={T.toServ} color={BRAND.color} />
      <Ripple x={K.x} y={K.y} frame={f} start={T.toCont} color={BRAND.color} />
      <Ripple x={FIELD.x} y={FIELD.y} frame={f} start={T.field} color={BRAND.color} />
      <Ripple x={SEND.x} y={SEND.y} frame={f} start={T.send} color={BRAND.color} maxR={90} />
      <Cursor
        x={cur.x}
        y={cur.y}
        size={48}
        scale={1 - 0.14 * clicks.reduce((a, c) => a + bump(f, c, 9), 0)}
        opacity={ramp(f, 52, 56) * (1 - ramp(f, 404, 418))}
      />
    </AbsoluteFill>
  );
};

export default DemoSite;
