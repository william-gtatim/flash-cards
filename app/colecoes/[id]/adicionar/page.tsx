import { AdicionarCartaoForm } from "@/app/colecoes/[id]/adicionar/components/adicionar-cartao-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdicionarCartoesPage({ params }: PageProps) {
  const { id } = await params;

  return <AdicionarCartaoForm categoryId={id} />;
}
