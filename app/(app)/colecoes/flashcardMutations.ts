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
  tagIds?: string[];
};

type AtualizarFlashcardInput = {
  id: string;
  categoryId?: string | null;
  front: Record<string, unknown>;
  back: Record<string, unknown>;
  tagIds?: string[];
};

type ImportarFlashcardsCsvInput = {
  categoryId: string;
  rows: Array<{ front: string; back: string }>;
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

function toParagraphDoc(text: string) {
  const content = text.trim();

  if (!content) {
    return { type: "doc", content: [{ type: "paragraph" }] } as Record<string, unknown>;
  }

  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: content }],
      },
    ],
  } as Record<string, unknown>;
}

function normalizeTagIds(tagIds?: string[]) {
  return Array.from(
    new Set((tagIds ?? []).map((tagId) => tagId.trim()).filter(Boolean)),
  );
}

async function syncFlashcardTags(
  cardId: string,
  tagIds: string[],
) {
  const supabase = createClient();

  const { error: deleteError } = await supabase
    .from("flashcardcard_tags")
    .delete()
    .eq("card_id", cardId);

  if (deleteError) {
    throw new Error(deleteError.message || "Erro ao atualizar tags do cartão.");
  }

  if (!tagIds.length) {
    return;
  }

  const payload = tagIds.map((tagId) => ({
    card_id: cardId,
    tag_id: tagId,
  }));

  const { error: insertError } = await supabase
    .from("flashcardcard_tags")
    .insert(payload);

  if (insertError) {
    throw new Error(insertError.message || "Erro ao atualizar tags do cartão.");
  }
}

export function useSalvarFlashcardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "create"],
    mutationFn: async ({ categoryId, front, back, tagIds }: SalvarFlashcardInput) => {
      if (!categoryId) {
        throw new Error("Coleção inválida.");
      }

      if (isEmptyRichDoc(front)) {
        throw new Error("Preencha a frente do cartão.");
      }

      if (isEmptyRichDoc(back)) {
        throw new Error("Preencha o verso do cartão.");
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
        throw new Error(error.message || "Erro ao salvar cartão.");
      }

      const normalizedTagIds = normalizeTagIds(tagIds);

      if (normalizedTagIds.length) {
        await syncFlashcardTags(data.id, normalizedTagIds);
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
          queryKey: ["flashcards", "due-now", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "study-today", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["categories", "detail", variables.categoryId],
        }),
      ]);
    },
  });
}

export function useImportarFlashcardsCsvMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "import-csv"],
    mutationFn: async ({ categoryId, rows }: ImportarFlashcardsCsvInput) => {
      if (!categoryId) {
        throw new Error("Coleção inválida.");
      }

      if (!rows.length) {
        throw new Error("CSV vazio.");
      }

      const normalizedRows = rows
        .map((row) => ({
          front: row.front.trim(),
          back: row.back.trim(),
        }))
        .filter((row) => row.front || row.back);

      if (!normalizedRows.length) {
        throw new Error("Nenhuma linha válida para importar.");
      }

      const payload = normalizedRows.map((row) => ({
        category_id: categoryId,
        front: toRichContentPayload(toParagraphDoc(row.front)),
        back: toRichContentPayload(toParagraphDoc(row.back)),
      }));

      const supabase = createClient();
      const { data, error } = await supabase
        .from("flashcards")
        .insert(payload)
        .select("id");

      if (error) {
        throw new Error(error.message || "Erro ao importar CSV.");
      }

      return {
        insertedCount: data?.length ?? payload.length,
      };
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "list", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "due-now", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "study-today", variables.categoryId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["categories", "detail", variables.categoryId],
        }),
      ]);
    },
  });
}

export function useAtualizarFlashcardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "update"],
    mutationFn: async ({ id, front, back, tagIds }: AtualizarFlashcardInput) => {
      if (!id) {
        throw new Error("Cartão inválido.");
      }

      if (isEmptyRichDoc(front)) {
        throw new Error("Preencha a frente do cartão.");
      }

      if (isEmptyRichDoc(back)) {
        throw new Error("Preencha o verso do cartão.");
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("flashcards")
        .update({
          front: toRichContentPayload(front),
          back: toRichContentPayload(back),
        })
        .eq("id", id)
        .select("id, category_id")
        .single();

      if (error) {
        throw new Error(error.message || "Erro ao atualizar cartão.");
      }

      await syncFlashcardTags(id, normalizeTagIds(tagIds));

      return data;
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
              queryKey: ["flashcards", "due-now", variables.categoryId],
            })
          : Promise.resolve(),
        variables.categoryId
          ? queryClient.invalidateQueries({
              queryKey: ["flashcards", "study-today", variables.categoryId],
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

export function useExcluirFlashcardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["flashcards", "delete"],
    mutationFn: async ({ id }: ExcluirFlashcardInput) => {
      if (!id) {
        throw new Error("Cartão inválido.");
      }

      const supabase = createClient();
      const { error } = await supabase.from("flashcards").delete().eq("id", id);

      if (error) {
        throw new Error(error.message || "Erro ao excluir cartão.");
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
              queryKey: ["flashcards", "due-now", variables.categoryId],
            })
          : Promise.resolve(),
        variables.categoryId
          ? queryClient.invalidateQueries({
              queryKey: ["flashcards", "study-today", variables.categoryId],
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

