// Ícones funcionais do painel (navegação e ações). Traço de 1,8 px, herdam a cor do texto.
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const IconPainel = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconLeads = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.5c2 .8 3 2.6 3 5.5" />
  </svg>
);

export const IconPosts = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export const IconPaginas = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 13h8M8 16h5" />
  </svg>
);

export const IconConfig = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 7h9M18.5 7H20M4 17h3.5M12.5 17H20" />
    <circle cx="15.5" cy="7" r="2.5" />
    <circle cx="10" cy="17" r="2.5" />
  </svg>
);

export const IconSite = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);

export const IconVoltar = ({ className }: P) => (
  <svg {...base} viewBox="0 0 20 20" strokeWidth={2.2} className={className}>
    <path d="M17 10H4M9 5l-5 5 5 5" />
  </svg>
);

export const IconSubir = ({ className }: P) => (
  <svg {...base} viewBox="0 0 20 20" strokeWidth={2.2} className={className}>
    <path d="M5 12l5-5 5 5" />
  </svg>
);

export const IconDescer = ({ className }: P) => (
  <svg {...base} viewBox="0 0 20 20" strokeWidth={2.2} className={className}>
    <path d="M5 8l5 5 5-5" />
  </svg>
);
