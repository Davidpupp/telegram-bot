import type { Metadata } from "next";
import { Suspense } from "react";
import { PostEditor, PostEditorFromQuery } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "Editor de post" };

export default function PostEditorPage() {
  // ?slug= abre um post existente; o Suspense permite gerar a página estática.
  return (
    <Suspense fallback={<PostEditor />}>
      <PostEditorFromQuery />
    </Suspense>
  );
}
