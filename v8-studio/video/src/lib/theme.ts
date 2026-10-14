import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta do sistema V8 Studio. O verde-petróleo existe só dentro do site fictício da clínica.
export const C = {
  white: "#FFFFFF",
  blue: "#2347D6",
  ink: "#0B1220",
  gray: "#5B6478",
  paper: "#F5F7FB",
  line: "#E3E7F0",
  teal: "#1B7A6B",
  tealSoft: "#E6F2EF",
} as const;

export const FONT = {
  display: "Bricolage, sans-serif",
  ui: "Inter, sans-serif",
  word: "Montserrat, sans-serif",
} as const;

export const SHADOW = "0 24px 64px -24px rgba(13,32,96,0.28), 0 8px 24px -12px rgba(13,32,96,0.16)";
export const SHADOW_HI = "0 40px 88px -28px rgba(13,32,96,0.38), 0 14px 32px -12px rgba(13,32,96,0.22)";
export const SHADOW_ON_BLUE = "0 28px 60px -20px rgba(6,16,60,0.55), 0 8px 20px -10px rgba(6,16,60,0.35)";

// Fontes locais (OFL), subconjunto latin. loadFont segura o render até cada uma carregar.
loadFont({ family: "Bricolage", url: staticFile("fonts/bricolage-latin.woff2"), weight: "200 800", stretch: "75% 100%" });
loadFont({ family: "Inter", url: staticFile("fonts/inter-latin.woff2"), weight: "400 700" });
loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-600-latin.woff2"), weight: "600" });
