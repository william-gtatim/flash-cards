"use client";

type StudyCardControlsProps = {
  onNext: () => void;
};

export function StudyCardControls({ onNext }: StudyCardControlsProps) {
  return (
    <div className="w-full max-w-2xl rounded-2xl bg-background p-2">
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          className="rounded-xl bg-rose-50 px-2 py-2 text-center text-rose-500 transition-opacity hover:opacity-90 dark:bg-rose-950/30 dark:text-rose-400"
          onClick={onNext}
        >
          <span className="block whitespace-nowrap text-base font-medium leading-tight">
            De novo
          </span>
          <span className="mt-1 block text-sm font-medium leading-tight">1m</span>
        </button>

        <button
          type="button"
          className="rounded-xl bg-orange-50 px-2 py-2 text-center text-orange-500 transition-opacity hover:opacity-90 dark:bg-amber-950/30 dark:text-amber-400"
          onClick={onNext}
        >
          <span className="block whitespace-nowrap text-base font-medium leading-tight">
            Dificil
          </span>
          <span className="mt-1 block text-sm font-medium leading-tight">3d</span>
        </button>

        <button
          type="button"
          className="rounded-xl bg-lime-50 px-3 py-2 text-center text-lime-500 transition-opacity hover:opacity-90 dark:bg-lime-950/30 dark:text-lime-400"
          onClick={onNext}
        >
          <span className="block whitespace-nowrap text-base font-medium leading-tight">
            Bom
          </span>
          <span className="mt-1 block text-sm font-medium leading-tight">6.3d</span>
        </button>

        <button
          type="button"
          className="rounded-xl bg-sky-50 px-3 py-2 text-center text-sky-500 transition-opacity hover:opacity-90 dark:bg-sky-950/30 dark:text-sky-400"
          onClick={onNext}
        >
          <span className="block whitespace-nowrap text-base font-medium leading-tight">
            Facil
          </span>
          <span className="mt-1 block text-sm font-medium leading-tight">8.1d</span>
        </button>
      </div>
    </div>
  );
}
