"use client";

import { useMemo } from "react";

import { useCriarTagMutation } from "@/app/(app)/colecoes/tagsMutations";
import { useUserTagsQuery } from "@/app/(app)/colecoes/tagsQueries";
import { Combobox } from "@/components/ui/combobox";

type FlashcardTagsFieldProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export function FlashcardTagsField({
  value,
  onChange,
  disabled = false,
}: FlashcardTagsFieldProps) {
  const { data: tags = [] } = useUserTagsQuery();
  const criarTag = useCriarTagMutation();

  const options = useMemo(
    () =>
      tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      })),
    [tags],
  );

  return (
    <div className="space-y-2 w-full">
      <Combobox
        options={options}
        selectedValues={value}
        onSelectedValuesChange={onChange}
        placeholder="Selecionar tags"
        searchPlaceholder="Buscar ou criar tag..."
        emptyText="Nenhuma tag encontrada."
        onCreateOption={async (name) => {
          const created = await criarTag.mutateAsync({ name });
          return {
            value: created.id,
            label: created.name,
          };
        }}
        disabled={disabled || criarTag.isPending}
      />
    </div>
  );
}
