import Upload from "../models/Upload.js";
import { generateInsights } from "../services/aiService.js";

export const refreshInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.body.role || "employee"; // default role if not provided

    const upload = await Upload.findById(id);
    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

// regenerate insights from stored parsedData

    
    const insights = await generateInsights(upload.parsedData, role);

    upload.insights = insights;
    upload.aiMeta = {
      regeneratedAt: new Date(),
      role,
      provider: process.env.AI_PROVIDER || "dummy",
    };

    await upload.save();

    res.status(200).json({
      message: "Insights regenerated successfully",
      upload,
    });
  } catch (err) {
    console.error("❌ Refresh insights error:", err);
    res.status(500).json({ error: err.message });
  }
};
