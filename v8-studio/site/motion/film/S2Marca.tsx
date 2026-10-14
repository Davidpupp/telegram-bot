import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LOGO_RATIO, Logo, Wordmark, Words } from "../compositions/kit";
import { C } from "../lib/theme";
import { E, clamp, coverRadius, lerp, ramp, sp } from "../lib/timing";
import { PILL } from "./layout";

const LOGO_W = 640;
const LOGO_H = LOGO_W * LOGO_RATIO;
const LOGO_X = 960 - LOGO_W / 2;
const LOGO_Y = 500 - LOGO_H / 2;
// Ponto do mergulho: a cintura do 8, entre os dois contadores (coordenadas do viewBox do logo).
const K = LOGO_W / 308;
const DIVE = { x: LOGO_X + 239.5 * K, y: LOGO_Y + 93 * K };

/**
 * Cena 2 · Marca (azul). O ponto azul inunda a tela, "Com um site da V8," e o logo sobe com mola firme,
 * seguido de STUDIO. A câmera mergulha na cintura do 8 até o branco do logo tomar a tela.
 */
export const S2Marca: React.FC = () => {
  const f = useCurrentFrame();
  const r = lerp(13, coverRadius(PILL.cx, PILL.cy, 1920, 1080), ramp(f, 0, 20, E.in));

  const logoIn = sp(f, 84, "heavy");
  const diveStart = 156;
  const diveEnd = 184;
  const dive = ramp(f, diveStart, diveEnd, E.in);
  const zoom = Math.exp(lerp(0, Math.log(30), dive));
  const pan = ramp(f, diveStart, diveEnd, E.io);
  const extrasOut = 1 - ramp(f, diveStart - 8, diveStart + 2);

  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${PILL.cx}px ${PILL.cy}px)`, backgroundColor: C.blue, isolation: "isolate" }}>
      <Words text="Com um site da V8," frame={f} start={14} exit={80} size={150} color={C.white} y={452} width={1920} />
      <AbsoluteFill
        style={{
          transformOrigin: `${DIVE.x}px ${DIVE.y}px`,
          transform: `translate(${(960 - DIVE.x) * pan}px, ${(540 - DIVE.y) * pan}px) scale(${zoom})`,
        }}
      >
        {f >= 84 ? (
          <div
            style={{
              position: "absolute",
              left: LOGO_X,
              top: LOGO_Y,
              width: LOGO_W,
              height: LOGO_H,
              opacity: clamp(logoIn * 1.6),
              transform: `translateY(${(1 - logoIn) * 80}px) scale(${lerp(0.94, 1, logoIn)})`,
            }}
          >
            <Logo width={LOGO_W} color={C.white} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, width: 1920, top: LOGO_Y + LOGO_H + 44, opacity: extrasOut }}>
          <Wordmark frame={f} start={100} size={46} color={C.white} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.white, opacity: ramp(f, diveEnd - 6, diveEnd) }} />
    </AbsoluteFill>
  );
};
