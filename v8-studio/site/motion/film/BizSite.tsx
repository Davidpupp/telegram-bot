import React from "react";
import { C, FONT } from "../lib/theme";
import { clamp, lerp } from "../lib/timing";
import { ArtMark } from "./art";
import type { Segment } from "./segments";

/** Progresso (0 → 1, a mola pode passar um pouco de 1) de cada peça do site de exemplo. */
export type SitePieces = {
  nav: number;
  head: number;
  sub: number;
  img: number;
  cards: [number, number, number];
  cta: number;
  ctaHover: number;
  ctaPress: number;
};

export const CTA_BOX = { x: 56, y: 452, w: 330, h: 84 };

/** Site do negócio de exemplo, montado peça por peça. Área útil: 1500 × 796. */
export const BizSite: React.FC<{ seg: Segment; p: SitePieces }> = ({ seg, p }) => {
  const fadeIn = (v: number) => clamp(v * 1.6);
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT.ui }}>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 26,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: fadeIn(p.nav),
          transform: `translateY(${(1 - p.nav) * -50}px)`,
        }}
      >
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: seg.color, letterSpacing: "-0.03em" }}>{seg.short}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 44, fontWeight: 500, fontSize: 22, color: C.gray }}>
          {seg.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
          <span style={{ height: 52, padding: "0 26px", borderRadius: 26, background: seg.color, color: C.white, fontWeight: 600, display: "flex", alignItems: "center" }}>
            {seg.navCta}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 140,
          width: 700,
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 88,
          lineHeight: 0.98,
          letterSpacing: "-0.035em",
          color: C.ink,
          opacity: fadeIn(p.head),
          transform: `translateX(${(1 - p.head) * -140}px)`,
        }}
      >
        {seg.headline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 344,
          width: 620,
          fontSize: 27,
          lineHeight: 1.45,
          color: C.gray,
          opacity: fadeIn(p.sub),
          transform: `translateX(${(1 - p.sub) * -100}px)`,
        }}
      >
        {seg.sub}
      </div>
      <div
        style={{
          position: "absolute",
          left: CTA_BOX.x,
          top: CTA_BOX.y,
          width: CTA_BOX.w,
          height: CTA_BOX.h,
          borderRadius: CTA_BOX.h / 2,
          background: seg.color,
          color: C.white,
          fontWeight: 600,
          fontSize: 29,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          boxShadow: `0 ${18 + 10 * p.ctaHover}px ${36 + 16 * p.ctaHover}px -16px rgba(11,18,32,${0.3 + 0.15 * p.ctaHover})`,
          opacity: clamp(p.cta * 2),
          transform: `scale(${lerp(0.9, 1, clamp(p.cta)) * (1 + 0.04 * p.ctaHover) * (1 - 0.06 * p.ctaPress)})`,
        }}
      >
        {seg.cta}
      </div>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 120,
          width: 644,
          height: 420,
          borderRadius: 30,
          background: seg.soft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeIn(p.img),
          transform: `translateX(${(1 - p.img) * 160}px)`,
        }}
      >
        <ArtMark art={seg.art} color={seg.color} />
      </div>
      {seg.services.map(([t, d], i) => (
        <div
          key={t}
          style={{
            position: "absolute",
            left: 56 + i * 472,
            top: 586,
            width: 444,
            height: 160,
            borderRadius: 26,
            background: C.white,
            boxShadow: `inset 0 0 0 2px ${C.line}`,
            opacity: fadeIn(p.cards[i]),
            transform: `translateY(${(1 - p.cards[i]) * 90}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 28, top: 28, width: 48, height: 48, borderRadius: 24, background: seg.soft }} />
          <div style={{ position: "absolute", left: 92, top: 34, fontWeight: 600, fontSize: 28, color: C.ink, lineHeight: "36px", whiteSpace: "nowrap" }}>{t}</div>
          <div style={{ position: "absolute", left: 28, top: 98, fontSize: 22, color: C.gray, whiteSpace: "nowrap" }}>{d}</div>
        </div>
      ))}
    </div>
  );
};
