# Proposal: A starter set of FHIR Questionnaires for “Kill the Clipboard”

## Executive summary

The project should **not** position FHIR Questionnaire as a new way to recreate the medical clipboard. Most clipboard content should be shared from existing clinical data using USCDI / US Core FHIR resources: demographics, medications, allergies, problems, labs, vitals, procedures, encounters, care team, notes, insurance, and existing health-status observations. ONC describes USCDI as the standardized set of data classes and elements for nationwide interoperable health information exchange. ([ONC Health IT][1])

The value of FHIR Questionnaire is different: it is the right tool when the patient needs to provide **current, subjective, scored, episode-specific, or workflow-specific information** that is not already available or reliable in USCDI data. HL7 defines FHIR Questionnaire as a structured set of questions that controls order, phrasing, presentation, and grouping; QuestionnaireResponse communicates the resulting answers. ([HL7][2])

Therefore, the proposed starter set should demonstrate:

> **USCDI first for reusable chart facts. FHIR Questionnaire only when asking the patient is clinically necessary.**

The starter set should include **five standardized, widely recognized, relatively simple instruments** that show the “first steps toward any questionnaire” without implying that these are the only supported forms.

## The distinction we should make

### Do not use Questionnaire for ordinary clipboard facts

A “bad” version of this project would produce a generic intake questionnaire asking for name, date of birth, address, medications, allergies, insurance, problem list, surgeries, family history, and prior encounters. That recreates the clipboard in digital form.

Instead, systems should first retrieve or reconcile those facts from USCDI / US Core FHIR resources. If the chart already knows the medication list, do not ask the patient to retype it. If the chart already has demographics, do not ask again. If prior labs or vitals exist, show them, reconcile them, or use them to prefill.

### Use Questionnaire when the capture event itself matters

FHIR Questionnaire is valuable when the system needs to know:

* exactly what question was asked;
* the exact answer set;
* the score or interpretation method;
* when the patient answered;
* whether the information is fresh enough for the current visit;
* whether the response should trigger a workflow.

US Core already recognizes QuestionnaireResponse for form, survey, and assessment tools, and US Core Observation Screening Assessment can represent survey questions and responses as searchable observations. ([FHIR Build][3])

So the starter library should demonstrate **patient-reported gap capture**, not “clipboard replacement.”

## Proposed starter set

I recommend these five:

| Instrument                       | Why it belongs in the starter set                                                                                                                                                                                                                                                                                               | Why it is not just USCDI clipboard data                                                                                                                                   | Licensing / standards posture                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PHQ-2 / PHQ-9**                | Depression screening is clinically important, widely recognized, short, and easy to score. The PHQ family is among the most widely used or recommended adult depression screening tools reviewed by USPSTF. ([USPSTF][4])                                                                                                       | The current score, the exact instrument, and the date/time of completion matter. If a recent PHQ-9 score already exists, share it as an Observation; otherwise, ask it.   | LOINC panel **44249-1**; PHQ-9 total score **44261-6**. LOINC records Pfizer terms saying no permission is required to reproduce, translate, display, or distribute. ([LOINC][5])                                                                                                                                                                             |
| **GAD-2 / GAD-7**                | Anxiety screening is common, simple, and pairs naturally with PHQ. USPSTF notes that GAD-2 and GAD-7 were the most commonly studied anxiety screening instruments in its evidence review. ([USPSTF][6])                                                                                                                         | Anxiety symptoms are current patient-reported state, not a static chart fact. The exact score can drive follow-up or monitoring.                                          | LOINC panel **69737-5**; GAD-7 total score **70274-6**. LOINC records the same Pfizer “no permission required” terms. ([LOINC][7])                                                                                                                                                                                                                            |
| **AUDIT-C**                      | Three-question alcohol-use screen; simple, clinically important, and useful across primary care, perioperative care, ED, behavioral health, liver/GI, pregnancy-related, and chronic disease workflows. USPSTF identifies AUDIT-C among brief instruments with best accuracy for unhealthy alcohol use in adults. ([USPSTF][8]) | Alcohol use may exist as social-history data, but it is often missing or stale. The questionnaire is useful when a current scored screen is due.                          | LOINC panel **72109-2**; total score **75626-2**. US Core’s AUDIT-C example states that, as a WHO-approved instrument, AUDIT is in the public domain. ([LOINC][9])                                                                                                                                                                                            |
| **PEG-3 Pain Scale**             | Very short pain intensity + function/interference measure. It is a strong example of something that cannot be inferred from the chart: how pain is affecting life this week. CDC’s 2022 opioid guideline names PEG as a tool clinicians can use to follow pain severity, function, and quality of life. ([CDC][10])             | Pain impact and function are current subjective patient-reported outcomes, not ordinary clipboard facts.                                                                  | LOINC panel **91148-7**; mean score **91147-9**. The PEG is described as freely available in the public domain. ([LOINC][11])                                                                                                                                                                                                                                 |
| **ESAS / ESAS-r symptom burden** | Best multi-symptom example for oncology, palliative care, serious illness, post-treatment monitoring, and complex symptom follow-up.                                                                                                                                                                                            | Captures current symptom burden across pain, tiredness, drowsiness, nausea, appetite, dyspnea, depression, anxiety, and wellbeing. This is not chart-demographic sharing. | LOINC now has an ESAS panel **112503-8** with item codes and total score **112493-2**. Alberta Health Services describes ESAS-r as public domain and freely available with acknowledgment; some materials also say the current form/name should not be modified without permission, so implementers should preserve attribution and versioning. ([LOINC][12]) |

LOINC availability does not by itself clear all use rights. LOINC notes that some licensed material includes third-party copyrighted content and that those third-party notices and terms still apply. The implementation should put license/copyright text directly in `Questionnaire.copyright`. ([LOINC][13])

## Why these five demonstrate “first steps toward any questionnaire”

These five are not meant to be a closed catalog. They are a **capability demonstration set**:

| Capability                          | Demonstrated by                                         |
| ----------------------------------- | ------------------------------------------------------- |
| Simple short-form screen            | PHQ-2, GAD-2, AUDIT-C                                   |
| Longer scored instrument            | PHQ-9, GAD-7                                            |
| Shared answer choices and scoring   | PHQ-9, GAD-7                                            |
| Numeric 0–10 patient-reported scale | PEG-3, ESAS-r                                           |
| Average score calculation           | PEG-3                                                   |
| Total score calculation             | PHQ-9, GAD-7, AUDIT-C, ESAS                             |
| Monitoring over time                | PHQ-9, GAD-7, PEG-3, ESAS-r                             |
| Workflow escalation                 | PHQ-9 item 9, high AUDIT-C, severe pain, severe dyspnea |
| Specialty extensibility             | ESAS-r for oncology/palliative/serious illness          |
| Searchable downstream data          | Extracted LOINC-coded Observations                      |

The message to implementers should be:

> These are starter examples. The general capability is “render a FHIR Questionnaire, collect a QuestionnaireResponse, preserve provenance, compute/extract Observations, and route follow-up.” Other local, specialty, or licensed instruments can use the same pattern.

## Implementation rule

For every candidate questionnaire, apply this test:

1. **Can this answer be retrieved as USCDI / US Core data?**
   If yes, retrieve or prefill instead of asking.

2. **Is the existing data fresh enough for this workflow?**
   If yes, reuse it. If no, ask the patient.

3. **Does exact wording, answer set, or scoring matter?**
   If yes, use FHIR Questionnaire and QuestionnaireResponse.

4. **Does the answer need to be searchable or trendable?**
   If yes, extract a LOINC-coded Observation from the QuestionnaireResponse.

5. **Does the answer require action?**
   If yes, create local workflow logic: Task, alert, referral, safety follow-up, or care-team notification.

## Core LOINC codes for the starter library

| Instrument                      | Questionnaire / panel code | Representative item codes                                                                | Score code   |
| ------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------- | ------------ |
| **PHQ-9**                       | **44249-1**                | 44250-9, 44255-8, 44259-0, 44254-1, 44251-7, 44258-2, 44252-5, 44253-3, 44260-8          | **44261-6**  |
| **GAD-7**                       | **69737-5**                | 69725-0, 68509-9, 69733-4, 69734-2, 69735-9, 69689-8, 69736-7                            | **70274-6**  |
| **AUDIT-C**                     | **72109-2**                | 68518-0, 68519-8, 68520-6                                                                | **75626-2**  |
| **PEG-3**                       | **91148-7**                | 75893-8, 91145-3, 91146-1                                                                | **91147-9**  |
| **ESAS / ESAS-r core symptoms** | **112503-8**               | 112494-0, 112495-7, 112496-5, 112497-3, 112498-1, 112499-9, 112500-4, 112501-2, 112502-0 | **112493-2** |

## FHIR resource pattern

A key technical point: in FHIR R4, the **Questionnaire** carries the item codes. The **QuestionnaireResponse** references the Questionnaire and records answers by `linkId`. For score search, reporting, trending, and quality logic, the system should also extract a coded **Observation**.

The basic pattern is:

1. `Questionnaire`
   Canonical form definition, LOINC panel code, item codes, answer options, copyright, version.

2. `QuestionnaireResponse`
   Patient’s answers, author/source, timestamp, link back to Questionnaire.

3. `Observation`
   Searchable score or item result, using LOINC code and `{score}` where appropriate.

Below are abbreviated FHIR R4-style examples. Production resources should include full answer lists, SDC/US Core profiles, scoring logic, versioning, and complete copyright text.

## Example 1: PHQ-9

```json
{
  "questionnaire": {
    "resourceType": "Questionnaire",
    "id": "phq-9",
    "url": "https://example.org/fhir/Questionnaire/phq-9",
    "version": "1.0.0",
    "status": "active",
    "subjectType": ["Patient"],
    "code": [
      {
        "system": "http://loinc.org",
        "code": "44249-1",
        "display": "PHQ-9 quick depression assessment panel [Reported.PHQ]"
      }
    ],
    "copyright": "PHQ-9: Copyright Pfizer Inc.; no permission required to reproduce, translate, display, or distribute. Include full source/license text in production.",
    "item": [
      {
        "linkId": "44250-9",
        "code": [{"system": "http://loinc.org", "code": "44250-9"}],
        "text": "Little interest or pleasure in doing things",
        "type": "choice"
      },
      {
        "linkId": "44255-8",
        "code": [{"system": "http://loinc.org", "code": "44255-8"}],
        "text": "Feeling down, depressed, or hopeless",
        "type": "choice"
      },
      {
        "linkId": "44260-8",
        "code": [{"system": "http://loinc.org", "code": "44260-8"}],
        "text": "Thoughts that you would be better off dead, or of hurting yourself in some way",
        "type": "choice"
      },
      {
        "linkId": "44261-6",
        "code": [{"system": "http://loinc.org", "code": "44261-6"}],
        "text": "PHQ-9 total score",
        "type": "integer",
        "readOnly": true
      }
    ]
  },
  "questionnaireResponse": {
    "resourceType": "QuestionnaireResponse",
    "id": "qr-phq9-example",
    "questionnaire": "https://example.org/fhir/Questionnaire/phq-9|1.0.0",
    "status": "completed",
    "subject": {"reference": "Patient/example"},
    "authored": "2026-06-09T09:30:00-05:00",
    "item": [
      {
        "linkId": "44250-9",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA6569-3",
              "display": "Several days"
            }
          }
        ]
      },
      {
        "linkId": "44255-8",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA6570-1",
              "display": "More than half the days"
            }
          }
        ]
      },
      {
        "linkId": "44261-6",
        "answer": [{"valueInteger": 8}]
      }
    ]
  },
  "extractedScoreObservation": {
    "resourceType": "Observation",
    "id": "obs-phq9-score-example",
    "status": "final",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey",
            "display": "Survey"
          }
        ]
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "44261-6",
          "display": "Patient Health Questionnaire 9 item (PHQ-9) total score [Reported]"
        }
      ]
    },
    "subject": {"reference": "Patient/example"},
    "effectiveDateTime": "2026-06-09T09:30:00-05:00",
    "valueQuantity": {
      "value": 8,
      "unit": "{score}",
      "system": "http://unitsofmeasure.org",
      "code": "{score}"
    },
    "derivedFrom": [{"reference": "QuestionnaireResponse/qr-phq9-example"}]
  }
}
```

Why this matters: PHQ-9 shows a familiar scored instrument, common answer choices, a total score, and an item that may need a local safety workflow. It should be used when a current depression screen is needed, not to re-create historical mental-health data already available in the chart.

## Example 2: GAD-7

```json
{
  "questionnaire": {
    "resourceType": "Questionnaire",
    "id": "gad-7",
    "url": "https://example.org/fhir/Questionnaire/gad-7",
    "version": "1.0.0",
    "status": "active",
    "subjectType": ["Patient"],
    "code": [
      {
        "system": "http://loinc.org",
        "code": "69737-5",
        "display": "Generalized anxiety disorder 7 item (GAD-7)"
      }
    ],
    "copyright": "GAD-7: Copyright Pfizer Inc.; no permission required to reproduce, translate, display, or distribute. Include full source/license text in production.",
    "item": [
      {
        "linkId": "69725-0",
        "code": [{"system": "http://loinc.org", "code": "69725-0"}],
        "text": "Feeling nervous, anxious or on edge",
        "type": "choice"
      },
      {
        "linkId": "68509-9",
        "code": [{"system": "http://loinc.org", "code": "68509-9"}],
        "text": "Not able to stop or control worrying",
        "type": "choice"
      },
      {
        "linkId": "70274-6",
        "code": [{"system": "http://loinc.org", "code": "70274-6"}],
        "text": "GAD-7 total score",
        "type": "integer",
        "readOnly": true
      }
    ]
  },
  "questionnaireResponse": {
    "resourceType": "QuestionnaireResponse",
    "id": "qr-gad7-example",
    "questionnaire": "https://example.org/fhir/Questionnaire/gad-7|1.0.0",
    "status": "completed",
    "subject": {"reference": "Patient/example"},
    "authored": "2026-06-09T09:35:00-05:00",
    "item": [
      {
        "linkId": "69725-0",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA6570-1",
              "display": "More than half the days"
            }
          }
        ]
      },
      {
        "linkId": "68509-9",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA6569-3",
              "display": "Several days"
            }
          }
        ]
      },
      {
        "linkId": "70274-6",
        "answer": [{"valueInteger": 7}]
      }
    ]
  },
  "extractedScoreObservation": {
    "resourceType": "Observation",
    "id": "obs-gad7-score-example",
    "status": "final",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey"
          }
        ]
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "70274-6",
          "display": "Generalized anxiety disorder 7 item (GAD-7) total score [Reported.PHQ]"
        }
      ]
    },
    "subject": {"reference": "Patient/example"},
    "valueQuantity": {
      "value": 7,
      "unit": "{score}",
      "system": "http://unitsofmeasure.org",
      "code": "{score}"
    },
    "derivedFrom": [{"reference": "QuestionnaireResponse/qr-gad7-example"}]
  }
}
```

Why this matters: GAD-7 shows the same general scoring pattern as PHQ-9, making it easy for vendors to support a reusable engine for multi-item Likert instruments.

## Example 3: AUDIT-C

```json
{
  "questionnaire": {
    "resourceType": "Questionnaire",
    "id": "audit-c",
    "url": "https://example.org/fhir/Questionnaire/audit-c",
    "version": "1.0.0",
    "status": "active",
    "subjectType": ["Patient"],
    "code": [
      {
        "system": "http://loinc.org",
        "code": "72109-2",
        "display": "Alcohol Use Disorder Identification Test - Consumption [AUDIT-C]"
      }
    ],
    "copyright": "AUDIT-C: WHO-approved AUDIT is public domain; include LOINC copyright notice and instrument source in production.",
    "item": [
      {
        "linkId": "68518-0",
        "code": [{"system": "http://loinc.org", "code": "68518-0"}],
        "text": "How often do you have a drink containing alcohol?",
        "type": "choice"
      },
      {
        "linkId": "68519-8",
        "code": [{"system": "http://loinc.org", "code": "68519-8"}],
        "text": "How many standard drinks containing alcohol do you have on a typical day?",
        "type": "choice"
      },
      {
        "linkId": "68520-6",
        "code": [{"system": "http://loinc.org", "code": "68520-6"}],
        "text": "How often do you have 6 or more drinks on one occasion?",
        "type": "choice"
      },
      {
        "linkId": "75626-2",
        "code": [{"system": "http://loinc.org", "code": "75626-2"}],
        "text": "AUDIT-C total score",
        "type": "integer",
        "readOnly": true
      }
    ]
  },
  "questionnaireResponse": {
    "resourceType": "QuestionnaireResponse",
    "id": "qr-auditc-example",
    "questionnaire": "https://example.org/fhir/Questionnaire/audit-c|1.0.0",
    "status": "completed",
    "subject": {"reference": "Patient/example"},
    "authored": "2026-06-09T09:40:00-05:00",
    "item": [
      {
        "linkId": "68518-0",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA18926-8",
              "display": "Monthly or less"
            }
          }
        ]
      },
      {
        "linkId": "68519-8",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA15694-5",
              "display": "1 or 2"
            }
          }
        ]
      },
      {
        "linkId": "68520-6",
        "answer": [
          {
            "valueCoding": {
              "system": "http://loinc.org",
              "code": "LA6270-8",
              "display": "Never"
            }
          }
        ]
      },
      {
        "linkId": "75626-2",
        "answer": [{"valueInteger": 1}]
      }
    ]
  },
  "extractedScoreObservation": {
    "resourceType": "Observation",
    "id": "obs-auditc-score-example",
    "status": "final",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey"
          }
        ]
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "75626-2",
          "display": "Total score [AUDIT-C]"
        }
      ]
    },
    "subject": {"reference": "Patient/example"},
    "valueQuantity": {
      "value": 1,
      "unit": "{score}",
      "system": "http://unitsofmeasure.org",
      "code": "{score}"
    },
    "derivedFrom": [{"reference": "QuestionnaireResponse/qr-auditc-example"}]
  }
}
```

Why this matters: AUDIT-C is short, clinically useful, and shows how a questionnaire can collect a structured risk screen when social-history data is missing, stale, or due for reassessment.

## Example 4: PEG-3 Pain Scale

```json
{
  "questionnaire": {
    "resourceType": "Questionnaire",
    "id": "peg-3",
    "url": "https://example.org/fhir/Questionnaire/peg-3",
    "version": "1.0.0",
    "status": "active",
    "subjectType": ["Patient"],
    "code": [
      {
        "system": "http://loinc.org",
        "code": "91148-7",
        "display": "Pain intensity, Enjoyment of life, General activity scale [PEG]"
      }
    ],
    "copyright": "PEG is freely available in the public domain; cite the original validation source and include LOINC copyright notice in production.",
    "item": [
      {
        "linkId": "75893-8",
        "code": [{"system": "http://loinc.org", "code": "75893-8"}],
        "text": "Pain severity in the past week",
        "type": "integer"
      },
      {
        "linkId": "91145-3",
        "code": [{"system": "http://loinc.org", "code": "91145-3"}],
        "text": "Pain interference with enjoyment of life",
        "type": "integer"
      },
      {
        "linkId": "91146-1",
        "code": [{"system": "http://loinc.org", "code": "91146-1"}],
        "text": "Pain interference with general activity",
        "type": "integer"
      },
      {
        "linkId": "91147-9",
        "code": [{"system": "http://loinc.org", "code": "91147-9"}],
        "text": "Mean score [PEG]",
        "type": "decimal",
        "readOnly": true
      }
    ]
  },
  "questionnaireResponse": {
    "resourceType": "QuestionnaireResponse",
    "id": "qr-peg3-example",
    "questionnaire": "https://example.org/fhir/Questionnaire/peg-3|1.0.0",
    "status": "completed",
    "subject": {"reference": "Patient/example"},
    "authored": "2026-06-09T09:45:00-05:00",
    "item": [
      {
        "linkId": "75893-8",
        "answer": [{"valueInteger": 6}]
      },
      {
        "linkId": "91145-3",
        "answer": [{"valueInteger": 7}]
      },
      {
        "linkId": "91146-1",
        "answer": [{"valueInteger": 5}]
      },
      {
        "linkId": "91147-9",
        "answer": [{"valueDecimal": 6.0}]
      }
    ]
  },
  "extractedScoreObservation": {
    "resourceType": "Observation",
    "id": "obs-peg-score-example",
    "status": "final",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey"
          }
        ]
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "91147-9",
          "display": "Mean score [PEG]"
        }
      ]
    },
    "subject": {"reference": "Patient/example"},
    "valueQuantity": {
      "value": 6.0,
      "unit": "{score}",
      "system": "http://unitsofmeasure.org",
      "code": "{score}"
    },
    "derivedFrom": [{"reference": "QuestionnaireResponse/qr-peg3-example"}]
  }
}
```

Why this matters: PEG-3 is probably the cleanest example of “Questionnaire where USCDI is not enough.” A medication list or problem list may show chronic pain, but it does not tell the clinician how pain affected enjoyment of life and general activity this week.

## Example 5: ESAS / ESAS-r symptom burden

```json
{
  "questionnaire": {
    "resourceType": "Questionnaire",
    "id": "esas-r",
    "url": "https://example.org/fhir/Questionnaire/esas-r",
    "version": "1.0.0",
    "status": "active",
    "subjectType": ["Patient"],
    "code": [
      {
        "system": "http://loinc.org",
        "code": "112503-8",
        "display": "Edmonton Symptom Assessment System [Edmonton Symptom Assessment System]"
      }
    ],
    "copyright": "ESAS-r is public domain and freely available with acknowledgment; preserve source, version, and form/name restrictions in production.",
    "item": [
      {
        "linkId": "112494-0",
        "code": [{"system": "http://loinc.org", "code": "112494-0"}],
        "text": "Pain",
        "type": "integer"
      },
      {
        "linkId": "112495-7",
        "code": [{"system": "http://loinc.org", "code": "112495-7"}],
        "text": "Tiredness",
        "type": "integer"
      },
      {
        "linkId": "112497-3",
        "code": [{"system": "http://loinc.org", "code": "112497-3"}],
        "text": "Nausea",
        "type": "integer"
      },
      {
        "linkId": "112499-9",
        "code": [{"system": "http://loinc.org", "code": "112499-9"}],
        "text": "Shortness of breath",
        "type": "integer"
      },
      {
        "linkId": "112493-2",
        "code": [{"system": "http://loinc.org", "code": "112493-2"}],
        "text": "Total score [Edmonton Symptom Assessment System]",
        "type": "integer",
        "readOnly": true
      }
    ]
  },
  "questionnaireResponse": {
    "resourceType": "QuestionnaireResponse",
    "id": "qr-esas-example",
    "questionnaire": "https://example.org/fhir/Questionnaire/esas-r|1.0.0",
    "status": "completed",
    "subject": {"reference": "Patient/example"},
    "authored": "2026-06-09T09:50:00-05:00",
    "item": [
      {
        "linkId": "112494-0",
        "answer": [{"valueInteger": 4}]
      },
      {
        "linkId": "112495-7",
        "answer": [{"valueInteger": 7}]
      },
      {
        "linkId": "112497-3",
        "answer": [{"valueInteger": 2}]
      },
      {
        "linkId": "112499-9",
        "answer": [{"valueInteger": 5}]
      },
      {
        "linkId": "112493-2",
        "answer": [{"valueInteger": 37}]
      }
    ]
  },
  "extractedScoreObservation": {
    "resourceType": "Observation",
    "id": "obs-esas-score-example",
    "status": "final",
    "category": [
      {
        "coding": [
          {
            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "survey"
          }
        ]
      }
    ],
    "code": {
      "coding": [
        {
          "system": "http://loinc.org",
          "code": "112493-2",
          "display": "Total score [Edmonton Symptom Assessment System]"
        }
      ]
    },
    "subject": {"reference": "Patient/example"},
    "valueQuantity": {
      "value": 37,
      "unit": "{score}",
      "system": "http://unitsofmeasure.org",
      "code": "{score}"
    },
    "derivedFrom": [{"reference": "QuestionnaireResponse/qr-esas-example"}]
  }
}
```

Why this matters: ESAS-r demonstrates a multi-symptom patient-reported outcome form. It is not for general intake; it is for serious illness, oncology, palliative care, post-treatment monitoring, or symptom-management workflows where current symptom burden is the point.

## Proposed product language

> We will provide a small, standards-based starter library of FHIR Questionnaires for high-value patient-reported information that is not reliably available as USCDI chart data. The library is not a replacement for USCDI exchange and is not a closed catalog. Implementers should retrieve USCDI/US Core data first, prefill or reconcile where possible, and use Questionnaire only when current patient input, exact instrument wording, scoring, or workflow routing is required.

## Governance guardrails

1. **No re-asking USCDI facts by default.**
   If the information is already available as Patient, AllergyIntolerance, Medication, Condition, Observation, Procedure, Encounter, Coverage, DocumentReference, or related US Core data, retrieve it first.

2. **Use “due/missing/stale” logic.**
   A PHQ-9, GAD-7, AUDIT-C, PEG, or ESAS-r should be asked only when clinically due, missing, stale, or needed for the current episode.

3. **Preserve the raw QuestionnaireResponse.**
   This maintains provenance: exact form, exact wording, exact answer, respondent, and timestamp.

4. **Extract only useful Observations.**
   At minimum, extract the score Observation. Extract individual item Observations only when needed for search, quality, CDS, reporting, or longitudinal display.

5. **Represent licensing explicitly.**
   Each Questionnaire should include `copyright`, `publisher`, `version`, `source`, and “do not modify” notes where applicable.

6. **Keep clinical escalation local but required where relevant.**
   PHQ-9 item 9, severe dyspnea, severe pain, or high alcohol-risk screens should not simply disappear into a data store. The starter examples should state that implementers need local routing rules.

## Bottom line

This starter set gives us a concrete way to say:

> “We are not standardizing the clipboard. We are standardizing the ability to ask necessary, patient-reported, scored, current questions when USCDI data is not enough.”

The five examples are simple enough for broad implementation, important enough to be credible, and diverse enough to prove the general capability: **any appropriately licensed or locally authored instrument can be represented as a FHIR Questionnaire, answered as a QuestionnaireResponse, and extracted into coded Observations where needed.**

[1]: https://healthit.gov/standards-and-technology/onc-standards-bulletin/onc-standards-bulletin-2026-1/?utm_source=chatgpt.com "ONC Standards Bulletin 2026-1"
[2]: https://hl7.org/fhir/R4/questionnaire.html "Questionnaire - FHIR v4.0.1"
[3]: https://build.fhir.org/ig/HL7/US-Core/StructureDefinition-us-core-questionnaireresponse.html?utm_source=chatgpt.com "Resource Profile: US Core QuestionnaireResponse Profile"
[4]: https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults?utm_source=chatgpt.com "Depression and Suicide Risk in Adults: Screening"
[5]: https://loinc.org/44249-1?utm_source=chatgpt.com "LOINC 44249-1 PHQ-9 quick depression assessment ..."
[6]: https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/anxiety-adults-screening?utm_source=chatgpt.com "Recommendation: Anxiety Disorders in Adults: Screening"
[7]: https://loinc.org/69737-5/panel "LOINC Panel Details 69737-5 Generalized anxiety disorder 7 item (GAD-7)"
[8]: https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/unhealthy-alcohol-use-in-adolescents-and-adults-screening-and-behavioral-counseling-interventions?utm_source=chatgpt.com "Unhealthy Alcohol Use in Adolescents and Adults ..."
[9]: https://loinc.org/72109-2/panel "LOINC Panel Details 72109-2 Alcohol Use Disorder Identification Test - Consumption [AUDIT-C]"
[10]: https://www.cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm "CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022  | MMWR"
[11]: https://loinc.org/91148-7 "LOINC 91148-7 Pain intensity, Enjoyment of life, General activity scale [PEG]"
[12]: https://loinc.org/112503-8 "LOINC 112503-8 Edmonton Symptom Assessment System [Edmonton Symptom Assessment System]"
[13]: https://loinc.org/kb/license/?utm_source=chatgpt.com "Copyright Notice and License"

