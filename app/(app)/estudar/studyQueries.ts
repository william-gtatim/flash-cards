"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";
import type { ProgressSnapshot } from "@/app/(app)/estudar/sm2";

async function buscarProgressoDoCard(cardId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcard_card_progress")
    .select(
      "level, ease_factor, repetition, interval_days, lapses, correct_streak, review_count",
    )
    .eq("card_id", cardId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message || "Erro ao buscar progresso do card.");
  }

  return (data?.[0] ?? null) as ProgressSnapshot | null;
}

export function useFlashcardProgressQuery(cardId?: string) {
  return useQuery({
    queryKey: ["flashcards", "progress", cardId],
    queryFn: () => buscarProgressoDoCard(cardId as string),
    enabled: Boolean(cardId),
  });
}
