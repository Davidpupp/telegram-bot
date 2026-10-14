import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile } from "remotion";
import { FILM_FRAMES, FPS, beat } from "../lib/timing";
import { SCENES, TOAST_STARTS, TYPE_S1, URL_FRAMES, URL_START, AVALANCHE_COUNT, AVALANCHE_START } from "../scenes/layout";
import { SFX_PEAKS, SfxName } from "./sfxPeaks";

// Trilha "Cat Walk" (Arulo, Mixkit #371, 130 BPM). O primeiro tempo forte da batida está em 14,769 s da
// música (medido pela energia de graves); começando em 7,384 s ele cai no drop do filme (7,385 s).
const MUSIC_START_FRAMES = Math.round((14.769 - beat(16) / FPS) * FPS);

type Cue = { name: SfxName; at: number; gain: number; trim?: [number, number]; peak?: number };

/** Lista de efeitos: `at` é o quadro em que o pico do efeito deve cair. */
const s3 = SCENES.s3.from;
const s4 = SCENES.s4.from;
const CUES: Cue[] = [
  // Cena 1: clique, digitação, Enter, resultados, clique no concorrente, pílula vira ponto
  { name: "click", at: beat(2), gain: 0.22 },
  ...TYPE_S1.map((at) => ({ name: "key" as SfxName, at, gain: 0.05 })),
  { name: "soft", at: beat(5), gain: 0.1 },
  ...[0, 1, 2].map((i) => ({ name: "soft" as SfxName, at: beat(5) + 4 + i * 14, gain: 0.07 })),
  { name: "click", at: 290, gain: 0.22 },
  { name: "whoosh", at: 312, gain: 0.06 },
  { name: "bubble", at: 330, gain: 0.08 },
  // Cena 2: inundação, partida do motor, riser, drop com ignição e impacto, segunda acelerada, mergulho
  { name: "whoosh", at: SCENES.s2.from + 10, gain: 0.05 },
  { name: "engine", at: beat(16), gain: 0.3, trim: [0.2, 1.7], peak: 1.079 },
  { name: "rise", at: beat(16), gain: 0.1 },
  { name: "impact", at: beat(16), gain: 0.28 },
  { name: "soft", at: beat(16) + 16, gain: 0.05 },
  { name: "engine", at: beat(18), gain: 0.26, trim: [1.95, 2.9], peak: 2.305 },
  { name: "whoosh", at: beat(20) - 6, gain: 0.08 },
  // Cena 3: concorrentes, Clínica Vida despenca, o último cai, comemoração, clique, montagem do site, clique forte
  ...[4, 10, 16].map((d) => ({ name: "soft" as SfxName, at: s3 + d + 4, gain: 0.06 })),
  { name: "pop", at: s3 + 36, gain: 0.12 },
  { name: "whoosh", at: s3 + 52, gain: 0.05 },
  { name: "bubble", at: s3 + 76, gain: 0.06 },
  { name: "bubble", at: s3 + 88, gain: 0.06 },
  { name: "click", at: beat(24), gain: 0.22 },
  { name: "whoosh", at: beat(24) + 10, gain: 0.06 },
  ...Array.from({ length: 9 }, (_, i) => ({ name: "key" as SfxName, at: URL_START + Math.round((i * 2 * URL_FRAMES) / 18), gain: 0.04 })),
  ...[156, 170, 184, 198, 202, 206].map((d) => ({ name: "soft" as SfxName, at: s3 + d, gain: 0.05 })),
  { name: "pop", at: s3 + 212, gain: 0.08 },
  { name: "click", at: beat(31), gain: 0.26 },
  // Cena 4: inundação, notificações empilhando, avalanche, branco
  { name: "whoosh", at: s4 + 8, gain: 0.06 },
  ...TOAST_STARTS.map((t, k) => ({ name: "toast" as SfxName, at: s4 + t + (k === 0 ? 18 : 9), gain: 0.1 + 0.01 * k })),
  ...Array.from({ length: AVALANCHE_COUNT }, (_, j) => ({ name: "bubble" as SfxName, at: s4 + AVALANCHE_START + j * 3 + 7, gain: 0.035 })),
  { name: "whoosh", at: s4 + 214, gain: 0.07 },
  // Cena 5: logo, STUDIO, botão, clique, piscadinha, emenda do loop
  { name: "pop", at: SCENES.s5.from + 8, gain: 0.14 },
  { name: "soft", at: SCENES.s5.from + 20, gain: 0.06 },
  { name: "pop", at: beat(44) + 4, gain: 0.1 },
  { name: "click", at: beat(47), gain: 0.26 },
  { name: "success", at: beat(47) + 2, gain: 0.12 },
  { name: "sparkle", at: beat(48), gain: 0.12 },
  { name: "whoosh", at: beat(50) + 22, gain: 0.05 },
];

const SfxCue: React.FC<{ cue: Cue }> = ({ cue }) => {
  const meta = SFX_PEAKS[cue.name];
  const trimStart = cue.trim ? cue.trim[0] : 0;
  const peak = cue.peak ?? meta.peak;
  let from = cue.at - Math.round((peak - trimStart) * FPS);
  let trimBefore = Math.round(trimStart * FPS);
  if (from < 0) {
    trimBefore -= from;
    from = 0;
  }
  const volume = Math.min(1, cue.gain / meta.amplitude);
  return (
    <Audio
      src={staticFile(`sfx/${cue.name}.mp3`)}
      from={from}
      trimBefore={trimBefore || undefined}
      trimAfter={cue.trim ? Math.round(cue.trim[1] * FPS) : undefined}
      volume={volume}
    />
  );
};

export const Soundtrack: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <>
    {music ? (
      <Audio
        src={staticFile("audio/cat-walk.mp3")}
        trimBefore={MUSIC_START_FRAMES}
        volume={(f) =>
          interpolate(f, [0, 15, FILM_FRAMES - 54, FILM_FRAMES], [0, 0.85, 0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    ) : null}
    {CUES.map((cue, i) => (
      <SfxCue key={i} cue={cue} />
    ))}
  </>
);
