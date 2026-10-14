// Dados gerais do site, usados no sitemap, no robots.txt, nos links canônicos, no Open Graph e no JSON-LD.

// TODO: confirmar o domínio com o usuário antes de publicar. "v8studio.com.br" é provisório.
export const SITE_URL = "https://v8studio.com.br";

export const SITE_NAME = "V8 Studio";

/** Última atualização da política de privacidade (AAAA-MM-DD). Mude junto com o texto da página. */
export const PRIVACY_UPDATED = "2026-10-14";

/** Endereço completo a partir de um caminho do site, sempre com barra no fim: absoluteUrl("/blog/"). */
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
