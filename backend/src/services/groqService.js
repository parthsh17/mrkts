const Groq = require("groq-sdk");

let groqClient;

const getClient = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

const FALLBACK_RESULT = {
  sentiment: "Neutral",
  summaryPoints: ["Analysis unavailable at this time."],
  actionableInsight:
    "No actionable insight could be generated. Please read the full article.",
};

// Groq free tier: ~30 req/min for most models — we throttle to 1 req/2s for safety
const SYSTEM_PROMPT = `You are a senior financial news analyst specializing in equity markets, macro-economics, and trading strategy. Your role is to dissect financial news articles and produce structured, actionable intelligence for retail traders and institutional investors.

You MUST respond with ONLY a valid JSON object. Do NOT include any markdown, code fences, preamble, or explanation. Your entire response must be parseable by JSON.parse().

Output schema (strict):
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "summaryPoints": ["<point1>", "<point2>", "<point3>"],
  "actionableInsight": "<single concise sentence>"
}

Rules:
1. "sentiment" must be EXACTLY one of: Bullish, Bearish, Neutral — based on the article's market implications.
   - Bullish: positive outlook, growth signal, or upward price catalyst.
   - Bearish: negative outlook, risk signal, or downward price catalyst.
   - Neutral: mixed signals, informational only, or unclear market direction.
2. "summaryPoints" must be an array of EXACTLY 3 short strings (each ≤ 15 words), covering the key facts.
3. "actionableInsight" must be exactly 1 sentence (≤ 35 words) — a specific, concrete action or watch signal for a trader/investor. Avoid vague advice like "monitor closely". Be specific about the asset class, sector, or ticker if inferable.
4. Ground your analysis in the article content provided. Do not invent facts.
5. If the article is entirely unrelated to finance or markets, use sentiment "Neutral" and note it is off-topic in the insight.`;

/**
 * Enrich a raw article with AI-generated sentiment, summary, and insight.
 * @param {{ title: string, snippet: string }} article
 * @returns {Promise<{ sentiment: string, summaryPoints: string[], actionableInsight: string }>}
 */
const enrichArticle = async ({ title, snippet }) => {
  try {
    const client = getClient();

    const userMessage = `Article Title: "${title}"
Article Content: "${(snippet || title).slice(0, 1200)}"

Analyze the above financial news article and return the JSON object.`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2, // Low temp for deterministic, factual output
      max_tokens: 300, // JSON response is always small
      top_p: 0.9,
      response_format: { type: "json_object" }, // Enforce JSON mode
    });

    const rawText = response.choices[0]?.message?.content?.trim();
    if (!rawText) throw new Error("Empty response from Groq");

    // Strip any accidental markdown fences (belt-and-suspenders)
    const jsonText = rawText
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    // Validate and sanitize each field
    const sentiment = ["Bullish", "Bearish", "Neutral"].includes(
      parsed.sentiment,
    )
      ? parsed.sentiment
      : "Neutral";

    const summaryPoints = Array.isArray(parsed.summaryPoints)
      ? parsed.summaryPoints.slice(0, 3).map(String)
      : ["No summary available."];

    const actionableInsight =
      typeof parsed.actionableInsight === "string" &&
      parsed.actionableInsight.trim()
        ? parsed.actionableInsight.trim()
        : FALLBACK_RESULT.actionableInsight;

    return { sentiment, summaryPoints, actionableInsight };
  } catch (error) {
    console.error(
      `⚠️  Groq enrichment failed for "${title}": ${error.message}`,
    );
    return FALLBACK_RESULT;
  }
};

module.exports = { enrichArticle };
