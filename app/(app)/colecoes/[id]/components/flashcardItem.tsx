"use client";

import type {FlashcardListItem} from "@/app/(app)/colecoes/flashcardQueries";
import {EllipsisVertical, Trash2} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";

type FlashcardItemProps = {
  flashcard: FlashcardListItem;
  onDelete?: (flashcard: FlashcardListItem) => void;
  deleting?: boolean;
};

type RichPayload = {
  type?: string;
  doc?: unknown;
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

function getPreview(value: FlashcardListItem["front"]) {
  const payload = (value ?? {}) as RichPayload;

  if (payload.type === "tiptap-json" && payload.doc) {
    const text = extractTextFromNode(payload.doc).replace(/\s+/g, " ").trim();
    return text || "Sem texto";
  }

  const fallback = extractTextFromNode(value).replace(/\s+/g, " ").trim();
  return fallback || "Sem texto";
}

export function FlashcardItem({
  flashcard,
  onDelete,
  deleting = false,
}: FlashcardItemProps) {
  const frontPreview = getPreview(flashcard.front);
  const backPreview = getPreview(flashcard.back);

  return (
    <Card className="rounded-2xl border-border/80">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
              {frontPreview}
            </p>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {backPreview}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-[-4px] h-8 w-8 shrink-0 rounded-full"
                disabled={deleting}
                aria-label="Opções do cartão"
              >
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete?.(flashcard)}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
