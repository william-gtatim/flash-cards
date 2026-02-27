"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";

import {createClient} from "@/lib/supabase/client";

type SalvarColecaoInput = {
  name: string;
};

type AtualizarColecaoInput = {
  id: string;
  name: string;
  newCardsDailyLimit: number;
};

export function useSalvarColecaoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["categories", "create"],
    mutationFn: async ({ name }: SalvarColecaoInput) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Informe o nome da coleção.");
      }

      const supabase = createClient();
      const { error } = await supabase.from("categories").insert({
        name: trimmedName,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Já existe uma coleção com esse nome.");
        }

        throw new Error(error.message || "Erro ao salvar coleção.");
      }

      return { name: trimmedName };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
    },
  });
}

export function useAtualizarColecaoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["categories", "update"],
    mutationFn: async ({ id, name, newCardsDailyLimit }: AtualizarColecaoInput) => {
      const trimmedName = name.trim();
      const normalizedDailyLimit = Number.isFinite(newCardsDailyLimit)
        ? Math.max(0, Math.trunc(newCardsDailyLimit))
        : 0;

      if (!id) {
        throw new Error("Coleção inválida.");
      }

      if (!trimmedName) {
        throw new Error("Informe o nome da coleção.");
      }

      const supabase = createClient();
      const { error } = await supabase
        .from("categories")
        .update({
          name: trimmedName,
          new_cards_daily_limit: normalizedDailyLimit,
        })
        .eq("id", id);

      if (error) {
        if (error.code === "23505") {
          throw new Error("Já existe uma coleção com esse nome.");
        }

        throw new Error(error.message || "Erro ao atualizar coleção.");
      }

      return { id, name: trimmedName, newCardsDailyLimit: normalizedDailyLimit };
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["categories", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["categories", "detail", variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["flashcards", "study-today", variables.id],
        }),
      ]);
    },
  });
}

