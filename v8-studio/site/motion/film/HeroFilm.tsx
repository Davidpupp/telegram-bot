import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { C } from "../lib/theme";
import { S1Busca } from "./S1Busca";
import { S2Marca } from "./S2Marca";
import { S3Site } from "./S3Site";
import { S4Clientes } from "./S4Clientes";
import { S5Final } from "./S5Final";
import { SEGMENTS, type SegmentKey } from "./segments";

export type HeroFilmProps = { seg?: SegmentKey };

/**
 * Filme do topo da Home (24 s, loop perfeito, sem som): seu cliente procura, encontra outra empresa;
 * com um site da V8 ele encontra você, o site se monta e os contatos chegam. O negócio de exemplo
 * muda conforme a escolha do visitante.
 */
const HeroFilm: React.FC<HeroFilmProps> = ({ seg = "odonto" }) => {
  const s = SEGMENTS[seg] ?? SEGMENTS.odonto;
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <Series>
        <Series.Sequence name="1 · Busca" durationInFrames={332}>
          <S1Busca seg={s} />
        </Series.Sequence>
        <Series.Sequence name="2 · Marca" offset={-20} durationInFrames={200}>
          <S2Marca />
        </Series.Sequence>
        <Series.Sequence name="3 · Site" durationInFrames={340}>
          <S3Site seg={s} />
        </Series.Sequence>
        <Series.Sequence name="4 · Clientes" offset={-20} durationInFrames={230}>
          <S4Clientes seg={s} />
        </Series.Sequence>
        <Series.Sequence name="5 · Fechamento" durationInFrames={378}>
          <S5Final />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export default HeroFilm;
