"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import LogoIntro, { type LogoIntroProps } from "./compositions/LogoIntro";
import { useMounted } from "./hooks";
import { INTRO_CLASS, finishIntro, introRequested } from "./intro";

const noop = () => null;
const noopSubscribe = () => () => {};
const subscribeResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const readViewport = () => `${Math.round(window.innerWidth)}x${Math.round(window.innerHeight)}`;
/** Onde o logo do cabeçalho está: é ali que o logo da abertura pousa. */
const readDock = () => {
  const r = document.querySelector("[data-logo-mark]")?.getBoundingClientRect();
  return r && r.width > 0 ? `${r.left},${r.top},${r.width},${r.height}` : "";
};

/**
 * Abertura do logo na Home: só na primeira visita da sessão e nunca com movimento reduzido.
 * O HTML do servidor já traz a camada branca; um script inline decide antes da primeira pintura
 * se ela aparece (classe intro-pending no <html>).
 */
export function IntroOverlay() {
  const requested = useSyncExternalStore(noopSubscribe, introRequested, () => true);
  const mounted = useMounted();
  const viewport = useSyncExternalStore(subscribeResize, readViewport, () => "1920x1080");
  const dockKey = useSyncExternalStore(subscribeResize, readDock, () => "");
  const [closed, setClosed] = useState(false);
  const player = useRef<PlayerRef>(null);

  const [w, h] = viewport.split("x").map(Number);
  const props = useMemo<LogoIntroProps>(() => {
    if (!dockKey) return { dock: null };
    const [x, y, dw, dh] = dockKey.split(",").map(Number);
    return { dock: { x, y, w: dw, h: dh } };
  }, [dockKey]);

  const close = useCallback(() => {
    finishIntro();
    document.documentElement.classList.remove(INTRO_CLASS);
    setClosed(true);
  }, []);

  // O React de desenvolvimento remonta a página e limpa a classe do <html>: devolve enquanto a abertura toca.
  useLayoutEffect(() => {
    if (requested && !closed) document.documentElement.classList.add(INTRO_CLASS);
  }, [requested, closed]);

  useEffect(() => {
    if (!mounted || !requested || closed) return;
    const p = player.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      if (e.detail.frame >= 176) finishIntro();
    };
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("ended", close);
    p.play();
    // Trava de segurança: a página nunca fica presa atrás da abertura.
    const failsafe = window.setTimeout(close, 6000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("ended", close);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(failsafe);
    };
  }, [mounted, requested, closed, close]);

  if (!requested || closed) return null;
  const playing = mounted;

  return (
    <div className={playing ? "intro is-playing" : "intro"}>
      {playing ? (
        <div className="intro__stage" aria-hidden="true">
          <Player
            ref={player}
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
        </div>
      ) : null}
      <button type="button" className="intro__skip" onClick={close}>
        Pular abertura
      </button>
    </div>
  );
}
