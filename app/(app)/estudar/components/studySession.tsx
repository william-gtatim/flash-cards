"use client";

import { useMemo, useState } from "react";

import { useFlashcardsByIdsQuery } from "@/app/(app)/colecoes/flashcardQueries";
import { StudyCard } from "@/app/(app)/estudar/components/studyCard";
import { StudyProgress } from "@/app/(app)/estudar/components/studyProgress";

type StudySessionProps = {
  cardIds: string[];
  collectionTitle: string;
};

export function StudySession({ cardIds, collectionTitle }: StudySessionProps) {
  const sanitizedIds = useMemo(
    () => cardIds.map((id) => id.trim()).filter(Boolean),
    [cardIds],
  );
  const { data: cards, isLoading } = useFlashcardsByIdsQuery(sanitizedIds);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const total = cards?.length ?? 0;
  const currentCard = total > 0 ? cards?.[index] ?? null : null;
  const progressCurrent = index + (showBack ? 1 : 0);

  function handleNext() {
    if (index < total - 1) {
      setIndex((prev) => prev + 1);
      setShowBack(false);
    }
  }

  if (!sanitizedIds.length) {
    return (
      <div className="space-y-4">
        <StudyProgress title={collectionTitle} current={0} total={0} />
        <p className="text-sm text-muted-foreground">
          Nenhum card informado para estudar.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StudyProgress
          title={collectionTitle}
          current={0}
          total={sanitizedIds.length}
        />
        <div className="h-[560px] animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="space-y-4">
        <StudyProgress title={collectionTitle} current={0} total={0} />
        <p className="text-sm text-muted-foreground">
          Nenhum card encontrado com os IDs informados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudyProgress title={collectionTitle} current={progressCurrent} total={total} />
      <StudyCard
        front={(currentCard.front ?? {}) as Record<string, unknown>}
        back={(currentCard.back ?? {}) as Record<string, unknown>}
        showBack={showBack}
        onToggleBack={() => setShowBack(true)}
        onNext={handleNext}
      />
    </div>
  );
}
