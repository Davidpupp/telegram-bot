import { SEGMENTS } from "@/motion/film/segments";
import { cx } from "@/motion/lib/cx";
import { MotionPlayer } from "@/motion/MotionPlayer";
import { Reveal } from "@/motion/Reveal";
import s from "./sobre.module.css";

// Na Home o filme abre com a clínica; aqui ele mostra o restaurante, para variar o exemplo.
const SEG = "restaurante" as const;

/** O filme da marca num card grande, com a nota de exemplo ilustrativo logo abaixo. */
export function BrandFilm() {
  const seg = SEGMENTS[SEG];
  return (
    <>
      <Reveal className={cx("player-frame", s.film)} y={48}>
        <MotionPlayer
          id="hero-film"
          inputProps={{ seg: SEG }}
          label={`Animação: alguém procura "${seg.query}" e só encontra outras empresas. Com um site da V8, encontra ${seg.brand}; o site se monta e os contatos começam a chegar.`}
        />
      </Reveal>
      <p className={cx("small muted", s.filmNote)}>Exemplo ilustrativo. Os nomes das empresas são fictícios.</p>
    </>
  );
}
