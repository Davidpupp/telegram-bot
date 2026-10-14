import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Cursor, LOGO_RATIO, Logo, Ripple, SearchPill, Wordmark, Words, pathAt } from "../compositions/kit";
import { C, FONT } from "../lib/theme";
import { E, bump, clamp, lerp, ramp, sp } from "../lib/timing";
import { PILL, SCENES } from "./layout";

const LOGO_W = 520;
const LOGO_H = LOGO_W * LOGO_RATIO;
const LOGO_TOP = 400 - LOGO_H / 2;
const CTA = { cx: 960, cy: 836, w: 320, h: 84 };

/**
 * Cena 5 · Fechamento (branco). Logo, STUDIO, a frase da marca e o botão "Começar". O cursor clica e o botão
 * volta a ser a pílula de busca do primeiro quadro: o filme emenda em loop.
 */
export const S5Final: React.FC = () => {
  const f = useCurrentFrame();
  const absFrame = f + SCENES.s5.from;
  const click = 196;
  const loopStart = 300;

  const pop = sp(f, 4, "soft");
  const out = (start: number) => ramp(f, start, start + 12, E.in);
  const mph = ramp(f, loopStart + 2, loopStart + 47, E.io);
  const ctaPop = sp(f, 110, "snappy");
  const hover = sp(f, 174, "snappy") * (1 - ramp(f, click + 8, click + 40));
  const ctaScale = mph > 0 ? 1 : lerp(0.9, 1, clamp(ctaPop)) * (1 + 0.04 * hover) * (1 - 0.07 * bump(f, click, 12));

  const keys: [number, number, number][] = [
    [150, 1600, 1190],
    [178, 1052, 850],
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
          opacity: clamp(pop * 1.5) * (1 - out(loopStart)),
          transform: `translateY(${-90 * out(loopStart)}px) scale(${lerp(0.9, 1, pop) * (1 - 0.15 * out(loopStart))})`,
        }}
      >
        <Logo width={LOGO_W} color={C.blue} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 1920, top: LOGO_TOP + LOGO_H + 34, opacity: 1 - out(loopStart + 3), transform: `translateY(${-50 * out(loopStart + 3)}px)` }}>
        <Wordmark frame={f} start={16} size={40} color={C.ink} />
      </div>
      <Words text="Seu negócio merece um site que vende." frame={f} start={60} exit={loopStart + 6} size={66} color={C.ink} y={672} width={1920} />
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
          opacity: ramp(f, 124, 136) * (1 - out(loopStart + 9)),
          transform: `translateY(${16 * (1 - ramp(f, 124, 136, E.out)) - 40 * out(loopStart + 9)}px)`,
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
        shadow={lerp(0.85, 1, mph)}
        caret={mph >= 0.999 && absFrame % 60 < 30}
        contentOpacity={ramp(f, loopStart + 24, loopStart + 44)}
        label="Começar"
        labelOpacity={clamp(ctaPop * 2) * (1 - ramp(f, loopStart + 2, loopStart + 18))}
        scale={ctaScale}
      />
      <Ripple x={CTA.cx} y={CTA.cy} frame={f} start={click} maxR={220} dur={34} />
      <Cursor x={cx} y={cy} scale={1 - 0.14 * bump(f, click, 9)} opacity={ramp(f, 150, 154)} />
    </AbsoluteFill>
  );
};
