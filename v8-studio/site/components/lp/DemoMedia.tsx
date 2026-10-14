"use client";

import { COMPOSITIONS, type CompId } from "@/motion/compositions/registry";
import { MotionPlayer } from "@/motion/MotionPlayer";

const FILL: React.CSSProperties = { position: "absolute", inset: 0, aspectRatio: "auto", height: "100%", background: "var(--color-paper)" };

/**
 * Demo do Remotion por id. Confere o id no registro antes de tocar: páginas criadas no admin podem
 * trazer um id que deixou de existir, e aí a área fica vazia em vez de quebrar a página.
 * `fill` preenche um pai com `position: relative` e altura definida.
 */
export function DemoMedia({ id, label, fill = false }: { id: string; label: string; fill?: boolean }) {
  if (!Object.prototype.hasOwnProperty.call(COMPOSITIONS, id)) return null;
  return <MotionPlayer id={id as CompId} label={label} style={fill ? FILL : undefined} />;
}
