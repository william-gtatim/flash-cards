"use client";

import { useState } from "react";
import { EllipsisVertical, FilePenLine, FileUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useExcluirColecaoMutation } from "@/app/(app)/colecoes/colecaoMutations";
import { EditColecaoDialog } from "@/app/(app)/colecoes/[id]/components/editColecaoDialog";
import { ImportCsvDialog } from "@/app/(app)/colecoes/[id]/components/importCsvDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/responsiveDialog";

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
  const router = useRouter();
  const excluirColecao = useExcluirColecaoMutation();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  async function handleDeleteCollection() {
    await excluirColecao.mutateAsync({ id: categoryId });
    toast.success("Coleção excluída.");
    setOpenDeleteDialog(false);
    router.push("/");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Opções da coleção">
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
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            Excluir coleção
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

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir coleção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a coleção "{categoryName}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              disabled={excluirColecao.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteCollection}
              disabled={excluirColecao.isPending}
            >
              {excluirColecao.isPending ? "Excluindo..." : "Excluir coleção"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

