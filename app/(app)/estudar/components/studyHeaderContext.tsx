"use client";

import { createContext, useContext, useMemo, useState } from "react";

type StudyHeaderState = {
  title: string;
  current: number;
  total: number;
};

type StudyHeaderContextValue = {
  state: StudyHeaderState;
  setState: (next: StudyHeaderState) => void;
};

const defaultState: StudyHeaderState = {
  title: "Estudo",
  current: 0,
  total: 0,
};

const StudyHeaderContext = createContext<StudyHeaderContextValue | null>(null);

export function StudyHeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyHeaderState>(defaultState);
  const value = useMemo(() => ({ state, setState }), [state]);

  return <StudyHeaderContext.Provider value={value}>{children}</StudyHeaderContext.Provider>;
}

export function useStudyHeader() {
  const context = useContext(StudyHeaderContext);
  if (!context) {
    throw new Error("useStudyHeader must be used within StudyHeaderProvider.");
  }
  return context;
}

