"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/responsiveDialog";
import { Input } from "@/components/ui/input";
import { useSalvarColecaoMutation } from "@/app/colecoes/colecaoMutations";

export default function CriarColecao() {
  const router = useRouter();
  const salvarColecaoMutation = useSalvarColecaoMutation();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await salvarColecaoMutation.mutateAsync({ name });
      setName("");
      setOpen(false);
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar colecao.",
      );
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg">Criar</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar colecao</DialogTitle>
            <DialogDescription>
              Voce alcanca os melhores resultados com os cartoes que cria por conta propria.
            </DialogDescription>
          </DialogHeader>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <Input
              inputSize="lg"
              id="nome-colecao"
              name="nome"
              placeholder="Nome da colecao"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={salvarColecaoMutation.isPending}
              required
            />

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={salvarColecaoMutation.isPending}
              >
                {salvarColecaoMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
