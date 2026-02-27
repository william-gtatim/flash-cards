"use client";

export type ReviewGrade = 1 | 2 | 3 | 4;

export type ProgressSnapshot = {
  level: number;
  ease_factor: number;
  repetition: number;
  interval_days: number;
  lapses: number;
  correct_streak: number;
  review_count: number;
};

export type NextProgress = {
  level: number;
  easeFactor: number;
  repetition: number;
  intervalDays: number;
  lapses: number;
  correctStreak: number;
  reviewCount: number;
  nextDueAt: string;
};

const qualityByGrade: Record<ReviewGrade, number> = {
  1: 0, // de novo
  2: 3, // dificil
  3: 4, // bom
  4: 5, // facil
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function addMinutes(base: Date, minutes: number) {
  const next = new Date(base);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

function addHours(base: Date, hours: number) {
  const next = new Date(base);
  next.setHours(next.getHours() + hours);
  return next;
}

const AGAIN_MINUTES = 10;
const HARD_HOURS_ON_FIRST_SUCCESS = 12;

export function computeSm2Progress(
  previous: ProgressSnapshot | null,
  grade: ReviewGrade,
  now: Date,
): NextProgress {
  const quality = qualityByGrade[grade];
  const prevEase = previous?.ease_factor ?? 2.5;
  const prevRepetition = previous?.repetition ?? 0;
  const prevInterval = previous?.interval_days ?? 0;
  const prevLapses = previous?.lapses ?? 0;
  const prevCorrectStreak = previous?.correct_streak ?? 0;
  const prevReviewCount = previous?.review_count ?? 0;

  let repetition = prevRepetition;
  let intervalDays = prevInterval;
  let nextDueAt: string;

  if (quality < 3) {
    repetition = 0;
    intervalDays = 0;
    nextDueAt = addMinutes(now, AGAIN_MINUTES).toISOString();
  } else {
    repetition = prevRepetition + 1;

    let baseInterval: number;
    if (repetition === 1) {
      baseInterval = 1;
    } else if (repetition === 2) {
      baseInterval = 6;
    } else {
      baseInterval = Math.max(1, Math.round(prevInterval * prevEase));
    }

    if (grade === 2) {
      // Keep "Hard" strictly below "Good".
      if (baseInterval <= 1) {
        intervalDays = 0;
        nextDueAt = addHours(now, HARD_HOURS_ON_FIRST_SUCCESS).toISOString();
      } else {
        intervalDays = Math.max(1, Math.floor(baseInterval * 0.6));
        nextDueAt = addDays(now, intervalDays).toISOString();
      }
    } else if (grade === 4) {
      intervalDays = Math.max(baseInterval + 1, Math.round(baseInterval * 1.5));
      nextDueAt = addDays(now, intervalDays).toISOString();
    } else {
      intervalDays = baseInterval;
      nextDueAt = addDays(now, intervalDays).toISOString();
    }
  }

  const easeDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const easeFactor = Math.max(1.3, round2(prevEase + easeDelta));

  return {
    level: grade,
    easeFactor,
    repetition,
    intervalDays,
    lapses: quality < 3 ? prevLapses + 1 : prevLapses,
    correctStreak: quality < 3 ? 0 : prevCorrectStreak + 1,
    reviewCount: prevReviewCount + 1,
    nextDueAt,
  };
}

export function formatIntervalLabel(nextDueAtIso: string, now: Date) {
  const diffMs = new Date(nextDueAtIso).getTime() - now.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  if (diffMinutes < 1440) {
    const hours = Math.round(diffMinutes / 60);
    return `${hours}h`;
  }

  const days = Math.round(diffMinutes / 1440);
  return `${days}d`;
}
