import React from "react";
import { AbsoluteFill, interpolateColors, spring, useCurrentFrame } from "remotion";
import { Toast, Words } from "../compositions/kit";
import { C } from "../lib/theme";
import { E, FPS, coverRadius, lerp, ramp, sp } from "../lib/timing";
import { PILE, SITE_CTA_CENTER, pileY } from "./layout";
import type { Segment } from "./segments";

// Queda que pousa na pilha sem atravessar a notificação de baixo (ζ ≈ 0,88).
const drop = (frame: number, start: number) => spring({ frame: frame - start, fps: FPS, config: { stiffness: 220, damping: 26, mass: 1 } });
const STARTS = [2, 40, 64, 88, 112];

/**
 * Cena 4 · Clientes (azul). O botão do site vira a primeira notificação enquanto o azul inunda a partir dele.
 * As notificações caem e empilham em ordem; o branco sobe a partir da pilha.
 */
export const S4Clientes: React.FC<{ seg: Segment }> = ({ seg }) => {
  const f = useCurrentFrame();
  const r = lerp(20, coverRadius(SITE_CTA_CENTER.x, SITE_CTA_CENTER.y, 1920, 1080), ramp(f, 0, 18, E.in));
  const whiteCenter = { x: PILE.x + PILE.w / 2, y: 560 };
  const whiteR = lerp(0, coverRadius(whiteCenter.x, whiteCenter.y, 1920, 1080), ramp(f, 196, 222, E.in));
  const sub = `${seg.brand} · agora`;

  const t0 = sp(f, STARTS[0], "base");
  const cta = { x: SITE_CTA_CENTER.x - 165, y: SITE_CTA_CENTER.y - 42, w: 330, h: 84 };
  const toast0 = (
    <Toast
      x={lerp(cta.x, PILE.x, t0)}
      y={lerp(cta.y, pileY(0), t0)}
      w={lerp(cta.w, PILE.w, t0)}
      h={lerp(cta.h, PILE.h, t0)}
      radius={lerp(42, 26, Math.min(1, t0))}
      bg={interpolateColors(Math.min(1, t0), [0, 0.6], [seg.color, C.white])}
      contentOpacity={ramp(f, 12, 22)}
      title={seg.toasts[0]}
      sub={sub}
    />
  );

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${SITE_CTA_CENTER.x}px ${SITE_CTA_CENTER.y}px)`, backgroundColor: C.blue, isolation: "isolate" }}>
        <Words text="Clientes chegando." frame={f} start={28} exit={172} exitDur={10} size={100} color={C.white} align="left" x={120} y={300} width={1000} />
        <Words text="Enquanto você trabalha." frame={f} start={100} exit={175} exitDur={10} size={72} color={C.white} align="left" x={120} y={430} width={1000} />
        {f >= 24 ? toast0 : null}
        {STARTS.slice(1).map((start, idx) => {
          const k = idx + 1;
          if (f < start) return null;
          const p = drop(f, start);
          return <Toast key={k} x={PILE.x} y={lerp(-260, pileY(k), p)} title={seg.toasts[k]} sub={sub} z={30 + k} />;
        })}
        <AbsoluteFill style={{ backgroundColor: C.white, clipPath: `circle(${whiteR}px at ${whiteCenter.x}px ${whiteCenter.y}px)`, zIndex: 90 }} />
      </AbsoluteFill>
      {f < 24 ? toast0 : null}
    </AbsoluteFill>
  );
};
