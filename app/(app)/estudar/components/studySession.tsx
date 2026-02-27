"use client";

import { useMemo, useState } from "react";

import { useFlashcardsByIdsQuery } from "@/app/(app)/colecoes/flashcardQueries";
import { StudyCard } from "@/app/(app)/estudar/components/studyCard";
import { StudyProgress } from "@/app/(app)/estudar/components/studyProgress";
import { useRegistrarRevisaoMutation } from "@/app/(app)/estudar/studyMutations";
import { useFlashcardProgressQuery } from "@/app/(app)/estudar/studyQueries";
import { computeSm2Progress, formatIntervalLabel } from "@/app/(app)/estudar/sm2";

type StudySessionProps = {
  cardIds: string[];
  collectionTitle: string;
};

const PREVIEW_BASE_DATE = new Date("2024-01-01T00:00:00.000Z");

export function StudySession({ cardIds, collectionTitle }: StudySessionProps) {
  const sanitizedIds = useMemo(
    () => cardIds.map((id) => id.trim()).filter(Boolean),
    [cardIds],
  );
  const { data: cards, isLoading } = useFlashcardsByIdsQuery(sanitizedIds);
  const registrarRevisao = useRegistrarRevisaoMutation();
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const total = cards?.length ?? 0;
  const currentCard = total > 0 ? cards?.[index] ?? null : null;
  const { data: currentProgress } = useFlashcardProgressQuery(currentCard?.id);
  const progressCurrent = isFinished ? total : index;
  const answerIntervals = useMemo(() => {
    const grade1 = computeSm2Progress(currentProgress ?? null, 1, PREVIEW_BASE_DATE);
    const grade2 = computeSm2Progress(currentProgress ?? null, 2, PREVIEW_BASE_DATE);
    const grade3 = computeSm2Progress(currentProgress ?? null, 3, PREVIEW_BASE_DATE);
    const grade4 = computeSm2Progress(currentProgress ?? null, 4, PREVIEW_BASE_DATE);

    return {
      1: formatIntervalLabel(grade1.nextDueAt, PREVIEW_BASE_DATE),
      2: formatIntervalLabel(grade2.nextDueAt, PREVIEW_BASE_DATE),
      3: formatIntervalLabel(grade3.nextDueAt, PREVIEW_BASE_DATE),
      4: formatIntervalLabel(grade4.nextDueAt, PREVIEW_BASE_DATE),
    } as Record<1 | 2 | 3 | 4, string>;
  }, [currentProgress]);

  function moveToNextCard() {
    if (index < total - 1) {
      setIndex((prev) => prev + 1);
      setShowBack(false);
      return;
    }

    setIsFinished(true);
  }

  async function handleAnswer(grade: 1 | 2 | 3 | 4) {
    if (!currentCard) return;

    await registrarRevisao.mutateAsync({
      cardId: currentCard.id,
      grade,
    });

    moveToNextCard();
  }

  if (!sanitizedIds.length) {
    return (
      <div className="space-y-4">
        <StudyProgress title={collectionTitle} current={0} total={0} />
        <p className="text-sm text-muted-foreground">
          Nenhum cartão informado para estudar.
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
          Nenhum cartão encontrado com os IDs informados.
        </p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="space-y-4">
        <StudyProgress title={collectionTitle} current={progressCurrent} total={total} />
        <p className="text-sm text-muted-foreground">Sessão concluída.</p>
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
        onAnswer={handleAnswer}
        answerIntervals={answerIntervals}
        controlsDisabled={registrarRevisao.isPending}
      />
    </div>
  );
}


