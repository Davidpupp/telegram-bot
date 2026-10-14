import type { Metadata } from "next";

// Painel administrativo: fora do grupo (site), então sem o cabeçalho e o rodapé públicos. Nunca indexado.
export const metadata: Metadata = {
  title: { default: "Painel V8 Studio", template: "%s · Painel V8 Studio" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
