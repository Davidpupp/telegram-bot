import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, LOGO_PATH, LOGO_VIEW } from "../lib/theme";
import { E, clamp, coverRadius, lerp, ramp, sp } from "../lib/timing";
import { LOGO_RATIO, Logo, Wordmark } from "./kit";

export type Rect = { x: number; y: number; w: number; h: number };
export type LogoIntroProps = { dock?: Rect | null };

// Subcaminhos do logo, na ordem em que o contorno é desenhado: o V nasce no vértice e sobe,
// depois a cunha, o 8 e os dois contadores. O path só tem M, L e Z, então o comprimento é exato.
type Pt = [number, number];
const SUBPATHS: Pt[][] = LOGO_PATH.split("M")
  .map((s) => s.replace(/Z/g, "").trim())
  .filter(Boolean)
  .map((s) => s.split("L").map((p) => p.trim().split(/\s+/).map(Number) as Pt));
const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const closed = (pts: Pt[]) => [...pts, pts[0]];
const LENS = SUBPATHS.map((pts) => closed(pts).slice(1).reduce((acc, p, i) => acc + segLen(closed(pts)[i], p), 0));
const STARTS = LENS.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = LENS.reduce((a, b) => a + b, 0);
const D = SUBPATHS.map((pts) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`);

/** Ponto da ponta da caneta depois de `drawn` unidades de contorno. */
const tipAt = (drawn: number): Pt => {
  for (let k = 0; k < SUBPATHS.length; k++) {
    if (drawn <= STARTS[k] + LENS[k]) {
      let d = drawn - STARTS[k];
      const pts = closed(SUBPATHS[k]);
      for (let i = 1; i < pts.length; i++) {
        const l = segLen(pts[i - 1], pts[i]);
        if (d <= l) {
          const t = l === 0 ? 0 : d / l;
          return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)];
        }
        d -= l;
      }
    }
  }
  return SUBPATHS[0][0];
};

// Vértice do V: de onde o azul preenche o logo.
const VERTEX: Pt = [109, 186];
const FILL_R = coverRadius(VERTEX[0], VERTEX[1], LOGO_VIEW.w, LOGO_VIEW.h);

/**
 * Abertura do site (3,3 s). O contorno do V8 é desenhado num traço contínuo enquanto a câmera recua,
 * o azul preenche o logo a partir do vértice do V, STUDIO sobe letra por letra e o logo encolhe
 * até o lugar dele no cabeçalho. O fundo branco some e revela a página.
 */
const LogoIntro: React.FC<LogoIntroProps> = ({ dock }) => {
  const f = useCurrentFrame();
  const { width: cw, height: ch } = useVideoConfig();

  const W = Math.min(520, cw * 0.56);
  const H = W * LOGO_RATIO;
  const k = W / LOGO_VIEW.w;
  const studio = W * 0.075;
  const blockH = H + W * 0.08 + studio * 1.2;
  const left = cw / 2 - W / 2;
  const top = ch / 2 - blockH / 2;

  const drawP = ramp(f, 8, 92, E.io);
  const drawn = TOTAL * drawP;
  const tip = tipAt(drawn);
  const strokeOut = ramp(f, 100, 112);
  const fillR = FILL_R * ramp(f, 84, 106, E.in);
  const cam = lerp(1.1, 1, ramp(f, 6, 104, E.out));

  const d = dock ? sp(f, 150, "heavy") : 0;
  const s = dock ? lerp(1, dock.w / W, d) : 1;
  const tx = dock ? lerp(0, dock.x - left, d) : 0;
  const ty = dock ? lerp(0, dock.y - top, d) : 0;
  const fadeLogo = dock ? 1 : 1 - ramp(f, 150, 170);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.white, opacity: 1 - ramp(f, 182, 198) }} />
      <AbsoluteFill style={{ transformOrigin: `${cw / 2}px ${top + H / 2}px`, transform: `scale(${cam})` }}>
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: W,
            height: H,
            transformOrigin: "0 0",
            transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            opacity: fadeLogo,
          }}
        >
          <svg viewBox={`0 0 ${LOGO_VIEW.w} ${LOGO_VIEW.h}`} width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - strokeOut }}>
            {D.map((path, i) => {
              const drawnHere = clamp(drawn - STARTS[i], 0, LENS[i]);
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={C.blue}
                  strokeWidth={2.6 / k}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={LENS[i]}
                  strokeDashoffset={LENS[i] - drawnHere}
                />
              );
            })}
            {drawP > 0 && drawP < 1 ? <circle cx={tip[0]} cy={tip[1]} r={5.5 / k} fill={C.blue} /> : null}
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `circle(${fillR * k}px at ${VERTEX[0] * k}px ${VERTEX[1] * k}px)`,
            }}
          >
            <Logo width={W} color={C.blue} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: cw, top: top + H + W * 0.08 }}>
          <Wordmark frame={f} start={100} exit={144} size={studio} color={C.ink} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default LogoIntro;
