import React from "react";
import {
  AbsoluteFill,
  interpolateColors,
  spring,
  useCurrentFrame,
} from "remotion";
import { Words } from "../components/Words";
import { Toast } from "../components/ui";
import { C, FONT } from "../lib/theme";
import { E, FPS, coverRadius, lerp, ramp, rng, sp } from "../lib/timing";
import {
  AVALANCHE_COUNT,
  AVALANCHE_START,
  PILE,
  SITE_CTA_CENTER,
  TOAST_STARTS,
  TOAST_TITLES,
  pileY,
} from "./layout";

// Queda com rebote curto (ζ ≈ 0,74): pousa na pilha sem atravessar as notificações de baixo.
const drop = (frame: number, start: number) =>
  spring({
    frame: frame - start,
    fps: FPS,
    config: { stiffness: 220, damping: 22, mass: 1 },
  });

const TILTS = (() => {
  const r = rng(41);
  return TOAST_TITLES.map(() => (r() - 0.5) * 4);
})();

const AVALANCHE = (() => {
  const r = rng(99);
  // Caixa do "Opa." (x 100–820, y 330–660): a avalanche não cai em cima da palavra.
  return Array.from({ length: AVALANCHE_COUNT }, (_, j) => {
    let x = -60 + r() * 1500;
    const y = 120 + r() * 820;
    if (x < 820 && x + 600 > 100 && y + 104 > 330 && y < 660)
      x = 880 + r() * 560;
    return {
      start: AVALANCHE_START + j * 3,
      x,
      y,
      rot: (r() - 0.5) * 36,
      title: TOAST_TITLES[j % TOAST_TITLES.length],
    };
  });
})();

/**
 * Cena 4 · Cliente chegando (azul). O botão "Agendar consulta" vira a primeira notificação enquanto o azul
 * inunda a partir dele. As notificações caem e empilham, cada uma numa batida e cada vez mais rápido;
 * a pilha transborda numa avalanche e o branco sobe a partir dela.
 */
export const S4Clientes: React.FC = () => {
  const f = useCurrentFrame();

  const R = coverRadius(SITE_CTA_CENTER.x, SITE_CTA_CENTER.y);
  const r = lerp(20, R, ramp(f, 0, 18, E.in));
  const whiteCenter = { x: PILE.x + PILE.w / 2, y: 560 };
  const whiteR = lerp(
    0,
    coverRadius(whiteCenter.x, whiteCenter.y),
    ramp(f, 194, 220, E.in),
  );

  // Notificação 0 nasce do botão do site (elemento compartilhado).
  const t0 = sp(f, TOAST_STARTS[0], "base");
  const cta = {
    x: SITE_CTA_CENTER.x - 165,
    y: SITE_CTA_CENTER.y - 42,
    w: 330,
    h: 84,
  };

  const toast0 = (
    <Toast
      x={lerp(cta.x, PILE.x, t0)}
      y={lerp(cta.y, pileY(0), t0)}
      w={lerp(cta.w, PILE.w, t0)}
      h={lerp(cta.h, PILE.h, t0)}
      radius={lerp(42, 26, Math.min(1, t0))}
      bg={interpolateColors(Math.min(1, t0), [0, 0.6], [C.teal, C.white])}
      contentOpacity={ramp(f, 12, 22)}
      title={TOAST_TITLES[0]}
      rotate={TILTS[0] * Math.min(1, t0)}
    />
  );

  return (
    <AbsoluteFill style={{ isolation: "isolate" }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${r}px at ${SITE_CTA_CENTER.x}px ${SITE_CTA_CENTER.y}px)`,
          backgroundColor: C.blue,
          isolation: "isolate",
        }}
      >
        <Words
          text="Cliente chegando."
          frame={f}
          start={28}
          exit={150}
          exitDur={10}
          size={100}
          color={C.white}
          family={FONT.display}
          align="left"
          x={120}
          y={292}
          width={1000}
        />
        <Words
          text="Mais um."
          frame={f}
          start={83}
          exit={152}
          exitDur={10}
          size={100}
          color={C.white}
          family={FONT.display}
          align="left"
          x={120}
          y={420}
          width={1000}
        />
        <Words
          text="E mais um."
          frame={f}
          start={125}
          exit={154}
          exitDur={10}
          size={100}
          color={C.white}
          family={FONT.display}
          align="left"
          x={120}
          y={548}
          width={1000}
        />
        <Words
          text="Opa."
          frame={f}
          start={168}
          size={260}
          color={C.white}
          family={FONT.display}
          align="left"
          x={120}
          y={360}
          width={1000}
          z={80}
        />

        {f >= 24 ? toast0 : null}
        {TOAST_STARTS.slice(1).map((start, idx) => {
          const k = idx + 1;
          if (f < start) return null;
          const p = drop(f, start);
          return (
            <Toast
              key={k}
              x={PILE.x}
              y={lerp(-260, pileY(k), p)}
              title={TOAST_TITLES[k]}
              rotate={lerp(TILTS[k] * 5, TILTS[k], Math.min(1, p))}
              z={30 + k}
            />
          );
        })}
        {AVALANCHE.map((a, j) => {
          if (f < a.start) return null;
          const p = drop(f, a.start);
          return (
            <Toast
              key={`a${j}`}
              x={a.x}
              y={lerp(-280, a.y, p)}
              title={a.title}
              rotate={a.rot * (0.4 + 0.6 * p)}
              scale={0.92}
              z={50 + j}
            />
          );
        })}
        <AbsoluteFill
          style={{
            backgroundColor: C.white,
            clipPath: `circle(${whiteR}px at ${whiteCenter.x}px ${whiteCenter.y}px)`,
            zIndex: 90,
          }}
        />
      </AbsoluteFill>
      {f < 24 ? toast0 : null}
    </AbsoluteFill>
  );
};
