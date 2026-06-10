import raw from "../data.json";

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface AnswerOption {
  valueCoding: Coding;
  extension?: { url: string; valueDecimal?: number }[];
}

export interface QItem {
  linkId: string;
  text?: string;
  type: string;
  code?: Coding[];
  answerOption?: AnswerOption[];
}

export interface Questionnaire {
  resourceType: "Questionnaire";
  url: string;
  item: QItem[];
  [k: string]: unknown;
}

export interface Instrument {
  key: string;
  name: string;
  title: string;
  tagline: string;
  panel: Coding;
  scoreCode: Coding;
  scoreLink: string;
  scored: string[];
  aggregate: "sum" | "mean";
  safetyLink: string | null;
  itemCodes: string[];
  flagNote: string | null;
  why: string;
  lic: string;
  sampleScore: number;
  loincTerm: string;
  loincCanonical: string;
  loincSource: string;
  questionnaire: Questionnaire;
  response: unknown;
  observation: unknown;
}

export const DATA = raw as unknown as { instruments: Instrument[] };

export function instByKey(key: string): Instrument {
  const inst = DATA.instruments.find((i) => i.key === key);
  if (!inst) throw new Error(`unknown instrument ${key}`);
  return inst;
}
