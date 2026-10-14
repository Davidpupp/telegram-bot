import { Easing, interpolateClamped, spring } from "./physics";

// Mesma grade e as mesmas molas do filme: 60 quadros por segundo, 130 BPM.
// A matemática vem de ./physics (idêntica à do Remotion), para as páginas não precisarem baixar o Remotion.
export const FPS = 60;
export const BPM = 130;
export const BEAT_FRAMES = (60 / BPM) * FPS;
export const beat = (n: number) => Math.round(n * BEAT_FRAMES);

// Presets de mola da skill motion-design (rigidez k, amortecimento d, massa 1). Sem rebote de desenho animado.
export const SPRINGS = {
  snappy: { stiffness: 320, damping: 30, mass: 1 },
  base: { stiffness: 170, damping: 26, mass: 1 },
  heavy: { stiffness: 120, damping: 24, mass: 1 },
  text: { stiffness: 191, damping: 20, mass: 1 },
  soft: { stiffness: 200, damping: 22, mass: 1 },
} as const;
export type SpringPreset = keyof typeof SPRINGS;

/** Mola de 0 a 1 que começa no quadro `start`. Antes de `start` vale 0. */
export const sp = (frame: number, start: number, preset: SpringPreset = "base") => spring({ frame: frame - start, fps: FPS, config: SPRINGS[preset] });

export const E = {
  io: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  out5: Easing.out(Easing.poly(5)),
  linear: (t: number) => t,
};

/** Progresso de 0 a 1 entre os quadros a e b, com easing. */
export const ramp = (frame: number, a: number, b: number, easing: (t: number) => number = E.io) => interpolateClamped(frame, [a, b], [0, 1], easing);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

/** Pulso 0 → 1 → 0 em seno, de `start` a `start + dur`. */
export const bump = (frame: number, start: number, dur: number) => {
  const t = (frame - start) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};

/** Raio que limpa o canto mais distante a partir de (x, y), com 5 % de folga. */
export const coverRadius = (x: number, y: number, w: number, h: number) => Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.05;

/** Gerador pseudoaleatório com semente (mulberry32). */
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

/** Mistura duas sombras de mesma estrutura, número a número (para o hover com mola). */
export const mixShadow = (a: string, b: string, t: number) => {
  const na = a.match(/-?\d*\.?\d+/g) ?? [];
  const nb = b.match(/-?\d*\.?\d+/g) ?? [];
  let i = 0;
  return a.replace(/-?\d*\.?\d+/g, () => {
    const v = lerp(parseFloat(na[i]), parseFloat(nb[i] ?? na[i]), t);
    i++;
    return String(Math.round(v * 1000) / 1000);
  });
};
