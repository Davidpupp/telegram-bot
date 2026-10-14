import Link from "next/link";
import { LOGO_PATH } from "@/motion/lib/theme";

/** Marca V8 oficial. `dock` marca a instância do cabeçalho, onde a abertura do logo pousa. */
export function LogoMark({ dock = false, className }: { dock?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 308 186" aria-hidden="true" focusable="false" className={className} {...(dock ? { "data-logo-mark": "" } : {})}>
      <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function Logo({ dock = false }: { dock?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="V8 Studio, página inicial">
      <LogoMark dock={dock} />
      <span>Studio</span>
    </Link>
  );
}
