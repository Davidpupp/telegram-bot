import Link from "next/link";
import { LiftLink } from "@/motion/Lift";
import styles from "./pranchas.module.css";

export const metadata = { title: "Índice" };

const BOARDS = [
  { href: "/pranchas/tokens/", title: "Tokens", text: "Cores, tipografia, grade, espaçamentos, raios, sombras e as molas do movimento." },
  { href: "/pranchas/componentes/", title: "Componentes", text: "Botões, cards, frase cinética, faixa que inunda, vitrine, passos, perguntas, formulário e tabelas, funcionando." },
  { href: "/pranchas/movimento/", title: "Movimento", text: "Quadros-chave da abertura do logo, do filme do topo e das demos, com a especificação de cada animação." },
  { href: "/pranchas/paginas/", title: "Páginas", text: "Todas as páginas no computador e no celular." },
];

export default function PranchasIndex() {
  return (
    <div className="container">
      <div className={styles.head}>
        <p className="kicker">V8 Studio · sistema visual</p>
        <h1>Pranchas</h1>
        <p className="lead muted">
          A documentação do design que roda no próprio site. Os nomes de camada estão em inglês, como no arquivo de design; os textos, em português.
        </p>
      </div>
      <div className={styles.cards}>
        {BOARDS.map((b) => (
          <LiftLink key={b.href} href={b.href} className={`card ${styles.indexCard}`}>
            <span className={styles.layer}>Board / {b.title}</span>
            <h2>{b.title}</h2>
            <p>{b.text}</p>
          </LiftLink>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 40 }}>
        O site em si começa na <Link href="/" style={{ color: "var(--color-blue)", fontWeight: 600 }}>Home</Link>.
      </p>
    </div>
  );
}
