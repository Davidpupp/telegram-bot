"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useMemo, useRef } from "react";
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

/**
 * <Player> do Remotion embutido na página: toca sozinho quando aparece na tela, pausa quando sai,
 * sem controles nem som. Com movimento reduzido, mostra só o quadro-pôster da composição.
 */
export function MotionPlayer({ id, label, inputProps, className, style, restartKey, gate = true, loop = true }: Props) {
  const meta = COMPOSITIONS[id];
  const wrap = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const visible = useInView(wrap, { threshold: 0.25, once: false, rootMargin: "0px" });
  const intro = useIntroGate();
  const key = JSON.stringify(inputProps ?? {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo(() => inputProps ?? {}, [key]);

  useEffect(() => {
    const p = player.current;
    if (!p) return;
    if (reduce) {
      p.pause();
      p.seekTo(meta.poster);
      return;
    }
    if (visible && intro && gate) p.play();
    else p.pause();
  }, [visible, intro, gate, reduce, mounted, meta.poster]);

  useEffect(() => {
    const p = player.current;
    if (!p || restartKey === undefined || reduce) return;
    p.seekTo(0);
  }, [restartKey, reduce]);

  return (
    <div
      ref={wrap}
      className={cx("player", className)}
      style={{ aspectRatio: `${meta.width} / ${meta.height}`, ...style }}
      role="img"
      aria-label={label}
    >
      {mounted ? (
        <Player
          ref={player}
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
          style={{ width: "100%", height: "100%" }}
        />
      ) : null}
    </div>
  );
}
