// services/aiService.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/**
 * Generate AI insights from a local uploaded file using Gemini
 * Supports PDF, CSV, TXT, etc.
 * @param {String} filePath - Path to uploaded file
 * @param {String} role - User role ("employee", "manager", "admin")
 * @returns {Object} Insights { summary, keyFindings, anomalies, recommendations, raw }
 */
export async function generateInsights(filePath, role = "employee") {
  try {
    // 🧩 1. Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    // 🧩 2. Read file and encode as Base64
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Detect MIME type
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".csv": "text/csv",
      ".txt": "text/plain",
      ".json": "application/json",
    };

    const mimeType = mimeTypes[ext] || "application/octet-stream";

    // 🧩 3. Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 🧩 4. Prepare prompt
    const prompt = `
You are an AI assistant for ClearSight AI.
Analyze this uploaded file and extract:
1. A short summary
2. Key findings or patterns
3. Any anomalies or concerns
4. Actionable recommendations

Return JSON with:
{
  "summary": "...",
  "keyFindings": ["..."],
  "anomalies": ["..."],
  "recommendations": ["..."]
}
`;

    // 🧩 5. Send file + prompt to Gemini
    const response = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType,
        },
      },
    ]);

    const raw = response?.response?.text?.() || "No response from Gemini.";
    return safeParse(raw);
  } catch (err) {
    console.error("❌ Gemini AI Error:", err.message || err);
    return {
      summary: "⚠️ AI insight generation failed.",
      keyFindings: [],
      anomalies: [],
      recommendations: [],
      raw: err.message || "Unknown error",
    };
  }
}

/**
 * Safe JSON parsing helper
 */
function safeParse(raw) {
  try {
    // 🧹 Clean markdown formatting
    const cleaned = raw.replace(/```json|```/g, "").trim();

    // Try normal JSON parse first
    const parsed = JSON.parse(cleaned);
    if (parsed.summary && parsed.keyFindings) return { ...parsed, raw };

    // If summary itself contains nested JSON, extract and parse that
    if (typeof parsed.summary === "string" && parsed.summary.includes("{")) {
      const innerMatch = parsed.summary.match(/{[\s\S]*}/);
      if (innerMatch) {
        const innerParsed = JSON.parse(innerMatch[0]);
        return { ...innerParsed, raw };
      }
    }

    // If not JSON but still text, wrap it safely
    return {
      summary: cleaned,
      keyFindings: [],
      anomalies: [],
      recommendations: [],
      raw,
    };
  } catch (err) {
    // Final fallback for non-JSON responses
    const match = raw.match(/{[\s\S]*}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return { ...parsed, raw };
      } catch {}
    }

    return {
      summary: raw.replace(/```json|```/g, "").trim(),
      keyFindings: [],
      anomalies: [],
      recommendations: [],
      raw,
    };
  }
}

