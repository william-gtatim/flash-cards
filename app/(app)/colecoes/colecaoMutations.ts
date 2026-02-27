"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";

import {createClient} from "@/lib/supabase/client";

type SalvarColecaoInput = {
  name: string;
};

export function useSalvarColecaoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["categories", "create"],
    mutationFn: async ({ name }: SalvarColecaoInput) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Informe o nome da colecao.");
      }

      const supabase = createClient();
      const { error } = await supabase.from("categories").insert({
        name: trimmedName,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Ja existe uma colecao com esse nome.");
        }

        throw new Error(error.message || "Erro ao salvar colecao.");
      }

      return { name: trimmedName };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
    },
  });
}
