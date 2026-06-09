#!/usr/bin/env python3
"""Verify the codes/displays/answers used by generate.py against the LOINC 2.82 distribution."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import generate as G

LOINC_DIR = os.path.expanduser("~/work/tx/Loinc_2.82")
LOINC_CSV = os.path.join(LOINC_DIR, "LoincTable", "Loinc.csv")
ANSWER_CSV = os.path.join(LOINC_DIR, "AccessoryFiles", "AnswerFile", "AnswerList.csv")

# --- load loinc terms ---
terms = {}
with open(LOINC_CSV, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        terms[row["LOINC_NUM"]] = (row["LONG_COMMON_NAME"], row["STATUS"], row["SHORTNAME"])

# --- load answer strings: code -> set of display texts ---
ans = {}
with open(ANSWER_CSV, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        code = row["AnswerStringId"]
        if code:
            ans.setdefault(code, set()).add(row["DisplayText"])

problems, oks = [], 0

def check_code(code, used_display, kind):
    global oks
    if code not in terms:
        problems.append(f"[{kind}] {code} NOT FOUND in LOINC")
        return
    lcn, status, short = terms[code]
    flag = "" if status == "ACTIVE" else f"  (STATUS={status})"
    if status != "ACTIVE":
        problems.append(f"[{kind}] {code} status={status} — {lcn}")
    oks += 1
    print(f"  {code:12} {kind:8} LOINC: {lcn}{flag}")
    if used_display:
        print(f"  {'':12} {'used':8} ours : {used_display}")

def check_answer(code, used_display):
    global oks
    if code not in ans:
        problems.append(f"[answer] {code} NOT FOUND in AnswerList")
        return
    oks += 1
    if used_display not in ans[code]:
        problems.append(f"[answer] {code} display mismatch: ours='{used_display}' loinc={sorted(ans[code])}")

for key, inst in G.INSTRUMENTS.items():
    print(f"\n=== {inst['name']}  (panel {inst['panel']['code']}) ===")
    check_code(inst["panel"]["code"], inst["panel"]["display"], "panel")
    for code, text, answers in inst["questions"]:
        check_code(code, text, "item")
        for a in (answers or []):
            check_answer(a[0], a[1])
    check_code(inst["score_code"]["code"], inst["score_code"]["display"], "score")

print("\n" + "="*60)
print(f"Checked {oks} codes/answers.")
if problems:
    print(f"\n{len(problems)} ISSUE(S):")
    for p in problems:
        print("  - " + p)
    sys.exit(1)
else:
    print("All codes ACTIVE and all answer displays match LOINC. ✓")
