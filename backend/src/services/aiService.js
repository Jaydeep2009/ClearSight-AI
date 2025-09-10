import dotenv from "dotenv";
dotenv.config();

/**
 * Generate AI insights from parsed data
 * @param {Object|Array} data - The parsed/cleaned data
 * @param {String} role - User role ("employee", "manager", "admin")
 * @returns {Object} { summary, raw }
 */
export async function generateInsights(data, role = "employee") {
  const provider = process.env.AI_PROVIDER || "dummy"; 
  const prompt = `
You are an AI assistant for ClearSight AI.
Summarize the following structured data for a ${role}.
Highlight key trends, anomalies, and actionable insights.
Return JSON with:
{
  "summary": "plain-English overview",
  "keyFindings": ["point1", "point2"],
  "anomalies": ["odd pattern"],
  "recommendations": ["action1", "action2"]
}

Data:
${JSON.stringify(data).slice(0, 3000)} 
`;

  try {
    if (provider === "openai") {
      const OpenAI = await import("openai");
      const client = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const raw = response.choices[0].message.content;
      return safeParse(raw);
    }

    if (provider === "gemini") {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const response = await model.generateContent(prompt);
      const raw = response.response.text();
      return safeParse(raw);
    }

    if (provider === "deepseek") {
      const resp = await fetch("https://api.deepseek.com/v1/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "deepseek-chat", prompt }),
      });

      const dataResp = await resp.json();
      const raw = dataResp.choices?.[0]?.text || "No insights";
      return safeParse(raw);
    }

    // Dummy fallback
    return {
      summary: `📊 Dummy Insights: Found ${Array.isArray(data) ? data.length : Object.keys(data).length} records.`,
      keyFindings: [],
      anomalies: [],
      recommendations: [],
      raw: "dummy",
    };

  } catch (err) {
    console.error("AI Service Error:", err);
    return {
      summary: "⚠️ AI insight generation failed.",
      keyFindings: [],
      anomalies: [],
      recommendations: [],
      raw: err.message,
    };
  }
}

/**
 * Try to parse JSON safely
 */
function safeParse(raw) {
  try {
    return { ...JSON.parse(raw), raw };
  } catch {
    return { summary: raw, keyFindings: [], anomalies: [], recommendations: [], raw };
  }
}
