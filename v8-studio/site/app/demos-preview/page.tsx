import { MotionPlayer } from "@/motion/MotionPlayer";

// Página temporária de verificação das demos dos serviços. Apagar depois de conferir.
const DEMOS = [
  { id: "demo-site", label: "Sites institucionais" },
  { id: "demo-loja", label: "Lojas virtuais" },
  { id: "demo-sistema", label: "Sistemas sob medida" },
  { id: "demo-app", label: "Aplicativos" },
] as const;

export default function DemosPreview() {
  return (
    <main style={{ padding: 40, background: "var(--color-blue)", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 400px)", gap: 32 }}>
        {DEMOS.map((d) => (
          <div key={d.id} className="player-frame" data-demo={d.id} style={{ width: 400 }}>
            <MotionPlayer id={d.id} label={d.label} style={{ background: "var(--color-paper)" }} />
          </div>
        ))}
      </div>
    </main>
  );
}
