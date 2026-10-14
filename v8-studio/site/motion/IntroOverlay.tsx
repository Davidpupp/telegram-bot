"use client";

import type { PlayerRef } from "@remotion/player";
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { LogoIntroProps } from "./compositions/LogoIntro";
import { useMounted } from "./hooks";
import { INTRO_CLASS, finishIntro, introRequested } from "./intro";

// O Remotion só é baixado quando a abertura vai tocar.
const IntroPlayer = lazy(() => import("./IntroPlayer"));
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
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const onRef = useCallback((p: PlayerRef | null) => setPlayer(p), []);

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

  // Se o código da abertura demorar ou falhar, a página nunca fica presa atrás da camada branca.
  useEffect(() => {
    if (!mounted || !requested || closed) return;
    const failsafe = window.setTimeout(close, 9000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, requested, closed, close]);

  useEffect(() => {
    if (!player || closed) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      if (e.detail.frame >= 176) finishIntro();
    };
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("ended", close);
    player.play();
    const failsafe = window.setTimeout(close, 6000);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("ended", close);
      window.clearTimeout(failsafe);
    };
  }, [player, closed, close]);

  if (!requested || closed) return null;

  return (
    <div className={player ? "intro is-playing" : "intro"}>
      {mounted ? (
        <div className="intro__stage" aria-hidden="true">
          <Suspense fallback={null}>
            <IntroPlayer w={w} h={h} props={props} onRef={onRef} />
          </Suspense>
        </div>
      ) : null}
      <button type="button" className="intro__skip" onClick={close}>
        Pular abertura
      </button>
    </div>
  );
}
