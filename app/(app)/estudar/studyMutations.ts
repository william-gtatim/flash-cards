"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";
import {
  computeSm2Progress,
  type ProgressSnapshot,
  type ReviewGrade,
} from "@/app/(app)/estudar/sm2";

type ProgressSnapshotRow = ProgressSnapshot & { id: string };

type RegistrarRevisaoInput = {
  cardId: string;
  grade: ReviewGrade;
};

export function useRegistrarRevisaoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["study", "review"],
    mutationFn: async ({ cardId, grade }: RegistrarRevisaoInput) => {
      if (!cardId) {
        throw new Error("Card invalido.");
      }

      if (![1, 2, 3, 4].includes(grade)) {
        throw new Error("Nota invalida.");
      }

      const supabase = createClient();
      const now = new Date();
      const reviewedAt = now.toISOString();

      const { error: reviewError } = await supabase.from("flashcard_reviews").insert({
        card_id: cardId,
        grade,
        reviewed_at: reviewedAt,
      });

      if (reviewError) {
        throw new Error(reviewError.message || "Erro ao registrar revisao.");
      }

      const { data: progressRows, error: progressReadError } = await supabase
        .from("flashcard_card_progress")
        .select(
          "id, level, ease_factor, repetition, interval_days, lapses, correct_streak, review_count",
        )
        .eq("card_id", cardId)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (progressReadError) {
        throw new Error(progressReadError.message || "Erro ao carregar progresso do card.");
      }

      const previous = (progressRows?.[0] ?? null) as ProgressSnapshotRow | null;
      const next = computeSm2Progress(previous, grade, now);

      if (previous?.id) {
        const { error: updateError } = await supabase
          .from("flashcard_card_progress")
          .update({
            level: next.level,
            ease_factor: next.easeFactor,
            repetition: next.repetition,
            interval_days: next.intervalDays,
            lapses: next.lapses,
            last_grade: grade,
            last_reviewed_at: reviewedAt,
            next_due_at: next.nextDueAt,
            correct_streak: next.correctStreak,
            review_count: next.reviewCount,
            updated_at: reviewedAt,
          })
          .eq("id", previous.id);

        if (updateError) {
          throw new Error(updateError.message || "Erro ao atualizar progresso do card.");
        }
      } else {
        const { error: insertError } = await supabase.from("flashcard_card_progress").insert({
          card_id: cardId,
          level: next.level,
          ease_factor: next.easeFactor,
          repetition: next.repetition,
          interval_days: next.intervalDays,
          lapses: next.lapses,
          last_grade: grade,
          last_reviewed_at: reviewedAt,
          next_due_at: next.nextDueAt,
          correct_streak: next.correctStreak,
          review_count: next.reviewCount,
          updated_at: reviewedAt,
        });

        if (insertError) {
          throw new Error(insertError.message || "Erro ao criar progresso do card.");
        }
      }

      return {
        cardId,
        grade,
        nextDueAt: next.nextDueAt,
        intervalDays: next.intervalDays,
      };
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards", "by-ids"] }),
        queryClient.invalidateQueries({ queryKey: ["flashcards", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["flashcards", "due-now"] }),
        queryClient.invalidateQueries({ queryKey: ["flashcards", "study-today"] }),
      ]);
    },
  });
}
