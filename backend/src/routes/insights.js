// routes/insights.js
import express from "express";
import { generateInsights } from "../services/aiService.js";
import * as XLSX from "xlsx";
import { upload } from "../middleware/upload.js"; // ✅ use same config

const router = express.Router();

// 📂 Upload + parse file → send to AI
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let parsedData = [];
    const ext = req.file.originalname.split(".").pop();

    if (ext === "csv" || ext === "xlsx" || ext === "xls") {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = XLSX.utils.sheet_to_json(sheet);
    } else if (ext === "json") {
      parsedData = JSON.parse(req.file.buffer.toString());
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // role = employee | manager | admin (default: employee)
    const role = req.body.role || "employee";

    const insights = await generateInsights(parsedData, role);

    res.json(insights);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
});

export default router;
