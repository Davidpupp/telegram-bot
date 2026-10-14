import Link from "next/link";
import { serviceHref, SERVICES } from "@/content/services";
import { cx } from "@/motion/lib/cx";
import s from "./sobre.module.css";

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h13M11 5l5 5-5 5" />
  </svg>
);

/** Os cinco serviços num card branco, uma linha por serviço, cada uma levando à sua página. */
export function ServiceList() {
  return (
    <ul className={cx("card", s.services)}>
      {SERVICES.map((sv) => (
        <li key={sv.slug}>
          <Link href={serviceHref(sv.slug)} className={s.serviceRow}>
            <span className={s.serviceText}>
              <span className={s.serviceName}>{sv.name}</span>
              <span className={s.serviceLine}>{sv.line}</span>
            </span>
            <span className={s.rowArrow} aria-hidden="true">
              <ArrowIcon />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
