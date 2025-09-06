import Upload from "../models/Upload.js";
import { parseExcel } from "../utils/parseExcel.js";
import { parsePDF } from "../utils/parsePDF.js";
import { parseLogs } from "../utils/parseLogs.js";
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
      let rawParsed = null;
      let parsedData = null;

      // Step 1: Parse file (now returns rawParsed + parsedData)
      if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
        ({ rawParsed, parsedData } = await parseExcel(file.buffer));
      } else if (ext === ".pdf") {
        ({ rawParsed, parsedData } = await parsePDF(file.buffer));
      } else if (ext === ".log" || ext === ".txt") {
        ({ rawParsed, parsedData } = await parseLogs(file.buffer));
      } else {
        return res.status(400).json({ error: `Unsupported file type: ${ext}` });
      }

      // Step 2: Save into MongoDB
      const uploadDoc = new Upload({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        parsedData,
      });

      await uploadDoc.save();
      results.push(uploadDoc);
    }

    res.status(200).json({
      message: "Files uploaded, parsed, cleaned, and stored successfully!",
      uploads: results,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "File processing failed" });
  }
};
