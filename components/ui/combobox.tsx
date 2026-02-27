"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  onCreateOption?: (name: string) => Promise<ComboboxOption | null>;
  disabled?: boolean;
  className?: string;
};

export function Combobox({
  options,
  selectedValues,
  onSelectedValuesChange,
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado.",
  onCreateOption,
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, normalizedQuery]);

  const selectedLabels = useMemo(() => {
    const byId = new Map(options.map((option) => [option.value, option.label]));
    return selectedValues
      .map((value) => byId.get(value))
      .filter((label): label is string => Boolean(label));
  }, [options, selectedValues]);

  const canCreate =
    Boolean(onCreateOption) &&
    Boolean(normalizedQuery) &&
    !options.some((option) => option.label.toLowerCase() === normalizedQuery);

  function toggleValue(value: string) {
    if (selectedSet.has(value)) {
      onSelectedValuesChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onSelectedValuesChange([...selectedValues, value]);
  }

  async function handleCreate() {
    if (!onCreateOption || !canCreate || isCreating) return;

    setIsCreating(true);

    try {
      const created = await onCreateOption(query.trim());

      if (!created) return;

      const next = selectedSet.has(created.value)
        ? selectedValues
        : [...selectedValues, created.value];

      onSelectedValuesChange(next);
      setQuery("");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 overflow-hidden text-left">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label) => (
                <span
                  key={label}
                  className="max-w-[140px] truncate rounded-md bg-muted px-2 py-0.5 text-xs text-foreground"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] p-0">
        <div className="border-b p-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter" && canCreate) {
                event.preventDefault();
                void handleCreate();
              }
            }}
          />
        </div>

        <div className="max-h-56 overflow-y-auto p-1">
          {canCreate ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleCreate();
              }}
              disabled={isCreating}
            >
              <Plus className="h-4 w-4" />
              {isCreating ? "Criando..." : `Criar "${query.trim()}"`}
            </DropdownMenuItem>
          ) : null}

          {filteredOptions.length === 0 ? (
            <div className="px-2 py-2 text-sm text-muted-foreground">{emptyText}</div>
          ) : null}

          {filteredOptions.map((option) => {
            const checked = selectedSet.has(option.value);

            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={(event) => {
                  event.preventDefault();
                  toggleValue(option.value);
                }}
              >
                <Check className={cn("h-4 w-4", checked ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{option.label}</span>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
