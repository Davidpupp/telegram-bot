"use client";

import type { PlayerRef } from "@remotion/player";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COMPOSITIONS, type CompId } from "./compositions/registry";
import { useInView, useMounted, useReducedMotion } from "./hooks";
import { useIntroGate } from "./intro";
import { cx } from "./lib/cx";

type Props = {
  /** Composição registrada em motion/compositions/registry.ts. */
  id: CompId;
  /** Descrição do que a animação mostra (leitores de tela). */
  label: string;
  inputProps?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
  /** Quando muda, a animação volta ao quadro 0. */
  restartKey?: string | number;
  /** Condição extra para tocar. */
  gate?: boolean;
  loop?: boolean;
};

const noop = () => null;
// O Player (e o próprio Remotion) só é baixado depois que a página aparece.
const Player = lazy(() => import("@remotion/player").then((m) => ({ default: m.Player })));

/**
 * <Player> do Remotion embutido na página: toca sozinho quando aparece na tela, pausa quando sai,
 * sem controles nem som. Com movimento reduzido, mostra só o quadro-pôster da composição.
 * Começa mudo: sem isso o Player espera um clique liberar o áudio do navegador antes de andar.
 */
export function MotionPlayer({ id, label, inputProps, className, style, restartKey, gate = true, loop = true }: Props) {
  const meta = COMPOSITIONS[id];
  const wrap = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const onRef = useCallback((p: PlayerRef | null) => setPlayer(p), []);
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const visible = useInView(wrap, { threshold: 0.25, once: false, rootMargin: "0px" });
  const intro = useIntroGate();
  const key = JSON.stringify(inputProps ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo(() => inputProps ?? {}, [key]);

  useEffect(() => {
    if (!player) return;
    if (reduce) {
      player.pause();
      player.seekTo(meta.poster);
      return;
    }
    if (visible && intro && gate) player.play();
    else player.pause();
  }, [player, visible, intro, gate, reduce, meta.poster]);

  useEffect(() => {
    if (!player || restartKey === undefined || reduce) return;
    player.seekTo(0);
  }, [player, restartKey, reduce]);

  return (
    <div ref={wrap} className={cx("player", className)} style={{ aspectRatio: `${meta.width} / ${meta.height}`, ...style }} role="img" aria-label={label}>
      {mounted ? (
        <Suspense fallback={null}>
          <Player
            ref={onRef}
            lazyComponent={meta.lazy}
            inputProps={props}
            durationInFrames={meta.duration}
            compositionWidth={meta.width}
            compositionHeight={meta.height}
            fps={60}
            loop={loop}
            initialFrame={reduce ? meta.poster : 0}
            controls={false}
            clickToPlay={false}
            doubleClickToFullscreen={false}
            spaceKeyToPlayOrPause={false}
            allowFullscreen={false}
            moveToBeginningWhenEnded={loop}
            errorFallback={noop}
            renderLoading={noop}
            acknowledgeRemotionLicense
            initiallyMuted
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
