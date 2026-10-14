import { rng, typedCount, typingSchedule } from "../lib/timing";

// Grade do filme do topo da Home (1920 × 1080, 60 fps, 1440 quadros = 24 s).
// Cenas: 1 Busca (branco) · 2 Marca (azul) · 3 Site (branco) · 4 Clientes (azul) · 5 Fechamento (branco).
// As cenas 2 e 4 começam 20 quadros antes para a inundação de cor cobrir o fim da cena anterior.
export const SCENES = {
  s1: { from: 0, dur: 332 },
  s2: { from: 312, dur: 200 },
  s3: { from: 512, dur: 340 },
  s4: { from: 832, dur: 230 },
  s5: { from: 1062, dur: 378 },
} as const;
export const FILM_FRAMES = 1440;

export const PILL = { cx: 960, cy: 340, w: 1000, h: 104 } as const;
export const CARD = { x: 460, w: 1000, h: 132 } as const;
export const SLOT_Y = [446, 594, 742] as const;
export const BROWSER = { x: 210, y: 110, w: 1500, h: 860, r: 28 } as const;
export const SITE_CTA_CENTER = { x: BROWSER.x + 56 + 165, y: BROWSER.y + 64 + 452 + 42 } as const;
export const PILE = { x: 1160, w: 600, h: 104, bottom: 980, step: 114 } as const;
export const pileY = (k: number) => PILE.bottom - PILE.h - k * PILE.step;

/** Digitação da busca: começa no quadro 62 e termina antes do Enter (quadro 160), qualquer que seja o tamanho. */
export const typingFor = (query: string) => {
  const spaces = query.split(" ").length - 1;
  const base = Math.min(3.4, 86 / (query.length + spaces * 0.5));
  return typingSchedule(query, 62, base, 7);
};
export { typedCount, rng };
