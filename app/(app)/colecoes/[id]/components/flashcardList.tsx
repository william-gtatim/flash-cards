"use client";

import {useState} from "react";
import {toast} from "sonner";

import {useExcluirFlashcardMutation} from "@/app/(app)/colecoes/flashcardMutations";
import type {FlashcardListItem} from "@/app/(app)/colecoes/flashcardQueries";
import {FlashcardItem} from "@/app/(app)/colecoes/[id]/components/flashcardItem";

type FlashcardListProps = {
  flashcards?: FlashcardListItem[];
  isLoading?: boolean;
};

export function FlashcardList({
  flashcards = [],
  isLoading = false,
}: FlashcardListProps) {
  const excluirFlashcard = useExcluirFlashcardMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(flashcard: FlashcardListItem) {
    setDeletingId(flashcard.id);

    try {
      await excluirFlashcard.mutateAsync({
        id: flashcard.id,
        categoryId: flashcard.category_id,
      });
      toast.success("Cartão excluído.");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Carregando cartões...
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Esta coleção ainda não possui cartões.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onDelete={handleDelete}
          deleting={deletingId === flashcard.id}
        />
      ))}
    </div>
  );
}
