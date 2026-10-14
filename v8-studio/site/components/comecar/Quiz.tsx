"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CONSENT_TEXT, CONSENT_VERSION, isGoalKey, isServiceSlug, readSource, submitLead, type LeadAnswers, type LeadPayload } from "@/lib/leads";
import { useReducedMotion, useSpringTo } from "@/motion/hooks";
import { cx } from "@/motion/lib/cx";
import { clamp, SPRINGS } from "@/motion/lib/timing";
import { springScrollTo } from "./anim";
import { EMPTY_CONTACT, firstName, phoneDigits, type ContactState } from "./contact";
import { ContactScreen } from "./ContactScreen";
import { Progress } from "./Progress";
import { QuestionScreen } from "./QuestionScreen";
import { answerLabels, choiceFor, CONTACT_STEP, firstUnanswered, QUESTIONS, RESULT_STEP, TOTAL_STEPS } from "./questions";
import { ResultScreen, type ResultData } from "./ResultScreen";
import { recommend, resultLines } from "./score";
import styles from "./Quiz.module.css";

/** Distância do deslize entre telas, em pixels. */
const SLIDE = 48;
/** Pausa entre escolher uma opção e a tela seguinte entrar: dá tempo de ver a escolha. */
const AUTO_ADVANCE_MS = 320;

const titleId = (i: number) => (i < CONTACT_STEP ? `pergunta-${i + 1}` : i === CONTACT_STEP ? "contato-titulo" : "resultado-titulo");

/** ?servico= marca a primeira pergunta e começa na segunda; ?objetivo= marca a terceira. */
function initFrom(params: { get(name: string): string | null }) {
  const answers: Partial<LeadAnswers> = {};
  const servico = params.get("servico");
  const objetivo = params.get("objetivo");
  if (isServiceSlug(servico)) answers.need = servico;
  if (isGoalKey(objetivo)) answers.goal = objetivo;
  return { answers, step: answers.need ? 1 : 0 };
}

/** Uma tela no palco: mede a própria altura e, fora de cena, fica inerte. */
function Slide({ index, current, style, onHeight, children }: { index: number; current: boolean; style?: React.CSSProperties; onHeight: (i: number, h: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onHeight(index, el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, onHeight]);
  return (
    <div ref={ref} className={styles.screen} style={style} data-current={current || undefined} aria-hidden={current ? undefined : true} inert={!current}>
      {children}
    </div>
  );
}

/**
 * Formulário "Começar": 7 perguntas, contato e resultado, uma tela por vez num card branco.
 *
 * Movimento: uma mola só (base, k 170, d 26) leva a posição do palco de uma tela à outra. Cada tela desliza
 * e esmaece conforme a distância até essa posição, para a frente e para trás, e a altura do card acompanha a
 * mesma mola. Com movimento reduzido, a posição pula direto e tudo aparece pronto.
 */
export function Quiz() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [init] = useState(() => initFrom(params));
  const [answers, setAnswers] = useState<Partial<LeadAnswers>>(init.answers);
  const [step, setStep] = useState(init.step);
  const [moved, setMoved] = useState(false);
  const [hint, setHint] = useState(false);
  const [contact, setContact] = useState<ContactState>(EMPTY_CONTACT);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const pos = useSpringTo(step, SPRINGS.base);
  const timer = useRef<number | null>(null);
  const card = useRef<HTMLDivElement>(null);

  const onHeight = useCallback((i: number, h: number) => setHeights((m) => (m[i] === h ? m : { ...m, [i]: h })), []);

  const go = useCallback((to: number) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setStep(to);
    setMoved(true);
    setHint(false);
  }, []);

  useEffect(() => {
    const t = timer;
    return () => {
      if (t.current !== null) window.clearTimeout(t.current);
    };
  }, []);

  // Tela nova: o foco vai para o título e, se o card ficou acima da tela, a janela rola até ele com a mola.
  useEffect(() => {
    if (!moved) return;
    const title = document.getElementById(titleId(step));
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
    }
    const top = card.current?.getBoundingClientRect().top ?? 0;
    if (top < 8) return springScrollTo(window.scrollY + top - 16, reduce);
  }, [step, moved, reduce]);

  const choose = (i: number, value: string) => {
    const q = QUESTIONS[i];
    setAnswers((a) => ({ ...a, [q.id]: value }));
    setHint(false);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => go(i + 1), reduce ? 180 : AUTO_ADVANCE_MS);
  };

  const continueFrom = (i: number) => {
    if (i < CONTACT_STEP) {
      if (answers[QUESTIONS[i].id]) go(i + 1);
      else setHint(true);
    } else if (i === CONTACT_STEP) {
      card.current?.querySelector<HTMLFormElement>("[data-current] form")?.requestSubmit();
    }
  };

  const submit = async () => {
    if (sending) return;
    const missing = firstUnanswered(answers);
    if (missing !== -1) {
      go(missing);
      return;
    }
    const a = answers as LeadAnswers;
    const rec = recommend(a);
    const now = new Date().toISOString();
    const whatsapp = contact.channel === "whatsapp";
    const payload: LeadPayload = {
      schema: 1,
      createdAt: now,
      answers: a,
      answerLabels: answerLabels(a),
      recommendedService: rec.service,
      compatibility: rec.compatibility,
      contact: {
        name: contact.name.trim(),
        company: contact.company.trim(),
        channel: contact.channel,
        whatsapp: whatsapp ? `+55${phoneDigits(contact.whatsapp)}` : null,
        email: whatsapp ? null : contact.email.trim(),
      },
      consent: { accepted: true, acceptedAt: contact.consentAt ?? now, version: CONSENT_VERSION, text: CONSENT_TEXT },
      source: readSource(params),
    };
    setSending(true);
    setSendError(null);
    const res = await submitLead(payload);
    setSending(false);
    if (!res.ok) {
      setSendError(res.error || "Não conseguimos enviar agora. Tente de novo em instantes.");
      return;
    }
    setResult({
      service: rec.service,
      compatibility: rec.compatibility,
      firstName: firstName(contact.name),
      lines: resultLines(a, rec.service),
      channel: contact.channel,
      contactShown: whatsapp ? contact.whatsapp : contact.email.trim(),
    });
    go(RESULT_STEP);
  };

  // Enter continua quando o foco não está num botão, link ou campo (esses já têm o próprio Enter).
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.defaultPrevented || e.nativeEvent.isComposing || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
    if ((e.target as HTMLElement).closest("button, a, input, select, textarea, label")) return;
    e.preventDefault();
    continueFrom(step);
  };

  const echoFor = (i: number) => {
    if (i === 0) {
      const goal = choiceFor("goal", answers.goal);
      return goal ? `Objetivo anotado: ${goal.label.toLowerCase()}.` : "Vamos montar a sua proposta.";
    }
    const q = QUESTIONS[i - 1];
    const echo = choiceFor(q.id, answers[q.id])?.echo ?? "";
    return i === CONTACT_STEP ? `${echo} Falta só o contato.`.trim() : echo;
  };

  const renderScreen = (i: number) => {
    if (i < CONTACT_STEP) {
      const q = QUESTIONS[i];
      return (
        <QuestionScreen
          question={q}
          titleId={titleId(i)}
          echo={echoFor(i)}
          answer={answers[q.id]}
          onChoose={(v) => choose(i, v)}
          onContinue={() => continueFrom(i)}
          onBack={i > 0 ? () => go(i - 1) : undefined}
          hint={hint && i === step}
        />
      );
    }
    if (i === CONTACT_STEP) {
      return (
        <ContactScreen
          titleId={titleId(i)}
          echo={echoFor(i)}
          contact={contact}
          onChange={(patch) => setContact((c) => ({ ...c, ...patch }))}
          sending={sending}
          sendError={sendError}
          onSubmit={submit}
          onBack={() => go(i - 1)}
        />
      );
    }
    return result ? <ResultScreen titleId={titleId(i)} data={result} /> : null;
  };

  // O palco é um carrossel: cada tela fica a (índice − posição) × SLIDE do centro e aparece conforme a distância.
  // Em cena: a etapa atual e toda tela a menos de uma posição da mola (a que sai e, num salto, as do meio).
  const moving = pos !== step;
  const presence = (i: number) => clamp(1 - Math.abs(pos - i));
  const shown: number[] = [];
  for (let i = Math.floor(Math.min(pos, step)); i <= Math.ceil(Math.max(pos, step)); i++) if (i === step || presence(i) > 0) shown.push(i);
  let height: number | undefined;
  if (moving) {
    let sum = 0;
    for (const i of shown) {
      if (presence(i) === 0) continue;
      if (heights[i] === undefined) {
        sum = NaN;
        break;
      }
      sum += heights[i] * presence(i);
    }
    if (Number.isFinite(sum)) height = sum;
  }
  const slideStyle = (i: number): React.CSSProperties | undefined => {
    if (!moving) return undefined;
    const opacity = clamp((presence(i) - 0.3) / 0.7);
    return { transform: `translateX(${(-(pos - i) * SLIDE).toFixed(2)}px)`, opacity, pointerEvents: opacity === 0 ? "none" : undefined };
  };

  return (
    <div ref={card} className={cx("card", styles.quiz)} onKeyDown={onKeyDown}>
      <Progress step={step} total={TOTAL_STEPS} />
      <div className={styles.stage} style={height === undefined ? undefined : { height: `${height.toFixed(2)}px` }}>
        {shown.map((i) => (
          <Slide
            key={i}
            index={i}
            current={i === step}
            onHeight={onHeight}
            style={slideStyle(i)}
          >
            {renderScreen(i)}
          </Slide>
        ))}
      </div>
    </div>
  );
}
