import { useState } from "react";
import { DATA, instByKey, type Instrument, type QItem } from "./data";
import { computeScore, hl, liveObservation, liveResponse, ordOf } from "./fhir";
import { useStore, type Entry, type ResTab } from "./store";

function InstTabs() {
  const current = useStore((s) => s.current);
  const setCurrent = useStore((s) => s.setCurrent);
  return (
    <div className="exp-tabs">
      {DATA.instruments.map((inst) => (
        <button
          key={inst.key}
          className={inst.key === current ? "active" : ""}
          onClick={() => setCurrent(inst.key)}
        >
          {inst.name}
        </button>
      ))}
    </div>
  );
}

function ChoiceOpts({ inst, item, scored }: { inst: Instrument; item: QItem; scored: boolean }) {
  const entry = useStore((s) => s.answers[inst.key]?.[item.linkId]);
  const setAnswer = useStore((s) => s.setAnswer);
  return (
    <div className="opts">
      {(item.answerOption ?? []).map((o, i) => {
        const w = ordOf(o, i);
        const sel = entry?.code === o.valueCoding.code;
        return (
          <label key={o.valueCoding.code} className={`opt ${sel ? "sel" : ""}`}>
            <input
              type="radio"
              name={`${inst.key}-${item.linkId}`}
              checked={!!sel}
              onChange={() =>
                setAnswer(inst.key, item.linkId, {
                  code: o.valueCoding.code,
                  display: o.valueCoding.display,
                  score: w,
                })
              }
            />
            <span>{o.valueCoding.display}</span>
            {scored && <span className="osc">+{w}</span>}
          </label>
        );
      })}
    </div>
  );
}

/** Long ordinal choice list (0–10) or numeric item -> compact scale of buttons. */
function Scale({ inst, item }: { inst: Instrument; item: QItem }) {
  const entry = useStore((s) => s.answers[inst.key]?.[item.linkId]);
  const setAnswer = useStore((s) => s.setAnswer);
  const opts = item.answerOption ?? [];
  const isChoice = item.type === "choice" && opts.length > 0;
  const buttons = isChoice
    ? opts.map((o, i) => ({
        label: String(i),
        title: o.valueCoding.display,
        entry: { code: o.valueCoding.code, display: o.valueCoding.display, score: ordOf(o, i) },
      }))
    : Array.from({ length: 11 }, (_, v) => ({
        label: String(v),
        title: String(v),
        entry: { score: v },
      }));
  return (
    <div className="scale">
      {buttons.map((b) => (
        <button
          key={b.label}
          className={entry?.score === b.entry.score ? "sel" : ""}
          title={b.title}
          onClick={() => setAnswer(inst.key, item.linkId, b.entry)}
        >
          {b.label}
        </button>
      ))}
      <div className="ends">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
}

function Form({ inst }: { inst: Instrument }) {
  const scored = new Set(inst.scored);
  let qn = 0;
  return (
    <div className="exp-form">
      {inst.questionnaire.item.map((it) => {
        if (it.type === "display")
          return (
            <div key={it.linkId} className="lead">
              {it.text}
            </div>
          );
        if (it.linkId === inst.scoreLink) return null; // score item is computed
        qn++;
        const opts = it.answerOption ?? [];
        const useScale = it.type !== "choice" || opts.length > 6;
        return (
          <div key={it.linkId} className="q">
            <div className="qt">
              <span className="ix">{qn}</span>
              {it.text}
            </div>
            {useScale ? (
              <Scale inst={inst} item={it} />
            ) : (
              <ChoiceOpts inst={inst} item={it} scored={scored.has(it.linkId)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const RES_TABS: { id: ResTab; label: string }[] = [
  { id: "response", label: "QuestionnaireResponse" },
  { id: "observation", label: "Observation" },
  { id: "questionnaire", label: "Questionnaire" },
];

function currentResource(inst: Instrument, resTab: ResTab, st: Record<string, Entry>) {
  if (resTab === "response") return liveResponse(inst, st);
  if (resTab === "observation") return liveObservation(inst, st);
  return inst.questionnaire;
}

function OutputPanel({ inst }: { inst: Instrument }) {
  const st = useStore((s) => s.answers[inst.key]) ?? {};
  const resTab = useStore((s) => s.resTab);
  const setResTab = useStore((s) => s.setResTab);
  const [copied, setCopied] = useState(false);

  const sc = computeScore(inst, st);
  const resource = currentResource(inst, resTab, st);
  const safety = inst.safetyLink ? st[inst.safetyLink] : undefined;
  const flag = !!safety && safety.score > 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(resource, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  const view = (kind: string) => `view.html?src=fhir/${inst.key}.${kind}.json`;

  return (
    <div className="exp-out">
      <div className="score-card">
        <div className="score-num">{sc.nAns === 0 ? "–" : sc.total}</div>
        <div className="score-meta">
          <div className="lbl">
            {inst.aggregate === "mean" ? "Mean score" : "Total score"} · {sc.nAns}/{sc.count}{" "}
            answered
          </div>
          <div className="code">
            LOINC {inst.scoreCode.code} · {inst.scoreCode.display}
          </div>
        </div>
      </div>
      {flag && (
        <div className="flag show">
          {inst.flagNote ?? "This response should trigger a local follow-up workflow."}
        </div>
      )}
      <div className="res-tabs">
        {RES_TABS.map((t) => (
          <button
            key={t.id}
            className={resTab === t.id ? "active" : ""}
            onClick={() => setResTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="codebox">
        <button className="copy" onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
        <pre className="code" dangerouslySetInnerHTML={{ __html: hl(resource) }} />
      </div>
      <div className="dl-row">
        <span className="dl-label">View &amp; download:</span>
        {["questionnaire", "response", "observation", "bundle"].map((kind) => (
          <a key={kind} href={view(kind)} target="_blank" rel="noopener">
            ⤢ {kind}.json
          </a>
        ))}
      </div>
    </div>
  );
}

export function Explorer() {
  const current = useStore((s) => s.current);
  const inst = instByKey(current);
  return (
    <div className="explorer">
      <InstTabs />
      <div className="exp-body">
        <Form inst={inst} />
        <OutputPanel inst={inst} />
      </div>
    </div>
  );
}
