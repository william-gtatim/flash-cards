"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";

import {createClient} from "@/lib/supabase/client";

type RichContentPayload = {
  type: "tiptap-json";
  version: 1;
  doc: Record<string, unknown>;
};

type SalvarFlashcardInput = {
  categoryId: string;
  front: Record<string, unknown>;
  back: Record<string, unknown>;
};

type ExcluirFlashcardInput = {
  id: string;
  categoryId?: string | null;
};

function isEmptyRichDoc(doc: Record<string, unknown>) {
  const json = JSON.stringify(doc);

  return (
    json === '{"type":"doc","content":[{"type":"paragraph"}]}' ||
    json === '{"type":"doc","content":[{"type":"paragraph","content":[]}]}'
  );
}

function toRichContentPayload(doc: Record<string, unknown>): RichContentPayload {
  return {
    type: "tiptap-json",
    version: 1,
    doc,
  };
}

export function useSalvarFlashcardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "create"],
    mutationFn: async ({ categoryId, front, back }: SalvarFlashcardInput) => {
      if (!categoryId) {
        throw new Error("Colecao invalida.");
      }

      if (isEmptyRichDoc(front)) {
        throw new Error("Preencha a frente do cartao.");
      }

      if (isEmptyRichDoc(back)) {
        throw new Error("Preencha o verso do cartao.");
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("flashcards")
        .insert({
          category_id: categoryId,
          front: toRichContentPayload(front),
          back: toRichContentPayload(back),
        })
        .select("id, category_id, created_at")
        .single();

      if (error) {
        throw new Error(error.message || "Erro ao salvar cartao.");
      }

      return data;
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "list", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["categories", "detail", variables.categoryId],
        }),
      ]);
    },
  });
}

export function useExcluirFlashcardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "delete"],
    mutationFn: async ({ id }: ExcluirFlashcardInput) => {
      if (!id) {
        throw new Error("Cartao invalido.");
      }

      const supabase = createClient();
      const { error } = await supabase.from("flashcards").delete().eq("id", id);

      if (error) {
        throw new Error(error.message || "Erro ao excluir cartao.");
      }

      return { id };
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards", "list"] }),
        variables.categoryId
          ? queryClient.invalidateQueries({
              queryKey: ["flashcards", "list", variables.categoryId],
            })
          : Promise.resolve(),
        variables.categoryId
          ? queryClient.invalidateQueries({
              queryKey: ["categories", "detail", variables.categoryId],
            })
          : Promise.resolve(),
      ]);
    },
  });
}
