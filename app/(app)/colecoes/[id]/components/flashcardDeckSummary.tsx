"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FlashcardDeckSummaryProps = {
  total: number;
  collectionId: string;
  isLoading?: boolean;
};

export function FlashcardDeckSummary({
  total,
  collectionId,
  isLoading = false,
}: FlashcardDeckSummaryProps) {
  const router = useRouter();

  return (
    <Card className="rounded-3xl bg-background border-0">
      <CardContent className="space-y-8 p-6 sm:space-y-10 sm:p-8">
        <div className="space-y-2 text-center">
          <p className="text-6xl font-bold leading-none tracking-tight text-foreground sm:text-7xl">
            {isLoading ? "..." : total}
          </p>
          <p className="text-base text-muted-foreground">cartoes na colecao</p>
        </div>

        <Button
          size="lg"
          className="h-16 w-full rounded-2xl text-2xl font-bold"
          onClick={() => router.push(`/colecoes/${collectionId}/estudar`)}
          disabled={isLoading || total === 0}
        >
          Estudar
        </Button>
      </CardContent>
    </Card>
  );
}
