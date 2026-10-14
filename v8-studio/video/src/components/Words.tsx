import React from "react";
import { E, clamp, ramp, sp } from "../lib/timing";

type Props = {
  /** Texto; "\n" quebra linha. */
  text: string;
  frame: number;
  start: number;
  /** Quadro em que as palavras começam a sair. */
  exit?: number;
  exitDir?: "up" | "down";
  size: number;
  color: string;
  family: string;
  weight?: number;
  align?: "center" | "left";
  x?: number;
  y: number;
  width?: number;
  /** Quadros entre uma palavra e a seguinte (55 ms = 3,3 quadros). */
  stagger?: number;
  lineHeight?: number;
  letterSpacing?: string;
  /** Transformação extra por palavra (índice global), aplicada fora da máscara. */
  extra?: (index: number) => string;
  /** Desliga a máscara (para palavras que precisam voar para fora). */
  unmasked?: boolean;
  /** Duração da saída de cada palavra, em quadros. */
  exitDur?: number;
  z?: number;
};

/** Frase cinética: cada palavra sobe de dentro de uma máscara, com mola e leve rotação. */
export const Words: React.FC<Props> = ({
  text,
  frame,
  start,
  exit,
  exitDir = "up",
  size,
  color,
  family,
  weight = 800,
  align = "center",
  x = 0,
  y,
  width = 1920,
  stagger = 3.3,
  lineHeight = 1.06,
  letterSpacing = "-0.03em",
  extra,
  unmasked = false,
  exitDur = 16,
  z = 20,
}) => {
  const lines = text.split("\n").map((l) => l.split(" "));
  let k = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing,
        color,
        zIndex: z,
      }}
    >
      {lines.map((words, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            justifyContent: align === "center" ? "center" : "flex-start",
            columnGap: size * 0.24,
            whiteSpace: "nowrap",
          }}
        >
          {words.map((w) => {
            const i = k++;
            const u = sp(frame, start + i * stagger, "text");
            const o = exit == null ? 0 : ramp(frame, exit + i * 2, exit + i * 2 + exitDur, E.in);
            const ty = (1 - u) * 112 + (exitDir === "up" ? -1 : 1) * o * 112;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: unmasked ? "visible" : "hidden",
                  padding: "0.16em 0.06em 0.2em",
                  margin: "-0.16em -0.06em -0.2em",
                  transform: extra ? extra(i) : undefined,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transformOrigin: "0% 100%",
                    transform: `translateY(${ty}%) rotate(${(1 - clamp(u)) * 6}deg)`,
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
