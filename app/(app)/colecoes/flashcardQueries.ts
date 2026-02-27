"use client";

import {useQuery} from "@tanstack/react-query";

import {createClient} from "@/lib/supabase/client";

export type FlashcardRichContent = {
  type: "tiptap-json";
  version: number;
  doc: Record<string, unknown>;
};

export type FlashcardListItem = {
  id: string;
  category_id: string | null;
  front: FlashcardRichContent | Record<string, unknown>;
  back: FlashcardRichContent | Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
};

async function listarFlashcardsDaColecao(categoryId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcards")
    .select("id, category_id, front, back, is_archived, created_at, updated_at")
    .eq("category_id", categoryId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao buscar cartões.");
  }

  return (data ?? []) as FlashcardListItem[];
}

export function useFlashcardsDaColecaoQuery(categoryId: string) {
  return useQuery({
    queryKey: ["flashcards", "list", categoryId],
    queryFn: () => listarFlashcardsDaColecao(categoryId),
    enabled: Boolean(categoryId),
  });
}
