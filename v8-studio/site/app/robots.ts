import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";

// Exportação estática: o arquivo é gerado uma vez, no build, como /robots.txt.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
