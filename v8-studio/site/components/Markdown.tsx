import Link from "next/link";
import { Fragment } from "react";

// Markdown simples para os artigos do blog e a prévia do editor do admin. Gera elementos React
// (nunca HTML cru), então qualquer "<script>" no texto aparece como texto, sem executar.
// Suporta: ## e ### títulos, parágrafos, listas com "- " e "1. ", citações com "> ",
// **negrito**, *itálico*, `código` e [links](/caminho/ ou https://...).

type Block = { type: "h2" | "h3" | "p" | "ul" | "ol" | "quote"; lines: string[] };

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Minutos de leitura, a 200 palavras por minuto. */
export const readingMinutes = (src: string) => Math.max(1, Math.round(src.split(/\s+/).filter(Boolean).length / 200));

function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  let cur: Block | null = null;
  const push = () => {
    if (cur && cur.lines.length) blocks.push(cur);
    cur = null;
  };
  for (const raw of src.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      push();
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      push();
      blocks.push({ type: h[1].length === 2 ? "h2" : "h3", lines: [h[2]] });
      continue;
    }
    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const q = /^>\s?(.*)$/.exec(line);
    const type: Block["type"] = ul ? "ul" : ol ? "ol" : q ? "quote" : "p";
    const text = ul ? ul[1] : ol ? ol[1] : q ? q[1] : line.trim();
    if (!cur || cur.type !== type) {
      push();
      cur = { type, lines: [] };
    }
    cur.lines.push(text);
  }
  push();
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={k++}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k++}>{t.slice(1, -1)}</code>);
    else if (t.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t)!;
      const href = lm[2];
      if (href.startsWith("/")) {
        out.push(
          <Link key={k++} href={href}>
            {lm[1]}
          </Link>,
        );
      } else if (/^https?:\/\//.test(href)) {
        out.push(
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer">
            {lm[1]}
          </a>,
        );
      } else out.push(lm[1]);
    } else out.push(<em key={k++}>{t.slice(1, -1)}</em>);
    last = i + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={slugify(b.lines[0])}>
                {inline(b.lines[0])}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(b.lines[0])}>
                {inline(b.lines[0])}
              </h3>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.lines.map((l, j) => (
                  <li key={j}>{inline(l)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.lines.map((l, j) => (
                  <li key={j}>{inline(l)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i}>
                {b.lines.map((l, j) => (
                  <Fragment key={j}>
                    {j > 0 ? <br /> : null}
                    {inline(l)}
                  </Fragment>
                ))}
              </blockquote>
            );
          default:
            return <p key={i}>{inline(b.lines.join(" "))}</p>;
        }
      })}
    </div>
  );
}
