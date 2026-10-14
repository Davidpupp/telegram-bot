import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { Soundtrack } from "./audio/Soundtrack";
import { C } from "./lib/theme";
import { FPS, beat } from "./lib/timing";
import { S1Busca } from "./scenes/S1Busca";
import { S2Calma } from "./scenes/S2Calma";
import { S3Site } from "./scenes/S3Site";
import { S4Clientes } from "./scenes/S4Clientes";
import { S5Final } from "./scenes/S5Final";

export type V8FilmProps = { audio: boolean; motionBlur: boolean };

/** Soco de câmera depois do drop: +0,6 % por batida e +1,4 % por compasso, com decaimento exponencial. */
const punch = (frame: number) => {
  let s = 0;
  for (let n = 16; n < 48; n++) {
    const t = (frame - beat(n)) / FPS;
    if (t >= 0 && t < 0.6) s += 0.006 * Math.exp(-t * 9) * Math.sin(Math.min(Math.PI, t * 26));
  }
  for (let k = 4; k < 12; k++) {
    const t = (frame - beat(k * 4)) / FPS;
    if (t >= 0 && t < 0.8) s += 0.014 * Math.exp(-t * 7) * Math.sin(Math.min(Math.PI, t * 22));
  }
  return s;
};

/** Cinco cenas em série; as cenas 2 e 4 entram 20 quadros antes para a inundação de cor. */
const Scenes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.white, transform: `scale(${1 + punch(frame)})` }}>
      <Series>
        <Series.Sequence name="1 · Busca" durationInFrames={352}>
          <S1Busca />
        </Series.Sequence>
        <Series.Sequence name="2 · Calma" offset={-20} durationInFrames={222}>
          <S2Calma />
        </Series.Sequence>
        <Series.Sequence name="3 · Site" durationInFrames={352}>
          <S3Site />
        </Series.Sequence>
        <Series.Sequence name="4 · Clientes" offset={-20} durationInFrames={222}>
          <S4Clientes />
        </Series.Sequence>
        <Series.Sequence name="5 · Final" durationInFrames={332}>
          <S5Final />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

/**
 * Filme completo. `motionBlur` liga o desfoque de movimento de câmera (obturador de 180°, 6 amostras),
 * usado no master; o áudio fica fora do desfoque para não ser duplicado.
 */
export const V8Film: React.FC<V8FilmProps> = ({ audio, motionBlur }) => (
  <AbsoluteFill style={{ backgroundColor: C.white }}>
    {motionBlur ? (
      <CameraMotionBlur shutterAngle={180} samples={6}>
        <Scenes />
      </CameraMotionBlur>
    ) : (
      <Scenes />
    )}
    {audio ? <Soundtrack /> : null}
  </AbsoluteFill>
);
