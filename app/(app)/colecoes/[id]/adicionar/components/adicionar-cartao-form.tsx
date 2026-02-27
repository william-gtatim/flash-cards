"use client";

import {useState} from "react";
import type {JSONContent} from "@tiptap/core";
import {toast} from "sonner";

import Editor from "@/app/(app)/colecoes/[id]/adicionar/components/editor";
import { FlashcardTagsField } from "@/app/(app)/colecoes/[id]/components/flashcardTagsField";
import {useSalvarFlashcardMutation} from "@/app/(app)/colecoes/flashcardMutations";
import {Button} from "@/components/ui/button";

type AdicionarCartaoFormProps = {
  categoryId: string;
};

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function AdicionarCartaoForm({
  categoryId,
}: AdicionarCartaoFormProps) {
  const salvarFlashcard = useSalvarFlashcardMutation();
  const [front, setFront] = useState<JSONContent>(EMPTY_DOC);
  const [back, setBack] = useState<JSONContent>(EMPTY_DOC);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [editorResetKey, setEditorResetKey] = useState(0);

  async function handleSalvar() {
    const result = await salvarFlashcard.mutateAsync({
      categoryId,
      front: front as Record<string, unknown>,
      back: back as Record<string, unknown>,
      tagIds,
    });

    toast.success("Cartão salvo com sucesso.");

    setFront(EMPTY_DOC);
    setBack(EMPTY_DOC);
    setEditorResetKey((prev) => prev + 1);

    return result;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <FlashcardTagsField
            value={tagIds}
            onChange={setTagIds}
            disabled={salvarFlashcard.isPending}
        />
        <Button onClick={handleSalvar} disabled={salvarFlashcard.isPending}>
          {salvarFlashcard.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Frente</h2>

        </div>
        <Editor key={`front-${editorResetKey}`} onChange={setFront} height={140} />
      </div>

      <div className="text-sm text-muted-foreground">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Verso</h2>
        <Editor key={`back-${editorResetKey}`} onChange={setBack} height={230} />
      </div>


    </div>
  );
}

