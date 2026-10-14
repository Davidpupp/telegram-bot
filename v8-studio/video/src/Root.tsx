import React from "react";
import { Composition, Folder } from "remotion";
import { V8Film } from "./V8Film";
import { S1Busca } from "./scenes/S1Busca";
import { S2Calma } from "./scenes/S2Calma";
import { S3Site } from "./scenes/S3Site";
import { S4Clientes } from "./scenes/S4Clientes";
import { S5Final } from "./scenes/S5Final";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="V8Film"
        component={V8Film}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={1440}
        defaultProps={{ audio: true, motionBlur: false }}
      />
      <Folder name="V8Film-Cenas">
        <Composition id="Cena1-Busca" component={S1Busca} width={1920} height={1080} fps={60} durationInFrames={352} />
        <Composition id="Cena2-Calma" component={S2Calma} width={1920} height={1080} fps={60} durationInFrames={222} />
        <Composition id="Cena3-Site" component={S3Site} width={1920} height={1080} fps={60} durationInFrames={352} />
        <Composition id="Cena4-Clientes" component={S4Clientes} width={1920} height={1080} fps={60} durationInFrames={222} />
        <Composition id="Cena5-Final" component={S5Final} width={1920} height={1080} fps={60} durationInFrames={332} />
      </Folder>
    </>
  );
};
