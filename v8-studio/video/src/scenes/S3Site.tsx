import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { ClinicSite } from "../components/ClinicSite";
import { Words } from "../components/Words";
import { Cursor, Ripple } from "../components/primitives";
import { Browser, ResultCard, SearchPill } from "../components/ui";
import { C, FONT } from "../lib/theme";
import { E, FPS, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import {
  BROWSER,
  CARD,
  CLINIC,
  COMPETITORS,
  PILL,
  QUERY,
  SCENES,
  SITE_CTA_CENTER,
  SITE_URL,
  SLOT_Y,
  URL_FRAMES,
  URL_START,
  localBeat,
  pathAt,
} from "./layout";

/**
 * Cena 3 · Agora ele acha você (branco). A busca volta; a Clínica Vida despenca no primeiro lugar e empurra
 * os concorrentes. O cursor comemora, clica, e o cartão vira o navegador onde o site se monta peça por peça.
 * O cursor pega impulso e clica em "Agendar consulta".
 */
export const S3Site: React.FC = () => {
  const f = useCurrentFrame();
  const b = (n: number) => localBeat(n, SCENES.s3.from);
  const land = 28;
  const push = 36;
  const clickCard = b(24);
  const morphStart = clickCard + 3;
  const clickCta = b(31);

  // Busca de novo
  const pillIn = sp(f, 0, "base");
  const out = ramp(f, morphStart, morphStart + 14, E.in);

  // Concorrentes: entram nos lugares 0, 1, 2 e são empurrados um lugar para baixo; o último cai da lista.
  const pushed = sp(f, push, "snappy");
  const fallOff = ramp(f, push + 5, push + 30, E.in);

  // Clínica Vida: despenca do alto e quica uma vez ao empurrar o concorrente (ζ ≈ 0,6).
  const drop = spring({ frame: f - land, fps: FPS, config: { stiffness: 200, damping: 17, mass: 1 } });
  const clinicY = lerp(-320, SLOT_Y[0], drop);

  // Cartão → navegador
  const m = sp(f, morphStart, "heavy");
  const morphing = f >= morphStart;
  const bx = lerp(CARD.x, BROWSER.x, m);
  const by = lerp(SLOT_Y[0], BROWSER.y, m);
  const bw = lerp(CARD.w, BROWSER.w, m);
  const bh = lerp(CARD.h, BROWSER.h, m);
  const urlChars = Math.floor(clamp((f - (URL_START - SCENES.s3.from)) / URL_FRAMES) * SITE_URL.length);

  // Site
  const hover = sp(f, b(29) - 2, "snappy") * (1 - ramp(f, clickCta + 6, clickCta + 30));
  const pieces = {
    nav: sp(f, 152, "snappy"),
    head: sp(f, 166, "text"),
    sub: sp(f, 172, "text"),
    img: sp(f, 180, "playful"),
    cards: [sp(f, 194, "playful"), sp(f, 198, "playful"), sp(f, 202, "playful")] as [number, number, number],
    cta: sp(f, 208, "playful"),
    ctaHover: hover,
    ctaPress: bump(f, clickCta, 12),
  };

  // Cursor: entra, comemora, clica no cartão, sai do caminho, vai ao botão, recua e clica com força.
  const ctaX = SITE_CTA_CENTER.x + 18;
  const ctaY = SITE_CTA_CENTER.y + 8;
  const keys: [number, number, number][] = [
    [b(22), 1700, 1190],
    [72, 1350, 640],
    [100, 1350, 640],
    [clickCard, 1310, 512],
    [clickCard + 6, 1310, 512],
    [140, 1540, 860],
    [b(28), 1540, 860],
    [b(29), ctaX, ctaY],
    [262, ctaX, ctaY],
    [292, ctaX + 40, ctaY + 30],
    [clickCta, ctaX, ctaY],
  ];
  const easeFor = (fr: number) => (fr > 292 && fr <= clickCta ? E.in : E.io);
  const { x: cx0, y: cy0 } = pathAt(f, keys, easeFor(f));
  const wiggle = f > 72 && f < 100 ? 18 * Math.sin((2 * Math.PI * (f - 72)) / 14) * (1 - ramp(f, 72, 100, (t) => t)) : 0;
  const hop = 22 * bump(f, 74, 12) + 16 * bump(f, 86, 12);
  const cursorScale = 1 - 0.16 * bump(f, clickCard, 9) - 0.2 * bump(f, clickCta, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, isolation: "isolate" }}>
      <Words text="Agora ele acha você." frame={f} start={14} exit={morphStart} size={112} color={C.ink} family={FONT.display} y={128} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-40 * out}px)` }}>
        <SearchPill
          cx={PILL.cx}
          cy={PILL.cy}
          w={PILL.w}
          h={PILL.h}
          borderColor={C.blue}
          borderWidth={3}
          text={QUERY}
          caret={f % 60 < 30}
          scale={lerp(1.08, 1, pillIn)}
        />
      </div>
      {COMPETITORS.map((r, i) => {
        const t0 = 4 + i * 6;
        const inn = sp(f, t0, "snappy");
        const isLast = i === 2;
        const wob = (i % 2 ? 1 : -1) * 3 * bump(f, push, 18);
        return (
          <ResultCard
            key={r.title}
            x={CARD.x}
            y={SLOT_Y[i] + 60 * (1 - inn) + 148 * pushed + (isLast ? 760 * fallOff : 0) + 60 * out}
            {...r}
            opacity={ramp(f, t0, t0 + 6) * (1 - out)}
            rotate={wob + (isLast ? 16 * fallOff : 0)}
          />
        );
      })}
      {!morphing || f < morphStart + 8 ? (
        <ResultCard
          x={morphing ? bx : CARD.x}
          y={morphing ? by : clinicY}
          w={morphing ? bw : CARD.w}
          h={morphing ? bh : CARD.h}
          {...CLINIC}
          highlight={ramp(f, land + 10, land + 18)}
          contentOpacity={1 - ramp(f, morphStart, morphStart + 6)}
          scale={1 - 0.03 * bump(f, clickCard, 10)}
          z={45}
        />
      ) : null}
      {morphing ? (
        <Browser
          x={bx}
          y={by}
          w={bw}
          h={bh}
          radius={lerp(24, BROWSER.r, m)}
          chromeOpacity={ramp(f, 128, 140)}
          url={SITE_URL.slice(0, urlChars)}
          caret={f >= 136 && f < 172 && f % 30 < 18}
        >
          <ClinicSite p={pieces} />
        </Browser>
      ) : null}
      <Ripple x={1310} y={512} frame={f} start={clickCard} />
      <Ripple x={SITE_CTA_CENTER.x} y={SITE_CTA_CENTER.y} frame={f} start={clickCta} color={C.teal} maxR={120} dur={26} />
      <Cursor
        x={cx0}
        y={cy0 - hop}
        rotate={wiggle}
        scale={cursorScale}
        opacity={ramp(f, b(22), b(22) + 4)}
      />
    </AbsoluteFill>
  );
};
