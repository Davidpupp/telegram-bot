"use client";

import { useTimeline } from "@/motion/hooks";
import { KineticText } from "@/motion/KineticText";
import { cx } from "@/motion/lib/cx";
import { sp } from "@/motion/lib/timing";
import { rise } from "./anim";
import { Collapse } from "./Collapse";
import { Option } from "./Option";
import { PressButton } from "./PressButton";
import type { Question } from "./questions";
import styles from "./Quiz.module.css";

type Props = {
  question: Question;
  titleId: string;
  /** Frase acima do título, comentando a resposta anterior. */
  echo: string;
  answer: string | undefined;
  onChoose: (value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  /** Aviso quando a pessoa tenta continuar sem escolher. */
  hint: boolean;
};

/**
 * Uma pergunta por tela. Ao montar, a frase de cima sobe, o título entra palavra por palavra (KineticText)
 * e as opções sobem em cascata com a mola suave, uma a cada 2 quadros.
 */
export function QuestionScreen({ question, titleId, echo, answer, onChoose, onContinue, onBack, hint }: Props) {
  const frame = useTimeline({ play: true, duration: 90 });
  const n = question.options.length;

  return (
    <>
      <p className={cx("kicker", styles.kicker)} style={rise(frame, 0, 10)}>
        {echo}
      </p>
      <KineticText as="h2" id={titleId} text={question.title} className={styles.title} delay={3} />
      <div role="group" aria-labelledby={titleId} className={cx(styles.options, question.cols === 3 && styles.options3)}>
        {question.options.map((o, i) => (
          <Option key={o.value} label={o.label} hint={o.hint} selected={answer === o.value} onChoose={() => onChoose(o.value)} enter={sp(frame, 8 + i * 2, "soft")} />
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        {hint ? "Escolha uma opção para continuar." : ""}
      </p>
      <Collapse open={hint}>
        <p className={styles.hint} aria-hidden="true">
          Escolha uma opção para continuar.
        </p>
      </Collapse>
      <div className={styles.actions} style={rise(frame, 10 + n * 2, 10)}>
        <PressButton className={cx("btn btn--primary", !answer && styles.dim)} aria-disabled={!answer || undefined} onClick={onContinue}>
          Continuar
        </PressButton>
        {onBack ? (
          <PressButton className="btn btn--ghost" onClick={onBack}>
            Voltar
          </PressButton>
        ) : null}
      </div>
    </>
  );
}
