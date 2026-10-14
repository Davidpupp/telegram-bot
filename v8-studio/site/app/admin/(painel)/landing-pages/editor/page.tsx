import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingEditor, LandingEditorFromQuery } from "@/components/admin/LandingEditor";

export const metadata: Metadata = { title: "Editor de landing page" };

export default function LandingEditorPage() {
  // ?slug= abre uma landing page existente; o Suspense permite gerar a página estática.
  return (
    <Suspense fallback={<LandingEditor />}>
      <LandingEditorFromQuery />
    </Suspense>
  );
}
