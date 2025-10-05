import Upload from "../models/Upload.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseLogs } from "../utils/parseLogs.js";
import { computeStats } from "../utils/dataStats.js";
import { generateInsights } from "../services/aiService.js";
import path from "path";
import fs from "fs";

export const handleFileUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    let results = [];

    for (const file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const uploadPath = path.join("uploads", file.originalname);

      // ✅ 1. Save uploaded file locally (Gemini needs path)
      fs.writeFileSync(uploadPath, file.buffer);

      // ✅ 2. Parse data for stats
      let parsedData = null;
      if ([".xlsx", ".xls", ".csv"].includes(ext)) {
        ({ parsedData } = await parseExcel(file.buffer));
      } else if (ext === ".pdf") {
        ({ parsedData } = await parsePDF(file.buffer));
      } else if ([".log", ".txt"].includes(ext)) {
        ({ parsedData } = await parseLogs(file.buffer));
      } else {
        return res.status(400).json({ error: `Unsupported file type: ${ext}` });
      }

      // ✅ 3. Compute file statistics
      const stats = computeStats(parsedData);

      // ✅ 4. Generate AI insights using file (Gemini-compatible)
      const aiResult = await generateInsights(uploadPath, req.user.role);

      // ✅ 5. Save everything in MongoDB
      const uploadDoc = new Upload({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        parsedData,
        stats,
        insights: aiResult.summary,
        aiMeta: aiResult,
      });

      await uploadDoc.save();
      results.push(uploadDoc);

      // ✅ 6. Optionally delete temp file after processing
      fs.unlinkSync(uploadPath);
    }

    res.status(200).json({
      message: "Files uploaded, parsed, analyzed, and stored successfully ✅",
      uploads: results,
    });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
};
