"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";
import type { TagItem } from "@/app/(app)/colecoes/tagsQueries";

type CriarTagInput = {
  name: string;
};

export function useCriarTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["tags", "create"],
    mutationFn: async ({ name }: CriarTagInput) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Informe o nome da tag.");
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("tags")
        .insert({ name: trimmedName })
        .select("id, name")
        .single();

      if (error) {
        if (error.code === "23505") {
          const { data: existing } = await supabase
            .from("tags")
            .select("id, name")
            .eq("name", trimmedName)
            .maybeSingle();

          if (existing) {
            return existing as TagItem;
          }
        }

        throw new Error(error.message || "Erro ao criar tag.");
      }

      return data as TagItem;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tags", "user-list"] });
    },
  });
}

