import { Easing, interpolate, spring } from "remotion";

// Grade do filme: 130 BPM a 60 fps. Uma batida = 27,69 quadros; 52 batidas = 1440 quadros = 24 s.
export const FPS = 60;
export const BPM = 130;
export const BEAT_FRAMES = (60 / BPM) * FPS;
export const beat = (n: number) => Math.round(n * BEAT_FRAMES);
export const FILM_FRAMES = beat(52);
export const DROP = beat(16);

// Presets de mola da skill motion-design (rigidez k, amortecimento d, massa 1).
export const SPRINGS = {
  snappy: { stiffness: 320, damping: 30, mass: 1 },
  base: { stiffness: 170, damping: 26, mass: 1 },
  heavy: { stiffness: 120, damping: 24, mass: 1 },
  playful: { stiffness: 180, damping: 12, mass: 1 },
  text: { stiffness: 191, damping: 20, mass: 1 },
  slam: { stiffness: 260, damping: 16, mass: 1 },
} as const;
export type SpringPreset = keyof typeof SPRINGS;

/** Mola de 0 a 1 que começa no quadro `start`. Antes de `start` vale 0. */
export const sp = (frame: number, start: number, preset: SpringPreset = "base") =>
  spring({ frame: frame - start, fps: FPS, config: SPRINGS[preset] });

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const E = {
  io: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  out5: Easing.out(Easing.poly(5)),
  expoIn: Easing.in(Easing.exp),
};

/** Progresso de 0 a 1 entre os quadros a e b, com easing. */
export const ramp = (frame: number, a: number, b: number, easing: (t: number) => number = E.io) =>
  interpolate(frame, [a, b], [0, 1], { ...clampOpts, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

/** Pulso 0 → 1 → 0 em seno, de `start` a `start + dur`. */
export const bump = (frame: number, start: number, dur: number) => {
  const t = (frame - start) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};

/** Tremor amortecido (balanço de motor), em pixels. */
export const shake = (frame: number, start: number, amp: number, hz = 22, decay = 9) => {
  const t = (frame - start) / FPS;
  if (t < 0) return 0;
  return amp * Math.exp(-decay * t) * Math.sin(2 * Math.PI * hz * t);
};

/** Raio que limpa o canto mais distante a partir de (x, y), com 5 % de folga. */
export const coverRadius = (x: number, y: number, w = 1920, h = 1080) =>
  Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.05;

/** Gerador pseudoaleatório com semente (mulberry32): nada de Math.random no render. */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Quadros em que cada caractere aparece, num ritmo humano com variação controlada. */
export const typingSchedule = (text: string, start: number, base: number, seed: number) => {
  const r = rng(seed);
  const out: number[] = [];
  let t = start;
  for (const ch of text) {
    out.push(Math.round(t));
    t += base + (r() - 0.5) * base * 0.6 + (ch === " " ? base * 0.5 : 0);
  }
  return out;
};

export const typedCount = (frame: number, schedule: number[]) => schedule.filter((f) => f <= frame).length;
