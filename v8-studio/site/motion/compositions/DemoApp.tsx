import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { C, FONT, SHADOW } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import { CheckBadge, Ripple, Toast, Words, shadowK } from "./kit";

// Demonstração "Aplicativos" (800 × 720, 6,6 s, loop): o app de uma academia fictícia no celular.
// Um aviso desce do topo da tela, o toque abre o detalhe da aula e confirma a presença.
const BRAND = { name: "Vigor", full: "Vigor Academia", color: "#0F766E", soft: "#E2F1EE" };
const PHONE = { x: 236, y: 32, w: 328, h: 656, r: 58, bezel: 12 };
const SCREEN = { x: PHONE.x + PHONE.bezel, y: PHONE.y + PHONE.bezel, w: PHONE.w - 2 * PHONE.bezel, h: PHONE.h - 2 * PHONE.bezel, r: 46 };

// Aviso (coordenadas da tela) e alvos de toque (coordenadas da composição).
const NOTE = { x: 10, y: 50, w: SCREEN.w - 20, h: 130, r: 24 };
const BTN = { x: 18, y: 520, w: SCREEN.w - 36, h: 60 };
const TAP1 = { x: SCREEN.x + NOTE.x + NOTE.w / 2, y: SCREEN.y + NOTE.y + NOTE.h / 2 + 6 };
const TAP2 = { x: SCREEN.x + BTN.x + BTN.w / 2, y: SCREEN.y + BTN.y + BTN.h / 2 };

const CLASSES: [string, string, string][] = [
  ["07:00", "Pilates", "Sala 1 · 50 min"],
  ["18:00", "Funcional", "Sala 2 · 45 min"],
  ["20:00", "Spinning", "Sala 3 · 40 min"],
];

const T = {
  note: 80,
  tap1: 124,
  open: 130,
  tap2: 210,
  done: 216,
  toast: 254,
  exit: 334,
};

const rise = (v: number, dy: number): React.CSSProperties => ({ opacity: clamp(v * 1.5), transform: `translateY(${(1 - v) * dy}px)` });

/** Halteres em traço, na cor da marca. */
const Dumbbell: React.FC<{ size: number }> = ({ size }) => {
  const s = { fill: C.white, stroke: BRAND.color, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
      <path d="M58 110 L162 110" {...s} fill="none" strokeWidth={12} />
      <rect x={30} y={62} width={30} height={96} rx={10} {...s} />
      <rect x={160} y={62} width={30} height={96} rx={10} {...s} />
      <rect x={8} y={82} width={22} height={56} rx={8} {...s} />
      <rect x={190} y={82} width={22} height={56} rx={8} {...s} />
    </svg>
  );
};

const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: BRAND.color,
      color: C.white,
      fontFamily: FONT.display,
      fontWeight: 800,
      fontSize: size * 0.62,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
    }}
  >
    V
  </div>
);

/** Círculo de toque: aparece, afunda no toque e some quando o dedo sai. */
const Touch: React.FC<{ x: number; y: number; frame: number; at: number }> = ({ x, y, frame, at }) => {
  const appear = sp(frame, at - 12, "snappy");
  const lift = ramp(frame, at + 8, at + 20);
  if (frame < at - 12 || lift >= 1) return null;
  const scale = lerp(1.35, 1, clamp(appear)) * (1 - 0.18 * bump(frame, at, 12));
  return (
    <div
      style={{
        position: "absolute",
        left: x - 29,
        top: y - 29,
        width: 58,
        height: 58,
        borderRadius: 29,
        background: "rgba(11,18,32,0.2)",
        boxShadow: `inset 0 0 0 3px rgba(255,255,255,0.9), 0 6px 16px -6px rgba(13,32,96,0.4)`,
        opacity: clamp(appear * 1.6) * (1 - lift),
        transform: `scale(${scale})`,
        zIndex: 100,
      }}
    />
  );
};

const DemoApp: React.FC = () => {
  const f = useCurrentFrame();
  const exit = ramp(f, T.exit, T.exit + 32, E.in);
  const phoneIn = sp(f, 0, "base");

  const note = sp(f, T.note, "base");
  const m = sp(f, T.open, "heavy");
  const opened = f >= T.open;
  const done = sp(f, T.done, "snappy");
  const btnIn = sp(f, T.open + 42, "snappy");
  const toast = sp(f, T.toast, "base");

  // O aviso cresce até virar a tela de detalhe.
  const card = opened
    ? { x: lerp(NOTE.x, 0, m), y: lerp(NOTE.y, 0, m), w: lerp(NOTE.w, SCREEN.w, m), h: lerp(NOTE.h, SCREEN.h, m), r: lerp(NOTE.r, SCREEN.r, m) }
    : { x: NOTE.x, y: lerp(-NOTE.h - 30, NOTE.y, note), w: NOTE.w, h: NOTE.h, r: NOTE.r };
  const noteContent = 1 - clamp(m * 3.2);
  const detail = clamp((m - 0.35) / 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateY(${-30 * exit}px)` }}>
        <div style={{ position: "absolute", inset: 0, opacity: clamp(phoneIn * 1.5), transform: `translateY(${(1 - phoneIn) * 40}px)` }}>
          {/* Corpo do celular */}
          <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.r, background: C.white, boxShadow: SHADOW }} />
          {/* Tela */}
          <div
            style={{
              position: "absolute",
              left: SCREEN.x,
              top: SCREEN.y,
              width: SCREEN.w,
              height: SCREEN.h,
              borderRadius: SCREEN.r,
              background: C.white,
              overflow: "hidden",
              boxShadow: `inset 0 0 0 2px ${C.line}`,
            }}
          >
            {/* Início do app */}
            <div style={{ position: "absolute", left: 22, top: 62, fontFamily: FONT.display, fontWeight: 800, fontSize: 26, color: BRAND.color, letterSpacing: "-0.03em" }}>{BRAND.name}</div>
            <Words text="Suas aulas" frame={f} start={14} size={42} color={C.ink} align="left" x={22} y={100} width={260} />
            <div style={{ position: "absolute", left: 22, top: 156, fontFamily: FONT.ui, fontSize: 18, color: C.gray, ...rise(sp(f, 26, "soft"), 12) }}>Hoje, quinta-feira</div>
            {CLASSES.map(([time, name, info], i) => (
              <div
                key={name}
                style={{
                  position: "absolute",
                  left: 18,
                  top: 196 + i * 96,
                  width: SCREEN.w - 36,
                  height: 84,
                  borderRadius: 20,
                  background: i === 1 ? BRAND.soft : C.paper,
                  ...rise(sp(f, 34 + i * 8, "snappy"), 40),
                }}
              >
                <div style={{ position: "absolute", left: 18, top: 15, fontFamily: FONT.ui, fontWeight: 700, fontSize: 20, color: BRAND.color }}>{time}</div>
                <div style={{ position: "absolute", left: 92, top: 14, fontFamily: FONT.ui, fontWeight: 600, fontSize: 20, color: C.ink }}>{name}</div>
                <div style={{ position: "absolute", left: 92, top: 44, fontFamily: FONT.ui, fontSize: 18, color: C.gray }}>{info}</div>
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 560, height: 2, background: C.line }} />
            {["Início", "Agenda", "Perfil"].map((t, i) => (
              <div
                key={t}
                style={{
                  position: "absolute",
                  left: i * (SCREEN.w / 3),
                  width: SCREEN.w / 3,
                  top: 576,
                  textAlign: "center",
                  fontFamily: FONT.ui,
                  fontWeight: i === 0 ? 600 : 500,
                  fontSize: 18,
                  color: i === 0 ? BRAND.color : C.gray,
                }}
              >
                {t}
              </div>
            ))}

            {/* Aviso que vira a tela de detalhe */}
            {f >= T.note ? (
              <div
                style={{
                  position: "absolute",
                  left: card.x,
                  top: card.y,
                  width: card.w,
                  height: card.h,
                  borderRadius: card.r,
                  background: C.white,
                  boxShadow: `${shadowK(1.3 * (1 - m))}, inset 0 0 0 ${2 * (1 - m)}px ${C.line}`,
                  overflow: "hidden",
                  transform: `scale(${1 - 0.03 * bump(f, T.tap1, 12)})`,
                  zIndex: 20,
                }}
              >
                {noteContent > 0 ? (
                  <div style={{ position: "absolute", left: 0, top: 0, width: NOTE.w, height: NOTE.h, opacity: noteContent }}>
                    <div style={{ position: "absolute", left: 14, top: 16 }}>
                      <AppIcon size={32} />
                    </div>
                    <div style={{ position: "absolute", left: 56, top: 21, fontFamily: FONT.ui, fontWeight: 600, fontSize: 18, color: C.ink }}>{BRAND.full}</div>
                    <div style={{ position: "absolute", right: 16, top: 21, fontFamily: FONT.ui, fontSize: 18, color: C.gray }}>agora</div>
                    <div style={{ position: "absolute", left: 16, top: 64, fontFamily: FONT.ui, fontWeight: 600, fontSize: 19, color: C.ink }}>Funcional hoje às 18h</div>
                    <div style={{ position: "absolute", left: 16, top: 92, fontFamily: FONT.ui, fontSize: 18, color: C.gray }}>Confirme sua presença.</div>
                  </div>
                ) : null}
                {opened ? (
                  <div style={{ position: "absolute", left: -card.x, top: -card.y, width: SCREEN.w, height: SCREEN.h, opacity: detail }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: 236, background: BRAND.soft, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 30 }}>
                      <Dumbbell size={170} />
                    </div>
                    <Words text="Funcional" frame={f} start={T.open + 22} size={44} color={C.ink} align="left" x={22} y={256} width={260} />
                    <div style={{ position: "absolute", left: 22, top: 318, ...rise(sp(f, T.open + 32, "soft"), 14) }}>
                      <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 20, color: C.ink }}>Hoje, 18:00 · Sala 2</div>
                      <div style={{ fontFamily: FONT.ui, fontSize: 19, color: C.gray, marginTop: 6 }}>45 minutos · 6 vagas</div>
                    </div>
                    <div style={{ position: "absolute", left: 22, right: 22, top: 400, height: 2, background: C.line, opacity: clamp(sp(f, T.open + 36, "soft") * 1.5) }} />
                    <div style={{ position: "absolute", left: 22, right: 22, top: 420, fontFamily: FONT.ui, fontSize: 19, lineHeight: "27px", color: C.gray, ...rise(sp(f, T.open + 38, "soft"), 14) }}>
                      Circuito com o peso do corpo. Traga toalha e água.
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: BTN.x,
                        top: BTN.y,
                        width: BTN.w,
                        height: BTN.h,
                        borderRadius: BTN.h / 2,
                        background: interpolateColors(clamp(done), [0, 1], [BRAND.color, BRAND.soft]),
                        overflow: "hidden",
                        opacity: clamp(btnIn * 1.5),
                        transform: `translateY(${(1 - btnIn) * 30}px) scale(${1 - 0.05 * bump(f, T.tap2, 12)})`,
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
                          transform: `translateY(${-60 * done}px)`,
                        }}
                      >
                        Confirmar presença
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
                          transform: `translateY(${60 * (1 - done)}px)`,
                        }}
                      >
                        <CheckBadge size={28} bg={BRAND.color} fg={C.white} />
                        Presença confirmada
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Barra de status e ilha, sempre por cima */}
            <div style={{ position: "absolute", left: 34, top: 15, fontFamily: FONT.ui, fontWeight: 600, fontSize: 18, color: C.ink, zIndex: 30 }}>9:41</div>
            <div style={{ position: "absolute", left: (SCREEN.w - 100) / 2, top: 12, width: 100, height: 30, borderRadius: 15, background: C.ink, zIndex: 30 }} />
            <svg viewBox="0 0 32 16" width={32} height={16} style={{ position: "absolute", left: SCREEN.w - 62, top: 19, zIndex: 30 }}>
              <rect x={1} y={1} width={26} height={14} rx={4} fill="none" stroke={C.ink} strokeWidth={2} />
              <rect x={4} y={4} width={18} height={8} rx={2} fill={C.ink} />
              <rect x={29} y={5} width={2.5} height={6} rx={1} fill={C.ink} />
            </svg>
            <div style={{ position: "absolute", left: (SCREEN.w - 110) / 2, top: SCREEN.h - 14, width: 110, height: 5, borderRadius: 3, background: C.ink, zIndex: 30 }} />
          </div>
        </div>
        {f >= T.toast ? <Toast x={150} y={lerp(-130, 22, toast)} w={500} h={96} title="Nova presença confirmada" sub={`${BRAND.full} · agora`} z={60} /> : null}
        <Ripple x={TAP1.x} y={TAP1.y} frame={f} start={T.tap1} color={BRAND.color} />
        <Ripple x={TAP2.x} y={TAP2.y} frame={f} start={T.tap2} color={BRAND.color} maxR={90} />
        <Touch x={TAP1.x} y={TAP1.y} frame={f} at={T.tap1} />
        <Touch x={TAP2.x} y={TAP2.y} frame={f} at={T.tap2} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default DemoApp;
