import type { ComponentType } from "react";

// Composições do Remotion usadas no site. Cada uma é carregada sob demanda pelo <MotionPlayer>.
// `poster` é o quadro mostrado com movimento reduzido.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lazy = () => Promise<{ default: ComponentType<any> }>;
export type CompMeta = { width: number; height: number; duration: number; poster: number; lazy: Lazy };

export const COMPOSITIONS = {
  "hero-film": { width: 1920, height: 1080, duration: 1440, poster: 1200, lazy: () => import("../film/HeroFilm") },
  "demo-landing": { width: 800, height: 720, duration: 420, poster: 300, lazy: () => import("./DemoLanding") },
  // Provisórios: apontam para a demo de landing page até as demos próprias existirem.
  "demo-site": { width: 800, height: 720, duration: 480, poster: 420, lazy: () => import("./DemoSite") },
  "demo-loja": { width: 800, height: 720, duration: 420, poster: 320, lazy: () => import("./DemoLoja") },
  "demo-sistema": { width: 800, height: 720, duration: 420, poster: 300, lazy: () => import("./DemoLanding") },
  "demo-app": { width: 800, height: 720, duration: 420, poster: 300, lazy: () => import("./DemoLanding") },
} satisfies Record<string, CompMeta>;

export type CompId = keyof typeof COMPOSITIONS;
