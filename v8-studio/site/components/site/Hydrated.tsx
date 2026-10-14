"use client";

import { useLayoutEffect } from "react";

/** Marca o <html> como hidratado (o script do <head> mostra tudo parado se isso não acontecer). */
export function Hydrated() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("js", "hy");
  }, []);
  return null;
}
