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

### Refreshing the official forms

`fhir-loinc/*.json` were fetched from LOINC's terminology server, which needs a free LOINC account:

```bash
# .env (gitignored) holds LOINC_USERNAME and LOINC_PASSWORD
set -a; . ./.env; set +a
for code in 44249-1 69737-5 72109-2 91148-7 112503-8; do
  curl -sS -u "$LOINC_USERNAME:$LOINC_PASSWORD" -H "Accept: application/fhir+json" \
       -o "fhir-loinc/$code.json" "https://fhir.loinc.org/Questionnaire/$code"
done
python3 generate.py && python3 verify_loinc.py
```

## What's in here

```
index.html                 # the single-page site (live, fillable demo)
data.json                  # bundle the site loads (generated)
generate.py                # generates responses/observations/bundles + data.json
verify_loinc.py            # validates codes/answers/scores against a LOINC distribution
fhir-loinc/
  <panel>.json             # LOINC's official Questionnaires, fetched verbatim from fhir.loinc.org
fhir/
  <id>.questionnaire.json  # the official LOINC Questionnaire (redistributed as-is)
  <id>.response.json       # example QuestionnaireResponse (LOINC linkIds, real datatypes)
  <id>.observation.json    # extracted, LOINC-coded score Observation (category=survey)
  <id>.bundle.json         # all three as a collection Bundle
```

The Questionnaires here are **LOINC's official FHIR Questionnaires**, published by Regenstrief at
[`fhir.loinc.org`](https://fhir.loinc.org/Questionnaire/) and redistributed under the
[LOINC license](http://loinc.org/license) (the notice travels in `Questionnaire.copyright`). We render
them as-is — real numeric `linkId`s, real answer codes — and the example responses reference their
canonical `http://loinc.org/q/<panel>`.

## The FHIR pattern

1. **`Questionnaire`** — LOINC's official form: canonical `http://loinc.org/q/<panel>`, panel code,
   item codes, answer options, `copyright`.
2. **`QuestionnaireResponse`** — answers by LOINC `linkId` with the right datatype (`valueCoding` for
   choice items, `valueInteger`/`valueDecimal` for numeric), `source`/author, `authored` timestamp,
   referencing the LOINC canonical. The raw provenance record.
3. **`Observation`** — `category = survey`, LOINC score code, `valueQuantity` in `{score}`,
   `derivedFrom` the response. The searchable, trendable result.

## Scoring

LOINC orders each item's answers from least to most, so the **option index is the ordinal** (the stored
`Score` field in LOINC's answer file is unreliable for several of these panels). The total is a **sum**,
except **PEG** which is a **mean**. PHQ-9's functional-difficulty item and each form's score item are not
summed. Scoring lives in `generate.py` (for the example responses) and in the page's JS (for the live
demo); `verify_loinc.py` re-derives every score and checks it against the response.

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
