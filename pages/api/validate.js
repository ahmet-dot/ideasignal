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

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: "Missing DEEPSEEK_API_KEY" });
  }

  const SYSTEM = `
You are a brutally honest startup idea validator.

Return ONLY valid JSON.
No markdown.
No explanation outside JSON.

Use this exact schema:
{
  "idea": "cleaned idea name",
  "oneLiner": "one sentence description",
  "overallScore": 75,
  "verdict": "BUY",
  "verdictText": "2 to 3 sentence honest verdict based on market reality",
  "dimensions": [
    {"name": "Market Size", "score": 80, "evidence": "specific evidence"},
    {"name": "Problem Urgency", "score": 70, "evidence": "specific evidence"},
    {"name": "Competition", "score": 30, "evidence": "specific evidence"},
    {"name": "VC Appetite", "score": 60, "evidence": "specific evidence"},
    {"name": "Community Demand", "score": 65, "evidence": "specific evidence"}
  ],
  "competitors": [
    {
      "name": "CompanyX",
      "funding": "$50M Series B",
      "backedBy": ["a16z"],
      "pricing": "$99 per month",
      "gap": "what they miss that you could do"
    }
  ],
  "greenFlags": ["specific opportunity"],
  "redFlags": ["specific risk"],
  "pivots": [
    {
      "title": "Pivot idea",
      "score": 65,
      "why": "specific gap in current market"
    }
  ]
}

Rules:
1. verdict must be one of:
STRONG_BUY, BUY, HOLD, SELL, STRONG_SELL
2. overallScore and all score fields must be integers from 0 to 100
3. Keep competitors to 3 items max
4. Keep greenFlags to 3 items max
5. Keep redFlags to 3 items max
6. Keep pivots to 3 items max
7. Be skeptical.
8. If the category is crowded, say it.
9. If distribution is the real moat, say it.
10. Do not invent absurd fake precision.
`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1800,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Validate this startup idea: "${idea.trim()}"` }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "DeepSeek request failed"
      });
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: "Empty response from model" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Model did not return valid JSON" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unknown server error"
    });
  }
}
