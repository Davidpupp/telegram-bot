"use client";

import { Thumbnail } from "@remotion/player";
import LogoIntro from "@/motion/compositions/LogoIntro";
import { COMPOSITIONS, type CompId } from "@/motion/compositions/registry";
import { useMounted } from "@/motion/hooks";
import { FPS } from "@/motion/lib/timing";

// Separado das outras ferramentas das pranchas: só a prancha de movimento baixa o Player do Remotion.
const DOCK_1920 = { x: 360, y: 25, w: 43, h: 26 };
const noop = () => null;

/** Um quadro parado de uma composição do Remotion (abertura do logo ou qualquer composição registrada). */
export function Frame({ comp, frame, inputProps }: { comp: "logo-intro" | CompId; frame: number; inputProps?: Record<string, unknown> }) {
  // Só no cliente: o HTML do servidor do Thumbnail não bate com o do navegador.
  const mounted = useMounted();
  const ratio = comp === "logo-intro" ? "16 / 9" : `${COMPOSITIONS[comp].width} / ${COMPOSITIONS[comp].height}`;
  if (!mounted) return <div style={{ width: "100%", aspectRatio: ratio, background: "var(--color-paper)" }} />;
  if (comp === "logo-intro") {
    return (
      <Thumbnail
        component={LogoIntro}
        inputProps={{ dock: DOCK_1920 }}
        frameToDisplay={frame}
        durationInFrames={200}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={FPS}
        errorFallback={noop}
        style={{ width: "100%", aspectRatio: "16 / 9", display: "block" }}
      />
    );
  }
  const meta = COMPOSITIONS[comp];
  return (
    <Thumbnail
      lazyComponent={meta.lazy}
      inputProps={inputProps ?? {}}
      frameToDisplay={frame}
      durationInFrames={meta.duration}
      compositionWidth={meta.width}
      compositionHeight={meta.height}
      fps={FPS}
      errorFallback={noop}
      style={{ width: "100%", aspectRatio: `${meta.width} / ${meta.height}`, display: "block" }}
    />
  );
}
