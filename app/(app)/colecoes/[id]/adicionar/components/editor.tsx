"use client";

import type { CSSProperties } from "react";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import type {JSONContent} from "@tiptap/core";
import styles from "./editor.module.css";

type EditorProps = {
  content?: JSONContent | string;
  onChange?: (content: JSONContent) => void;
  height?: number;
};

export default function Editor({ content, onChange, height = 230 }: EditorProps) {
  const style = {
    "--editor-height": `${height}px`,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={styles.container}
    >
      <SimpleEditor content={content} onChange={onChange} />
    </div>
  );
}
