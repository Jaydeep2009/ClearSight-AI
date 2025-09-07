// src/services/aiService.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // keep key in .env
});

export async function generateInsights(parsedData) {
  try {
    // Convert parsed data into a text summary
    const dataPreview = JSON.stringify(parsedData).slice(0, 2000); // keep prompt short

    const prompt = `
    You are a business data analyst AI.
    Analyze the following structured data and provide:
    1. Key trends
    2. Anomalies or risks
    3. Actionable recommendations
    4. A plain-English summary for managers

    Data: ${dataPreview}
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o if available
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Insights Error:", error);
    return "Could not generate insights.";
  }
}
