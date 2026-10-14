import { Reveal } from "@/motion/Reveal";
import s from "./sobre.module.css";

// Só compromissos que o site já faz em outras páginas (Home, passos e perguntas frequentes).
const ITEMS = [
  { title: "Proposta em até 1 dia útil", text: "Escopo, prazo e investimento por escrito, depois de um formulário de 2 minutos." },
  { title: "Prazos combinados antes de começar", text: "O cronograma vem na proposta, e você sabe em que etapa o projeto está." },
  { title: "Revisões combinadas", text: "Você vê cada etapa antes de seguir e pede ajustes dentro do que foi combinado." },
  { title: "Ajuda com textos e fotos", text: "A gente ajuda a escrever os textos e indica o que fotografar. O que você já tem e funciona, a gente aproveita." },
  { title: "Celular primeiro", text: "Cada tela nasce no celular e depois cresce para o computador." },
  { title: "Base para a busca", text: "Páginas rápidas, títulos e descrições pensados para cada página e mapa do site." },
  { title: "Tudo no seu nome", text: "Domínio, conteúdo e acessos ficam com você. Textos, fotos e blog você mesmo atualiza." },
  { title: "Por perto depois do lançamento", text: "O site vai ao ar medido e pronto para receber contatos. Para mudanças maiores, a gente continua disponível." },
];

/** O que o cliente pode esperar: oito compromissos em duas colunas, separados por linhas finas. */
export function Expectations() {
  return (
    <Reveal as="ul" className={s.expect}>
      {ITEMS.map((it) => (
        <li key={it.title} className={s.expectItem}>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
