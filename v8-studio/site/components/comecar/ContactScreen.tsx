"use client";

import Link from "next/link";
import { useState } from "react";
import { CONSENT_LINK_TEXT, CONSENT_TEXT, type LeadChannel } from "@/lib/leads";
import { useTimeline } from "@/motion/hooks";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { rise } from "./anim";
import { Collapse, useLast } from "./Collapse";
import { FIELD_ORDER, nextPhoneValue, validateContact, type ContactField, type ContactState } from "./contact";
import { PressButton } from "./PressButton";
import styles from "./Quiz.module.css";

const ID: Record<ContactField, string> = { name: "c-nome", company: "c-empresa", whatsapp: "c-whatsapp", email: "c-email", consent: "c-aceite" };
const CHANNELS: { value: LeadChannel; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
];
const ALL_TOUCHED: Record<ContactField, boolean> = { name: true, company: true, whatsapp: true, email: true, consent: true };

// Exemplos dentro das mensagens ("(11) 91234-5678", "nome@empresa.com.br") não quebram no meio.
const EXAMPLE = /(\(\d{2}\) \d{4,5}-\d{4}|\S+@\S+\.\S+)/;
const keepExamples = (text: string) =>
  text.split(EXAMPLE).map((part, i) =>
    i % 2 ? (
      <span key={i} className={styles.nowrap}>
        {part}
      </span>
    ) : (
      part
    ),
  );

/** Mensagem de erro do campo: abre e fecha com a mola rápida, sem empurrar o resto de uma vez. */
function FieldError({ id, text, className }: { id: string; text: string | undefined; className?: string }) {
  const shown = useLast(text);
  return (
    <Collapse open={!!text} className={cx(styles.error, className)}>
      <p id={text ? id : undefined} className="field__error">
        {keepExamples(shown ?? "")}
      </p>
    </Collapse>
  );
}

/** Bloco que sobe ao aparecer (o campo do canal escolhido). */
function Appear({ delay, className, children }: { delay: number; className?: string; children: React.ReactNode }) {
  const frame = useTimeline({ play: true, duration: delay + 60 });
  return (
    <div className={className} style={rise(frame, delay, 12)}>
      {children}
    </div>
  );
}

type Props = {
  titleId: string;
  echo: string;
  contact: ContactState;
  onChange: (patch: Partial<ContactState>) => void;
  sending: boolean;
  sendError: string | null;
  /** Chamado com os campos válidos. */
  onSubmit: () => void;
  onBack: () => void;
};

export function ContactScreen({ titleId, echo, contact, onChange, sending, sendError, onSubmit, onBack }: Props) {
  const frame = useTimeline({ play: true, duration: 100 });
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [switched, setSwitched] = useState(false);
  const errors = validateContact(contact);
  const err = (f: ContactField) => (touched[f] ? errors[f] : undefined);
  const touch = (f: ContactField, value: string) => {
    if (value.trim()) setTouched((t) => ({ ...t, [f]: true }));
  };
  const a11y = (f: ContactField) => ({ "aria-invalid": err(f) ? true : undefined, "aria-describedby": err(f) ? `${ID[f]}-erro` : undefined });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      setTouched(ALL_TOUCHED);
      document.getElementById(ID[first])?.focus();
      return;
    }
    onSubmit();
  };

  const field = contact.channel === "whatsapp" ? "whatsapp" : "email";
  const [before, after] = CONSENT_TEXT.split(CONSENT_LINK_TEXT);

  return (
    <>
      <p className={cx("kicker", styles.kicker)} style={rise(frame, 0, 10)}>
        {echo}
      </p>
      <KineticText as="h2" id={titleId} text="Para onde a gente manda a proposta?" className={styles.title} delay={3} />
      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={cx("field", err("name") && styles.invalid)} style={rise(frame, 10, 14)}>
          <label htmlFor={ID.name}>Nome</label>
          <input
            id={ID.name}
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Como podemos te chamar"
            maxLength={80}
            value={contact.name}
            onChange={(e) => onChange({ name: e.target.value })}
            onBlur={(e) => touch("name", e.target.value)}
            {...a11y("name")}
          />
          <FieldError id={`${ID.name}-erro`} text={err("name")} />
        </div>

        <div className={cx("field", err("company") && styles.invalid)} style={rise(frame, 12, 14)}>
          <label htmlFor={ID.company}>Empresa</label>
          <input
            id={ID.company}
            name="empresa"
            type="text"
            autoComplete="organization"
            placeholder="Nome do seu negócio"
            maxLength={100}
            value={contact.company}
            onChange={(e) => onChange({ company: e.target.value })}
            onBlur={(e) => touch("company", e.target.value)}
            {...a11y("company")}
          />
          <FieldError id={`${ID.company}-erro`} text={err("company")} />
        </div>

        <div className="field" style={rise(frame, 14, 14)}>
          <p className={styles.groupLabel} id="c-canal">
            Como prefere receber a resposta?
          </p>
          <div className={styles.choices} role="radiogroup" aria-labelledby="c-canal">
            {CHANNELS.map((c) => (
              <label key={c.value} className={styles.choice}>
                <input
                  type="radio"
                  name="canal"
                  value={c.value}
                  checked={contact.channel === c.value}
                  onChange={() => {
                    setSwitched(true);
                    onChange({ channel: c.value });
                  }}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Appear key={field} delay={switched ? 0 : 16} className={cx("field", err(field) && styles.invalid)}>
          {field === "whatsapp" ? (
            <>
              <label htmlFor={ID.whatsapp}>WhatsApp com DDD</label>
              <input
                id={ID.whatsapp}
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="(11) 91234-5678"
                value={contact.whatsapp}
                onChange={(e) => onChange({ whatsapp: nextPhoneValue(contact.whatsapp, e.target.value) })}
                onBlur={(e) => touch("whatsapp", e.target.value)}
                {...a11y("whatsapp")}
              />
            </>
          ) : (
            <>
              <label htmlFor={ID.email}>E-mail</label>
              <input
                id={ID.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="nome@empresa.com.br"
                maxLength={254}
                value={contact.email}
                onChange={(e) => onChange({ email: e.target.value })}
                onBlur={(e) => touch("email", e.target.value)}
                {...a11y("email")}
              />
            </>
          )}
          <FieldError id={`${ID[field]}-erro`} text={err(field)} />
        </Appear>

        <div className={styles.full} style={rise(frame, 18, 14)}>
          <label className={cx("check", styles.consent)}>
            <input
              id={ID.consent}
              type="checkbox"
              name="aceite"
              checked={contact.consent}
              onChange={(e) => onChange({ consent: e.target.checked, consentAt: e.target.checked ? new Date().toISOString() : null })}
              {...a11y("consent")}
            />
            <span>
              {before}
              <Link href="/privacidade/" target="_blank" rel="noopener">
                {CONSENT_LINK_TEXT}
                <span className="visually-hidden"> (abre em nova aba)</span>
              </Link>
              {after}
            </span>
          </label>
          <FieldError id={`${ID.consent}-erro`} text={err("consent")} className={styles.consentError} />
        </div>

        {sendError ? (
          <p className={cx(styles.full, styles.sendError)} role="alert">
            {sendError}
          </p>
        ) : null}

        <div className={cx(styles.full, styles.actions, styles.formActions)} style={rise(frame, 20, 10)}>
          <PressButton type="submit" className="btn btn--primary" disabled={sending} aria-busy={sending || undefined}>
            {sending ? "Enviando…" : "Enviar e ver o resultado"}
          </PressButton>
          <PressButton className="btn btn--ghost" onClick={onBack}>
            Voltar
          </PressButton>
        </div>
      </form>
    </>
  );
}
