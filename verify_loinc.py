#!/usr/bin/env python3
"""
Validate the redistributed LOINC Questionnaires and the generated responses against
the local LOINC 2.82 distribution:

  * every panel / item / answer-option / score code is ACTIVE in LOINC,
  * every answer-option display matches LOINC's AnswerList text,
  * each example response references LOINC's canonical url and only uses linkIds that
    exist in the official Questionnaire,
  * every scored choice item carries SDC ordinalValue weights on all its answer options,
  * the recomputed score (ordinalValue weights; sum or mean) matches the response's score item.

Run:  python3 verify_loinc.py
"""
import csv, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import generate as G

LOINC_DIR = os.path.expanduser("~/work/tx/Loinc_2.82")
terms, ans = {}, {}
with open(os.path.join(LOINC_DIR, "LoincTable", "Loinc.csv"), newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        terms[row["LOINC_NUM"]] = (row["LONG_COMMON_NAME"], row["STATUS"])
with open(os.path.join(LOINC_DIR, "AccessoryFiles", "AnswerFile", "AnswerList.csv"), newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        c = row["AnswerStringId"]
        if c:
            ans.setdefault(c, set()).add(row["DisplayText"])

problems, checked = [], 0


def code_active(code, kind):
    global checked
    checked += 1
    if code not in terms:
        problems.append(f"[{kind}] {code} not found in LOINC")
    elif terms[code][1] != "ACTIVE":
        problems.append(f"[{kind}] {code} status={terms[code][1]}")


def answer_ok(code, display):
    global checked
    checked += 1
    if code not in ans:
        problems.append(f"[answer] {code} not in AnswerList")
    elif display not in ans[code]:
        problems.append(f"[answer] {code} display '{display}' not in {sorted(ans[code])}")


for panel, cfg in G.CONFIG.items():
    q = G.decorate(G.load_q(panel), cfg)
    print(f"\n=== {cfg['name']}  panel {panel}  url {q['url']} ===")
    code_active(panel, "panel")
    code_active(cfg["score_code"]["code"], "score")
    by = {it["linkId"]: it for it in q["item"]}
    for it in q["item"]:
        c = (it.get("code") or [{}])[0].get("code")
        if c:
            code_active(c, "item")
        for o in it.get("answerOption", []):
            vc = o["valueCoding"]
            answer_ok(vc["code"], vc["display"])

    # every scored choice item must carry a weight on every answer option
    for lid in cfg["scored"]:
        it = by[lid]
        if it["type"] != "choice":
            continue
        for i, o in enumerate(it.get("answerOption", [])):
            if not any(e.get("url") == G.ORDINAL_EXT for e in o.get("extension", [])):
                problems.append(f"[{cfg['key']}] item {lid} option {i} missing ordinalValue")

    # response integrity
    r = G.build_response(cfg, q)
    if r["questionnaire"] != q["url"]:
        problems.append(f"[{cfg['key']}] response questionnaire {r['questionnaire']} != {q['url']}")
    for entry in r["item"]:
        if entry["linkId"] not in by:
            problems.append(f"[{cfg['key']}] response linkId {entry['linkId']} not in questionnaire")
    recomputed = G.compute_score(cfg, q)
    score_item = next(e for e in r["item"] if e["linkId"] == cfg["score_link"])
    got = score_item["answer"][0]["valueDecimal"]
    if got != recomputed:
        problems.append(f"[{cfg['key']}] score item {got} != recomputed {recomputed}")
    print(f"  items ok · score={recomputed} ({cfg['aggregate']}) · linkIds match")

print("\n" + "=" * 60)
print(f"Checked {checked} codes/answers across {len(G.CONFIG)} instruments.")
if problems:
    print(f"\n{len(problems)} ISSUE(S):")
    for p in problems:
        print("  - " + p)
    sys.exit(1)
print("All codes ACTIVE, answer displays match, responses consistent. ✓")
