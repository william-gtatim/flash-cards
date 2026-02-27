"use client";

import { useState } from "react";
import { EllipsisVertical, FilePenLine, FileUp } from "lucide-react";

import { EditColecaoDialog } from "@/app/(app)/colecoes/[id]/components/editColecaoDialog";
import { ImportCsvDialog } from "@/app/(app)/colecoes/[id]/components/importCsvDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ColecaoOptionsDropdownProps = {
  categoryId: string;
  categoryName: string;
  newCardsDailyLimit: number;
};

export function ColecaoOptionsDropdown({
  categoryId,
  categoryName,
  newCardsDailyLimit,
}: ColecaoOptionsDropdownProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Opcoes da colecao">
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <FilePenLine className="h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenImportDialog(true)}>
            <FileUp className="h-4 w-4" />
            Importar CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditColecaoDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        categoryId={categoryId}
        currentName={categoryName}
        currentNewCardsDailyLimit={newCardsDailyLimit}
      />

      <ImportCsvDialog
        open={openImportDialog}
        onOpenChange={setOpenImportDialog}
        categoryId={categoryId}
      />
    </>
  );
}
