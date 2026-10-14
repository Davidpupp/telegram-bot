import React from "react";
import { C, FONT } from "../lib/theme";
import { clamp, lerp } from "../lib/timing";

/** Progresso (0 → 1, molas podem passar de 1) de cada peça do site fictício. */
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

const Tooth: React.FC = () => (
  <svg viewBox="0 0 220 220" width={250} height={250}>
    <path
      d="M64 26 C 34 26, 20 52, 24 86 C 28 120, 42 172, 60 198 C 68 210, 80 202, 82 188 C 86 162, 94 144, 110 144 C 126 144, 134 162, 138 188 C 140 202, 152 210, 160 198 C 178 172, 192 120, 196 86 C 200 52, 186 26, 156 26 C 138 26, 126 36, 110 36 C 94 36, 82 26, 64 26 Z"
      fill={C.white}
      stroke={C.teal}
      strokeWidth={9}
      strokeLinejoin="round"
    />
    <path d="M62 62 C 70 52, 84 50, 92 56" fill="none" stroke={C.teal} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
  </svg>
);

/** Site da "Clínica Vida" (exemplo ilustrativo), montado peça por peça. Área: 1500 × 796. */
export const ClinicSite: React.FC<{ p: SitePieces }> = ({ p }) => {
  const fadeIn = (v: number) => clamp(v * 1.6);
  const services: [string, string][] = [
    ["Limpeza", "Prevenção sem complicação"],
    ["Clareamento", "Sorriso mais claro"],
    ["Implantes", "Planejamento completo"],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: FONT.ui }}>
      {/* Menu */}
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
        <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: C.teal, letterSpacing: "-0.03em" }}>Vida</div>
        <div style={{ display: "flex", alignItems: "center", gap: 44, fontWeight: 500, fontSize: 22, color: C.gray }}>
          <span>Tratamentos</span>
          <span>Equipe</span>
          <span>Contato</span>
          <span
            style={{
              height: 52,
              padding: "0 26px",
              borderRadius: 26,
              background: C.teal,
              color: C.white,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            Agendar
          </span>
        </div>
      </div>
      {/* Título */}
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
        Seu sorriso em boas mãos.
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
        Clínica odontológica com atendimento de segunda a sábado.
      </div>
      {/* Botão principal */}
      <div
        style={{
          position: "absolute",
          left: CTA_BOX.x,
          top: CTA_BOX.y,
          width: CTA_BOX.w,
          height: CTA_BOX.h,
          borderRadius: CTA_BOX.h / 2,
          background: C.teal,
          color: C.white,
          fontWeight: 600,
          fontSize: 29,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          boxShadow: `0 ${18 + 10 * p.ctaHover}px ${36 + 16 * p.ctaHover}px -16px rgba(27,122,107,${0.45 + 0.2 * p.ctaHover})`,
          transform: `scale(${Math.max(0, p.cta) * (1 + 0.05 * p.ctaHover) * (1 - 0.1 * p.ctaPress)})`,
        }}
      >
        Agendar consulta
      </div>
      {/* Imagem */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 120,
          width: 644,
          height: 420,
          borderRadius: 30,
          background: C.tealSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeIn(p.img),
          transform: `translateX(${(1 - p.img) * 220}px) rotate(${(1 - p.img) * 7}deg)`,
        }}
      >
        <div style={{ transform: `rotate(${lerp(-10, 0, clamp(p.img))}deg)` }}>
          <Tooth />
        </div>
      </div>
      {/* Serviços */}
      {services.map(([t, d], i) => (
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
          <div style={{ position: "absolute", left: 28, top: 28, width: 48, height: 48, borderRadius: 24, background: C.tealSoft }} />
          <div style={{ position: "absolute", left: 92, top: 34, fontWeight: 600, fontSize: 28, color: C.ink, lineHeight: "36px", whiteSpace: "nowrap" }}>{t}</div>
          <div style={{ position: "absolute", left: 28, top: 98, fontSize: 22, color: C.gray, whiteSpace: "nowrap" }}>{d}</div>
        </div>
      ))}
    </div>
  );
};
