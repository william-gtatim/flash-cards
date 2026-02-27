import type {ReactNode} from "react";

import {ColecaoLayoutClient} from "@/app/(app)/colecoes/[id]/colecaoLayoutClient";

interface Props {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ColecaoLayout({ children, params }: Props) {
  const { id } = await params;

  return <ColecaoLayoutClient id={id}>{children}</ColecaoLayoutClient>;
}
