import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { Hydrated } from "@/components/site/Hydrated";
import { JS_FLAG_SCRIPT } from "@/motion/intro-constants";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "V8 Studio · Sites que vendem", template: "%s · V8 Studio" },
  description:
    "A V8 Studio cria landing pages, sites, lojas virtuais, sistemas e aplicativos para empresas que querem ser encontradas e escolhidas.",
  applicationName: "V8 Studio",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Uma dica de pré-carregamento por fonte (o React evita duplicar a tag).
  preload("/fonts/bricolage-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  preload("/fonts/inter-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
      </head>
      <body>
        <Hydrated />
        {children}
      </body>
    </html>
  );
}
