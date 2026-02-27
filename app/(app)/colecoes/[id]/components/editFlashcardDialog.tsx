"use client";

import { useEffect, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { toast } from "sonner";

import Editor from "@/app/(app)/colecoes/[id]/adicionar/components/editor";
import { useAtualizarFlashcardMutation } from "@/app/(app)/colecoes/flashcardMutations";
import type { FlashcardListItem } from "@/app/(app)/colecoes/flashcardQueries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/responsiveDialog";

type RichPayload = {
  type?: string;
  doc?: unknown;
};

type EditFlashcardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: FlashcardListItem | null;
};

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function toEditorDoc(value: FlashcardListItem["front"]): JSONContent {
  if (!value || typeof value !== "object") {
    return EMPTY_DOC;
  }

  const payload = value as RichPayload;

  if (
    payload.type === "tiptap-json" &&
    payload.doc &&
    typeof payload.doc === "object"
  ) {
    return payload.doc as JSONContent;
  }

  return value as JSONContent;
}

export function EditFlashcardDialog({
  open,
  onOpenChange,
  flashcard,
}: EditFlashcardDialogProps) {
  const atualizarFlashcard = useAtualizarFlashcardMutation();
  const [front, setFront] = useState<JSONContent>(EMPTY_DOC);
  const [back, setBack] = useState<JSONContent>(EMPTY_DOC);
  const [editorResetKey, setEditorResetKey] = useState(0);

  useEffect(() => {
    if (!open || !flashcard) return;

    setFront(toEditorDoc(flashcard.front));
    setBack(toEditorDoc(flashcard.back));
    setEditorResetKey((prev) => prev + 1);
  }, [open, flashcard]);

  async function handleSave() {
    if (!flashcard) return;

    await atualizarFlashcard.mutateAsync({
      id: flashcard.id,
      categoryId: flashcard.category_id,
      front: front as Record<string, unknown>,
      back: back as Record<string, unknown>,
    });

    toast.success("Cartão atualizado.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto md:w-[min(96vw,1100px)] md:max-w-[990px]">
        <DialogHeader className="hidden md:block">
          <DialogTitle>Editar cartão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="min-w-0 space-y-2">
            <h3 className="text-sm font-medium text-foreground">Frente</h3>
            <Editor key={`front-${editorResetKey}`} content={front} onChange={setFront} height={140} />
          </div>

          <div className="min-w-0 space-y-2">
            <h3 className="text-sm font-medium text-foreground">Verso</h3>
            <Editor key={`back-${editorResetKey}`} content={back} onChange={setBack} height={230} />
          </div>
        </div>

        <DialogFooter className="gap-2 mt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={atualizarFlashcard.isPending}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={atualizarFlashcard.isPending}>
            {atualizarFlashcard.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

