"use client";

import { Player, type PlayerRef } from "@remotion/player";
import LogoIntro, { type LogoIntroProps } from "./compositions/LogoIntro";

const noop = () => null;

/** O Player da abertura do logo, num pedaço de código à parte: só é baixado quando a abertura vai tocar. */
export default function IntroPlayer({ w, h, props, onRef }: { w: number; h: number; props: LogoIntroProps; onRef: (p: PlayerRef | null) => void }) {
  return (
    <Player
      ref={onRef}
      component={LogoIntro}
      inputProps={props}
      durationInFrames={200}
      compositionWidth={w}
      compositionHeight={h}
      fps={60}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      allowFullscreen={false}
      errorFallback={noop}
      renderLoading={noop}
      acknowledgeRemotionLicense
      initiallyMuted
      style={{ width: "100%", height: "100%" }}
    />
  );
}
