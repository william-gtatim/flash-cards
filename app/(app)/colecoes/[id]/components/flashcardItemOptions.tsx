"use client";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import type { FlashcardListItem } from "@/app/(app)/colecoes/flashcardQueries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FlashcardItemOptionsProps = {
  flashcard: FlashcardListItem;
  onEdit?: (flashcard: FlashcardListItem) => void;
  onDelete?: (flashcard: FlashcardListItem) => void;
  disabled?: boolean;
};

export function FlashcardItemOptions({
  flashcard,
  onEdit,
  onDelete,
  disabled = false,
}: FlashcardItemOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-[-4px] h-8 w-8 shrink-0 rounded-full"
          disabled={disabled}
          aria-label="Opções do cartão"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(flashcard)} disabled={disabled}>
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete?.(flashcard)}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

