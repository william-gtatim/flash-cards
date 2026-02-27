"use client";

import {useQuery} from "@tanstack/react-query";

import {createClient} from "@/lib/supabase/client";

export type FlashcardRichContent = {
  type: "tiptap-json";
  version: number;
  doc: Record<string, unknown>;
};

export type FlashcardListItem = {
  id: string;
  category_id: string | null;
  front: FlashcardRichContent | Record<string, unknown>;
  back: FlashcardRichContent | Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
};

type FlashcardProgressRow = {
  card_id: string;
  next_due_at: string | null;
  updated_at: string;
};

async function listarFlashcardsDaColecao(categoryId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcards")
    .select("id, category_id, front, back, is_archived, created_at, updated_at")
    .eq("category_id", categoryId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao buscar cartões.");
  }

  return (data ?? []) as FlashcardListItem[];
}

export function useFlashcardsDaColecaoQuery(categoryId: string) {
  return useQuery({
    queryKey: ["flashcards", "list", categoryId],
    queryFn: () => listarFlashcardsDaColecao(categoryId),
    enabled: Boolean(categoryId),
  });
}

async function buscarFlashcardsPorIds(ids: string[]) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("flashcards")
    .select("id, category_id, front, back, is_archived, created_at, updated_at")
    .in("id", ids)
    .eq("is_archived", false);

  if (error) {
    throw new Error(error.message || "Erro ao buscar cards para estudo.");
  }

  const byId = new Map((data ?? []).map((item) => [item.id, item]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter((item): item is FlashcardListItem => Boolean(item));

  return ordered;
}

export function useFlashcardsByIdsQuery(ids: string[]) {
  return useQuery({
    queryKey: ["flashcards", "by-ids", ids],
    queryFn: () => buscarFlashcardsPorIds(ids),
    enabled: ids.length > 0,
  });
}

async function listarFlashcardsDisponiveisAgora(categoryId: string) {
  const cards = await listarFlashcardsDaColecao(categoryId);

  if (!cards.length) {
    return [];
  }

  const supabase = createClient();
  const cardIds = cards.map((card) => card.id);

  const { data: progressRows, error: progressError } = await supabase
    .from("flashcard_card_progress")
    .select("card_id, next_due_at, updated_at")
    .in("card_id", cardIds)
    .order("updated_at", { ascending: false });

  if (progressError) {
    throw new Error(progressError.message || "Erro ao buscar progresso dos cards.");
  }

  const latestProgressByCard = new Map<string, FlashcardProgressRow>();

  for (const row of (progressRows ?? []) as FlashcardProgressRow[]) {
    if (!latestProgressByCard.has(row.card_id)) {
      latestProgressByCard.set(row.card_id, row);
    }
  }

  const now = Date.now();

  return cards.filter((card) => {
    const progress = latestProgressByCard.get(card.id);

    // Sem progresso: disponível para estudo.
    if (!progress || !progress.next_due_at) {
      return true;
    }

    return new Date(progress.next_due_at).getTime() <= now;
  });
}

export function useFlashcardsDisponiveisAgoraQuery(categoryId: string) {
  return useQuery({
    queryKey: ["flashcards", "due-now", categoryId],
    queryFn: () => listarFlashcardsDisponiveisAgora(categoryId),
    enabled: Boolean(categoryId),
  });
}

export type FlashcardsParaEstudoHojeResult = {
  cards: FlashcardListItem[];
  dueCount: number;
  newCountSelected: number;
  newDailyLimit: number;
};

async function listarFlashcardsParaEstudoHoje(categoryId: string) {
  const cards = await listarFlashcardsDaColecao(categoryId);

  if (!cards.length) {
    return {
      cards: [],
      dueCount: 0,
      newCountSelected: 0,
      newDailyLimit: 20,
    } as FlashcardsParaEstudoHojeResult;
  }

  const supabase = createClient();
  const cardIds = cards.map((card) => card.id);

  const { data: categoryRow, error: categoryError } = await supabase
    .from("categories")
    .select("new_cards_daily_limit")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError) {
    throw new Error(categoryError.message || "Erro ao buscar limite de novos da colecao.");
  }

  const newDailyLimit = Math.max(0, categoryRow?.new_cards_daily_limit ?? 20);

  const { data: progressRows, error: progressError } = await supabase
    .from("flashcard_card_progress")
    .select("card_id, next_due_at, updated_at")
    .in("card_id", cardIds)
    .order("updated_at", { ascending: false });

  if (progressError) {
    throw new Error(progressError.message || "Erro ao buscar progresso dos cards.");
  }

  const latestProgressByCard = new Map<string, FlashcardProgressRow>();
  for (const row of (progressRows ?? []) as FlashcardProgressRow[]) {
    if (!latestProgressByCard.has(row.card_id)) {
      latestProgressByCard.set(row.card_id, row);
    }
  }

  const now = Date.now();
  const dueCards: FlashcardListItem[] = [];
  const newCards: FlashcardListItem[] = [];

  for (const card of cards) {
    const progress = latestProgressByCard.get(card.id);

    if (!progress || !progress.next_due_at) {
      newCards.push(card);
      continue;
    }

    if (new Date(progress.next_due_at).getTime() <= now) {
      dueCards.push(card);
    }
  }

  const sortedNewCards = [...newCards].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
  const selectedNewCards = sortedNewCards.slice(0, newDailyLimit);
  const selectedCards = [...dueCards, ...selectedNewCards];

  return {
    cards: selectedCards,
    dueCount: dueCards.length,
    newCountSelected: selectedNewCards.length,
    newDailyLimit,
  } as FlashcardsParaEstudoHojeResult;
}

export function useFlashcardsParaEstudoHojeQuery(categoryId: string) {
  return useQuery({
    queryKey: ["flashcards", "study-today", categoryId],
    queryFn: () => listarFlashcardsParaEstudoHoje(categoryId),
    enabled: Boolean(categoryId),
  });
}
