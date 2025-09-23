// routes/insights.js
import express from "express";
import multer from "multer";
import { generateInsights } from "../services/aiServices.js";
import * as XLSX from "xlsx";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 📂 Upload + parse file → send to AI
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let parsedData = [];
    const ext = req.file.originalname.split(".").pop();

    if (ext === "csv" || ext === "xlsx") {
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = XLSX.utils.sheet_to_json(sheet);
    } else if (ext === "json") {
      parsedData = JSON.parse(fs.readFileSync(req.file.path, "utf-8"));
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
  } finally {
    if (req.file) fs.unlinkSync(req.file.path); // cleanup
  }
});

export default router;
