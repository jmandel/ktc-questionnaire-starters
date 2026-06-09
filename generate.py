#!/usr/bin/env python3
"""
Build the example library for the "Kill the Clipboard" starter questionnaire set.

We redistribute LOINC's *official* FHIR Questionnaires (fetched from
https://fhir.loinc.org/Questionnaire/<panel> into fhir-loinc/<panel>.json) verbatim,
then generate, for each one, an example QuestionnaireResponse and an extracted score
Observation that reference LOINC's canonical url (http://loinc.org/q/<panel>) and use
LOINC's real linkIds — so everything is consistent with the published form.

Scoring uses the answerOption *index* as the ordinal (LOINC orders options 0..N; its
stored Score field is unreliable for several of these panels). PHQ-9's functional-
difficulty item and the score item itself are not summed.

Outputs (re-run after editing):  python3 generate.py
  fhir/<key>.questionnaire.json   verbatim official LOINC Questionnaire (redistributed)
  fhir/<key>.response.json        example QuestionnaireResponse (LOINC linkIds)
  fhir/<key>.observation.json     extracted score Observation
  fhir/<key>.bundle.json          all three as a collection Bundle
  data.json                       bundle the static site loads
"""

import json
import os

HERE = os.path.dirname(__file__)
SRC_DIR = os.path.join(HERE, "fhir-loinc")     # pristine official forms
OUT_DIR = os.path.join(HERE, "fhir")
LOINC = "http://loinc.org"
UCUM = "http://unitsofmeasure.org"
LOINC_Q = "http://loinc.org/q/"                # LOINC canonical url pattern
LOINC_FHIR = "https://fhir.loinc.org/Questionnaire/"
AUTHORED = "2026-06-09T09:30:00-05:00"


def coding(code, display):
    return {"system": LOINC, "code": code, "display": display}


# --- per-instrument config keyed by LOINC panel code ----------------------
# sample: linkId -> chosen answer (index for 'choice' items, numeric value for
#         'decimal'/'integer' items). Covers every non-score item.
# scored: linkIds that contribute to the total/mean. score: the score item linkId.

CONFIG = {
    "44249-1": dict(
        key="phq-9", name="PHQ-9",
        title="Patient Health Questionnaire-9 (PHQ-9)",
        tagline="Depression screening · total score 0–27",
        score_code=coding("44261-6", "Patient Health Questionnaire 9 item (PHQ-9) total score [Reported]"),
        item_codes=["44250-9", "44255-8", "44259-0", "44254-1", "44251-7",
                    "44258-2", "44252-5", "44253-3", "44260-8"],
        score_link="14372", aggregate="sum", safety_link="14371",
        scored=["14363", "14364", "14365", "14366", "14367", "14368", "14369", "14370", "14371"],
        sample={"14363": 1, "14364": 2, "14365": 1, "14366": 2, "14367": 1,
                "14368": 1, "14369": 0, "14370": 0, "14371": 1, "57492": 1},
        flag_note="Any non-zero answer to PHQ-9 item 9 (thoughts of self-harm) should trigger a local "
                  "suicide-risk follow-up workflow, independent of the total score.",
        why="A familiar depression screen with shared answer choices, a total score, and a safety "
            "question built in. Ask it when a fresh screen is due — the chart won't tell you how the "
            "patient feels this week.",
        lic="No permission required",
    ),
    "69737-5": dict(
        key="gad-7", name="GAD-7",
        title="Generalized Anxiety Disorder-7 (GAD-7)",
        tagline="Anxiety screening · total score 0–21",
        score_code=coding("70274-6", "Generalized anxiety disorder 7 item (GAD-7) total score [Reported.PHQ]"),
        item_codes=["69725-0", "68509-9", "69733-4", "69734-2", "69735-9", "69689-8", "69736-7"],
        score_link="58628", aggregate="sum", safety_link=None,
        scored=["57541", "57542", "57543", "57544", "57545", "57546", "57547"],
        sample={"57541": 2, "57542": 1, "57543": 2, "57544": 1, "57545": 0, "57546": 1, "57547": 0},
        flag_note=None,
        why="Anxiety screen that scores the same way as PHQ-9, so the same code handles both. How "
            "someone feels right now isn't something the chart can hand over.",
        lic="No permission required",
    ),
    "72109-2": dict(
        key="audit-c", name="AUDIT-C",
        title="Alcohol Use Disorders Identification Test - Consumption (AUDIT-C)",
        tagline="Alcohol-use screening · total score 0–12",
        score_code=coding("75626-2", "Total score [AUDIT-C]"),
        item_codes=["68518-0", "68519-8", "68520-6"],
        score_link="72040", aggregate="sum", safety_link=None,
        scored=["72043", "72044", "72042"],
        sample={"72043": 1, "72044": 0, "72042": 0},
        flag_note="Consider a positive screen at ≥4 (men) / ≥3 (women); local thresholds vary. A positive "
                  "screen should route to brief intervention or further assessment.",
        why="A three-question alcohol screen. Social history is often missing or out of date; this gets "
            "a fresh, scored answer when one is needed.",
        lic="Public domain (WHO)",
    ),
    "91148-7": dict(
        key="peg-3", name="PEG-3",
        title="Pain, Enjoyment of life, General activity (PEG)",
        tagline="Pain impact · 3 items (0–10) · mean score",
        score_code=coding("91147-9", "Mean score [PEG]"),
        item_codes=["75893-8", "91145-3", "91146-1"],
        score_link="108516", aggregate="mean", safety_link=None,
        scored=["108518", "108514", "108515"],
        sample={"108518": 6, "108514": 7, "108515": 4},
        flag_note="A high or rising mean PEG score over time can prompt re-evaluation of the pain plan.",
        why="The clearest case for a questionnaire: the chart may say the patient has chronic pain, but "
            "not how much it got in the way of their life this week.",
        lic="Public domain",
    ),
    "112503-8": dict(
        key="esas-r", name="ESAS-r",
        title="Edmonton Symptom Assessment System (revised)",
        tagline="Symptom burden · 9 items (0–10) · summary score",
        score_code=coding("112493-2", "Total score [Edmonton Symptom Assessment System]"),
        item_codes=["112494-0", "112495-7", "112496-5", "112497-3", "112498-1",
                    "112499-9", "112500-4", "112501-2", "112502-0"],
        score_link="151377", aggregate="sum", safety_link=None,
        scored=["151386", "151385", "151384", "151383", "151382",
                "151381", "151380", "151379", "151378"],
        sample={"151386": 4, "151385": 7, "151384": 3, "151383": 2, "151382": 5,
                "151381": 5, "151380": 3, "151379": 4, "151378": 4},
        flag_note="Any symptom rated severe (e.g. ≥7) is typically flagged for clinician review; ESAS-r "
                  "is for symptom monitoring, not general intake.",
        why="Rates nine symptoms at once for cancer, palliative, and serious-illness care. It's how the "
            "patient is doing today, not anything in the demographics.",
        lic="Public domain w/ acknowledgment",
    ),
}


def load_q(panel):
    with open(os.path.join(SRC_DIR, f"{panel}.json")) as f:
        q = json.load(f)
    assert q.get("resourceType") == "Questionnaire", panel
    return q


def items_by_link(q):
    return {it["linkId"]: it for it in q["item"]}


def chosen_answer(item, val):
    """Return (answer_object, ordinal_value) for a sample value on an item."""
    if item["type"] == "choice":
        opt = item["answerOption"][val]
        return {"valueCoding": dict(opt["valueCoding"])}, val
    # numeric (decimal / integer)
    if item["type"] == "integer":
        return {"valueInteger": val}, val
    return {"valueDecimal": val}, val


def compute_score(cfg, q):
    by = items_by_link(q)
    vals = []
    for lid in cfg["scored"]:
        v = cfg["sample"][lid]
        vals.append(v)  # index for choice == ordinal; numeric value otherwise
    total = sum(vals)
    if cfg["aggregate"] == "mean":
        return round(total / len(vals), 1)
    return total


def build_response(cfg, q):
    by = items_by_link(q)
    canonical = q["url"]
    items = []
    for it in q["item"]:
        lid = it["linkId"]
        if lid == cfg["score_link"]:
            continue
        if lid not in cfg["sample"]:
            continue
        ans, _ = chosen_answer(it, cfg["sample"][lid])
        items.append({"linkId": lid, "text": it.get("text", ""), "answer": [ans]})
    # score item (LOINC item type is decimal)
    score = compute_score(cfg, q)
    items.append({
        "linkId": cfg["score_link"],
        "text": by[cfg["score_link"]].get("text", "Total score"),
        "answer": [{"valueDecimal": score}],
    })
    return {
        "resourceType": "QuestionnaireResponse",
        "id": f"qr-{cfg['key']}-example",
        "questionnaire": canonical,
        "status": "completed",
        "subject": {"reference": "Patient/example", "display": "Example Patient"},
        "authored": AUTHORED,
        "source": {"reference": "Patient/example"},
        "item": items,
    }


def build_observation(cfg, q):
    score = compute_score(cfg, q)
    return {
        "resourceType": "Observation",
        "id": f"obs-{cfg['key']}-score-example",
        "status": "final",
        "category": [{"coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey", "display": "Survey"}]}],
        "code": {"coding": [cfg["score_code"]]},
        "subject": {"reference": "Patient/example", "display": "Example Patient"},
        "effectiveDateTime": AUTHORED,
        "valueQuantity": {"value": score, "unit": "{score}", "system": UCUM, "code": "{score}"},
        "derivedFrom": [{"reference": f"QuestionnaireResponse/qr-{cfg['key']}-example"}],
    }


def build_bundle(cfg, q, r, o):
    return {
        "resourceType": "Bundle",
        "id": f"{cfg['key']}-example",
        "type": "collection",
        "entry": [
            {"fullUrl": q["url"], "resource": q},
            {"fullUrl": f"urn:uuid:qr-{cfg['key']}", "resource": r},
            {"fullUrl": f"urn:uuid:obs-{cfg['key']}", "resource": o},
        ],
    }


def write_json(path, obj):
    with open(path, "w") as f:
        json.dump(obj, f, indent=2)
        f.write("\n")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    site = {"instruments": []}
    for panel, cfg in CONFIG.items():
        q = load_q(panel)
        r = build_response(cfg, q)
        o = build_observation(cfg, q)
        b = build_bundle(cfg, q, r, o)
        key = cfg["key"]
        write_json(os.path.join(OUT_DIR, f"{key}.questionnaire.json"), q)
        write_json(os.path.join(OUT_DIR, f"{key}.response.json"), r)
        write_json(os.path.join(OUT_DIR, f"{key}.observation.json"), o)
        write_json(os.path.join(OUT_DIR, f"{key}.bundle.json"), b)

        site["instruments"].append({
            "key": key, "name": cfg["name"], "title": cfg["title"], "tagline": cfg["tagline"],
            "panel": coding(panel, q["code"][0]["display"]),
            "scoreCode": cfg["score_code"],
            "scoreLink": cfg["score_link"], "scored": cfg["scored"],
            "aggregate": cfg["aggregate"], "safetyLink": cfg["safety_link"],
            "itemCodes": cfg["item_codes"],
            "flagNote": cfg["flag_note"], "why": cfg["why"], "lic": cfg["lic"],
            "sampleScore": compute_score(cfg, q),
            "loincTerm": f"https://loinc.org/{panel}",
            "loincCanonical": f"{LOINC_Q}{panel}",
            "loincSource": f"{LOINC_FHIR}{panel}",
            "questionnaire": q, "response": r, "observation": o,
        })

    write_json(os.path.join(HERE, "data.json"), site)
    print(f"Wrote {len(CONFIG)} instruments × 4 files to {OUT_DIR} and data.json")


if __name__ == "__main__":
    main()
