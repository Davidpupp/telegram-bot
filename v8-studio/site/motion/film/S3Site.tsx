import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Browser, Cursor, ResultCard, Ripple, SearchPill, Words, pathAt } from "../compositions/kit";
import { C } from "../lib/theme";
import { E, FPS, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import { BizSite } from "./BizSite";
import { BROWSER, CARD, PILL, SITE_CTA_CENTER, SLOT_Y } from "./layout";
import { COMPETITOR_FAVS, type Segment } from "./segments";

/**
 * Cena 3 · Site (branco). A mesma busca, agora com o negócio em primeiro lugar: o cartão desce do alto
 * e empurra as outras empresas. O cursor clica, o cartão vira o navegador e o site se monta peça por peça.
 * O cursor vai ao botão principal e clica.
 */
export const S3Site: React.FC<{ seg: Segment }> = ({ seg }) => {
  const f = useCurrentFrame();
  const land = 36;
  const push = 44;
  const clickCard = 120;
  const morphStart = 123;
  const clickCta = 290;

  const pillIn = sp(f, 0, "base");
  const out = ramp(f, morphStart, morphStart + 14, E.in);
  const pushed = sp(f, push, "snappy");
  const fallOff = ramp(f, push + 5, push + 30, E.in);

  // O cartão do negócio desce sem rebote (ζ ≈ 0,92).
  const drop = spring({ frame: f - land, fps: FPS, config: { stiffness: 200, damping: 26, mass: 1 } });
  const clinicY = lerp(-320, SLOT_Y[0], drop);

  const m = sp(f, morphStart, "heavy");
  const morphing = f >= morphStart;
  const bx = lerp(CARD.x, BROWSER.x, m);
  const by = lerp(SLOT_Y[0], BROWSER.y, m);
  const bw = lerp(CARD.w, BROWSER.w, m);
  const bh = lerp(CARD.h, BROWSER.h, m);
  const urlChars = Math.floor(clamp((f - 140) / 20) * seg.url.length);

  const hover = sp(f, 258, "snappy") * (1 - ramp(f, clickCta + 6, clickCta + 30));
  const pieces = {
    nav: sp(f, 152, "snappy"),
    head: sp(f, 166, "text"),
    sub: sp(f, 172, "text"),
    img: sp(f, 180, "soft"),
    cards: [sp(f, 194, "soft"), sp(f, 198, "soft"), sp(f, 202, "soft")] as [number, number, number],
    cta: sp(f, 208, "snappy"),
    ctaHover: hover,
    ctaPress: bump(f, clickCta, 12),
  };

  const ctaX = SITE_CTA_CENTER.x + 18;
  const ctaY = SITE_CTA_CENTER.y + 8;
  const keys: [number, number, number][] = [
    [70, 1700, 1190],
    [112, 1310, 512],
    [clickCard + 6, 1310, 512],
    [150, 1540, 860],
    [236, 1540, 860],
    [262, ctaX, ctaY],
  ];
  const { x: cx, y: cy } = pathAt(f, keys, E.io);
  const cursorScale = 1 - 0.14 * bump(f, clickCard, 9) - 0.16 * bump(f, clickCta, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, isolation: "isolate" }}>
      <Words text="ele encontra você." frame={f} start={12} exit={morphStart} size={112} color={C.ink} y={128} width={1920} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-40 * out}px)` }}>
        <SearchPill cx={PILL.cx} cy={PILL.cy} w={PILL.w} h={PILL.h} borderColor={C.blue} borderWidth={3} text={seg.query} caret={f % 60 < 30} scale={lerp(1.08, 1, pillIn)} />
      </div>
      {seg.competitors.map((r, i) => {
        const t0 = 4 + i * 6;
        const inn = sp(f, t0, "snappy");
        const isLast = i === 2;
        return (
          <ResultCard
            key={r.title}
            {...r}
            favColor={COMPETITOR_FAVS[i]}
            x={CARD.x}
            y={SLOT_Y[i] + 60 * (1 - inn) + 148 * pushed + (isLast ? 120 * fallOff : 0) + 60 * out}
            opacity={ramp(f, t0, t0 + 6) * (1 - out) * (isLast ? 1 - fallOff : 1)}
          />
        );
      })}
      {!morphing || f < morphStart + 8 ? (
        <ResultCard
          fav={seg.fav}
          favColor={seg.color}
          url={seg.url}
          title={seg.brand}
          desc={seg.resultDesc}
          x={morphing ? bx : CARD.x}
          y={morphing ? by : clinicY}
          w={morphing ? bw : CARD.w}
          h={morphing ? bh : CARD.h}
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
          url={seg.url.slice(0, urlChars)}
          caret={f >= 136 && f < 172 && f % 30 < 18}
        >
          <BizSite seg={seg} p={pieces} />
        </Browser>
      ) : null}
      <Ripple x={1310} y={512} frame={f} start={clickCard} />
      <Ripple x={SITE_CTA_CENTER.x} y={SITE_CTA_CENTER.y} frame={f} start={clickCta} color={seg.color} maxR={120} dur={26} />
      <Cursor x={cx} y={cy} scale={cursorScale} opacity={ramp(f, 70, 74)} />
    </AbsoluteFill>
  );
};
