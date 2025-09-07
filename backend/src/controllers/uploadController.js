import Upload from "../models/Upload.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseLogs } from "../utils/parseLogs.js";
import path from "path";
import axios from "axios"; // for calling DeepSeek API

// Utility: Call DeepSeek API for insights
const generateInsights = async (parsedData) => {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a data analysis assistant. Summarize key insights, patterns, and trends from structured data in plain English.",
          },
          {
            role: "user",
            content: `Here is the parsed data: ${JSON.stringify(parsedData).slice(0, 5000)}`, 
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0]?.message?.content || "No insights generated";
  } catch (err) {
    console.error("DeepSeek API error:", err.response?.data || err.message);
    return "AI Insights unavailable";
  }
};

export const handleFileUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const userId = req.body.userId || (req.user ? req.user._id : null);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    let results = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      let parsedData = null;

      // Step 1: Parse file
      if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
        ({ parsedData } = await parseExcel(file.buffer));
      } else if (ext === ".pdf") {
        ({ parsedData } = await parsePDF(file.buffer));
      } else if (ext === ".log" || ext === ".txt") {
        ({ parsedData } = await parseLogs(file.buffer));
      } else {
        return res.status(400).json({ error: `Unsupported file type: ${ext}` });
      }

      // Step 2: Generate AI insights
      const insights = await generateInsights(parsedData);

      // Step 3: Save into MongoDB
      const uploadDoc = new Upload({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        parsedData,
        insights, // NEW
      });

      await uploadDoc.save();
      results.push(uploadDoc);
    }

    res.status(200).json({
      message: "Files uploaded, parsed, analyzed, and stored successfully!",
      uploads: results,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "File processing failed" });
  }
};
