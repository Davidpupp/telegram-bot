import { C } from "../lib/theme";
import { beat, typingSchedule } from "../lib/timing";

// Janelas das cenas na timeline do filme (quadros a 60 fps). As cenas 2 e 4 começam 20 quadros antes
// para desenhar a inundação de cor por cima do fim da cena anterior.
export const SCENES = {
  s1: { from: 0, dur: 352 },
  s2: { from: 332, dur: 222 },
  s3: { from: 554, dur: 352 },
  s4: { from: 886, dur: 222 },
  s5: { from: 1108, dur: 332 },
} as const;

/** Batida n convertida para o quadro local de uma cena. */
export const localBeat = (n: number, sceneFrom: number) => beat(n) - sceneFrom;

// Tela de busca (mundo das cenas 1 e 3).
export const PILL = { cx: 960, cy: 340, w: 1000, h: 104 } as const;
export const CARD = { x: 460, w: 1000, h: 132 } as const;
export const SLOT_Y = [446, 594, 742] as const;
export const QUERY = "dentista perto de mim";
export const TYPE_S1 = typingSchedule(QUERY, 58, 3.4, 7);
export const SITE_URL = "clinicavida.com.br";
export const URL_START = SCENES.s3.from + 140;
export const URL_FRAMES = 20;

export type Result = { fav: string; favColor: string; url: string; title: string; desc: string };
export const COMPETITORS: Result[] = [
  { fav: "C", favColor: "#8A93A6", url: "concorrenteodonto.com.br", title: "Concorrente Odonto", desc: "Dentista perto de você. Agende pelo telefone." },
  { fav: "S", favColor: "#9AA1B1", url: "sorrisoecia.com.br", title: "Sorriso & Cia Concorrente", desc: "Clareamento, limpeza e implantes." },
  { fav: "M", favColor: "#AAB0BE", url: "maisumconcorrente.com.br", title: "Mais Um Concorrente", desc: "Atendimento de segunda a sábado." },
];
export const CLINIC: Result = {
  fav: "V",
  favColor: C.teal,
  url: "clinicavida.com.br",
  title: "Clínica Vida",
  desc: "Seu sorriso em boas mãos. Agende online em poucos cliques.",
};

// Navegador da cena 3 e botão principal do site, em coordenadas de tela.
export const BROWSER = { x: 210, y: 110, w: 1500, h: 860, r: 28 } as const;
export const SITE_CTA_CENTER = { x: BROWSER.x + 56 + 165, y: BROWSER.y + 64 + 452 + 42 } as const;

// Pilha de notificações da cena 4.
export const PILE = { x: 1160, w: 600, h: 104, bottom: 980, step: 114 } as const;
export const pileY = (k: number) => PILE.bottom - PILE.h - k * PILE.step;
export const TOAST_TITLES = [
  "Nova consulta agendada",
  "Novo pedido de orçamento",
  "Nova mensagem pelo site",
  "Nova consulta agendada",
  "Novo contato pelo site",
  "Novo pedido de orçamento",
  "Nova consulta agendada",
];
/** Quadro local (cena 4) em que cada notificação da pilha começa a cair. A 0 nasce do botão. */
export const TOAST_STARTS = [2, 42, 69, 97, 111, 125, 138];
export const AVALANCHE_START = 150;
export const AVALANCHE_COUNT = 14;

/** Interpolação por quadros-chave [quadro, x, y] com easing entre cada par. */
export const pathAt = (frame: number, keys: [number, number, number][], ease: (t: number) => number) => {
  if (frame <= keys[0][0]) return { x: keys[0][1], y: keys[0][2] };
  for (let i = 1; i < keys.length; i++) {
    const [f1, x1, y1] = keys[i];
    if (frame <= f1) {
      const [f0, x0, y0] = keys[i - 1];
      const t = ease((frame - f0) / Math.max(1, f1 - f0));
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last[1], y: last[2] };
};
