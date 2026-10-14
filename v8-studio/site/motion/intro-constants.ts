// Constantes da abertura do logo, sem "use client" para poderem ser lidas por componentes de servidor.
export const INTRO_KEY = "v8-intro";
export const INTRO_CLASS = "intro-pending";

/** Roda durante a leitura do HTML da Home, antes da primeira pintura: decide se a abertura aparece. */
export const INTRO_DECIDE_SCRIPT = `try{if(!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("${INTRO_CLASS}")}catch(e){}`;

/**
 * Roda no <head> de todas as páginas: marca que há JavaScript (as animações começam escondidas) e,
 * se o site não hidratar em 6 s, mostra tudo parado.
 */
export const JS_FLAG_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");setTimeout(function(){if(!d.classList.contains("hy"))d.classList.remove("js","${INTRO_CLASS}")},6000)})()`;
