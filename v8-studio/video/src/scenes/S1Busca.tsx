import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { Words } from "../components/Words";
import { Cursor, Ripple } from "../components/primitives";
import { ResultCard, SearchPill } from "../components/ui";
import { C, FONT } from "../lib/theme";
import { E, bump, lerp, ramp, sp, typedCount } from "../lib/timing";
import { CARD, COMPETITORS, PILL, QUERY, SCENES, SLOT_Y, TYPE_S1, localBeat, pathAt } from "./layout";

/**
 * Cena 1 · Busca (branco). O cliente procura um dentista e só encontra concorrentes;
 * clica no primeiro e vai embora com ele. A pílula encolhe até virar o ponto que inunda a cena 2.
 */
export const S1Busca: React.FC = () => {
  const f = useCurrentFrame();
  const b = (n: number) => localBeat(n, SCENES.s1.from);

  const clickPill = b(2);
  const enter = b(5);
  const camY = 200 * (1 - sp(f, enter, "base"));

  // Pílula
  const typed = QUERY.slice(0, typedCount(f, TYPE_S1));
  const typing = f >= TYPE_S1[0] - 2 && f <= enter + 4;
  const caret = typing || f % 60 < 30;
  const focus = ramp(f, clickPill, clickPill + 6);
  const press = 1 - 0.03 * bump(f, clickPill, 10) - 0.025 * bump(f, enter, 10);
  const toDot = ramp(f, 312, 330, E.io);
  const pillW = lerp(PILL.w, 26, toDot);
  const pillH = lerp(PILL.h, 26, toDot);

  // Cartão 0: o cursor passa, hesita, clica e sai arrastando o concorrente.
  const hoverAt = b(9);
  const clickCard = 290;
  const leave = ramp(f, 297, 322, E.in);
  const cardsOut = ramp(f, 312, 326, E.in);

  // Cursor
  const keys: [number, number, number][] = [
    [b(1), 1560, 1190],
    [clickPill, 1250, 548],
    [70, 1250, 548],
    [102, 1420, 700],
    [b(8), 1420, 700],
    [hoverAt, 1310, 512],
  ];
  let { x: cx, y: cy } = pathAt(f, keys, E.io);
  if (f > 102 && f < b(8)) cy += 5 * Math.sin((2 * Math.PI * (f - 102)) / 50);
  if (f > hoverAt && f < 286) cx += 14 * Math.sin((2 * Math.PI * (f - hoverAt)) / 18) * (1 - ramp(f, hoverAt, 286));
  cx += 1500 * leave;
  cy -= 30 * leave;
  const cursorScale = 1 - 0.16 * bump(f, clickPill, 9) - 0.16 * bump(f, clickCard, 9);

  return (
    <AbsoluteFill style={{ backgroundColor: C.white, isolation: "isolate" }}>
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        <Words text="Seu cliente procura." frame={f} start={6} exit={b(6)} size={112} color={C.ink} family={FONT.display} y={128} />
        <Words
          text="E só acha o concorrente."
          frame={f}
          start={b(6) + 7}
          exit={312}
          size={112}
          color={C.ink}
          family={FONT.display}
          y={128}
        />
        {COMPETITORS.map((r, i) => {
          const t0 = enter + i * 14;
          const inn = sp(f, t0, "snappy");
          const isFirst = i === 0;
          const lift = isFirst ? sp(f, hoverAt, "snappy") * (1 - leave) : 0;
          return (
            <ResultCard
              key={r.title}
              x={CARD.x + (isFirst ? 1500 * leave : 0)}
              y={SLOT_Y[i] + 60 * (1 - inn) + (isFirst ? 0 : 50 * cardsOut)}
              {...r}
              opacity={ramp(f, t0, t0 + 6) * (isFirst ? 1 : 1 - cardsOut)}
              lift={lift}
              rotate={isFirst ? 7 * leave : 0}
              scale={isFirst ? 1 - 0.03 * bump(f, clickCard, 10) : 1}
            />
          );
        })}
        <SearchPill
          cx={PILL.cx}
          cy={PILL.cy}
          w={pillW}
          h={pillH}
          bg={interpolateColors(toDot, [0, 0.55, 1], [C.white, C.white, C.blue])}
          borderColor={interpolateColors(focus, [0, 1], [C.line, C.blue])}
          borderWidth={(2 + focus) * (1 - toDot)}
          shadowK={1 - toDot}
          text={typed}
          caret={caret}
          contentOpacity={1 - ramp(f, 312, 318)}
          scale={press}
        />
      </AbsoluteFill>
      <Ripple x={1250} y={548} frame={f} start={clickPill} />
      <Ripple x={1310} y={512} frame={f} start={clickCard} />
      <Cursor x={cx} y={cy} scale={cursorScale} opacity={ramp(f, b(1), b(1) + 4)} />
    </AbsoluteFill>
  );
};
