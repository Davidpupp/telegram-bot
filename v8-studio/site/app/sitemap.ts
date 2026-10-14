import type { MetadataRoute } from "next";
import { postHref, POSTS } from "@/content/posts";
import { serviceHref, SERVICES } from "@/content/services";
import { absoluteUrl, PRIVACY_UPDATED } from "@/content/site";

// Exportação estática: o sitemap é gerado uma vez, no build, como /sitemap.xml.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const newestPost = POSTS.map((p) => p.date).sort().at(-1);
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/servicos/") },
    ...SERVICES.map((s) => ({ url: absoluteUrl(serviceHref(s.slug)) })),
    { url: absoluteUrl("/blog/"), lastModified: newestPost },
    ...POSTS.map((p) => ({ url: absoluteUrl(postHref(p.slug)), lastModified: p.date })),
    { url: absoluteUrl("/sobre/") },
    { url: absoluteUrl("/comecar/") },
    { url: absoluteUrl("/privacidade/"), lastModified: PRIVACY_UPDATED },
  ];
}
