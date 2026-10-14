import React from "react";
import { C, FONT, SHADOW } from "../lib/theme";
import { CheckBadge, SearchIcon } from "./primitives";

const shadow = (k: number) =>
  `0 24px 64px -24px rgba(13,32,96,${(0.28 * k).toFixed(3)}), 0 8px 24px -12px rgba(13,32,96,${(0.16 * k).toFixed(3)})`;

/** A pílula: barra de busca que também vira o botão "Começar" no fechamento. */
export const SearchPill: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  shadowK?: number;
  text?: string;
  caret?: boolean;
  contentOpacity?: number;
  label?: string;
  labelOpacity?: number;
  scale?: number;
}> = ({
  cx,
  cy,
  w,
  h,
  bg = C.white,
  borderColor = C.line,
  borderWidth = 2,
  shadowK = 1,
  text = "",
  caret = false,
  contentOpacity = 1,
  label,
  labelOpacity = 0,
  scale = 1,
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
      boxShadow: `inset 0 0 0 ${borderWidth}px ${borderColor}, ${shadow(shadowK)}`,
      transform: `scale(${scale})`,
      overflow: "hidden",
      zIndex: 30,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 0,
        height: h,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: contentOpacity,
        whiteSpace: "nowrap",
      }}
    >
      <SearchIcon size={36} color={C.blue} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", height: h }}>
        {text ? null : (
          <span style={{ position: "absolute", left: 8, fontFamily: FONT.ui, fontWeight: 500, fontSize: 36, color: C.gray, letterSpacing: "-0.01em" }}>
            Pesquisar
          </span>
        )}
        <span style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 36, color: C.ink, letterSpacing: "-0.01em" }}>{text}</span>
        <span style={{ display: "inline-block", width: 3, height: 42, marginLeft: 3, background: C.blue, opacity: caret ? 1 : 0 }} />
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
          fontSize: 34,
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

/** Resultado de busca. */
export const ResultCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  fav: string;
  favColor: string;
  url: string;
  title: string;
  desc: string;
  highlight?: number;
  lift?: number;
  opacity?: number;
  rotate?: number;
  scale?: number;
  contentOpacity?: number;
  z?: number;
}> = ({ x, y, w = 1000, h = 132, fav, favColor, url, title, desc, highlight = 0, lift = 0, opacity = 1, rotate = 0, scale = 1, contentOpacity = 1, z = 25 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 24,
      background: C.white,
      boxShadow: `inset 0 0 0 ${3 * highlight}px ${C.blue}, ${shadow(1 + lift * 0.7)}`,
      opacity,
      transform: `translateY(${-8 * lift}px) rotate(${rotate}deg) scale(${scale})`,
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
      <div style={{ position: "absolute", left: 116, top: 16, right: 30, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 21, color: C.gray, lineHeight: "28px" }}>{url}</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: "46px", letterSpacing: "-0.015em" }}>
          {title}
        </div>
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
  radius: number;
  chromeOpacity: number;
  url: string;
  caret?: boolean;
  children?: React.ReactNode;
}> = ({ x, y, w, h, radius, chromeOpacity, url, caret = false, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      background: C.white,
      boxShadow: SHADOW,
      overflow: "hidden",
      zIndex: 40,
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: 64, opacity: chromeOpacity, borderBottom: `2px solid ${C.line}` }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 28 + i * 24, top: 25, width: 14, height: 14, borderRadius: 7, background: C.line }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 28,
          top: 14,
          height: 36,
          borderRadius: 18,
          background: C.paper,
          fontFamily: FONT.ui,
          fontWeight: 500,
          fontSize: 20,
          color: C.gray,
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          whiteSpace: "nowrap",
        }}
      >
        {url}
        <span style={{ display: "inline-block", width: 2, height: 22, marginLeft: 2, background: C.ink, opacity: caret ? 1 : 0 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 64, width: w, height: h - 64 }}>{children}</div>
  </div>
);

/** Notificação de novo cliente. */
export const Toast: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  rotate?: number;
  scale?: number;
  opacity?: number;
  bg?: string;
  radius?: number;
  contentOpacity?: number;
  z?: number;
}> = ({ x, y, w = 600, h = 104, title, sub = "Clínica Vida · agora", rotate = 0, scale = 1, opacity = 1, bg = C.white, radius = 26, contentOpacity = 1, z = 30 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      background: bg,
      boxShadow: "0 28px 60px -20px rgba(6,16,60,0.5), 0 8px 20px -10px rgba(6,16,60,0.3)",
      transform: `rotate(${rotate}deg) scale(${scale})`,
      opacity,
      zIndex: z,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
      <div style={{ position: "absolute", left: 22, top: h / 2 - 30 }}>
        <CheckBadge size={60} bg={C.blue} fg={C.white} />
      </div>
      <div style={{ position: "absolute", left: 104, top: h / 2 - 34, whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 29, color: C.ink, lineHeight: "38px", letterSpacing: "-0.01em" }}>{title}</div>
        <div style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: 21, color: C.gray, lineHeight: "28px" }}>{sub}</div>
      </div>
    </div>
  </div>
);
