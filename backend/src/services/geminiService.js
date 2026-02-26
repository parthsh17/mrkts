const { GoogleGenAI } = require('@google/genai');

let genAI;

const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
};

const FALLBACK_RESULT = {
  sentiment: 'Neutral',
  summaryPoints: ['Analysis unavailable at this time.'],
  actionableInsight: 'No actionable insight could be generated. Please read the full article.',
};

/**
 * Enrich a raw article with AI-generated sentiment, summary, and insight.
 * @param {{ title: string, snippet: string }} article
 * @returns {Promise<{ sentiment: string, summaryPoints: string[], actionableInsight: string }>}
 */
const enrichArticle = async ({ title, snippet }) => {
  try {
    const client = getClient();
    const model = client.models;

    const prompt = `You are a financial news analyst. Analyze the following article and respond ONLY with a valid JSON object — no markdown, no explanation.

Article Title: "${title}"
Article Snippet: "${snippet.slice(0, 800)}"

Respond with this exact JSON structure:
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "summaryPoints": ["point1", "point2", "point3"],
  "actionableInsight": "A single, concise, actionable insight for a trader or investor."
}

Rules:
- summaryPoints must be an array of exactly 3 short bullet strings.
- sentiment must be exactly one of: Bullish, Bearish, Neutral.
- actionableInsight must be one clear sentence.`;

    const response = await model.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const rawText = response.text.trim();

    // Strip markdown code fences if present
    const jsonText = rawText.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsed = JSON.parse(jsonText);

    // Validate and sanitize
    const sentiment = ['Bullish', 'Bearish', 'Neutral'].includes(parsed.sentiment)
      ? parsed.sentiment
      : 'Neutral';

    const summaryPoints = Array.isArray(parsed.summaryPoints)
      ? parsed.summaryPoints.slice(0, 3)
      : [parsed.summaryPoints || 'No summary available.'];

    const actionableInsight =
      typeof parsed.actionableInsight === 'string' && parsed.actionableInsight.trim()
        ? parsed.actionableInsight.trim()
        : FALLBACK_RESULT.actionableInsight;

    return { sentiment, summaryPoints, actionableInsight };
  } catch (error) {
    console.error(`⚠️  Gemini enrichment failed for "${title}": ${error.message}`);
    return FALLBACK_RESULT;
  }
};

module.exports = { enrichArticle };
