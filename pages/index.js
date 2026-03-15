import { useState, useRef } from "react";

function scoreColor10(s) {
  if (s >= 8) return "#4ade80";
  if (s >= 5) return "#fbbf24";
  return "#f87171";
}

function assessmentColor(v) {
  if (v === "Strong") return "#4ade80";
  if (v === "Moderate") return "#fbbf24";
  return "#f87171";
}

function verdictConfig(v) {
  const map = {
    STRONG_BUY: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", label: "STRONG BUY" },
    BUY: { color: "#a3e635", bg: "rgba(163,230,53,0.08)", border: "rgba(163,230,53,0.2)", label: "BUY" },
    HOLD: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", label: "HOLD" },
    SELL: { color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", label: "SELL" },
    STRONG_SELL: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", label: "STRONG SELL" },
  };
  return map[v] || map.HOLD;
}

const STEPS = [
  "Framing the startup idea...",
  "Analyzing customer and market...",
  "Mapping competition and revenue logic...",
  "Reviewing risks and growth potential...",
  "Generating founder memo..."
];

const BG = "#08080d";
const SERIF = "'Instrument Serif', Georgia, serif";
const MONO = "'Geist Mono', 'Courier New', monospace";
const SANS = "'Geist', system-ui, sans-serif";
const CARD = "rgba(255,255,255,0.025)";
const BORDER = "1px solid rgba(255,255,255,0.08)";

export default function App() {
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState("idle");
  const [stepIdx, setStep] = useState(0);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const timer = useRef(null);

  async function run() {
    if (!idea.trim()) return;

    setPhase("loading");
    setStep(0);
    setReport(null);
    setError("");

    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStep(Math.min(i, STEPS.length - 1));
      if (i >= STEPS.length - 1) clearInterval(timer.current);
    }, 2000);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      clearInterval(timer.current);
      setStep(STEPS.length);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setReport(data);
      setPhase("done");
      setTab("overview");
    } catch (err) {
      clearInterval(timer.current);
      setError(err.message || "Unknown error");
      setPhase("error");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: "rgba(255,255,255,0.88)", fontFamily: SANS, paddingBottom: 80 }}>
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, background: "rgba(255,255,255,0.9)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 7, height: 7, background: BG, borderRadius: "50%" }} />
        </div>
        <span style={{ fontFamily: SERIF, fontSize: 17 }}>IdeaSignal</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 2 }}>beta</span>
      </nav>

      {phase === "idle" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "72px 24px 0", textAlign: "center" }}>
          <p style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>
            startup viability · founder memo · validation plan
          </p>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 18px", fontWeight: 400 }}>
            Validate before
            <br />
            <em style={{ color: "rgba(255,255,255,0.35)" }}>you build.</em>
          </h1>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Structured startup analysis with a sharper founder lens.
            <br />
            Market, competition, monetization, risk, and what to test next.
          </p>

          <div style={{ position: "relative", maxWidth: 580, margin: "0 auto 12px" }}>
            <input
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "17px 150px 17px 22px",
                fontSize: 15,
                color: "rgba(255,255,255,0.88)",
                fontFamily: SANS,
                outline: "none",
                boxSizing: "border-box"
              }}
              placeholder="AI powered sales coaching platform for SDR managers..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
            />
            <button
              onClick={run}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.88)",
                color: BG,
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: SANS
              }}
            >
              Validate →
            </button>
          </div>

          <p style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.16)" }}>
            // deepseek-chat · structured venture memo
          </p>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
          <p style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 28 }}>
            // building analysis
          </p>

          <div style={{ background: CARD, border: BORDER, borderRadius: 14, padding: "24px 20px" }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: i < STEPS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none"
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: i < stepIdx ? "#4ade80" : i === stepIdx ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    width: 16,
                    textAlign: "center"
                  }}
                >
                  {i < stepIdx ? "✓" : i === stepIdx ? "⟳" : "○"}
                </span>
                <span style={{ fontSize: 13, color: i <= stepIdx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                  {s}
                </span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.16)", marginTop: 20 }}>
            ~10 to 20 seconds
          </p>
        </div>
      )}

      {phase === "error" && (
        <div style={{ maxWidth: 440, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ color: "#f87171", fontFamily: MONO, fontSize: 12, marginBottom: 10 }}>// error</p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>{error}</p>
          <button
            onClick={() => setPhase("idle")}
            style={{
              background: "transparent",
              border: BORDER,
              color: "rgba(255,255,255,0.5)",
              padding: "10px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: SANS
            }}
          >
            ← Try again
          </button>
        </div>
      )}

      {phase === "done" && report && (
        <Report report={report} onReset={() => { setPhase("idle"); setIdea(""); }} tab={tab} setTab={setTab} />
      )}
    </div>
  );
}

function Report({ report, onReset, tab, setTab }) {
  const vc = verdictConfig(report.verdict);
  const TABS = ["overview", "competitors", "validation", "signals"];
  const CARD = "rgba(255,255,255,0.025)";
  const BORDER = "1px solid rgba(255,255,255,0.08)";

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 14 }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>
            // founder memo
          </p>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,4vw,42px)", margin: 0, fontWeight: 400, letterSpacing: "-0.5px" }}>
            Startup Viability Assessment
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", margin: "6px 0 0" }}>
            {report.ideaSummary}
          </p>
        </div>

        <button
          onClick={onReset}
          style={{
            background: "transparent",
            border: BORDER,
            color: "rgba(255,255,255,0.35)",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: MONO,
            flexShrink: 0
          }}
        >
          ← new idea
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center", margin: "24px 0", background: CARD, border: BORDER, borderRadius: 14, padding: "22px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", border: `3px solid ${scoreColor10(report.overallScore)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `${scoreColor10(report.overallScore)}12` }}>
            <span style={{ fontSize: 30, fontWeight: 600, color: scoreColor10(report.overallScore), lineHeight: 1, fontFamily: SERIF }}>
              {report.overallScore}
            </span>
            <span style={{ fontSize: 10, color: scoreColor10(report.overallScore), fontFamily: MONO }}>/10</span>
          </div>
        </div>

        <div>
          <span style={{ display: "inline-block", background: vc.bg, border: `1px solid ${vc.border}`, color: vc.color, padding: "4px 12px", borderRadius: 5, fontSize: 11, fontWeight: 600, fontFamily: MONO, marginBottom: 10 }}>
            {vc.label}
          </span>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            {report.verdictText}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 22 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "2px solid rgba(255,255,255,0.7)" : "2px solid transparent",
              color: tab === t ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.3)",
              padding: "9px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: SANS,
              fontWeight: tab === t ? 500 : 400,
              marginBottom: -1,
              textTransform: "capitalize"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ background: CARD, border: BORDER, borderRadius: 12, padding: "20px" }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 18px" }}>
              // viability analysis
            </p>

            {(report.analysis || []).map((item, i) => (
              <div key={i} style={{ marginBottom: i < report.analysis.length - 1 ? 18 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>{item.category}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: assessmentColor(item.assessment), fontFamily: MONO, border: `1px solid ${assessmentColor(item.assessment)}33`, padding: "3px 8px", borderRadius: 999 }}>
                    {item.assessment}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.46)", margin: 0, lineHeight: 1.7 }}>
                  {item.analysis}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(74,222,128,0.03)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(74,222,128,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
                // top strengths
              </p>
              {(report.topStrengths || []).map((g, i) => (
                <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 8px", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid rgba(74,222,128,0.25)" }}>
                  {g}
                </p>
              ))}
            </div>

            <div style={{ background: "rgba(248,113,113,0.03)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(248,113,113,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
                // top concerns
              </p>
              {(report.topConcerns || []).map((r, i) => (
                <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 8px", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid rgba(248,113,113,0.25)" }}>
                  {r}
                </p>
              ))}
            </div>
          </div>

          <div style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 18 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
              // strategic pivots
            </p>
            {(report.strategicPivots || []).map((p, i) => (
              <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.56)", margin: "0 0 10px", lineHeight: 1.6 }}>
                {p}
              </p>
            ))}
          </div>

          <div style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 18 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
              // bottom line
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", margin: 0, lineHeight: 1.7 }}>
              {report.bottomLine}
            </p>
          </div>
        </div>
      )}

      {tab === "competitors" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(report.competitors || []).map((c, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, margin: "0 0 6px", fontWeight: 400 }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.48)", margin: 0, lineHeight: 1.7 }}>{c.summary}</p>
              </div>

              <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 8, padding: 12 }}>
                <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(74,222,128,0.5)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>
                  your gap
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>{c.gap}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "validation" && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 20 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 18px" }}>
              // validation steps
            </p>
            {(report.validationSteps || []).map((step, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 12, marginBottom: i < report.validationSteps.length - 1 ? 14 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", margin: 0, lineHeight: 1.7 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PlanCard title="Top Hypothesis" value={report.validationPlan?.topHypothesis} />
            <PlanCard title="Fastest Experiment" value={report.validationPlan?.fastestExperiment} />
            <PlanCard title="First Buyer" value={report.validationPlan?.firstBuyer} />
            <PlanCard title="Manual Version" value={report.validationPlan?.manualVersion} />
          </div>

          <div style={{ background: "rgba(248,113,113,0.03)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: 12, padding: 18 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(248,113,113,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>
              // kill criteria
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", margin: 0, lineHeight: 1.7 }}>
              {report.validationPlan?.killCriteria}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanCard({ title, value }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18 }}>
      <p style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>
        // {title}
      </p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", margin: 0, lineHeight: 1.7 }}>
        {value}
      </p>
    </div>
  );
}
