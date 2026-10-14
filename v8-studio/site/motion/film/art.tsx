import React from "react";
import { C } from "../lib/theme";
import type { Art } from "./segments";

/** Ilustração em traço da cor do segmento, no lugar da foto do site de exemplo. */
export const ArtMark: React.FC<{ art: Art; color: string; size?: number }> = ({ art, color, size = 250 }) => {
  const s = { fill: "none", stroke: color, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<Art, React.ReactNode> = {
    tooth: (
      <>
        <path
          d="M64 26 C 34 26, 20 52, 24 86 C 28 120, 42 172, 60 198 C 68 210, 80 202, 82 188 C 86 162, 94 144, 110 144 C 126 144, 134 162, 138 188 C 140 202, 152 210, 160 198 C 178 172, 192 120, 196 86 C 200 52, 186 26, 156 26 C 138 26, 126 36, 110 36 C 94 36, 82 26, 64 26 Z"
          {...s}
          fill={C.white}
        />
        <path d="M62 62 C 70 52, 84 50, 92 56" {...s} strokeWidth={7} opacity={0.5} />
      </>
    ),
    plate: (
      <>
        <circle cx={110} cy={112} r={78} {...s} fill={C.white} />
        <circle cx={110} cy={112} r={50} {...s} strokeWidth={6} opacity={0.5} />
        <path d="M14 40 L14 96 M2 40 L2 70 Q2 84 14 86 Q26 84 26 70 L26 40 M14 96 L14 196" {...s} strokeWidth={7} transform="translate(-6 0)" />
        <path d="M212 40 Q186 64 190 118 L208 118 L208 196" {...s} strokeWidth={7} transform="translate(6 0)" />
      </>
    ),
    scales: (
      <>
        <path d="M110 30 L110 186 M70 196 L150 196 M40 64 L180 64" {...s} />
        <path d="M40 64 L14 126 Q40 146 66 126 Z M180 64 L154 126 Q180 146 206 126 Z" {...s} fill={C.white} />
        <circle cx={110} cy={30} r={10} {...s} fill={C.white} />
      </>
    ),
    dumbbell: (
      <>
        <path d="M58 110 L162 110" {...s} strokeWidth={12} />
        <rect x={30} y={62} width={30} height={96} rx={10} {...s} fill={C.white} />
        <rect x={160} y={62} width={30} height={96} rx={10} {...s} fill={C.white} />
        <rect x={8} y={82} width={22} height={56} rx={8} {...s} fill={C.white} />
        <rect x={190} y={82} width={22} height={56} rx={8} {...s} fill={C.white} />
      </>
    ),
    wrench: (
      <path
        d="M150 22 C 124 22, 104 44, 108 72 L 30 150 C 20 160, 20 176, 30 186 C 40 196, 56 196, 66 186 L 144 108 C 172 112, 196 92, 196 66 C 196 58, 194 52, 192 46 L 168 70 L 146 70 L 146 48 L 170 24 C 164 22, 156 22, 150 22 Z"
        {...s}
        fill={C.white}
      />
    ),
    hanger: (
      <>
        <path d="M110 70 L110 58 Q110 46 122 42 Q134 36 132 24 Q128 10 112 12 Q100 14 98 26" {...s} />
        <path d="M110 70 L20 150 Q12 160 26 162 L194 162 Q208 160 200 150 Z" {...s} fill={C.white} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} style={{ overflow: "visible" }}>
      {paths[art]}
    </svg>
  );
};
