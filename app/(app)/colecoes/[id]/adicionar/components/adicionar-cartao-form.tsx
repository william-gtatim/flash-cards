"use client";

import {useState} from "react";
import type {JSONContent} from "@tiptap/core";
import {toast} from "sonner";

import Editor from "@/app/(app)/colecoes/[id]/adicionar/components/editor";
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
  const [editorResetKey, setEditorResetKey] = useState(0);

  async function handleSalvar() {
    const result = await salvarFlashcard.mutateAsync({
      categoryId,
      front: front as Record<string, unknown>,
      back: back as Record<string, unknown>,
    });

    toast.success("Cartão salvo com sucesso.");

    setFront(EMPTY_DOC);
    setBack(EMPTY_DOC);
    setEditorResetKey((prev) => prev + 1);

    return result;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Frente</h2>
          <Button onClick={handleSalvar} disabled={salvarFlashcard.isPending}>
            {salvarFlashcard.isPending ? "Salvando..." : "Salvar"}
          </Button>
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

