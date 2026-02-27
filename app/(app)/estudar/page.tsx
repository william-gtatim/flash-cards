import { StudySession } from "@/app/(app)/estudar/components/studySession";

type SearchParams = {
  ids?: string | string[];
  title?: string;
};

type EstudarPageProps = {
  searchParams: Promise<SearchParams>;
};

function parseIds(idsParam?: string | string[]) {
  if (!idsParam) return [];

  if (Array.isArray(idsParam)) {
    return idsParam.map((value) => value.trim()).filter(Boolean);
  }

  return idsParam
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export default async function EstudarPage({ searchParams }: EstudarPageProps) {
  const resolvedParams = await searchParams;
  const cardIds = parseIds(resolvedParams.ids);
  const title = resolvedParams.title?.trim() || "Estudo";

  return (
    <div className="space-y-6">
      <StudySession cardIds={cardIds} collectionTitle={title} />
    </div>
  );
}
