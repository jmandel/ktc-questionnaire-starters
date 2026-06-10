import { createRoot } from "react-dom/client";
import "./styles.css";
import { Explorer } from "./explorer";
import {
  BottomLine,
  Boundary,
  CapabilityMatrix,
  Cards,
  Codes,
  DecisionFlow,
  ExplorerNote,
  Footer,
  Governance,
  Hero,
  Methodology,
  Model,
  Nav,
  Pattern,
} from "./sections";

function App() {
  return (
    <>
      <Nav />
      <a id="top"></a>
      <Hero />
      <Model />
      <Boundary />
      <DecisionFlow />
      <Methodology />
      <Cards />
      <CapabilityMatrix />
      <section id="explore">
        <div className="wrap">
          <div className="sec-head">
            <div className="kicker">Live examples</div>
            <h2>Fill one out and watch the FHIR get built</h2>
            <p>
              Pick an instrument, answer it, and see the score compute live alongside the{" "}
              <span className="mono">QuestionnaireResponse</span> and the extracted, LOINC-coded{" "}
              <span className="mono">Observation</span>. Open any of the files below to see it in
              full and download it.
            </p>
          </div>
          <Explorer />
          <ExplorerNote />
        </div>
      </section>
      <Pattern />
      <Codes />
      <Governance />
      <BottomLine />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
