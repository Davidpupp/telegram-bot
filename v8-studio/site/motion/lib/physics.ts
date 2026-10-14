// Mola e easings com a mesma matemática do Remotion (remotion/src/spring e Easing), sem importar o pacote.
// As animações da página usam isto; assim o Remotion só é baixado nas páginas que têm um <Player>.
// O resultado é idêntico ao spring() do Remotion: mesma integração quadro a quadro, mesmo passo final fracionário.

export type SpringConfig = { stiffness: number; damping: number; mass: number };

type Node = { current: number; velocity: number; lastTimestamp: number };

function advance(a: Node, now: number, c: SpringConfig): Node {
  const deltaTime = Math.min(now - a.lastTimestamp, 64);
  const k = c.stiffness;
  const m = c.mass;
  const d = c.damping;
  const v0 = -a.velocity;
  const x0 = 1 - a.current;
  const zeta = d / (2 * Math.sqrt(k * m));
  const omega0 = Math.sqrt(k / m);
  const omega1 = omega0 * Math.sqrt(1 - zeta ** 2);
  const t = deltaTime / 1000;
  if (zeta < 1) {
    const sin1 = Math.sin(omega1 * t);
    const cos1 = Math.cos(omega1 * t);
    const env = Math.exp(-zeta * omega0 * t);
    const frag = env * (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);
    return {
      current: 1 - frag,
      velocity: zeta * omega0 * frag - env * (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1),
      lastTimestamp: now,
    };
  }
  const env = Math.exp(-omega0 * t);
  return {
    current: 1 - env * (x0 + (v0 + omega0 * x0) * t),
    velocity: env * (v0 * (t * omega0 - 1) + t * x0 * omega0 * omega0),
    lastTimestamp: now,
  };
}

const cache = new Map<string, number>();

/** Valor da mola de `from` a `to` no quadro `frame` (quadros negativos valem `from`). */
export function spring({ frame, fps, config, from = 0, to = 1 }: { frame: number; fps: number; config: SpringConfig; from?: number; to?: number }) {
  const f = Math.max(0, frame);
  const key = `${f}|${fps}|${config.stiffness}|${config.damping}|${config.mass}`;
  let v = cache.get(key);
  if (v === undefined) {
    let a: Node = { current: 0, velocity: 0, lastTimestamp: 0 };
    const whole = Math.floor(f);
    for (let i = 0; i <= whole; i++) a = advance(a, (i / fps) * 1000, config);
    if (f % 1 > 0) a = advance(a, (f / fps) * 1000, config);
    v = a.current;
    if (cache.size > 4000) cache.clear();
    cache.set(key, v);
  }
  return from === 0 && to === 1 ? v : from + (to - from) * v;
}

type Ease = (t: number) => number;
const cubic: Ease = (t) => t * t * t;
const poly =
  (n: number): Ease =>
  (t) =>
    Math.pow(t, n);
const easeIn = (e: Ease): Ease => e;
const easeOut =
  (e: Ease): Ease =>
  (t) =>
    1 - e(1 - t);
const easeInOut =
  (e: Ease): Ease =>
  (t) =>
    t < 0.5 ? e(t * 2) / 2 : 1 - e((1 - t) * 2) / 2;

/** Os mesmos easings do Remotion usados no site. */
export const Easing = { cubic, poly, in: easeIn, out: easeOut, inOut: easeInOut };

/** interpolate() do Remotion para um intervalo, com extrapolação travada nas duas pontas. */
export function interpolateClamped(x: number, [a, b]: [number, number], [y0, y1]: [number, number], easing: Ease = (t) => t) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return y0 + (y1 - y0) * easing(t);
}
