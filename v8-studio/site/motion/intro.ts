"use client";

import { useSyncExternalStore } from "react";
import { INTRO_CLASS, INTRO_KEY } from "./intro-constants";

// Estado da abertura do logo (só na Home, uma vez por sessão). As animações do topo da página esperam
// a abertura terminar para não acontecerem escondidas atrás dela.
export { INTRO_CLASS, INTRO_KEY };
const DONE_EVENT = "v8:intro-done";

let done = false;
// Decisão lida uma vez por carregamento: o React de desenvolvimento remonta a página e limpa a classe do <html>.
let decided: boolean | null = null;

/** true se o script do <head> pediu a abertura neste carregamento. */
export const introRequested = () => {
  if (typeof document === "undefined") return false;
  if (decided === null) decided = document.documentElement.classList.contains(INTRO_CLASS);
  return decided;
};

export const isIntroPending = () => introRequested() && !done;

export function finishIntro() {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(DONE_EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(DONE_EVENT, cb);
  return () => window.removeEventListener(DONE_EVENT, cb);
};

/** Libera o quadro inicial das animações: true quando não há abertura pendente ou quando ela terminou. */
export function useIntroGate() {
  return useSyncExternalStore(
    subscribe,
    () => !isIntroPending(),
    () => false,
  );
}
