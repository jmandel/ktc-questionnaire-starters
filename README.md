# Kill the Clipboard — FHIR Questionnaire Starter Set

A small, standards-based starter set of **FHIR R4 Questionnaires** for high-value,
patient-reported information that **USCDI / US Core data does not already carry** — with worked
`QuestionnaireResponse` and extracted, LOINC-coded `Observation` examples.

> **USCDI first for reusable chart facts. FHIR Questionnaire only when asking the patient is
> clinically necessary** — current, subjective, scored, episode-specific, or workflow-triggering
> information.

🔗 **Live site:** https://jmandel.github.io/ktc-questionnaire-starters/

## Why this exists

The failure mode for a "questionnaire" project is recreating the paper intake clipboard in digital
form: re-asking demographics, medications, allergies, problems, insurance. All of that should be
**retrieved from US Core FHIR resources** and prefilled, not re-collected.

FHIR `Questionnaire` earns its place only when the *capture event itself* matters — when the system
needs to know exactly what was asked, the exact answer set, the score, when the patient answered, and
whether the response should trigger a workflow.

## The five instruments

| Instrument | Panel (LOINC) | Score (LOINC) | Demonstrates | Licensing posture |
|---|---|---|---|---|
| **PHQ-9** — depression | `44249-1` | `44261-6` total | Likert scoring, shared answers, safety item | Pfizer; no permission required |
| **GAD-7** — anxiety | `69737-5` | `70274-6` total | Same scoring engine as PHQ-9 | Pfizer; no permission required |
| **AUDIT-C** — alcohol use | `72109-2` | `75626-2` total | Short risk screen, per-question answer lists | WHO; public domain |
| **PEG-3** — pain impact | `91148-7` | `91147-9` mean | 0–10 numeric scales, **mean** score | Public domain |
| **ESAS-r** — symptom burden | `112503-8` | `112493-2` total | Multi-symptom PRO, specialty extensibility | AHS; public domain w/ acknowledgment |

These are a **capability demonstration set, not a closed catalog**. The general pattern — render a
Questionnaire, collect a Response, preserve provenance, extract Observations, route follow-up — applies
to any appropriately licensed or locally authored instrument.

### On canonical URLs

The LOINC panel code in `Questionnaire.code` is the real interoperability anchor — it's what a receiving
system matches on, regardless of who rendered the form. LOINC also publishes official FHIR Questionnaires
for these panels at [`fhir.loinc.org`](https://fhir.loinc.org/Questionnaire/) with the canonical
`http://loinc.org/q/<panel>`. Because our resources are our own rendering (LOINC-code `linkId`s plus an
`ordinalValue` scoring extension, which LOINC's published form does not carry), they keep their own `url`
but cite LOINC's official form via `derivedFrom` and `meta.source`. We don't reuse LOINC's canonical
`url`, which would falsely assert these *are* LOINC's resource (its `linkId`s and item set differ).

## What's in here

```
index.html                 # the single-page site (live, fillable demo)
data.json                  # bundle the site loads (generated)
generate.py                # source of truth — generates all FHIR + data.json
verify_loinc.py            # validates every code/answer against a LOINC distribution
fhir/
  <id>.questionnaire.json  # Questionnaire (panel code, item codes, answerOption w/ ordinalValue)
  <id>.response.json       # example QuestionnaireResponse
  <id>.observation.json    # extracted, LOINC-coded score Observation (category=survey)
  <id>.bundle.json         # all three as a collection Bundle
```

## The FHIR pattern

1. **`Questionnaire`** — canonical URL, LOINC panel code, item codes, answer options with
   `ordinalValue` scores, version, `copyright`, and `derivedFrom` the official LOINC form.
2. **`QuestionnaireResponse`** — answers by `linkId`, `source`/author, `authored` timestamp, link back
   to the Questionnaire. The raw provenance record.
3. **`Observation`** — `category = survey`, LOINC score code, `valueQuantity` in `{score}`,
   `derivedFrom` the response. The searchable, trendable result.

## Regenerating & verifying

```bash
python3 generate.py        # rewrite fhir/*.json and data.json
python3 verify_loinc.py    # check every code/display/answer against ~/work/tx/Loinc_2.82
```

`verify_loinc.py` confirms all panel/item/score codes are **ACTIVE** in LOINC and that every choice
answer's code + display text and the AUDIT-C answer lists (`LL2179-1` / `LL2180-9` / `LL2181-7`) match
the distribution. All 120 codes/answers currently pass.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

(The page fetches `data.json`, so serve over HTTP rather than opening the file directly.)

## Caveats

For demonstration and implementation reference only — **not medical advice** and not a certified
instrument distribution. Instrument copyright and use terms belong to their respective owners. LOINC®
availability does not by itself clear all use rights; put license text in `Questionnaire.copyright` and
verify codes, answer lists, and licensing against authoritative sources before production use. LOINC®
is a registered trademark of Regenstrief Institute, Inc.
