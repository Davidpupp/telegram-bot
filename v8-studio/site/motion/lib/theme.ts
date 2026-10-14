// Paleta e fontes do sistema V8 Studio, iguais às do filme. As fontes são carregadas por @font-face
// em app/globals.css, então valem tanto nas páginas quanto dentro das composições do <Player>.
export const C = {
  white: "#FFFFFF",
  blue: "#2347D6",
  blueInk: "#1A37AE",
  ink: "#0B1220",
  gray: "#5B6478",
  paper: "#F5F7FB",
  line: "#E3E7F0",
  teal: "#1B7A6B",
  tealSoft: "#E6F2EF",
} as const;

export const FONT = {
  display: "Bricolage, Inter, sans-serif",
  ui: "Inter, sans-serif",
  word: "Montserrat, Inter, sans-serif",
} as const;

export const SHADOW = "0 24px 64px -24px rgba(13,32,96,0.28), 0 8px 24px -12px rgba(13,32,96,0.16)";
export const SHADOW_HI = "0 40px 88px -28px rgba(13,32,96,0.38), 0 14px 32px -12px rgba(13,32,96,0.22)";
export const SHADOW_ON_BLUE = "0 28px 60px -20px rgba(6,16,60,0.5), 0 8px 20px -10px rgba(6,16,60,0.3)";

export const LOGO_PATH =
  "M93 186 L125 186 L171 94 L149 56 L109 133 L43 0 L0 0 Z M161 0 L119 0 L96 46 L117 90 Z M171 112 L171 164 L192 186 L288 186 L308 164 L308 112 L286 93 L308 74 L308 22 L287 0 L192 0 L171 22 L171 74 L193 93 Z M208 111 L270 111 L270 151 L208 151 Z M208 35 L270 35 L270 75 L208 75 Z";
export const LOGO_VIEW = { w: 308, h: 186 } as const;
