"use client";

import { useEffect, useState } from "react";

// Estado da abertura do logo (só na Home, uma vez por sessão). As animações do topo da página esperam
// a abertura terminar para não acontecerem escondidas atrás dela.
import { INTRO_CLASS, INTRO_KEY } from "./intro-constants";

export { INTRO_CLASS, INTRO_KEY };
const DONE_EVENT = "v8:intro-done";

let done = false;

export const isIntroPending = () =>
  typeof document !== "undefined" && !done && document.documentElement.classList.contains(INTRO_CLASS);

export function finishIntro() {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(DONE_EVENT));
}

/** Libera o quadro inicial das animações: true quando não há abertura pendente ou quando ela terminou. */
export function useIntroGate() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isIntroPending()) {
      setOpen(true);
      return;
    }
    const f = () => setOpen(true);
    window.addEventListener(DONE_EVENT, f);
    return () => window.removeEventListener(DONE_EVENT, f);
  }, []);
  return open;
}
