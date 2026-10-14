import { KineticText } from "@/motion/KineticText";
import { Reveal } from "@/motion/Reveal";
import s from "./sobre.module.css";

const PRINCIPLES = [
  {
    word: "Clareza.",
    text: "Proposta com escopo, prazo e investimento por escrito, sem letra miúda. Textos que o seu cliente entende de primeira. Se uma palavra precisa de explicação, a gente troca por outra mais simples.",
  },
  {
    word: "Velocidade.",
    text: "Resposta em até 1 dia útil depois do formulário. Páginas leves, que abrem rápido mesmo com a internet do celular oscilando. E um processo sem etapas que não levam a lugar nenhum.",
  },
  {
    word: "Honestidade.",
    text: "Se o que resolve o seu problema é um projeto menor do que você imaginava, a gente diz. Nada de prometer primeiro lugar no Google ou resultado que ninguém pode garantir.",
  },
];

/** Os três princípios em linhas largas sobre o azul: a palavra grande à esquerda e o que ela significa na prática. */
export function Principles() {
  return (
    <ul className={s.principles}>
      {PRINCIPLES.map((p, i) => (
        <li key={p.word} className={s.principle}>
          <KineticText as="h3" text={p.word} className={s.principleWord} delay={i * 4} />
          <Reveal as="p" className={s.principleText} delay={10 + i * 4}>
            {p.text}
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
