"use client";

import { ItemColecao } from "@/app/colecoes/itemColecao";
import { useListarColecoesQuery } from "@/app/colecoes/colecaoQueries";

export default function ListaColecoes() {
  const { data, isLoading, isError, error } = useListarColecoesQuery();

  if (isLoading) {
    return (
      <ul className="flex w-full flex-col gap-4 rounded-lg bg-background">
        <li className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          Carregando colecoes...
        </li>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul className="flex w-full flex-col gap-4 rounded-lg bg-background">
        <li className="rounded-md border border-destructive/30 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar colecoes."}
        </li>
      </ul>
    );
  }

  if (!data?.length) {
    return (
      <ul className="flex w-full flex-col gap-4 rounded-lg bg-background">
        <li className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          Nenhuma colecao criada ainda.
        </li>
      </ul>
    );
  }

  return (
    <ul className="flex w-full flex-col rounded-lg bg-background">
      {data.map((colecao) => (
        <ItemColecao key={colecao.id} colecao={colecao} />
      ))}
    </ul>
  );
}
