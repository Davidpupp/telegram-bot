import { Suspense } from "react";
import { Quiz } from "@/components/comecar/Quiz";
import { QuizFallback } from "@/components/comecar/QuizFallback";
import styles from "@/components/comecar/TopBar.module.css";
import { cx } from "@/motion/lib/cx";

export default function ComecarPage() {
  return (
    <div className={cx("container", styles.page)}>
      <div className={styles.wrap}>
        <h1 className="visually-hidden">Começar um projeto com a V8 Studio</h1>
        <p className={styles.intro}>Leva 2 minutos. Sem compromisso.</p>
        {/* O formulário lê ?servico= e ?objetivo= com useSearchParams: na exportação estática ele precisa
            de um <Suspense>, e o HTML estático leva o card de espera no lugar. */}
        <Suspense fallback={<QuizFallback />}>
          <Quiz />
        </Suspense>
        <p className={styles.note}>Suas respostas servem só para montar a proposta.</p>
      </div>
    </div>
  );
}
