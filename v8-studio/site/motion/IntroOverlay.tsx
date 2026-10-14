"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import LogoIntro, { type LogoIntroProps, type Rect } from "./compositions/LogoIntro";
import { INTRO_CLASS, finishIntro, isIntroPending } from "./intro";

const noop = () => null;
// Decisão tomada uma vez por carregamento (o React de desenvolvimento monta os efeitos duas vezes).
let decided: boolean | null = null;

/**
 * Abertura do logo na Home: só na primeira visita da sessão e nunca com movimento reduzido.
 * O HTML do servidor já traz a camada branca; um script inline decide antes da primeira pintura
 * se ela aparece (classe intro-pending no <html>).
 */
export function IntroOverlay() {
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");
  const [size, setSize] = useState({ w: 1920, h: 1080 });
  const [props, setProps] = useState<LogoIntroProps>({ dock: null });
  const player = useRef<PlayerRef>(null);

  const end = useCallback(() => {
    finishIntro();
    document.documentElement.classList.remove(INTRO_CLASS);
    setState("done");
  }, []);

  useLayoutEffect(() => {
    if (decided === null) decided = isIntroPending();
    if (!decided) {
      setState("done");
      return;
    }
    document.documentElement.classList.add(INTRO_CLASS);
    const el = document.querySelector("[data-logo-mark]");
    const r = el?.getBoundingClientRect();
    const dock: Rect | null = r && r.width > 0 ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
    setSize({ w: Math.round(window.innerWidth), h: Math.round(window.innerHeight) });
    setProps({ dock });
    setState("playing");
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const p = player.current;
    if (!p) return;
    const onFrame = (e: { detail: { frame: number } }) => {
      if (e.detail.frame >= 176) finishIntro();
    };
    const onEnded = () => {
      decided = false;
      end();
    };
    p.addEventListener("frameupdate", onFrame);
    p.addEventListener("ended", onEnded);
    p.play();
    // Trava de segurança: a página nunca fica presa atrás da abertura.
    const failsafe = window.setTimeout(onEnded, 6000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEnded();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      p.removeEventListener("frameupdate", onFrame);
      p.removeEventListener("ended", onEnded);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(failsafe);
    };
  }, [state, end]);

  if (state === "done") return null;

  return (
    <div className={state === "playing" ? "intro is-playing" : "intro"}>
      {state === "playing" ? (
        <div className="intro__stage" aria-hidden="true">
          <Player
            ref={player}
            component={LogoIntro}
            inputProps={props}
            durationInFrames={200}
            compositionWidth={size.w}
            compositionHeight={size.h}
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
      <button
        type="button"
        className="intro__skip"
        onClick={() => {
          decided = false;
          end();
        }}
      >
        Pular abertura
      </button>
    </div>
  );
}
