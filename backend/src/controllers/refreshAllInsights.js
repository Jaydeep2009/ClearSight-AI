import Upload from "../models/Upload.js";
import { generateInsights } from "../services/aiService.js";

export const refreshAllInsights = async (req, res) => {
  try {
    const userId = req.body.userId || (req.user ? req.user._id : null);
    const role = req.body.role || "employee";

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    const uploads = await Upload.find({ userId });
    if (uploads.length === 0) {
      return res.status(404).json({ error: "No uploads found for this user" });
    }

    let refreshed = [];
    for (const upload of uploads) {
      const insights = await generateInsights(upload.parsedData, role);

      upload.insights = insights;
      upload.aiMeta = {
        regeneratedAt: new Date(),
        role,
        provider: process.env.AI_PROVIDER || "dummy",
      };

      await upload.save();
      refreshed.push(upload);
    }

    res.status(200).json({
      message: `Regenerated insights for ${refreshed.length} uploads`,
      uploads: refreshed,
    });
  } catch (err) {
    console.error("❌ Refresh all insights error:", err);
    res.status(500).json({ error: err.message });
  }
};
