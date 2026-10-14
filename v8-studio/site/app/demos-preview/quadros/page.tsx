"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";
import { COMPOSITIONS, type CompId } from "@/motion/compositions/registry";

// Página temporária: quadros exatos das demos para a folha de contato. Apagar depois de conferir.
const IDS: CompId[] = ["demo-landing", "demo-site", "demo-loja", "demo-sistema", "demo-app"];

type W = Window & { __seek?: (f: number) => void; __ready?: boolean };

export default function Quadros() {
  const refs = useRef<Partial<Record<CompId, PlayerRef | null>>>({});
  useEffect(() => {
    const w = window as W;
    w.__seek = (f: number) => {
      for (const id of IDS) refs.current[id]?.seekTo(Math.min(f, COMPOSITIONS[id].duration - 1));
    };
    w.__ready = true;
  }, []);
  return (
    <main style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 24, background: "#fff" }}>
      {IDS.map((id) => {
        const m = COMPOSITIONS[id];
        return (
          <div key={id} data-id={id} style={{ width: 400, aspectRatio: `${m.width} / ${m.height}` }}>
            <Player
              ref={(r) => {
                refs.current[id] = r;
              }}
              lazyComponent={m.lazy}
              durationInFrames={m.duration}
              compositionWidth={m.width}
              compositionHeight={m.height}
              fps={60}
              controls={false}
              initiallyMuted
              acknowledgeRemotionLicense
              renderLoading={() => null}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        );
      })}
    </main>
  );
}
