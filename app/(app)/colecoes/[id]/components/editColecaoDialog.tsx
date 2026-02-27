"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAtualizarColecaoMutation } from "@/app/(app)/colecoes/colecaoMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/responsiveDialog";

type EditColecaoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  currentName: string;
  currentNewCardsDailyLimit: number;
};

export function EditColecaoDialog({
  open,
  onOpenChange,
  categoryId,
  currentName,
  currentNewCardsDailyLimit,
}: EditColecaoDialogProps) {
  const atualizarColecao = useAtualizarColecaoMutation();
  const [name, setName] = useState(currentName);
  const [newCardsDailyLimit, setNewCardsDailyLimit] = useState(
    String(currentNewCardsDailyLimit),
  );

  useEffect(() => {
    if (open) {
      setName(currentName);
      setNewCardsDailyLimit(String(currentNewCardsDailyLimit));
    }
  }, [open, currentName, currentNewCardsDailyLimit]);

  const parsedDailyLimit = Number.parseInt(newCardsDailyLimit, 10);
  const isDailyLimitValid = Number.isFinite(parsedDailyLimit) && parsedDailyLimit >= 0;

  const canSave = name.trim().length > 0 && isDailyLimitValid && !atualizarColecao.isPending;

  async function handleSave() {
    if (!canSave) return;

    await atualizarColecao.mutateAsync({
      id: categoryId,
      name,
      newCardsDailyLimit: parsedDailyLimit,
    });

    toast.success("Colecao atualizada.");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar colecao</DialogTitle>
          <DialogDescription>
            Altere o nome da colecao e o limite diario de novos cards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome da colecao"
            inputSize="lg"
          />
          <Input
            value={newCardsDailyLimit}
            onChange={(event) => setNewCardsDailyLimit(event.target.value)}
            placeholder="Limite diario de novos cards"
            inputMode="numeric"
            type="number"
            min={0}
            step={1}
            inputSize="lg"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={atualizarColecao.isPending}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={!canSave}>
            {atualizarColecao.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
