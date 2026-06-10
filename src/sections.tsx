import { DATA } from "./data";
import { useStore } from "./store";

const GH = "https://github.com/jmandel/ktc-questionnaire-starters";

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top">
          <span className="dot">✚</span>
          <span className="bt-long">KTC&nbsp;Questionnaire&nbsp;Starters</span>
          <span className="bt-short">KTC&nbsp;Starters</span>
        </a>
        <nav className="nav-links">
          <a href="#model">The model</a>
          <a href="#boundary">Boundary</a>
          <a href="#methodology">How we choose</a>
          <a href="#set">The five</a>
          <a href="#explore">Explore</a>
          <a href="#codes">LOINC</a>
          <a className="ghub" href={GH}>
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" style={{ borderTop: "none" }}>
      <div className="wrap">
        <span className="eyebrow">Kill the Clipboard · FHIR Questionnaire</span>
        <h1>Patient questionnaires for what the chart doesn't already have.</h1>
        <p className="lede">
          Kill the Clipboard starts by letting patients <b>share what the chart should already
          know</b> — meds, allergies, problems, immunizations — over a SMART&nbsp;Health&nbsp;Link.
          This is a small, standards-based set of FHIR&nbsp;R4 Questionnaires for{" "}
          <em>the residual</em>: the patient-reported, scored, visit-specific answers no EHR holds.
          Worked QuestionnaireResponse and LOINC-coded Observation examples included — try them
          live.
        </p>
        <div className="thesis">
          Share what the chart should already have first. Only use a questionnaire when the answer
          is something no EHR has — <b>how the patient feels right now, a score, or something
          specific to today's visit</b> — not to re-collect what a SMART&nbsp;Health&nbsp;Link
          already delivered.
        </div>
        <div className="cta">
          <a className="btn btn-primary" href="#explore">
            Try a live instrument →
          </a>
          <a className="btn btn-ghost" href="#set">
            See the five
          </a>
        </div>
        <div className="badges">
          <span className="badge">
            <b>5</b> instruments
          </span>
          <span className="badge">
            <b>FHIR R4</b> Questionnaire · Response · Observation
          </span>
          <span className="badge">
            <b>LOINC</b>-coded panels &amp; scores
          </span>
          <span className="badge">Public-domain / no-permission terms</span>
        </div>
      </div>
    </section>
  );
}

export function Model() {
  return (
    <section id="model">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Where this fits</div>
          <h2>How questionnaires fit into Kill the Clipboard</h2>
          <p>
            Kill the Clipboard makes progress in stages. The patient shares their structured data
            first. Questionnaires only cover the part no EHR can hand over.
          </p>
        </div>
        <div className="stages">
          <div className="stage">
            <div className="sn">
              <span className="b">1</span>
              <span className="verb">Share</span>
            </div>
            <p>
              The patient presents a <b>SMART Health Link</b> (a QR at check-in, or a link pasted
              ahead of time) — an encrypted FHIR Bundle of their data. No portal login.
            </p>
            <div className="tagm">
              <span>Patient app → QR</span>
            </div>
          </div>
          <div className="stage">
            <div className="sn">
              <span className="b">2</span>
              <span className="verb">Persist</span>
            </div>
            <p>
              The EHR files the structured data to the chart, labeled patient-shared: today{" "}
              <b>PAMI</b> (problems, allergies, meds, immunizations), growing toward full
              US&nbsp;Core — plus any PDFs.
            </p>
            <div className="tagm">
              <span>US Core in the chart</span>
            </div>
          </div>
          <div className="stage">
            <div className="sn">
              <span className="b">3</span>
              <span className="verb">What's covered</span>
            </div>
            <p>
              A lot of the clipboard is now in the chart — meds, allergies, problems, immunizations,
              insurance, and the patient's own narrative. The clinic shouldn't ask for it again.
            </p>
            <div className="tagm">
              <span>Most of the clipboard</span>
            </div>
          </div>
          <div className="stage last">
            <div className="sn">
              <span className="b">4</span>
              <span className="verb">What's left</span>
            </div>
            <p>
              What's left is how the patient feels right now, a screening score, how pain affects
              their week — things no EHR holds. That's what a questionnaire is for.
            </p>
            <div className="tagm">
              <span>The five live here ↓</span>
            </div>
          </div>
        </div>

        <div className="milestones">
          <div className="ms">
            <div className="when">Apr 2026</div>
            <div className="what">
              Patient-shared <b>PDFs</b> retained in the chart
            </div>
          </div>
          <div className="ms">
            <div className="when">Jul 2026</div>
            <div className="what">
              Structured <b>PAMI</b> FHIR persisted
            </div>
          </div>
          <div className="ms now">
            <div className="when">Next</div>
            <div className="what">
              A <b>check-in protocol</b> — the clinic asks; the patient answers
            </div>
          </div>
        </div>

        <div className="modelnote">
          <h3>What comes next: the clinic asks, your app answers</h3>
          <p>
            The piece that finishes the job is a check-in protocol: the clinic asks for specific
            things, and the patient's app answers with a FHIR bundle — USCDI records,
            patient-authored PDFs, and eventually{" "}
            <b>QuestionnaireResponses, including for forms the clinic wrote itself</b>. The patient
            reviews and approves before anything is sent, and each requested item goes back marked
            with how it was answered:
          </p>
          <div className="statuspills">
            <span className="sp-f">✓ fulfilled — here's what you asked for</span>
            <span className="sp-p">◐ partial — some of it</span>
            <span className="sp-d">— declined — the patient said no</span>
          </div>
          <p style={{ marginTop: 14 }}>
            The moment a clinic can ask for a questionnaire, someone has to render it, score it,
            pull the answers back out, and route any follow-up. These five are a small place to
            start on that.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Boundary() {
  return (
    <section id="boundary" className="alt">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">A simple rule of thumb</div>
          <h2>What to share, and what to ask</h2>
          <p>
            Most of what's on an intake clipboard already lives in the chart as structured
            US&nbsp;Core data. The clinic should pull that in, not ask for it again. Save the
            questionnaire for the things that only the patient can tell you today.
          </p>
        </div>
        <div className="boundary">
          <div className="bcard no">
            <h3>
              <span className="tag no">Don't ask</span> Retrieve from USCDI / US&nbsp;Core
            </h3>
            <p>
              If the chart already knows it, prefill or reconcile — never make the patient retype
              it.
            </p>
            <div className="chips">
              {[
                "Demographics",
                "Medications",
                "Allergies",
                "Problems",
                "Labs",
                "Vitals",
                "Procedures",
                "Encounters",
                "Coverage",
                "Care team",
                "Notes",
                "Health-status observations",
              ].map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="bcard yes">
            <h3>
              <span className="tag yes">Do ask</span> Capture as a Questionnaire
            </h3>
            <p>Use a Questionnaire when the system must know, with provenance:</p>
            <ul>
              <li>
                exactly <b>what question</b> was asked, and the exact <b>answer set</b>;
              </li>
              <li>
                the <b>score</b> or interpretation method;
              </li>
              <li>
                <b>when</b> the patient answered — and whether it's fresh enough for this visit;
              </li>
              <li>
                whether the response should <b>trigger a workflow</b> (referral, safety follow-up,
                alert).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DecisionFlow() {
  return (
    <section id="rule">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">The decision</div>
          <h2>When to ask — and what comes back</h2>
          <p>
            It isn't a checklist. There's one real decision — ask the patient, or don't. When you
            do ask, you ask with a FHIR Questionnaire — standardized or homegrown — and the answer
            comes back as two artifacts that do different jobs.
          </p>
        </div>
        <div className="decide">
          <div className="dnode gate">
            <div className="dh">Is it already in the chart, and fresh enough?</div>
            <div className="dsub">
              USCDI / US&nbsp;Core — Patient, Medication, AllergyIntolerance, Condition,
              Observation, Procedure, Encounter, Coverage…
            </div>
            <div className="branches">
              <div className="branch">
                <span className="bt ok">Yes · fresh</span> Prefill or reconcile from the chart.
                Don't ask.
              </div>
              <div className="branch ask">
                <span className="bt go">Missing · stale · due</span> Ask the patient ↓
              </div>
            </div>
          </div>
          <div className="dconn"></div>
          <div className="dnode ask-node">
            <div className="dh">Ask with a FHIR Questionnaire</div>
            <div className="dsub">
              Standardized or homegrown, it's the same pipeline: publish the form, render it,
              collect a response, reconcile it into the record.
            </div>
            <div className="branches">
              <div className="branch ask">
                <span className="bt go">Validated instrument</span> Exact wording, answer set, and
                scoring matter — use the published form verbatim. The five below start here.
              </div>
              <div className="branch">
                <span className="bt ok">Local question</span> Author your own Questionnaire — a
                clinic's own form travels the same rails.
              </div>
            </div>
          </div>
          <div className="dconn">either way</div>
          <div className="dsplit">
            <div className="acard">
              <div className="rt">QuestionnaireResponse</div>
              <h4>The stable, app-submitted surface</h4>
              <p>
                Exactly what was asked and answered — verbatim, with provenance (who, when). LOINC
                models the score as an item on the form, so the app fills it in like any other
                answer.
              </p>
            </div>
            <div className="derive">
              <span>EHR extracts</span>
              <span className="ar">→</span>
            </div>
            <div className="acard obs">
              <div className="rt">Observation</div>
              <h4>The EHR-extracted, fileable artifact</h4>
              <p>
                The EHR re-checks the math and files the LOINC-coded score as an Observation —
                searchable and trendable, ready for dashboards, quality measures, and CDS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Methodology() {
  return (
    <section id="methodology" className="alt">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">How we choose</div>
          <h2>How we pick the first few</h2>
          <p>
            The destination is any form a clinic can publish in FHIR — including the one Dr. Smith
            dreamed up last night. Getting there means everyone building the same pipeline: render
            the form, score it, pull the answers back out, reconcile them into the record, route
            follow-up. So we start where alignment is easy: a few instruments that are free of
            licensing problems, obviously useful, and that everyone agrees should be doable. Here's
            what we look for; the five below fit so far.
          </p>
        </div>
        <div className="filters">
          <div className="filter">
            <h4>
              <span className="ck">✓</span> It isn't already USCDI data
            </h4>
            <p>
              If it's a USCDI element, an app can fetch and share it over a SMART Health Link — no
              work for the patient, and the EHR gets it in a shape it already knows. A questionnaire
              is for what USCDI doesn't carry.
            </p>
          </div>
          <div className="filter">
            <h4>
              <span className="ck">✓</span> Clinics already use it
            </h4>
            <p>
              Familiar to clinicians and backed by guidance from USPSTF, CMS, or CDC — not a niche
              tool.
            </p>
          </div>
          <div className="filter">
            <h4>
              <span className="ck">✓</span> Scoring is simple
            </h4>
            <p>A sum or an average. Easy to compute, save as an Observation, and track over time.</p>
          </div>
          <div className="filter">
            <h4>
              <span className="ck">✓</span> No licensing in the way
            </h4>
            <p>
              Public domain, or terms that say no permission is needed — so it's safe to show and
              pass along.
            </p>
          </div>
          <div className="filter">
            <h4>
              <span className="ck">✓</span> It has LOINC codes
            </h4>
            <p>
              The panel, the questions, the answers, and the score all have LOINC codes, so the
              responses travel between systems. (Every code here is checked against the LOINC 2.82
              release.)
            </p>
          </div>
          <div className="filter">
            <h4>
              <span className="ck">✓</span> It shows something new
            </h4>
            <p>
              Between them they cover the range: a short screen, a longer one, a 0–10 scale, a total
              and an average, many symptoms at once, and a result that needs follow-up.
            </p>
          </div>
        </div>
        <p className="deferred">
          This isn't a closed list — it's the on-ramp. The same approach works for any questionnaire
          a clinic licenses or writes itself. We've left some heavier ones out for now — like C-SSRS
          or PCL-5, which bring in safety routing or a narrower use — and they can follow the same
          path later.
        </p>
      </div>
    </section>
  );
}

export function Cards() {
  const setCurrent = useStore((s) => s.setCurrent);
  return (
    <section id="set">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">The starter set</div>
          <h2>The five we're starting with</h2>
          <p>
            Each one is familiar in U.S. practice and simple to score. Between them they show the
            whole pattern: show a Questionnaire, collect a Response, keep the record of what was
            asked, pull out an Observation, and route any follow-up.
          </p>
        </div>
        <div className="cards">
          {DATA.instruments.map((inst) => (
            <div key={inst.key} className="icard">
              <div className="top">
                <span className="abbr">{inst.name}</span>
                <a className="loinc" href={inst.loincTerm} target="_blank" rel="noopener">
                  panel {inst.panel.code} ↗
                </a>
              </div>
              <div className="full">{inst.title}</div>
              <div className="why">{inst.why}</div>
              <div className="foot">
                <span className={`pill ${inst.lic.includes("Public") ? "pub" : "terms"}`}>
                  {inst.lic}
                </span>
                <a className="try" href="#explore" onClick={() => setCurrent(inst.key)}>
                  Try it →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilityMatrix() {
  const rows: [string, string][] = [
    ["Simple short-form screen", "AUDIT-C (PHQ-2 / GAD-2 are the first two items of PHQ-9 / GAD-7)"],
    ["Longer scored instrument", "PHQ-9, GAD-7"],
    ["Shared answer choices & ordinal scoring", "PHQ-9, GAD-7"],
    ["Numeric 0–10 patient-reported scale", "PEG-3, ESAS-r"],
    ["Average (mean) score calculation", "PEG-3"],
    ["Total score calculation", "PHQ-9, GAD-7, AUDIT-C, ESAS-r"],
    ["Monitoring over time", "PHQ-9, GAD-7, PEG-3, ESAS-r"],
    ["Workflow escalation", "PHQ-9 item 9, high AUDIT-C, severe pain, severe dyspnea"],
    ["Specialty extensibility", "ESAS-r (oncology / palliative / serious illness)"],
    ["Searchable downstream data", "Extracted LOINC-coded Observations"],
  ];
  return (
    <section className="alt">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">At a glance</div>
          <h2>What each one shows</h2>
        </div>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Demonstrated by</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([cap, by]) => (
                <tr key={cap}>
                  <td>{cap}</td>
                  <td>{by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ExplorerNote() {
  return (
    <p className="note">
      These are LOINC's <b>official</b> FHIR Questionnaires (from{" "}
      <a href="https://fhir.loinc.org/Questionnaire/">fhir.loinc.org</a>) — real LOINC{" "}
      <code>linkId</code>s and answer codes — decorated with the SDC <code>ordinalValue</code>{" "}
      extension so every scored answer option carries its weight in-band. Scores are computed in the
      browser from those weights; PEG reports the <b>mean</b>, the others a <b>total</b>. PHQ-9's
      difficulty item carries no weights and isn't summed. The{" "}
      <span className="mono">QuestionnaireResponse</span> fills the form's own score item and
      references LOINC's canonical <code>{"http://loinc.org/q/<panel>"}</code>; the{" "}
      <span className="mono">Observation</span> is what an EHR would extract from it.
    </p>
  );
}

export function Pattern() {
  return (
    <section className="alt">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">The FHIR pattern</div>
          <h2>The three FHIR resources</h2>
          <p>
            In FHIR&nbsp;R4 the <b>Questionnaire</b> carries the item codes; the{" "}
            <b>QuestionnaireResponse</b> records the answers by <code>linkId</code>; and an
            extracted <b>Observation</b> makes the score easy to find and track.
          </p>
        </div>
        <div className="pattern">
          <div className="pnode">
            <div className="rt">Questionnaire</div>
            <h4>The form definition</h4>
            <p>
              LOINC's official form: canonical <code>{"http://loinc.org/q/<panel>"}</code>, panel
              code, item codes, answer options with SDC <code>ordinalValue</code> weights, and
              copyright.
            </p>
          </div>
          <div className="arrow">→</div>
          <div className="pnode">
            <div className="rt">QuestionnaireResponse</div>
            <h4>The patient's answers</h4>
            <p>
              Answers by <code>linkId</code> — including the form's own score item — author /
              source, <code>authored</code> timestamp, link back to the Questionnaire. The raw
              provenance record.
            </p>
          </div>
          <div className="arrow">→</div>
          <div className="pnode">
            <div className="rt">Observation</div>
            <h4>The searchable score</h4>
            <p>
              Extracted by the EHR from the response: <code>category=survey</code>, LOINC score
              code, <code>valueQuantity</code> in <code>{"{score}"}</code>, <code>derivedFrom</code>{" "}
              the response.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Codes() {
  return (
    <section id="codes">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Reference</div>
          <h2>Core LOINC codes for the starter library</h2>
          <p>
            These starters <b>are</b> LOINC's official FHIR Questionnaires, published at{" "}
            <a href="https://fhir.loinc.org/Questionnaire/">fhir.loinc.org</a> by Regenstrief and
            redistributed here under the LOINC license. We add one thing: SDC{" "}
            <code>ordinalValue</code> weights (<code>itemWeight</code> in R5) on the scored answer
            options, so the scoring convention travels with the form instead of living in
            out-of-band code. Note Regenstrief publishes these with <code>status:&nbsp;draft</code>,
            preserved here as published. The example responses reference their canonical{" "}
            <code>{"http://loinc.org/q/<panel>"}</code>, and the panel code in{" "}
            <code>Questionnaire.code</code> stays the real interoperability anchor.
          </p>
        </div>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th className="code">Panel code</th>
                <th className="code">Representative item codes</th>
                <th className="code">Score code</th>
                <th className="code">Official LOINC form</th>
              </tr>
            </thead>
            <tbody>
              {DATA.instruments.map((inst) => (
                <tr key={inst.key}>
                  <td>
                    <b>{inst.name}</b>
                  </td>
                  <td className="code">
                    <a href={inst.loincTerm} target="_blank" rel="noopener">
                      {inst.panel.code}
                    </a>
                  </td>
                  <td className="code itemcodes">{inst.itemCodes.join(", ")}</td>
                  <td className="code">
                    <span className="sc">{inst.scoreCode.code}</span>
                  </td>
                  <td className="code">
                    <a href={inst.loincSource} target="_blank" rel="noopener">
                      q/{inst.panel.code} ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          LOINC availability does not by itself clear all use rights — third-party copyright notices
          still apply. Put the full license text in <code>Questionnaire.copyright</code>.
        </p>
      </div>
    </section>
  );
}

type Guard = [string, string, React.ReactNode];

function GuardCards({ guards }: { guards: Guard[] }) {
  return (
    <div className="guards">
      {guards.map(([ic, title, body]) => (
        <div key={title} className="guard">
          <div className="g-ic">{ic}</div>
          <h4>{title}</h4>
          <p>{body}</p>
        </div>
      ))}
    </div>
  );
}

export function Governance() {
  const whenToAsk: Guard[] = [
    ["🚫", "No re-asking USCDI facts", <>If it's available as US&nbsp;Core data, retrieve it first. Never default to re-collection.</>],
    ["⏱️", "Ask only when due", <>Ask an instrument only when clinically due, missing, stale, or needed for the current episode.</>],
  ];
  const oweTheAnswer: Guard[] = [
    ["🧾", "Preserve the raw response", <>Keep the QuestionnaireResponse: exact form, wording, answer, respondent, and timestamp.</>],
    ["🔎", "File the score", <>Extract the score as an Observation. Per-item Observations only when search / CDS / reporting actually needs them.</>],
    ["©️", "Carry the license with the form", <>Set <code>copyright</code>, <code>publisher</code>, <code>version</code>, source, and "do not modify" notes.</>],
    ["🚨", "Route what needs action", <>PHQ-9 item 9, severe dyspnea / pain, high alcohol risk must reach someone — not vanish into storage.</>],
  ];
  return (
    <section id="govern" className="alt">
      <div className="wrap">
        <div className="sec-head">
          <div className="kicker">Ground rules</div>
          <h2>Two ways this goes wrong</h2>
          <p>
            It can drift back into a clipboard — asking the patient for what the chart already has.
            Or it can collect honest answers and then fumble them. Two rules guard the asking; four
            duties cover what you collect.
          </p>
        </div>
        <div className="g-label">Before you ask</div>
        <GuardCards guards={whenToAsk} />
        <div className="g-label">Once the patient has answered</div>
        <GuardCards guards={oweTheAnswer} />
      </div>
    </section>
  );
}

export function BottomLine() {
  return (
    <section>
      <div className="wrap">
        <div className="callout">
          <p style={{ margin: 0 }}>
            The goal isn't to digitize the clipboard. It's to give clinics a standard way to ask{" "}
            <b>the few questions only the patient can answer</b> — and to get those answers back as
            data, not paper.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: ".95rem", color: "var(--ink-2)" }}>
            Any questionnaire a clinic licenses or writes can work the same way: a
            FHIR&nbsp;Questionnaire, answered as a QuestionnaireResponse, turned into coded
            Observations where it's useful, and wired to whatever follow-up the clinic needs.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="grid">
          <div>
            <div className="brand" style={{ marginBottom: 8 }}>
              <span className="dot">✚</span> KTC Questionnaire Starters
            </div>
            <div>A "Kill the Clipboard" proof-pattern set · FHIR R4</div>
          </div>
          <div>
            <div>
              <a href={GH}>Source on GitHub ↗</a>
            </div>
            <div>
              <a href={`${GH}/tree/main/fhir`}>Browse raw FHIR artifacts ↗</a>
            </div>
            <div>
              <a href="https://hl7.org/fhir/R4/questionnaire.html">FHIR R4 Questionnaire ↗</a>
            </div>
          </div>
        </div>
        <p className="disc">
          For demonstration and implementation reference only — not medical advice and not a
          certified instrument distribution. Instrument copyright and use terms belong to their
          respective owners (Pfizer Inc. for PHQ/GAD with no-permission-required terms; WHO public
          domain for AUDIT; public domain for PEG; Alberta Health Services for ESAS-r). LOINC® is a
          registered trademark of Regenstrief Institute, Inc. Verify codes, answer lists, and
          licensing against authoritative sources before production use.
        </p>
      </div>
    </footer>
  );
}
