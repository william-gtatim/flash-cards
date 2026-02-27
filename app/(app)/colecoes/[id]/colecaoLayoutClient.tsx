"use client";

import Link from "next/link";
import type {ReactNode} from "react";
import {usePathname} from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Spinner} from "@/components/ui/spinner";
import {useColecaoQuery} from "@/app/(app)/colecoes/colecaoQueries";

type ColecaoLayoutClientProps = {
  id: string;
  children: ReactNode;
};

export function ColecaoLayoutClient({
  id,
  children,
}: ColecaoLayoutClientProps) {
  const pathname = usePathname();
  const { data: colecao, isLoading, isError, error } = useColecaoQuery(id);
  const isAdicionarPage = pathname?.endsWith("/adicionar");

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Carregando coleção...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar coleção."}
        </p>
      </div>
    );
  }

  if (!colecao) {
    return (
      <div className="py-6">
        <p className="text-sm text-muted-foreground">Coleção não encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isAdicionarPage ? (
              <BreadcrumbLink asChild>
                <Link href={`/app/(app)/colecoes/${id}`}>{colecao.name}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{colecao.name}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {isAdicionarPage ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Adicionar cartões</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : null}
        </BreadcrumbList>
      </Breadcrumb>

      {children}
    </div>
  );
}
