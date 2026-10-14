"use client";

import { createContext } from "react";

/** Dentro de uma faixa que inunda de cor: `ready` fica true quando o azul já cobriu o topo da faixa. */
export const FloodContext = createContext<{ ready: boolean } | null>(null);
