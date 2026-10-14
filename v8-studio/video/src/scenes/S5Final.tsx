import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Words } from "../components/Words";
import { Cursor, Logo, LOGO_RATIO, Ripple } from "../components/primitives";
import { SearchPill } from "../components/ui";
import { C, FONT } from "../lib/theme";
import { E, bump, lerp, ramp, sp } from "../lib/timing";
import { PILL, SCENES, localBeat, pathAt } from "./layout";

const LOGO_W = 520;
const LOGO_H = LOGO_W * LOGO_RATIO;
const LOGO_TOP = 400 - LOGO_H / 2;
const CTA = { cx: 960, cy: 836, w: 320, h: 84 };

/**
 * Cena 5 · Fechamento (branco). O logo pula, STUDIO, a frase da marca e o botão "Começar".
 * O cursor clica, o logo dá uma piscadinha no compasso em que a música sobe, e o botão volta a ser
 * a pílula de busca do primeiro quadro: o filme emenda em loop.
 */
export const S5Final: React.FC = () => {
  const f = useCurrentFrame();
  const b = (n: number) => localBeat(n, SCENES.s5.from);
  const absFrame = f + SCENES.s5.from;
  const click = b(47);
  const wink = b(48);
  const loopStart = b(50);

  const pop = sp(f, 4, "slam");
  const breathe = f > 236 ? 1 + 0.006 * Math.sin((2 * Math.PI * (f - 236)) / 70) : 1;
  const tilt = 6 * bump(f, wink - 2, 30);
  const out = (start: number) => ramp(f, start, start + 12, E.in);

  // Botão "Começar" → pílula de busca (emenda do loop).
  const mph = ramp(f, loopStart + 2, loopStart + 47, E.io);
  const ctaPop = sp(f, b(44), "playful");
  const hover = sp(f, b(46) - 2, "snappy") * (1 - ramp(f, click + 8, click + 40));
  const ctaScale =
    mph > 0
      ? 1
      : Math.max(0, ctaPop) * (1 + 0.04 * hover) * (1 - 0.09 * bump(f, click, 12)) * (1 + 0.06 * bump(f, wink + 2, 14));

  const keys: [number, number, number][] = [
    [b(45), 1600, 1190],
    [b(46), 1052, 850],
    [click + 30, 1052, 850],
    [click + 70, 1640, 1220],
  ];
  const { x: cx, y: cy } = pathAt(f, keys, E.io);

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, isolation: "isolate" }}>
      <div
        style={{
          position: "absolute",
          left: 960 - LOGO_W / 2,
          top: LOGO_TOP,
          width: LOGO_W,
          height: LOGO_H,
          opacity: 1 - out(loopStart),
          transform: `translateY(${-90 * out(loopStart)}px) rotate(${tilt}deg) scale(${Math.max(0, pop) * breathe * (1 - 0.15 * out(loopStart))})`,
        }}
      >
        <Logo width={LOGO_W} color={C.blue} wink={bump(f, wink, 16)} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: LOGO_TOP + LOGO_H + 34,
          display: "flex",
          justifyContent: "center",
          fontFamily: FONT.word,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: "0.46em",
          paddingLeft: "0.46em",
          color: C.ink,
          opacity: 1 - out(loopStart + 3),
          transform: `translateY(${-50 * out(loopStart + 3)}px)`,
        }}
      >
        {"STUDIO".split("").map((ch, i) => {
          const u = sp(f, 16 + i * 2.5, "text");
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.1em 0", margin: "-0.1em 0" }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - u) * 110}%)` }}>{ch}</span>
            </span>
          );
        })}
      </div>
      <Words
        text="Seu negócio merece um site que vende."
        frame={f}
        start={b(42)}
        exit={loopStart + 6}
        size={66}
        color={C.ink}
        family={FONT.display}
        y={672}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 902,
          textAlign: "center",
          fontFamily: FONT.ui,
          fontWeight: 500,
          fontSize: 27,
          color: C.gray,
          opacity: ramp(f, b(44) + 14, b(44) + 26) * (1 - out(loopStart + 9)),
          transform: `translateY(${16 * (1 - ramp(f, b(44) + 14, b(44) + 26, E.out)) - 40 * out(loopStart + 9)}px)`,
        }}
      >
        Leva 2 minutos. Sem compromisso.
      </div>
      <SearchPill
        cx={CTA.cx}
        cy={lerp(CTA.cy, PILL.cy + 200, mph)}
        w={lerp(CTA.w, PILL.w, mph)}
        h={lerp(CTA.h, PILL.h, mph)}
        bg={interpolateColors(mph, [0, 0.55], [C.blue, C.white])}
        borderColor={C.line}
        borderWidth={2 * ramp(mph, 0.35, 0.7, (t) => t)}
        shadowK={lerp(0.85, 1, mph)}
        text=""
        caret={mph >= 0.999 && absFrame % 60 < 30}
        contentOpacity={ramp(f, loopStart + 24, loopStart + 44)}
        label="Começar"
        labelOpacity={1 - ramp(f, loopStart + 2, loopStart + 18)}
        scale={ctaScale}
      />
      <Ripple x={CTA.cx} y={CTA.cy} frame={f} start={click} maxR={260} dur={34} />
      <Cursor x={cx} y={cy} scale={1 - 0.16 * bump(f, click, 9)} opacity={ramp(f, b(45), b(45) + 4)} />
    </AbsoluteFill>
  );
};
