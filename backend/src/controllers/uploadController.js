import Upload from "../models/Upload.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseLogs } from "../utils/parseLogs.js";
import { computeStats } from "../utils/dataStats.js"; // ✅ stats utility
import path from "path";

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

      // Step 1: Parse
      if ([".xlsx", ".xls", ".csv"].includes(ext)) {
        ({ parsedData } = await parseExcel(file.buffer));
      } else if (ext === ".pdf") {
        ({ parsedData } = await parsePDF(file.buffer));
      } else if ([".log", ".txt"].includes(ext)) {
        ({ parsedData } = await parseLogs(file.buffer));
      } else {
        return res.status(400).json({ error: `Unsupported file type: ${ext}` });
      }

      // Step 2: Compute stats
      const stats = computeStats(parsedData);

      // Step 3: Save to DB
      const uploadDoc = new Upload({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        parsedData,
        stats,   // ✅ save stats only
      });

      await uploadDoc.save();
      results.push(uploadDoc);
    }

    res.status(200).json({
      message: "Files uploaded, parsed, and stored successfully!",
      uploads: results,
    });
  } catch (err) {
      console.error("❌ Upload error:", err.message);
      console.error(err.stack);
      res.status(500).json({ error: err.message }); // return real error
  }

};
