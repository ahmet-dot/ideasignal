import { useState, useRef } from "react";

function scoreColor(s) {
  if (s >= 70) return "#4ade80";
  if (s >= 45) return "#fbbf24";
  return "#f87171";
}

function verdictConfig(v) {
  const map = {
    STRONG_BUY: { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", label: "STRONG BUY" },
    BUY: { color: "#a3e635", bg: "rgba(163,230,53,0.08)", border: "rgba(163,230,53,0.2)", label: "BUY" },
    HOLD: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", label: "HOLD" },
    SELL: { color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", label: "SELL" },
    STRONG_SELL: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", label: "STRONG SELL" }
  };
  return map[v] || map.HOLD;
}

const STEPS = [
  "Scanning competitor landscape...",
  "Reading community demand signals...",
  "Checking investor appetite...",
  "Analyzing market pressure...",
  "Generating validation report..."
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
    }, 2200);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() })
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
            competitors · market reality · investor appetite
          </p>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,6vw,68px)", lineHeight: 1.05, letterSpacing: "-1px", margin: "0 0 18px", fontWeight: 400 }}>
            Validate before
            <br />
            <em style={{ color: "rgba(255,255,255,0.35)" }}>you build.</em>
          </h1>

          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 40px" }}>
            Structured startup idea analysis.
            <br />
            Brutal, clean, fast.
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
              placeholder="AI powered sales coaching for SDR teams..."
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
            // powered by openai
          </p>
        </div>
      )}

      {phase === "loading" && (
        <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
          <p style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 28 }}>
            // validating idea
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
        <Report report={report} onReset={() => {
          setPhase("idle");
          setIdea("");
        }} tab={tab} setTab={setTab} />
      )}
    </div>
  );
}

function Report({ report, onReset, tab, setTab }) {
  const vc = verdictConfig(report.verdict);
  const TABS = ["overview", "competitors", "pivots"];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 14 }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>
            // validation report
          </p>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,4vw,42px)", margin: 0, fontWeight: 400, letterSpacing: "-0.5px" }}>
            {report.idea}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", margin: "6px 0 0" }}>
            {report.oneLiner}
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
          <div style={{ width: 88, height: 88, borderRadius: "50%", border: `3px solid ${scoreColor(report.overallScore)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `${scoreColor(report.overallScore)}12` }}>
            <span style={{ fontSize: 30, fontWeight: 600, color: scoreColor(report.overallScore), lineHeight: 1, fontFamily: SERIF }}>
              {report.overallScore}
            </span>
            <span style={{ fontSize: 10, color: scoreColor(report.overallScore), fontFamily: MONO }}>/100</span>
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
              // dimension scores
            </p>

            {(report.dimensions || []).map((d, i) => (
              <div key={i} style={{ marginBottom: i < report.dimensions.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: scoreColor(d.score), fontFamily: MONO }}>{d.score}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", marginBottom: 5 }}>
                  <div style={{ width: `${d.score}%`, height: "100%", background: scoreColor(d.score), borderRadius: 2 }} />
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", margin: 0, fontFamily: MONO, lineHeight: 1.5 }}>
                  {d.evidence}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(74,222,128,0.03)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(74,222,128,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
                // green flags
              </p>
              {(report.greenFlags || []).map((g, i) => (
                <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 8px", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid rgba(74,222,128,0.25)" }}>
                  {g}
                </p>
              ))}
            </div>

            <div style={{ background: "rgba(248,113,113,0.03)", border: "1px solid rgba(248,113,113,0.1)", borderRadius: 12, padding: 16 }}>
              <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(248,113,113,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
                // red flags
              </p>
              {(report.redFlags || []).map((r, i) => (
                <p key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "0 0 8px", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid rgba(248,113,113,0.25)" }}>
                  {r}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "competitors" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(report.competitors || []).map((c, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 20, margin: "0 0 3px", fontWeight: 400 }}>{c.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: MONO }}>{c.pricing}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: MONO, fontSize: 13, color: "#f87171", margin: "0 0 4px", fontWeight: 500 }}>{c.funding}</p>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {(c.backedBy || []).map((b, j) => (
                      <span key={j} style={{ fontSize: 10, fontFamily: MONO, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 7px", borderRadius: 4 }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 8, padding: 12 }}>
                <p style={{ fontFamily: MONO, fontSize: 10, color: "rgba(74,222,128,0.5)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>
                  your gap
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                  {c.gap}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "pivots" && (
        <div style={{ display: "grid", gap: 10 }}>
          {(report.pivots || []).map((p, i) => (
            <div key={i} style={{ background: CARD, border: BORDER, borderRadius: 12, padding: 18, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "start" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", fontFamily: MONO }}>{i + 1}</span>
              </div>

              <div>
                <h4 style={{ fontSize: 14, fontWeight: 500, margin: "0 0 5px", color: "rgba(255,255,255,0.88)" }}>{p.title}</h4>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6, fontFamily: MONO }}>{p.why}</p>
              </div>

              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `2px solid ${scoreColor(p.score)}`, display: "flex", alignItems: "center", justifyContent: "center", background: `${scoreColor(p.score)}10`, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor(p.score), fontFamily: SERIF }}>{p.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
