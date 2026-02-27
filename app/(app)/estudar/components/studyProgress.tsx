"use client";

type StudyProgressProps = {
  title?: string;
  current: number;
  total: number;
};

export function StudyProgress({
  title = "Estudo",
  current,
  total,
}: StudyProgressProps) {
  const safeTotal = Math.max(total, 0);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percent = safeTotal > 0 ? (safeCurrent / safeTotal) * 100 : 0;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-zinc-200 px-4 py-1.5 text-2xl font-semibold leading-none text-foreground dark:bg-zinc-800">
          <span>{safeCurrent}</span>
          <span className="text-zinc-400 dark:text-zinc-500">/{safeTotal}</span>
        </div>

        <div className="h-4 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
