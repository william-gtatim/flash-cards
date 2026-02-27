"use client";

import Link from "next/link";

import { ColecaoOptionsDropdown } from "@/app/(app)/colecoes/[id]/components/colecaoOptionsDropdown";
import { FlashcardDeckSummary } from "@/app/(app)/colecoes/[id]/components/flashcardDeckSummary";
import { FlashcardList } from "@/app/(app)/colecoes/[id]/components/flashcardList";
import { useColecaoQuery } from "@/app/(app)/colecoes/colecaoQueries";
import {
  useFlashcardsDaColecaoQuery,
  useFlashcardsParaEstudoHojeQuery,
} from "@/app/(app)/colecoes/flashcardQueries";
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
  const {
    data: flashcardsParaEstudoHoje,
    isLoading: isStudyTodayLoading,
  } = useFlashcardsParaEstudoHojeQuery(id);

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
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{colecao.name}</h1>
            <ColecaoOptionsDropdown
              categoryId={id}
              categoryName={colecao.name}
              newCardsDailyLimit={colecao.new_cards_daily_limit ?? 0}
            />
          </div>
          {!isFlashcardsError ? (
            <>
              <FlashcardDeckSummary
                total={flashcardsParaEstudoHoje?.cards.length ?? 0}
                cardIds={(flashcardsParaEstudoHoje?.cards ?? []).map((card) => card.id)}
                collectionTitle={colecao.name}
                dueCount={flashcardsParaEstudoHoje?.dueCount ?? 0}
                newCountSelected={flashcardsParaEstudoHoje?.newCountSelected ?? 0}
                newDailyLimit={flashcardsParaEstudoHoje?.newDailyLimit ?? 0}
                isLoading={isStudyTodayLoading}
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
