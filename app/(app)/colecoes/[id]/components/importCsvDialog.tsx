"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useImportarFlashcardsCsvMutation } from "@/app/(app)/colecoes/flashcardMutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/responsiveDialog";
import { Input } from "@/components/ui/input";

type ImportCsvDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
};

function parseCsvTwoColumns(csvText: string) {
  const text = csvText.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }

      field += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }

      row.push(field);
      field = "";

      const isEmptyLine =
        row.length === 1 && row[0].trim() === "";

      if (!isEmptyLine) {
        rows.push(row);
      }

      row = [];
      i += 1;
      continue;
    }

    field += char;
    i += 1;
  }

  row.push(field);
  const isLastEmpty = row.length === 1 && row[0].trim() === "";
  if (!isLastEmpty) {
    rows.push(row);
  }

  for (const parsedRow of rows) {
    if (parsedRow.length !== 2) {
      throw new Error("Cada linha do CSV deve ter exatamente 2 colunas: frente,verso.");
    }
  }

  return rows.map((parsedRow) => ({
    front: parsedRow[0] ?? "",
    back: parsedRow[1] ?? "",
  }));
}

export function ImportCsvDialog({
  open,
  onOpenChange,
  categoryId,
}: ImportCsvDialogProps) {
  const importarCsv = useImportarFlashcardsCsvMutation();
  const [file, setFile] = useState<File | null>(null);

  const canImport = useMemo(
    () => Boolean(file) && !importarCsv.isPending,
    [file, importarCsv.isPending],
  );

  async function handleImport() {
    if (!file) return;

    const text = await file.text();
    const rows = parseCsvTwoColumns(text);

    const result = await importarCsv.mutateAsync({
      categoryId,
      rows,
    });

    toast.success(`${result.insertedCount} cartoes importados.`);
    setFile(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar CSV</DialogTitle>
          <DialogDescription>
            Arquivo sem cabecalho, com 2 colunas por linha: frente,verso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Exemplo: Pergunta,Resposta
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importarCsv.isPending}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleImport} disabled={!canImport}>
            {importarCsv.isPending ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
