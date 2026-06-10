import type { AnswerOption, Instrument, QItem } from "./data";
import type { Entry } from "./store";

export const ORDINAL_EXT = "http://hl7.org/fhir/StructureDefinition/ordinalValue";

/** Weight of an answerOption: its SDC ordinalValue extension, else its index. */
export function ordOf(opt: AnswerOption, i: number): number {
  const e = (opt.extension ?? []).find((x) => x.url === ORDINAL_EXT);
  return e?.valueDecimal ?? i;
}

/** Items the patient fills in: everything except display items and the computed score item. */
export function inputItems(inst: Instrument): QItem[] {
  return inst.questionnaire.item.filter(
    (it) => it.type !== "display" && it.linkId !== inst.scoreLink,
  );
}

export function itemByLink(inst: Instrument, linkId: string): QItem | undefined {
  return inst.questionnaire.item.find((it) => it.linkId === linkId);
}

export interface ScoreState {
  total: number;
  nAns: number;
  count: number;
  complete: boolean;
  scoredComplete: boolean;
}

export function computeScore(inst: Instrument, st: Record<string, Entry> = {}): ScoreState {
  let sum = 0;
  let nScored = 0;
  for (const lid of inst.scored) {
    const e = st[lid];
    if (e) {
      sum += e.score;
      nScored++;
    }
  }
  const total =
    inst.aggregate === "mean" ? Math.round((sum / Math.max(nScored, 1)) * 10) / 10 : sum;
  const inputs = inputItems(inst);
  const nAns = inputs.filter((it) => it.linkId in st).length;
  return {
    total,
    nAns,
    count: inputs.length,
    complete: nAns === inputs.length,
    scoredComplete: nScored === inst.scored.length,
  };
}

/* ---------- live resources (LOINC linkIds + datatypes) ---------- */

export function liveResponse(inst: Instrument, st: Record<string, Entry> = {}) {
  const items: object[] = [];
  for (const it of inputItems(inst)) {
    const entry = st[it.linkId];
    if (!entry) continue;
    let answer: object;
    if (it.type === "choice")
      answer = {
        valueCoding: { system: "http://loinc.org", code: entry.code, display: entry.display },
      };
    else if (it.type === "integer") answer = { valueInteger: entry.score };
    else answer = { valueDecimal: entry.score };
    items.push({ linkId: it.linkId, text: it.text, answer: [answer] });
  }
  const sc = computeScore(inst, st);
  if (sc.scoredComplete) {
    items.push({
      linkId: inst.scoreLink,
      text: itemByLink(inst, inst.scoreLink)?.text ?? "Total score",
      answer: [{ valueDecimal: sc.total }],
    });
  }
  return {
    resourceType: "QuestionnaireResponse",
    id: `qr-${inst.key}-live`,
    questionnaire: inst.loincCanonical,
    status: sc.complete ? "completed" : "in-progress",
    subject: { reference: "Patient/example", display: "Example Patient" },
    authored: new Date().toISOString(),
    source: { reference: "Patient/example" },
    item: items,
  };
}

export function liveObservation(inst: Instrument, st: Record<string, Entry> = {}) {
  const sc = computeScore(inst, st);
  const obs: Record<string, unknown> = {
    resourceType: "Observation",
    id: `obs-${inst.key}-live`,
    status: sc.scoredComplete ? "final" : "preliminary",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "survey",
            display: "Survey",
          },
        ],
      },
    ],
    code: { coding: [inst.scoreCode] },
    subject: { reference: "Patient/example", display: "Example Patient" },
    effectiveDateTime: new Date().toISOString(),
    derivedFrom: [{ reference: `QuestionnaireResponse/qr-${inst.key}-live` }],
  };
  // A partial sum/mean isn't a valid instrument score — and 0 is a real one.
  if (sc.scoredComplete)
    obs.valueQuantity = {
      value: sc.total,
      unit: "{score}",
      system: "http://unitsofmeasure.org",
      code: "{score}",
    };
  else
    obs.dataAbsentReason = {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/data-absent-reason",
          code: "temp-unknown",
          display: "Temporarily Unknown",
        },
      ],
    };
  return obs;
}

/* ---------- tiny JSON syntax highlighter ---------- */

export function hl(obj: unknown): string {
  let s = JSON.stringify(obj, null, 2);
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return s.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g,
    (m) => {
      let cls = "tok-num";
      if (/^"/.test(m)) cls = /:$/.test(m) ? "tok-key" : "tok-str";
      else if (/true|false/.test(m)) cls = "tok-bool";
      else if (/null/.test(m)) cls = "tok-null";
      return `<span class="${cls}">${m}</span>`;
    },
  );
}
