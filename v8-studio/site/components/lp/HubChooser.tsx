"use client";

import { useEffect, useRef, useState } from "react";
import type { Chooser, ChooserService } from "@/content/hub";
import { useReducedMotion, useSpringTo, useTimeline } from "@/motion/hooks";
import { PressLink } from "@/motion/Lift";
import { cx } from "@/motion/lib/cx";
import { clamp, lerp, sp, SPRINGS } from "@/motion/lib/timing";
import { DemoMedia } from "./DemoMedia";
import s from "./HubChooser.module.css";

type Option = { key: string; label: string; hint: string };

/** Entrada de um painel: cada peça desliza do lado da navegação (frente ou volta) com a mola suave. */
function useEnter(animate: boolean, dir: 1 | -1) {
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: animate, duration: 80 });
  return (i: number): React.CSSProperties | undefined => {
    if (!animate || reduce) return undefined;
    const u = sp(frame, i * 3, "soft");
    if (Math.abs(1 - u) < 0.0005) return undefined;
    return { opacity: clamp(u * 1.5), transform: `translateX(${((1 - u) * 32 * dir).toFixed(2)}px)` };
  };
}

function Question({
  title,
  options,
  onPick,
  onBack,
  animate,
  dir,
  headingRef,
}: {
  title: string;
  options: Option[];
  onPick: (key: string) => void;
  onBack?: () => void;
  animate: boolean;
  dir: 1 | -1;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const enter = useEnter(animate, dir);
  return (
    <div className={s.panel}>
      <h2 ref={headingRef} tabIndex={-1} className={s.question} style={enter(0)}>
        {title}
      </h2>
      <div className={s.options} role="group" aria-label={title}>
        {options.map((o, i) => (
          <button key={o.key} type="button" className={cx("option", s.option)} onClick={() => onPick(o.key)} style={enter(i + 1)}>
            <strong>{o.label}</strong>
            <span>{o.hint}</span>
          </button>
        ))}
      </div>
      {onBack ? (
        <button type="button" className={cx("btn btn--quiet", s.back)} onClick={onBack} style={enter(options.length + 1)}>
          Voltar
        </button>
      ) : null}
    </div>
  );
}

function Result({
  service,
  reason,
  onBack,
  onRestart,
  headingRef,
}: {
  service: ChooserService;
  reason: string;
  onBack: () => void;
  onRestart: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const enter = useEnter(true, 1);
  return (
    <div className={s.panel}>
      <p className="kicker" style={enter(0)}>
        Nossa recomendação
      </p>
      <h2 ref={headingRef} tabIndex={-1} className={s.answer} style={enter(1)}>
        Comece por {service.singular}.
      </h2>
      <p className={s.reason} style={enter(2)}>
        {reason}
      </p>
      <div className={s.actions} style={enter(3)}>
        <PressLink href={service.href} className="btn btn--primary">
          Ver {service.name.toLowerCase()}
        </PressLink>
        <PressLink href={service.start} className="btn btn--ghost">
          Começar
        </PressLink>
      </div>
      <div className={s.secondary} style={enter(4)}>
        <button type="button" className="btn btn--quiet" onClick={onBack}>
          Voltar
        </button>
        <button type="button" className="btn btn--quiet" onClick={onRestart}>
          Refazer as perguntas
        </button>
      </div>
    </div>
  );
}

/** Um serviço na lista ao lado: apaga com mola quando deixa de combinar com as respostas. */
function Candidate({ service, on }: { service: ChooserService; on: boolean }) {
  const v = useSpringTo(on ? 1 : 0, SPRINGS.base);
  const style: React.CSSProperties | undefined =
    v > 0.9995 ? undefined : { opacity: lerp(0.28, 1, clamp(v)), transform: `translateX(${((1 - v) * 12).toFixed(2)}px) scale(${lerp(0.97, 1, clamp(v)).toFixed(4)})` };
  return (
    <div className={s.candidate} style={style}>
      <strong>{service.name}</strong>
      <span>{service.hint}</span>
    </div>
  );
}

/** A demo do serviço recomendado entra crescendo de leve no lugar da lista. */
function ResultDemo({ service }: { service: ChooserService }) {
  const reduce = useReducedMotion();
  const frame = useTimeline({ play: true, duration: 60 });
  const u = reduce ? 1 : sp(frame, 4, "soft");
  const style: React.CSSProperties | undefined = u > 0.9995 ? undefined : { opacity: clamp(u * 1.4), transform: `scale(${lerp(0.94, 1, u).toFixed(4)})` };
  return (
    <div className={s.demo} style={style}>
      {service.demo ? <DemoMedia id={service.demo.id} label={service.demo.label} fill /> : null}
    </div>
  );
}

/**
 * Escolhedor de duas perguntas: para quem é e o que a pessoa precisa fazer. A segunda pergunta depende da
 * primeira, e cada resposta final recomenda um serviço com o motivo, levando à landing page dele.
 * Ao lado, os cinco serviços apagam conforme as respostas e dão lugar à demo do recomendado.
 */
export function HubChooser({ chooser, services }: { chooser: Chooser; services: ChooserService[] }) {
  const [who, setWho] = useState<string | null>(null);
  const [what, setWhat] = useState<string | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [touched, setTouched] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const branch = chooser.options.find((o) => o.key === who) ?? null;
  const leaf = branch?.options.find((o) => o.key === what) ?? null;
  const step = !branch ? 0 : !leaf ? 1 : 2;
  const winner = leaf ? (services.find((x) => x.slug === leaf.service) ?? null) : null;
  const progress = useSpringTo((step + 1) / 3, SPRINGS.base);

  // Depois de cada resposta, o foco vai para a pergunta nova (ou para a recomendação). Se ela ficou
  // escondida acima da tela (celular), a página sobe até ela, abaixo do cabeçalho fixo.
  useEffect(() => {
    const el = heading.current;
    if (!touched || !el) return;
    el.focus({ preventScroll: true });
    const top = el.getBoundingClientRect().top;
    const header = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    if (top < header + 16) window.scrollBy({ top: top - header - 32 });
  }, [touched, who, what]);

  const go = (d: 1 | -1, nextWho: string | null, nextWhat: string | null) => {
    setTouched(true);
    setDir(d);
    setWho(nextWho);
    setWhat(nextWhat);
  };

  const active = step === 0 || !branch ? null : new Set(step === 2 && leaf ? [leaf.service] : branch.options.map((o) => o.service));

  return (
    <div className={cx("card", s.chooser)}>
      <div className={s.top}>
        <p className={s.count}>{step < 2 ? `Pergunta ${step + 1} de 2` : "Pronto"}</p>
        <div className="progress" aria-hidden="true">
          <div className="progress__bar" style={{ width: `${(clamp(progress) * 100).toFixed(2)}%` }} />
        </div>
      </div>
      <div className={cx(s.body, step === 2 && s.done)}>
        <div className={s.main}>
          {step === 0 ? (
            <Question key="q1" title={chooser.question} options={chooser.options} onPick={(k) => go(1, k, null)} animate={touched} dir={dir} headingRef={heading} />
          ) : null}
          {step === 1 && branch ? (
            <Question
              key={`q2-${branch.key}`}
              title={branch.question}
              options={branch.options}
              onPick={(k) => go(1, branch.key, k)}
              onBack={() => go(-1, null, null)}
              animate
              dir={dir}
              headingRef={heading}
            />
          ) : null}
          {step === 2 && leaf && winner ? (
            <Result
              key={`r-${leaf.key}`}
              service={winner}
              reason={leaf.reason}
              onBack={() => go(-1, who, null)}
              onRestart={() => go(-1, null, null)}
              headingRef={heading}
            />
          ) : null}
        </div>
        <div className={s.side}>
          {step === 2 && winner ? (
            <ResultDemo key={winner.slug} service={winner} />
          ) : (
            <div className={s.candidates} aria-hidden="true">
              <p className={s.sideNote}>{active ? "Combinam com a sua resposta" : "Os cinco serviços da V8"}</p>
              {services.map((x) => (
                <Candidate key={x.slug} service={x} on={!active || active.has(x.slug)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
