"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

export type ColecaoListItem = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ColecaoDetalhe = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

async function listarColecoes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao buscar colecoes.");
  }

  return (data ?? []) as ColecaoListItem[];
}

export function useListarColecoesQuery() {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: listarColecoes,
  });
}

async function buscarColecaoPorId(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar colecao.");
  }

  return (data ?? null) as ColecaoDetalhe | null;
}

export function useColecaoQuery(id: string) {
  return useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => buscarColecaoPorId(id),
    enabled: Boolean(id),
  });
}
