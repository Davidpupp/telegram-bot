import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Words } from "../components/Words";
import { Logo, LOGO_RATIO } from "../components/primitives";
import { C, FONT } from "../lib/theme";
import { E, FPS, bump, clamp, coverRadius, lerp, ramp, shake, sp } from "../lib/timing";
import { PILL, SCENES, localBeat } from "./layout";

const LOGO_W = 640;
const LOGO_H = LOGO_W * LOGO_RATIO;
const LOGO_X = 960 - LOGO_W / 2;
const LOGO_Y = 500 - LOGO_H / 2;
// Ponto de mergulho: a cintura do 8, entre os dois contadores (coordenadas do viewBox do logo).
const K = LOGO_W / 308;
const DIVE = { x: LOGO_X + 239.5 * K, y: LOGO_Y + 93 * K };

/**
 * Cena 2 · Calma (azul). O ponto azul inunda a tela, "Calma." e "A gente resolve.", que treme como motor
 * em marcha lenta. No drop o logo V8 despenca, amassa ao pousar e derruba as palavras; acelera duas vezes
 * ("vrum") e a câmera mergulha na cintura do 8 até o branco tomar a tela.
 */
export const S2Calma: React.FC = () => {
  const f = useCurrentFrame();
  const b = (n: number) => localBeat(n, SCENES.s2.from);
  const drop = b(16);
  const rev2 = b(18);
  const diveStart = b(19);
  const diveEnd = b(20);

  // Inundação a partir do ponto (a pílula encolhida da cena 1).
  const R = coverRadius(PILL.cx, PILL.cy);
  const r = lerp(13, R, ramp(f, 0, 20, E.in));

  // Tremor de marcha lenta antes do drop e impacto do pouso.
  const idle = Math.pow(ramp(f, 64, drop, (t) => t), 1.5);
  const knock = ramp(f, drop, drop + 18, E.out);
  const wordFx = (i: number) => {
    const t = f / FPS;
    const dx = 9 * idle * Math.sin(2 * Math.PI * 16 * t + i * 1.7) + (i - 1) * 1150 * knock;
    const dy = 6 * idle * Math.sin(2 * Math.PI * 21 * t + i) + 820 * knock;
    return `translate(${dx}px, ${dy}px) rotate(${((i - 1) * 38 + 14) * knock}deg)`;
  };

  // Logo: queda acelerada nos 8 quadros antes do drop, amassa e estica ao pousar.
  const fall = ramp(f, drop - 8, drop, E.in);
  const logoY = lerp(-900, 0, fall);
  const sy = 1 - 0.2 * bump(f, drop, 10) + 0.06 * bump(f, drop + 10, 10);
  const sx = 1 + 0.12 * bump(f, drop, 10) - 0.03 * bump(f, drop + 10, 10);
  const revX = shake(f, drop, 10, 20, 8) + shake(f, rev2, 13, 22, 8);
  const revPulse = 1 + 0.04 * bump(f, rev2, 12);
  const screenShake = shake(f, drop, 12, 16, 10);

  // Mergulho em escala logarítmica, com o ponto da cintura indo para o centro da tela.
  const dive = ramp(f, diveStart, diveEnd, E.in);
  const zoom = Math.exp(lerp(0, Math.log(30), dive));
  const panX = (960 - DIVE.x) * ramp(f, diveStart, diveEnd, E.io);
  const panY = (540 - DIVE.y) * ramp(f, diveStart, diveEnd, E.io);
  const extrasOut = 1 - ramp(f, diveStart - 8, diveStart + 2);

  const vrum = (start: number, x: number, y: number, size: number, rot: number, text: string) => {
    const p = sp(f, start, "playful");
    const o = clamp(p * 2) * (1 - ramp(f, start + 18, start + 30));
    if (f < start || o <= 0) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.02em",
          color: C.white,
          opacity: o * extrasOut,
          transform: `rotate(${rot}deg) scale(${0.5 + 0.5 * p})`,
          transformOrigin: "0% 100%",
          whiteSpace: "nowrap",
          zIndex: 25,
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${PILL.cx}px ${PILL.cy}px)`, backgroundColor: C.blue, isolation: "isolate" }}>
      <AbsoluteFill style={{ transform: `translateY(${screenShake}px)` }}>
        <Words text="Calma." frame={f} start={12} exit={b(14)} size={220} color={C.white} family={FONT.display} y={420} />
        <Words
          text="A gente resolve."
          frame={f}
          start={b(14) + 4}
          size={150}
          color={C.white}
          family={FONT.display}
          y={456}
          extra={wordFx}
        />
        <AbsoluteFill
          style={{
            transformOrigin: `${DIVE.x}px ${DIVE.y}px`,
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          }}
        >
          {f >= drop - 8 ? (
            <div
              style={{
                position: "absolute",
                left: LOGO_X,
                top: LOGO_Y,
                width: LOGO_W,
                height: LOGO_H,
                transformOrigin: "50% 100%",
                transform: `translate(${revX}px, ${logoY}px) scale(${sx * revPulse}, ${sy * revPulse})`,
                zIndex: 30,
              }}
            >
              <Logo width={LOGO_W} color={C.white} />
            </div>
          ) : null}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: LOGO_Y + LOGO_H + 44,
              display: "flex",
              justifyContent: "center",
              fontFamily: FONT.word,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "0.46em",
              paddingLeft: "0.46em",
              color: C.white,
              opacity: extrasOut,
              zIndex: 30,
            }}
          >
            {"STUDIO".split("").map((ch, i) => {
              const u = sp(f, drop + 14 + i * 2.5, "text");
              return (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.1em 0", margin: "-0.1em 0" }}>
                  <span style={{ display: "inline-block", transform: `translateY(${(1 - u) * 110}%)` }}>{ch}</span>
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
        {vrum(drop + 4, 1330, 290, 58, -10, "vrum")}
        {vrum(rev2, 1310, 610, 72, 8, "vrum vrum!")}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.white, opacity: ramp(f, diveEnd - 6, diveEnd) }} />
    </AbsoluteFill>
  );
};
