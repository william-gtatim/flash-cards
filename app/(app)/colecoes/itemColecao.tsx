import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle,} from "@/components/ui/item";
import {ChevronRightIcon} from "lucide-react";
import Link from "next/link";

import type {ColecaoListItem} from "@/app/(app)/colecoes/colecaoQueries";

type ItemColecaoProps = {
  colecao: ColecaoListItem;
};

export function ItemColecao({ colecao }: ItemColecaoProps) {
  return (
    <li className="border-b border-b-foreground/10 last:border-b-0">
      <Item asChild>
        <Link href={`/colecoes/${colecao.id}`} aria-label={`Abrir coleção ${colecao.name}`}>
          <ItemContent>
            <ItemTitle>{colecao.name}</ItemTitle>
            <ItemDescription>Cartões para revisar hoje: --</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </Link>
      </Item>
    </li>
  );
}
