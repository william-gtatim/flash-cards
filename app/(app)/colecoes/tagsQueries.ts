"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

export type TagItem = {
  id: string;
  name: string;
};

async function listarTagsDoUsuario() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message || "Erro ao buscar tags.");
  }

  return (data ?? []) as TagItem[];
}

export function useUserTagsQuery() {
  return useQuery({
    queryKey: ["tags", "user-list"],
    queryFn: listarTagsDoUsuario,
  });
}

