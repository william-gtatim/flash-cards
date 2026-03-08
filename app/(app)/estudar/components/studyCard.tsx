"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudyCardControls } from "@/app/(app)/estudar/components/studyCardControls";

type RichPayload = {
  type?: string;
  doc?: unknown;
};

type RichDoc = Record<string, unknown>;

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

function toRichDoc(value: Record<string, unknown>): RichDoc | null {
  const payload = value as RichPayload;

  if (payload.type === "tiptap-json" && payload.doc && typeof payload.doc === "object") {
    return payload.doc as RichDoc;
  }

  if (value.type === "doc") {
    return value;
  }

  return null;
}

function RichBackContent({
  content,
  fallbackText,
}: {
  content: Record<string, unknown>;
  fallbackText: string;
}) {
  const richDoc = toRichDoc(content);
  const plainText = toPlainText(content);

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none [&_*]:text-left [&_a]:text-primary [&_a]:underline [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:ml-6 [&_ul]:list-disc",
      },
    },
    extensions: [
      StarterKit,
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
    ],
    content: richDoc,
  });

  if (!plainText && !richDoc) {
    return (
      <p className="max-w-4xl text-lg leading-relaxed text-muted-foreground">
        {fallbackText}
      </p>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl text-base leading-relaxed text-muted-foreground">
      <EditorContent editor={editor} />
    </div>
  );
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

  return (
    <div className="space-y-6">
      <Card className="min-h-[420px] rounded-3xl border-0 bg-card mb-[100px]">
        <CardContent className="flex min-h-[420px] items-start justify-center p-8 text-center sm:p-12">
          {!showBack ? (
            <p className="max-w-4xl text-xl leading-tight text-foreground">
              {frontText}
            </p>
          ) : (
            <div className="space-y-8">
              <p className="max-w-4xl text-xl leading-tight text-foreground">
                {frontText}
              </p>
              <div className="mx-auto h-px w-24 bg-border" />
              <RichBackContent content={back} fallbackText="Sem conteudo no verso." />
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
