"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudyCardControls } from "@/app/(app)/estudar/components/studyCardControls";

type RichPayload = {
  type?: string;
  doc?: unknown;
};

type StudyCardProps = {
  front: Record<string, unknown>;
  back: Record<string, unknown>;
  showBack: boolean;
  onToggleBack: () => void;
  onAnswer: (grade: 1 | 2 | 3 | 4) => void;
  answerIntervals: Record<1 | 2 | 3 | 4, string>;
  controlsDisabled?: boolean;
};

function extractTextFromNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const current = node as Record<string, unknown>;
  const parts: string[] = [];

  if (typeof current.text === "string") {
    parts.push(current.text);
  }

  if (Array.isArray(current.content)) {
    for (const child of current.content) {
      const childText = extractTextFromNode(child);
      if (childText) parts.push(childText);
    }
  }

  return parts.join(" ").trim();
}

function toPlainText(value: Record<string, unknown>) {
  const payload = value as RichPayload;

  if (payload.type === "tiptap-json" && payload.doc) {
    return extractTextFromNode(payload.doc).replace(/\s+/g, " ").trim();
  }

  return extractTextFromNode(value).replace(/\s+/g, " ").trim();
}

export function StudyCard({
  front,
  back,
  showBack,
  onToggleBack,
  onAnswer,
  answerIntervals,
  controlsDisabled = false,
}: StudyCardProps) {
  const frontText = toPlainText(front) || "Sem conteudo na frente.";
  const backText = toPlainText(back) || "Sem conteudo no verso.";

  return (
    <div className="space-y-6">
      <Card className="min-h-[420px] rounded-3xl border-0 bg-card">
        <CardContent className="flex min-h-[420px] items-start justify-center p-8 text-center sm:p-12">
          {!showBack ? (
            <p className="max-w-4xl text-2xl leading-tight text-foreground">
              {frontText}
            </p>
          ) : (
            <div className="space-y-8">
              <p className="max-w-4xl text-2xl leading-tight text-foreground">
                {frontText}
              </p>
              <div className="mx-auto h-px w-24 bg-border" />
              <p className="max-w-4xl text-lg leading-relaxed text-muted-foreground">
                {backText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-6 z-40 px-4">
        <div className="mx-auto flex max-w-3xl justify-center">
          {!showBack ? (
            <Button
              type="button"
              variant="dark"
              size="xl"
              onClick={onToggleBack}
            >
              Mostrar resposta
            </Button>
          ) : (
            <StudyCardControls
              onAnswer={onAnswer}
              intervals={answerIntervals}
              disabled={controlsDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
