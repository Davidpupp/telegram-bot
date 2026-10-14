"use client";

import Link from "next/link";
import { serviceHref, SERVICES } from "@/content/services";
import type { LeadChannel, ServiceSlug } from "@/lib/leads";
import { useTimeline } from "@/motion/hooks";
import { KineticText } from "@/motion/KineticText";
import { PressLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { clamp, lerp, sp } from "@/motion/lib/timing";
import { rise } from "./anim";
import { SERVICE_TITLE } from "./score";
import styles from "./Quiz.module.css";

export type ResultData = {
  service: ServiceSlug;
  compatibility: number;
  firstName: string;
  lines: [string, string];
  channel: LeadChannel;
  /** O WhatsApp formatado ou o e-mail, como a pessoa digitou. */
  contactShown: string;
};

const R = 52;
const C = 2 * Math.PI * R;

/**
 * Resultado: o anel "Compatibilidade" desenha o traço com a mola pesada (sem rebote) e o número conta junto,
 * do mesmo valor da mola. O texto sobe depois, com a mola suave.
 */
export function ResultScreen({ titleId, data }: { titleId: string; data: ResultData }) {
  const frame = useTimeline({ play: true, duration: 160 });
  const u = clamp(sp(frame, 16, "heavy"));
  const pct = data.compatibility;
  const service = SERVICES.find((s) => s.slug === data.service);
  const ringIn = sp(frame, 6, "soft");
  const ringStyle = Math.abs(1 - ringIn) < 0.0005 ? undefined : { opacity: clamp(ringIn * 1.6), transform: `scale(${lerp(0.9, 1, ringIn).toFixed(4)})` };

  return (
    <>
      <p className={cx("kicker", styles.kicker)} style={rise(frame, 0, 10)}>
        {data.firstName ? `Tudo certo, ${data.firstName}. Recebemos suas respostas.` : "Tudo certo. Recebemos suas respostas."}
      </p>
      <KineticText as="h2" id={titleId} text={`Indicamos ${SERVICE_TITLE[data.service]}.`} className={styles.title} delay={3} />
      <div className={styles.result}>
        <figure className={styles.ringFig}>
          <div className={styles.ring} role="img" aria-label={`Compatibilidade de ${pct}%`} style={ringStyle}>
            <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
              <circle className={styles.ringTrack} cx="60" cy="60" r={R} />
              <circle
                className={styles.ringArc}
                cx="60"
                cy="60"
                r={R}
                strokeDasharray={C.toFixed(3)}
                strokeDashoffset={(C * (1 - (pct / 100) * u)).toFixed(3)}
                style={u < 0.004 ? { opacity: 0 } : undefined}
              />
            </svg>
            <span className={styles.ringValue} aria-hidden="true">
              <span>
                {Math.round(pct * u)}
                <small>%</small>
              </span>
            </span>
          </div>
          <figcaption className={styles.ringCaption}>
            <span className={styles.ringLabel}>Compatibilidade</span>
            <span className={styles.ringNote}>Mede o quanto suas respostas combinam com o serviço indicado.</span>
          </figcaption>
        </figure>

        <div className={styles.resultText}>
          <p className={styles.resultLead} style={rise(frame, 22, 16)}>
            {data.lines[0]}
          </p>
          <p style={rise(frame, 26, 16)}>{data.lines[1]}</p>
          <div className={styles.sla} style={rise(frame, 30, 16)}>
            <p>Respondemos em até 1 dia útil.</p>
            <p className={styles.slaNote}>
              {data.channel === "whatsapp" ? "A proposta chega pelo WhatsApp " : "A proposta chega pelo e-mail "}
              <span className={cx(styles.contactShown, data.channel === "whatsapp" && styles.nowrap)}>{data.contactShown}</span>.
            </p>
          </div>
          <div className={styles.resultActions} style={rise(frame, 34, 12)}>
            {service ? (
              <PressLink href={serviceHref(service.slug)} className="btn btn--primary">
                Conhecer {service.name.toLowerCase()}
              </PressLink>
            ) : null}
            <Link href="/" className="btn btn--ghost">
              Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
