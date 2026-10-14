import React from "react";
import { C, FONT, LOGO_PATH, LOGO_VIEW, SHADOW, SHADOW_ON_BLUE } from "../lib/theme";
import { E, clamp, ramp, sp } from "../lib/timing";

// Peças visuais compartilhadas pelas composições (as mesmas do filme, sem a parte cômica).

export const LOGO_RATIO = LOGO_VIEW.h / LOGO_VIEW.w;

export const shadowK = (k: number) =>
  `0 24px 64px -24px rgba(13,32,96,${(0.28 * k).toFixed(3)}), 0 8px 24px -12px rgba(13,32,96,${(0.16 * k).toFixed(3)})`;

/** Cursor de seta com contorno branco. (x, y) é a ponta da seta. */
export const Cursor: React.FC<{ x: number; y: number; scale?: number; opacity?: number; size?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
  size = 58,
}) => (
  <svg
    viewBox="0 0 44 44"
    width={size}
    height={size}
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      overflow: "visible",
      zIndex: 100,
      opacity,
      transformOrigin: `${(6.6 * size) / 58}px ${(4 * size) / 58}px`,
      transform: `translate(${x - (6.6 * size) / 58}px, ${y - (4 * size) / 58}px) scale(${scale})`,
      filter: "drop-shadow(0 6px 10px rgba(13,32,96,0.35))",
    }}
  >
    <path d="M5 3 L5 34 L12.5 27 L17.5 39 L22.5 37 L17.6 25.4 L27.5 25.4 Z" fill={C.ink} stroke={C.white} strokeWidth={2.4} strokeLinejoin="round" />
  </svg>
);

/** Onda de clique: anel que cresce e some. */
export const Ripple: React.FC<{ x: number; y: number; frame: number; start: number; color?: string; maxR?: number; dur?: number }> = ({
  x,
  y,
  frame,
  start,
  color = C.blue,
  maxR = 72,
  dur = 22,
}) => {
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

/** Logo V8 oficial (um único path, regra evenodd). */
export const Logo: React.FC<{ width: number; color: string; style?: React.CSSProperties }> = ({ width, color, style }) => (
  <svg viewBox={`0 0 ${LOGO_VIEW.w} ${LOGO_VIEW.h}`} width={width} height={width * LOGO_RATIO} style={{ overflow: "visible", display: "block", ...style }}>
    <path d={LOGO_PATH} fill={color} fillRule="evenodd" />
  </svg>
);

/** STUDIO em Montserrat 600, letra por letra de dentro de uma máscara. */
export const Wordmark: React.FC<{
  frame: number;
  start: number;
  size: number;
  color: string;
  exit?: number;
  stagger?: number;
}> = ({ frame, start, size, color, exit, stagger = 2.5 }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      fontFamily: FONT.word,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "0.46em",
      paddingLeft: "0.46em",
      color,
      lineHeight: 1.2,
    }}
  >
    {"STUDIO".split("").map((ch, i) => {
      const u = sp(frame, start + i * stagger, "text");
      const o = exit == null ? 0 : ramp(frame, exit + i * 1.5, exit + i * 1.5 + 12, E.in);
      return (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.1em 0", margin: "-0.1em 0" }}>
          <span style={{ display: "inline-block", transform: `translateY(${(1 - u) * 110 + o * 110}%)` }}>{ch}</span>
        </span>
      );
    })}
  </div>
);

/** Frase cinética: cada palavra sobe de dentro de uma máscara, com mola de texto e 6° de rotação. */
export const Words: React.FC<{
  text: string;
  frame: number;
  start: number;
  exit?: number;
  exitDir?: "up" | "down";
  exitDur?: number;
  size: number;
  color: string;
  family?: string;
  weight?: number;
  align?: "center" | "left";
  x?: number;
  y: number;
  width: number;
  stagger?: number;
  lineHeight?: number;
  letterSpacing?: string;
  z?: number;
}> = ({
  text,
  frame,
  start,
  exit,
  exitDir = "up",
  exitDur = 16,
  size,
  color,
  family = FONT.display,
  weight = 800,
  align = "center",
  x = 0,
  y,
  width,
  stagger = 3.3,
  lineHeight = 1.06,
  letterSpacing = "-0.03em",
  z = 20,
}) => {
  const lines = text.split("\n").map((l) => l.split(" "));
  let k = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing,
        color,
        zIndex: z,
      }}
    >
      {lines.map((words, li) => (
        <div key={li} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.24, whiteSpace: "nowrap" }}>
          {words.map((w) => {
            const i = k++;
            const u = sp(frame, start + i * stagger, "text");
            const o = exit == null ? 0 : ramp(frame, exit + i * 2, exit + i * 2 + exitDur, E.in);
            const ty = (1 - u) * 112 + (exitDir === "up" ? -1 : 1) * o * 112;
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.16em 0.06em 0.2em", margin: "-0.16em -0.06em -0.2em" }}>
                <span style={{ display: "inline-block", transformOrigin: "0% 100%", transform: `translateY(${ty}%) rotate(${(1 - clamp(u)) * 6}deg)` }}>{w}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round">
    <circle cx={13.5} cy={13.5} r={9} />
    <path d="M20.5 20.5 L28 28" />
  </svg>
);

export const CheckBadge: React.FC<{ size: number; bg: string; fg: string }> = ({ size, bg, fg }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <circle cx={30} cy={30} r={30} fill={bg} />
    <path d="M18 31 L26 39 L43 22" fill="none" stroke={fg} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A pílula: barra de busca que também vira o botão "Começar". */
export const SearchPill: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  shadow?: number;
  text?: string;
  caret?: boolean;
  contentOpacity?: number;
  label?: string;
  labelOpacity?: number;
  scale?: number;
  fontSize?: number;
}> = ({
  cx,
  cy,
  w,
  h,
  bg = C.white,
  borderColor = C.line,
  borderWidth = 2,
  shadow = 1,
  text = "",
  caret = false,
  contentOpacity = 1,
  label,
  labelOpacity = 0,
  scale = 1,
  fontSize = 36,
}) => (
  <div
    style={{
      position: "absolute",
      left: cx - w / 2,
      top: cy - h / 2,
      width: w,
      height: h,
      borderRadius: h / 2,
      background: bg,
      boxShadow: `inset 0 0 0 ${borderWidth}px ${borderColor}, ${shadowK(shadow)}`,
      transform: `scale(${scale})`,
      overflow: "hidden",
      zIndex: 30,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: fontSize,
        top: 0,
        height: h,
        display: "flex",
        alignItems: "center",
        gap: fontSize * 0.6,
        opacity: contentOpacity,
        whiteSpace: "nowrap",
      }}
    >
      <SearchIcon size={fontSize} color={C.blue} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", height: h }}>
        {text ? null : (
          <span style={{ position: "absolute", left: 8, fontFamily: FONT.ui, fontWeight: 500, fontSize, color: C.gray, letterSpacing: "-0.01em" }}>Pesquisar</span>
        )}
        <span style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize, color: C.ink, letterSpacing: "-0.01em" }}>{text}</span>
        <span style={{ display: "inline-block", width: 3, height: fontSize * 1.16, marginLeft: 3, background: C.blue, opacity: caret ? 1 : 0 }} />
      </div>
    </div>
    {label ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT.ui,
          fontWeight: 600,
          fontSize: fontSize * 0.94,
          color: C.white,
          opacity: labelOpacity,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    ) : null}
  </div>
);

export type Result = { fav: string; favColor: string; url: string; title: string; desc: string };

/** Resultado de busca. */
export const ResultCard: React.FC<
  Result & {
    x: number;
    y: number;
    w?: number;
    h?: number;
    highlight?: number;
    highlightColor?: string;
    lift?: number;
    opacity?: number;
    scale?: number;
    contentOpacity?: number;
    z?: number;
  }
> = ({ x, y, w = 1000, h = 132, fav, favColor, url, title, desc, highlight = 0, highlightColor = C.blue, lift = 0, opacity = 1, scale = 1, contentOpacity = 1, z = 25 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 24,
      background: C.white,
      boxShadow: `inset 0 0 0 ${3 * highlight}px ${highlightColor}, ${shadowK(1 + lift * 0.7)}`,
      opacity,
      transform: `translateY(${-8 * lift}px) scale(${scale})`,
      zIndex: z,
    }}
  >
    <div style={{ opacity: contentOpacity, position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: h / 2 - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          background: favColor,
          color: C.white,
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {fav}
      </div>
      <div style={{ position: "absolute", left: 116, top: 16, right: 30, whiteSpace: "nowrap", overflow: "hidden" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 21, color: C.gray, lineHeight: "28px" }}>{url}</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: "46px", letterSpacing: "-0.015em" }}>{title}</div>
        <div style={{ fontFamily: FONT.ui, fontWeight: 400, fontSize: 21, color: C.gray, lineHeight: "28px" }}>{desc}</div>
      </div>
    </div>
  </div>
);

/** Moldura de navegador com barra de endereço. */
export const Browser: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  chromeOpacity?: number;
  url: string;
  caret?: boolean;
  bar?: number;
  children?: React.ReactNode;
  z?: number;
  shadow?: string;
}> = ({ x, y, w, h, radius = 28, chromeOpacity = 1, url, caret = false, bar = 64, children, z = 40, shadow = SHADOW }) => {
  const k = bar / 64;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: radius, background: C.white, boxShadow: shadow, overflow: "hidden", zIndex: z }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: bar, opacity: chromeOpacity, borderBottom: `2px solid ${C.line}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: (28 + i * 24) * k, top: 25 * k, width: 14 * k, height: 14 * k, borderRadius: 7 * k, background: C.line }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 120 * k,
            right: 28 * k,
            top: 14 * k,
            height: 36 * k,
            borderRadius: 18 * k,
            background: C.paper,
            fontFamily: FONT.ui,
            fontWeight: 500,
            fontSize: 20 * k,
            color: C.gray,
            display: "flex",
            alignItems: "center",
            paddingLeft: 20 * k,
            whiteSpace: "nowrap",
          }}
        >
          {url}
          <span style={{ display: "inline-block", width: 2, height: 22 * k, marginLeft: 2, background: C.ink, opacity: caret ? 1 : 0 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: bar, width: w, height: h - bar }}>{children}</div>
    </div>
  );
};

/** Notificação de novo cliente. */
export const Toast: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub: string;
  scale?: number;
  opacity?: number;
  bg?: string;
  radius?: number;
  contentOpacity?: number;
  z?: number;
  badge?: string;
}> = ({ x, y, w = 600, h = 104, title, sub, scale = 1, opacity = 1, bg = C.white, radius = 26, contentOpacity = 1, z = 30, badge = C.blue }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      background: bg,
      boxShadow: SHADOW_ON_BLUE,
      transform: `scale(${scale})`,
      opacity,
      zIndex: z,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
      <div style={{ position: "absolute", left: 22, top: h / 2 - 30 }}>
        <CheckBadge size={60} bg={badge} fg={C.white} />
      </div>
      <div style={{ position: "absolute", left: 104, top: h / 2 - 34, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 29, color: C.ink, lineHeight: "38px", letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 21, color: C.gray, lineHeight: "28px" }}>{sub}</div>
      </div>
    </div>
  </div>
);

/** Interpolação por quadros-chave [quadro, x, y] com easing entre cada par. */
export const pathAt = (frame: number, keys: [number, number, number][], ease: (t: number) => number = E.io) => {
  if (frame <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [f1, x1, y1] = keys[i];
    if (frame <= f1) {
      const [f0, x0, y0] = keys[i - 1];
      const t = ease((frame - f0) / Math.max(1, f1 - f0));
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last[1], y: last[2] };
};
