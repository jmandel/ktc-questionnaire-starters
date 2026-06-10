import { create } from "zustand";
import { DATA } from "./data";

/** One selected answer: coding for choice items, plus its scoring weight (or raw value). */
export interface Entry {
  code?: string;
  display?: string;
  score: number;
}

export type ResTab = "response" | "observation" | "questionnaire";

interface ExplorerState {
  current: string; // instrument key
  resTab: ResTab;
  answers: Record<string, Record<string, Entry>>; // instrument key -> linkId -> entry
  setCurrent: (key: string) => void;
  setResTab: (t: ResTab) => void;
  setAnswer: (instKey: string, linkId: string, entry: Entry) => void;
}

export const useStore = create<ExplorerState>((set) => ({
  current: DATA.instruments[0].key,
  resTab: "response",
  answers: {},
  setCurrent: (current) => set({ current }),
  setResTab: (resTab) => set({ resTab }),
  setAnswer: (instKey, linkId, entry) =>
    set((s) => ({
      answers: {
        ...s.answers,
        [instKey]: { ...s.answers[instKey], [linkId]: entry },
      },
    })),
}));
