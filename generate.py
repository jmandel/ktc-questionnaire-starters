#!/usr/bin/env python3
"""
Generate FHIR R4 artifacts (Questionnaire / QuestionnaireResponse / Observation)
for the "Kill the Clipboard" starter questionnaire set.

Source of truth for every JSON file under /fhir and for /data.json (the bundle
the static site loads for its interactive viewer). Re-run after editing:

    python3 generate.py

This keeps the website, the downloadable resources, and the LOINC tables in sync.
"""

import json
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "fhir")
ORDINAL_EXT = "http://hl7.org/fhir/StructureDefinition/ordinalValue"
QC_EXT = "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
LOINC = "http://loinc.org"
UCUM = "http://unitsofmeasure.org"
BASE = "https://jmandel.github.io/ktc-questionnaire-starters/fhir"

# ---------------------------------------------------------------------------
# Shared answer lists
# ---------------------------------------------------------------------------

# PHQ-9 / GAD-7 frequency scale (0-3)
FREQ_0_3 = [
    ("LA6568-5", "Not at all", 0),
    ("LA6569-3", "Several days", 1),
    ("LA6570-1", "More than half the days", 2),
    ("LA6571-9", "Nearly every day", 3),
]

# AUDIT-C answer lists differ per question
# Verified against LOINC 2.82 answer lists LL2179-1 / LL2180-9 / LL2181-7
AUDIT_Q1 = [  # LL2179-1
    ("LA6270-8", "Never", 0),
    ("LA18926-8", "Monthly or less", 1),
    ("LA18927-6", "2-4 times a month", 2),
    ("LA18928-4", "2-3 times a week", 3),
    ("LA18929-2", "4 or more times a week", 4),
]
AUDIT_Q2 = [  # LL2180-9
    ("LA15694-5", "1 or 2", 0),
    ("LA15695-2", "3 or 4", 1),
    ("LA18930-0", "5 or 6", 2),
    ("LA18931-8", "7 to 9", 3),
    ("LA18932-6", "10 or more", 4),
]
AUDIT_Q3 = [  # LL2181-7
    ("LA6270-8", "Never", 0),
    ("LA18933-4", "Less than monthly", 1),
    ("LA18876-5", "Monthly", 2),
    ("LA18891-4", "Weekly", 3),
    ("LA18934-2", "Daily or almost daily", 4),
]


def answer_options(answers):
    """Build Questionnaire.item.answerOption with ordinalValue scoring."""
    opts = []
    for code, display, score in answers:
        opts.append({
            "extension": [{"url": ORDINAL_EXT, "valueDecimal": score}],
            "valueCoding": {"system": LOINC, "code": code, "display": display},
        })
    return opts


def coding(code, display):
    return {"system": LOINC, "code": code, "display": display}


# ---------------------------------------------------------------------------
# Instrument definitions
# ---------------------------------------------------------------------------

INSTRUMENTS = {}


def define(key, **kw):
    INSTRUMENTS[key] = kw


define(
    "phq-9",
    name="PHQ-9",
    title="Patient Health Questionnaire-9 (PHQ-9)",
    tagline="Depression screening · 9 items · total score 0–27",
    panel=coding("44249-1", "PHQ-9 quick depression assessment panel [Reported.PHQ]"),
    copyright="PHQ-9 was developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission is required to reproduce, translate, display, or distribute it.",
    score_code=coding("44261-6", "Patient Health Questionnaire 9 item (PHQ-9) total score [Reported]"),
    score_type="integer",
    questions=[
        ("44250-9", "Little interest or pleasure in doing things", FREQ_0_3),
        ("44255-8", "Feeling down, depressed, or hopeless", FREQ_0_3),
        ("44259-0", "Trouble falling or staying asleep, or sleeping too much", FREQ_0_3),
        ("44254-1", "Feeling tired or having little energy", FREQ_0_3),
        ("44251-7", "Poor appetite or overeating", FREQ_0_3),
        ("44258-2", "Feeling bad about yourself - or that you are a failure or have let yourself or your family down", FREQ_0_3),
        ("44252-5", "Trouble concentrating on things, such as reading the newspaper or watching television", FREQ_0_3),
        ("44253-3", "Moving or speaking so slowly that other people could have noticed - or the opposite, being so fidgety or restless that you have been moving around a lot more than usual", FREQ_0_3),
        ("44260-8", "Thoughts that you would be better off dead, or of hurting yourself in some way", FREQ_0_3),
    ],
    lead="Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    # sample response answers as (item_index -> chosen ordinal score)
    sample=[1, 2, 1, 2, 1, 1, 0, 0, 1],
    flag_item=8,  # PHQ-9 item 9 (zero-based) is the safety item
    flag_note="Any non-zero answer to item 9 (thoughts of self-harm) should trigger a local suicide-risk follow-up workflow, independent of the total score.",
)

define(
    "gad-7",
    name="GAD-7",
    title="Generalized Anxiety Disorder-7 (GAD-7)",
    tagline="Anxiety screening · 7 items · total score 0–21",
    panel=coding("69737-5", "Generalized anxiety disorder 7 item (GAD-7)"),
    copyright="GAD-7 was developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc. No permission is required to reproduce, translate, display, or distribute it.",
    score_code=coding("70274-6", "Generalized anxiety disorder 7 item (GAD-7) total score [Reported.PHQ]"),
    score_type="integer",
    questions=[
        ("69725-0", "Feeling nervous, anxious, or on edge", FREQ_0_3),
        ("68509-9", "Not being able to stop or control worrying", FREQ_0_3),
        ("69733-4", "Worrying too much about different things", FREQ_0_3),
        ("69734-2", "Trouble relaxing", FREQ_0_3),
        ("69735-9", "Being so restless that it is hard to sit still", FREQ_0_3),
        ("69689-8", "Becoming easily annoyed or irritable", FREQ_0_3),
        ("69736-7", "Feeling afraid, as if something awful might happen", FREQ_0_3),
    ],
    lead="Over the last 2 weeks, how often have you been bothered by the following problems?",
    sample=[2, 1, 2, 1, 0, 1, 0],
    flag_item=None,
    flag_note=None,
)

define(
    "audit-c",
    name="AUDIT-C",
    title="Alcohol Use Disorders Identification Test - Consumption (AUDIT-C)",
    tagline="Alcohol-use screening · 3 items · total score 0–12",
    panel=coding("72109-2", "Alcohol Use Disorder Identification Test - Consumption [AUDIT-C]"),
    copyright="The AUDIT and AUDIT-C were developed by the World Health Organization (WHO) and are in the public domain.",
    score_code=coding("75626-2", "Total score [AUDIT-C]"),
    score_type="integer",
    questions=[
        ("68518-0", "How often do you have a drink containing alcohol?", AUDIT_Q1),
        ("68519-8", "How many standard drinks containing alcohol do you have on a typical day when drinking?", AUDIT_Q2),
        ("68520-6", "How often do you have six or more drinks on one occasion?", AUDIT_Q3),
    ],
    lead=None,
    sample=[1, 0, 0],
    flag_item=None,
    flag_note="Consider a positive screen at ≥4 for men and ≥3 for women (local thresholds vary). A positive screen should route to brief intervention or further assessment.",
)

# PEG-3 — 0-10 numeric items
PEG_SCALE_LEAD = "0 = no pain / does not interfere … 10 = pain as bad as you can imagine / completely interferes"
define(
    "peg-3",
    name="PEG-3",
    title="Pain, Enjoyment of life, General activity (PEG)",
    tagline="Pain impact · 3 numeric items (0–10) · mean score",
    panel=coding("91148-7", "Pain intensity, Enjoyment of life, General activity scale [PEG]"),
    copyright="The PEG is freely available in the public domain (Krebs EE, et al. J Gen Intern Med. 2009). Cite the original validation source when reproduced.",
    score_code=coding("91147-9", "Mean score [PEG]"),
    score_type="decimal",
    questions=[
        ("75893-8", "What number best describes your pain on average in the past week?", None),
        ("91145-3", "What number best describes how, during the past week, pain has interfered with your enjoyment of life?", None),
        ("91146-1", "What number best describes how, during the past week, pain has interfered with your general activity?", None),
    ],
    lead=PEG_SCALE_LEAD,
    numeric=(0, 10),
    sample=[6, 7, 5],
    flag_item=None,
    flag_note="A high or rising mean PEG score over time can prompt re-evaluation of the pain treatment plan.",
)

ESAS_LEAD = "Please rate each symptom right now: 0 = no symptom … 10 = worst possible symptom"
define(
    "esas-r",
    name="ESAS-r",
    title="Edmonton Symptom Assessment System (revised)",
    tagline="Symptom burden · 9 numeric items (0–10) · summary score",
    panel=coding("112503-8", "Edmonton Symptom Assessment System [Edmonton Symptom Assessment System]"),
    copyright="ESAS-r is in the public domain and freely available with acknowledgment (Alberta Health Services / Regional Palliative Care Program). Do not modify the current form or name without permission.",
    score_code=coding("112493-2", "Total score [Edmonton Symptom Assessment System]"),
    score_type="integer",
    questions=[
        ("112494-0", "Pain", None),
        ("112495-7", "Tiredness (lack of energy)", None),
        ("112496-5", "Drowsiness (feeling sleepy)", None),
        ("112497-3", "Nausea", None),
        ("112498-1", "Lack of appetite", None),
        ("112499-9", "Shortness of breath", None),
        ("112500-4", "Depression (feeling sad)", None),
        ("112501-2", "Anxiety (feeling nervous)", None),
        ("112502-0", "Wellbeing (how you feel overall)", None),
    ],
    lead=ESAS_LEAD,
    numeric=(0, 10),
    sample=[4, 7, 3, 2, 5, 5, 3, 4, 4],
    flag_item=None,
    flag_note="Any individual symptom rated severe (e.g. ≥7) is typically flagged for clinician review; ESAS-r is for symptom monitoring, not general intake.",
)


# ---------------------------------------------------------------------------
# Builders
# ---------------------------------------------------------------------------

AUTHORED = "2026-06-09T09:30:00-05:00"


def build_questionnaire(key, inst):
    items = []
    if inst.get("lead"):
        items.append({
            "linkId": "lead",
            "text": inst["lead"],
            "type": "display",
        })
    numeric = inst.get("numeric")
    for code, text, answers in inst["questions"]:
        item = {
            "linkId": code,
            "code": [coding(code, text)],
            "text": text,
        }
        if answers is not None:
            item["type"] = "choice"
            item["answerOption"] = answer_options(answers)
        elif numeric is not None:
            item["type"] = "integer"
            item["extension"] = [
                {"url": "http://hl7.org/fhir/StructureDefinition/minValue", "valueInteger": numeric[0]},
                {"url": "http://hl7.org/fhir/StructureDefinition/maxValue", "valueInteger": numeric[1]},
            ]
        else:
            item["type"] = "integer"
        items.append(item)

    # score item
    items.append({
        "linkId": inst["score_code"]["code"],
        "code": [inst["score_code"]],
        "text": inst["score_code"]["display"],
        "type": inst["score_type"],
        "readOnly": True,
    })

    return {
        "resourceType": "Questionnaire",
        "id": key,
        "url": f"{BASE}/{key}.questionnaire.json",
        "version": "1.0.0",
        "name": inst["name"].replace("-", "_"),
        "title": inst["title"],
        "status": "active",
        "experimental": True,
        "date": "2026-06-09",
        "publisher": "Kill the Clipboard — starter set",
        "subjectType": ["Patient"],
        "code": [inst["panel"]],
        "copyright": inst["copyright"],
        "item": items,
    }


def score_value(key, inst):
    scores = []
    numeric = inst.get("numeric")
    for (code, text, answers), chosen in zip(inst["questions"], inst["sample"]):
        scores.append(chosen)
    total = sum(scores)
    if key == "peg-3":
        return round(total / len(scores), 1)
    return total


def build_response(key, inst):
    answers_items = []
    numeric = inst.get("numeric")
    for (code, text, answers), chosen in zip(inst["questions"], inst["sample"]):
        if answers is not None:
            ac, ad, _ = next(a for a in answers if a[2] == chosen)
            ans = {"valueCoding": coding(ac, ad)}
        else:
            ans = {"valueInteger": chosen}
        answers_items.append({"linkId": code, "text": text, "answer": [ans]})

    sval = score_value(key, inst)
    if inst["score_type"] == "decimal":
        score_answer = {"valueDecimal": sval}
    else:
        score_answer = {"valueInteger": sval}
    answers_items.append({
        "linkId": inst["score_code"]["code"],
        "text": inst["score_code"]["display"],
        "answer": [score_answer],
    })

    return {
        "resourceType": "QuestionnaireResponse",
        "id": f"qr-{key}-example",
        "questionnaire": f"{BASE}/{key}.questionnaire.json|1.0.0",
        "status": "completed",
        "subject": {"reference": "Patient/example", "display": "Example Patient"},
        "authored": AUTHORED,
        "source": {"reference": "Patient/example"},
        "item": answers_items,
    }


def build_observation(key, inst):
    sval = score_value(key, inst)
    return {
        "resourceType": "Observation",
        "id": f"obs-{key}-score-example",
        "status": "final",
        "category": [{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "survey",
                "display": "Survey",
            }],
        }],
        "code": {"coding": [inst["score_code"]]},
        "subject": {"reference": "Patient/example", "display": "Example Patient"},
        "effectiveDateTime": AUTHORED,
        "valueQuantity": {
            "value": sval,
            "unit": "{score}",
            "system": UCUM,
            "code": "{score}",
        },
        "derivedFrom": [{"reference": f"QuestionnaireResponse/qr-{key}-example"}],
    }


def build_bundle(key, q, r, o):
    return {
        "resourceType": "Bundle",
        "id": f"{key}-example",
        "type": "collection",
        "entry": [
            {"fullUrl": f"{BASE}/{key}.questionnaire.json", "resource": q},
            {"fullUrl": f"urn:uuid:qr-{key}", "resource": r},
            {"fullUrl": f"urn:uuid:obs-{key}", "resource": o},
        ],
    }


def write_json(path, obj):
    with open(path, "w") as f:
        json.dump(obj, f, indent=2)
        f.write("\n")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    site_data = {"instruments": []}
    for key, inst in INSTRUMENTS.items():
        q = build_questionnaire(key, inst)
        r = build_response(key, inst)
        o = build_observation(key, inst)
        b = build_bundle(key, q, r, o)
        write_json(os.path.join(OUT_DIR, f"{key}.questionnaire.json"), q)
        write_json(os.path.join(OUT_DIR, f"{key}.response.json"), r)
        write_json(os.path.join(OUT_DIR, f"{key}.observation.json"), o)
        write_json(os.path.join(OUT_DIR, f"{key}.bundle.json"), b)

        item_codes = [c for (c, _t, _a) in inst["questions"]]
        site_data["instruments"].append({
            "key": key,
            "name": inst["name"],
            "title": inst["title"],
            "tagline": inst["tagline"],
            "panel": inst["panel"],
            "scoreCode": inst["score_code"],
            "scoreType": inst["score_type"],
            "itemCodes": item_codes,
            "copyright": inst["copyright"],
            "flagNote": inst.get("flag_note"),
            "sampleScore": score_value(key, inst),
            "questionnaire": q,
            "response": r,
            "observation": o,
        })

    write_json(os.path.join(os.path.dirname(__file__), "data.json"), site_data)
    print(f"Wrote {len(INSTRUMENTS)} instruments × 4 files to {OUT_DIR} and data.json")


if __name__ == "__main__":
    main()
