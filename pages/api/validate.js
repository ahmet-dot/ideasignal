export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idea } = req.body || {};

  if (!idea || !idea.trim()) {
    return res.status(400).json({ error: "No idea provided" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  const SYSTEM = `
You are an experienced startup investor and venture analyst.

Your task is to evaluate a startup idea using structured venture analysis across eight core dimensions.

Maintain a constructively critical, founder-friendly tone.
Avoid hype, clichés, or generic advice.
Be concise, analytical, and practical.
Do not pretend to have verified live sources unless such sources were actually provided.
Clearly state uncertainty when information is limited.

Evaluate the idea across these categories:

1. Market Size & Opportunity
Assess TAM potential, growth trends, and whether the market is expanding or stagnant.

2. Competitive Landscape
Identify direct or indirect competitors, saturation level, entry barriers, and positioning.

3. Unique Value Proposition
Evaluate differentiation, defensibility, potential moat, and whether the idea is meaningfully distinct.

4. Target Customer Validation
Identify the primary buyer persona, urgency of their pain point, and willingness to pay.

5. Revenue Model
Assess monetization logic, pricing viability, scalability, and potential CAC vs LTV dynamics.

6. Operational Requirements
Evaluate technical feasibility, team capabilities required, capital intensity, and regulatory or logistical constraints.

7. Growth Potential
Analyze scalability, potential network effects, expansion opportunities, and operational leverage.

8. Risk Assessment
Identify key risks, weaknesses, timing issues, and plausible failure modes.

After evaluating all dimensions:
• Assign an Overall Viability Score from 1 to 10
• Identify Top 3 Strengths
• Identify Top 3 Concerns
• Suggest Strategic Pivots or Refinements
• Provide 3 Actionable Validation Steps
• Provide a practical Validation Plan

Return ONLY valid JSON.

Use this exact schema:
{
  "ideaSummary": "",
  "analysis": [
    {
      "category": "Market Size & Opportunity",
      "assessment": "Strong",
      "analysis": ""
    },
    {
      "category": "Competitive Landscape",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Unique Value Proposition",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Target Customer Validation",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Revenue Model",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Operational Requirements",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Growth Potential",
      "assessment": "Moderate",
      "analysis": ""
    },
    {
      "category": "Risk Assessment",
      "assessment": "Weak",
      "analysis": ""
    }
  ],
  "overallScore": 7,
  "verdict": "BUY",
  "verdictText": "",
  "topStrengths": ["", "", ""],
  "topConcerns": ["", "", ""],
  "strategicPivots": ["", "", ""],
  "validationSteps": ["", "", ""],
  "validationPlan": {
    "topHypothesis": "",
    "fastestExperiment": "",
    "firstBuyer": "",
    "manualVersion": "",
    "killCriteria": ""
  },
  "competitors": [
    {
      "name": "",
      "summary": "",
      "gap": ""
    }
  ],
  "bottomLine": ""
}

Rules:
• overallScore must be an integer from 1 to 10
• assessment values must be exactly Strong, Moderate, or Weak
• verdict must be exactly one of: STRONG_BUY, BUY, HOLD, SELL, STRONG_SELL
• keep analysis concise but useful
• avoid generic startup advice
• if certainty is low, reflect that in the wording
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Evaluate the following startup idea using structured venture analysis.

Startup idea:
"${idea.trim()}"`
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed",
      });
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: "Empty response from model" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({ error: "Model did not return valid JSON" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unknown server error",
    });
  }
}
