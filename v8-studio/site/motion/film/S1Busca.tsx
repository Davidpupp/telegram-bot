import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Cursor, ResultCard, Ripple, SearchPill, Words, pathAt } from "../compositions/kit";
import { C } from "../lib/theme";
import { E, bump, lerp, ramp, sp } from "../lib/timing";
import { CARD, PILL, SLOT_Y, typedCount, typingFor } from "./layout";
import { COMPETITOR_FAVS, type Segment } from "./segments";

/**
 * Cena 1 · Busca (branco). O cliente digita o que procura e só encontra outras empresas; clica na
 * primeira e vai embora com ela. A pílula encolhe até virar o ponto azul que inunda a cena 2.
 */
export const S1Busca: React.FC<{ seg: Segment }> = ({ seg }) => {
  const f = useCurrentFrame();
  const clickPill = 56;
  const enter = 160;
  const camY = 200 * (1 - sp(f, enter, "base"));

  const schedule = typingFor(seg.query);
  const typed = seg.query.slice(0, typedCount(f, schedule));
  const typing = f >= schedule[0] - 2 && f <= enter + 4;
  const caret = typing || f % 60 < 30;
  const focus = ramp(f, clickPill, clickPill + 6);
  const press = 1 - 0.03 * bump(f, clickPill, 10) - 0.025 * bump(f, enter, 10);
  const toDot = ramp(f, 300, 318, E.io);

  const hoverAt = 226;
  const clickCard = 256;
  const leave = ramp(f, 264, 294, E.in);
  const cardsOut = ramp(f, 292, 306, E.in);

  const keys: [number, number, number][] = [
    [30, 1560, 1190],
    [clickPill, 1250, 548],
    [72, 1250, 548],
    [104, 1420, 700],
    [200, 1420, 700],
    [hoverAt, 1310, 512],
  ];
  let { x: cx, y: cy } = pathAt(f, keys, E.io);
  cx += 1500 * leave;
  cy -= 30 * leave;
  const cursorScale = 1 - 0.14 * bump(f, clickPill, 9) - 0.14 * bump(f, clickCard, 9);

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, isolation: "isolate" }}>
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        <Words text="Seu cliente procura." frame={f} start={6} exit={166} size={112} color={C.ink} y={128} width={1920} />
        <Words text="E encontra outra empresa." frame={f} start={173} exit={300} size={112} color={C.ink} y={128} width={1920} />
        {seg.competitors.map((r, i) => {
          const t0 = enter + i * 14;
          const inn = sp(f, t0, "snappy");
          const isFirst = i === 0;
          const lift = isFirst ? sp(f, hoverAt, "snappy") * (1 - leave) : 0;
          return (
            <ResultCard
              key={r.title}
              {...r}
              favColor={COMPETITOR_FAVS[i]}
              x={CARD.x + (isFirst ? 1500 * leave : 0)}
              y={SLOT_Y[i] + 60 * (1 - inn) + (isFirst ? 0 : 50 * cardsOut)}
              opacity={ramp(f, t0, t0 + 6) * (isFirst ? 1 : 1 - cardsOut)}
              lift={lift}
              scale={isFirst ? 1 - 0.03 * bump(f, clickCard, 10) : 1}
            />
          );
        })}
        <SearchPill
          cx={PILL.cx}
          cy={PILL.cy}
          w={lerp(PILL.w, 26, toDot)}
          h={lerp(PILL.h, 26, toDot)}
          bg={interpolateColors(toDot, [0, 0.55, 1], [C.white, C.white, C.blue])}
          borderColor={interpolateColors(focus, [0, 1], [C.line, C.blue])}
          borderWidth={(2 + focus) * (1 - toDot)}
          shadow={1 - toDot}
          text={typed}
          caret={caret}
          contentOpacity={1 - ramp(f, 300, 306)}
          scale={press}
        />
      </AbsoluteFill>
      <Ripple x={1250} y={548} frame={f} start={clickPill} />
      <Ripple x={1310} y={512} frame={f} start={clickCard} />
      <Cursor x={cx} y={cy} scale={cursorScale} opacity={ramp(f, 30, 34)} />
    </AbsoluteFill>
  );
};
