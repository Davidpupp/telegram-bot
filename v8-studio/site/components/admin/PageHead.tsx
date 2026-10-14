import { cx } from "@/motion/lib/cx";
import { KineticText } from "@/motion/KineticText";
import s from "./ui.module.css";

type Props = {
  title: string;
  kicker?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
};

/** Título da tela (frase cinética) com kicker, linha de apoio e ações à direita. */
export function PageHead({ title, kicker, meta, actions }: Props) {
  return (
    <header className={cx("admin__top", s.head)}>
      <div className={s.titles}>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <KineticText as="h1" text={title} delay={2} />
        {meta ? <p className={s.meta}>{meta}</p> : null}
      </div>
      {actions ? <div className={s.actions}>{actions}</div> : null}
    </header>
  );
}

/** Título de card (h2 pequeno) com apoio e uma ação opcional. */
export function CardHead({ title, sub, action, id }: { title: string; sub?: React.ReactNode; action?: React.ReactNode; id?: string }) {
  return (
    <div className={s.cardHead}>
      <div>
        <h2 className={s.cardTitle} id={id}>
          {title}
        </h2>
        {sub ? <p className={s.cardSub}>{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}
