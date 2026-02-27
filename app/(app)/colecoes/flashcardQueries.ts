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

async function buscarFlashcardsPorIds(ids: string[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcards")
    .select("id, category_id, front, back, is_archived, created_at, updated_at")
    .in("id", ids)
    .eq("is_archived", false);

  if (error) {
    throw new Error(error.message || "Erro ao buscar cards para estudo.");
  }

  const byId = new Map((data ?? []).map((item) => [item.id, item]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((item): item is FlashcardListItem => Boolean(item));

  return ordered;
}

export function useFlashcardsByIdsQuery(ids: string[]) {
  return useQuery({
    queryKey: ["flashcards", "by-ids", ids],
    queryFn: () => buscarFlashcardsPorIds(ids),
    enabled: ids.length > 0,
  });
}
