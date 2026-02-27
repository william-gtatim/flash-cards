"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import type { ColecaoListItem } from "@/app/(app)/colecoes/colecaoQueries";
import { useFlashcardsDisponiveisAgoraQuery } from "@/app/(app)/colecoes/flashcardQueries";

type ItemColecaoProps = {
  colecao: ColecaoListItem;
};

export function ItemColecao({ colecao }: ItemColecaoProps) {
  const { data: flashcardsDisponiveisAgora, isLoading } =
    useFlashcardsDisponiveisAgoraQuery(colecao.id);

  const dueCount = flashcardsDisponiveisAgora?.length ?? 0;
  const description = isLoading
    ? "Cartoes para revisar hoje: ..."
    : dueCount > 0
      ? `Cartoes para revisar hoje: ${dueCount}`
      : "Tudo revisado por hoje.";

  return (
    <li className="border-b border-b-foreground/10 last:border-b-0">
      <Item asChild>
        <Link href={`/colecoes/${colecao.id}`} aria-label={`Abrir colecao ${colecao.name}`}>
          <ItemContent>
            <ItemTitle>{colecao.name}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-5" />
          </ItemActions>
        </Link>
      </Item>
    </li>
  );
}
