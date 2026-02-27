"use client";

import Link from "next/link";

import { FlashcardDeckSummary } from "@/app/(app)/colecoes/[id]/components/flashcardDeckSummary";
import { FlashcardList } from "@/app/(app)/colecoes/[id]/components/flashcardList";
import { useColecaoQuery } from "@/app/(app)/colecoes/colecaoQueries";
import { useFlashcardsDaColecaoQuery } from "@/app/(app)/colecoes/flashcardQueries";
import { Button } from "@/components/ui/button";

type ColecaoPageClientProps = {
  id: string;
};

export function ColecaoPageClient({ id }: ColecaoPageClientProps) {
  const { data: colecao, isLoading, isError } = useColecaoQuery(id);
  const {
    data: flashcards,
    isLoading: isFlashcardsLoading,
    isError: isFlashcardsError,
  } = useFlashcardsDaColecaoQuery(id);

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!isError && !colecao ? (
        <p className="text-sm text-muted-foreground">Colecao nao encontrada.</p>
      ) : null}

      {!isError && colecao ? (
        <div className="space-y-4 pb-24">
          <h1 className="text-2xl font-semibold tracking-tight">{colecao.name}</h1>
          {!isFlashcardsError ? (
            <>
              <FlashcardDeckSummary
                total={flashcards?.length ?? 0}
                collectionId={id}
                isLoading={isFlashcardsLoading}
              />
              <FlashcardList
                flashcards={flashcards}
                isLoading={isFlashcardsLoading}
              />
            </>
          ) : null}
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-6 z-40 px-4">
        <div className="mx-auto flex max-w-3xl justify-center">
          <Button asChild variant="dark" size="xl">
            <Link href={`/colecoes/${id}/adicionar`}>Adicionar cartoes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
