import React from "react";
import { C } from "../lib/theme";

/** Cursor de seta com contorno branco. (x, y) é a ponta da seta. */
export const Cursor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, rotate = 0, opacity = 1 }) => (
  <svg
    viewBox="0 0 44 44"
    width={58}
    height={58}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
      zIndex: 100,
      opacity,
      transformOrigin: "6.6px 4px",
      transform: `translate(${x - 6.6}px, ${y - 4}px) rotate(${rotate}deg) scale(${scale})`,
      filter: "drop-shadow(0 6px 10px rgba(13,32,96,0.35))",
    }}
  >
    <path
      d="M5 3 L5 34 L12.5 27 L17.5 39 L22.5 37 L17.6 25.4 L27.5 25.4 Z"
      fill={C.ink}
      stroke={C.white}
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
  </svg>
);

/** Onda de clique: anel que cresce e some. */
export const Ripple: React.FC<{
  x: number;
  y: number;
  frame: number;
  start: number;
  color?: string;
  maxR?: number;
  dur?: number;
}> = ({ x, y, frame, start, color = C.blue, maxR = 72, dur = 22 }) => {
  const p = (frame - start) / dur;
  if (p < 0 || p > 1) return null;
  const e = 1 - Math.pow(1 - p, 3);
  const r = 10 + e * (maxR - 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: "50%",
        border: `${1 + 4 * (1 - p)}px solid ${color}`,
        opacity: 1 - p,
        zIndex: 99,
      }}
    />
  );
};

export const LOGO_PATH =
  "M93 186 L125 186 L171 94 L149 56 L109 133 L43 0 L0 0 Z M161 0 L119 0 L96 46 L117 90 Z M171 112 L171 164 L192 186 L288 186 L308 164 L308 112 L286 93 L308 74 L308 22 L287 0 L192 0 L171 22 L171 74 L193 93 Z M208 111 L270 111 L270 151 L208 151 Z M208 35 L270 35 L270 75 L208 75 Z";
export const LOGO_RATIO = 186 / 308;

/** Logo V8 vetorizado. `wink` de 0 a 1 fecha o olho de baixo do 8 (contador inferior). */
export const Logo: React.FC<{
  width: number;
  color: string;
  wink?: number;
  style?: React.CSSProperties;
}> = ({ width, color, wink = 0, style }) => (
  <svg viewBox="0 0 308 186" width={width} height={width * LOGO_RATIO} style={{ overflow: "visible", ...style }}>
    <path d={LOGO_PATH} fill={color} fillRule="evenodd" />
    {wink > 0.001 ? (
      <rect
        x={206}
        y={109}
        width={66}
        height={44}
        fill={color}
        transform={`translate(0 131) scale(1 ${wink}) translate(0 -131)`}
      />
    ) : null}
  </svg>
);

/** Ícone de lupa (traço). */
export const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round">
    <circle cx={13.5} cy={13.5} r={9} />
    <path d="M20.5 20.5 L28 28" />
  </svg>
);

/** Ícone de confirmação (traço) dentro de um círculo. */
export const CheckBadge: React.FC<{ size: number; bg: string; fg: string }> = ({ size, bg, fg }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <circle cx={30} cy={30} r={30} fill={bg} />
    <path d="M18 31 L26 39 L43 22" fill="none" stroke={fg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
