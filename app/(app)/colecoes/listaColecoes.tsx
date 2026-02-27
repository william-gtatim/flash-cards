"use client";

import {ItemColecao} from "@/app/(app)/colecoes/itemColecao";
import CriarColecao from "@/app/(app)/colecoes/criarColecao";
import {useListarColecoesQuery} from "@/app/(app)/colecoes/colecaoQueries";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {FolderOpen} from "lucide-react";

export default function ListaColecoes() {
  const { data, isLoading, isError, error } = useListarColecoesQuery();

  if (isLoading) {
    return (
      <ul className="flex w-full flex-col gap-4 rounded-lg bg-background">
        <li className="rounded-md border border-border p-4 text-sm text-muted-foreground">
          Carregando coleções...
        </li>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul className="flex w-full flex-col gap-4 rounded-lg bg-background">
        <li className="rounded-md border border-destructive/30 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar coleções."}
        </li>
      </ul>
    );
  }

  if (!data?.length) {
    return (
      <Empty className="w-full bg-background">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>Nenhuma coleção criada</EmptyTitle>
          <EmptyDescription>
            Crie sua primeira coleção para começar a adicionar cartões e estudar.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <CriarColecao />
        </EmptyContent>
      </Empty>
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

