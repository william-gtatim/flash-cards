"use client";

import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import type {JSONContent} from "@tiptap/core";

type EditorProps = {
  content?: JSONContent | string;
  onChange?: (content: JSONContent) => void;
};

export default function Editor({ content, onChange }: EditorProps) {
  return (
    <div className="w-full [&_.simple-editor-wrapper]:h-[230px] [&_.simple-editor-wrapper]:min-h-0 [&_.simple-editor-wrapper]:overflow-y-auto [&_.simple-editor-wrapper]:overflow-x-hidden [&_.simple-editor-content]:min-h-0">
      <SimpleEditor content={content} onChange={onChange} />
    </div>
  );
}
