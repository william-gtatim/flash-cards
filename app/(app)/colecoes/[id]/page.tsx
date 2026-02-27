import {ColecaoPageClient} from "@/app/(app)/colecoes/[id]/colecaoPageClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ColecaoPage({ params }: PageProps) {
  const { id } = await params;

  return <ColecaoPageClient id={id} />;
}
