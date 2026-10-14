// Gerado por scripts/measure_sfx.py: pico e duração (s) de cada efeito em public/sfx.
export const SFX_PEAKS = {
  bubble: {peak: 0.1278, duration: 0.3806, amplitude: 0.783},
  check: {peak: 0.0110, duration: 1.3764, amplitude: 1.377},
  click: {peak: 0.1076, duration: 0.2190, amplitude: 0.714},
  engine: {peak: 2.3053, duration: 4.7730, amplitude: 1.241},
  impact: {peak: 0.5511, duration: 4.0631, amplitude: 1.280},
  key: {peak: 0.0014, duration: 0.1995, amplitude: 0.697},
  pop: {peak: 0.0061, duration: 1.1748, amplitude: 1.363},
  rise: {peak: 0.7148, duration: 2.3207, amplitude: 1.183},
  soft: {peak: 0.1334, duration: 0.2880, amplitude: 1.233},
  sparkle: {peak: 0.4743, duration: 2.3333, amplitude: 0.773},
  success: {peak: 0.2595, duration: 1.6191, amplitude: 1.313},
  toast: {peak: 0.1208, duration: 1.5534, amplitude: 1.359},
  whoosh: {peak: 0.7128, duration: 1.7567, amplitude: 0.704},
} as const;

export type SfxName = keyof typeof SFX_PEAKS;
