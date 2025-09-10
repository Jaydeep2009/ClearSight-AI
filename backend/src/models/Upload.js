import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    parsedData: { type: mongoose.Schema.Types.Mixed, default: [] }, // structured data
    stats: { type: Object },  // computed statistics
    uploadedAt: { type: Date, default: Date.now },

    // 🔹 AI fields (Gemini integration)
    aiInsights: { type: Object, default: {} }, // structured insights (e.g. { summary, anomalies, recommendations })
    aiMeta: { type: mongoose.Schema.Types.Mixed, default: {} }, // raw Gemini response/debug
  },
  { timestamps: true }
);

export default mongoose.model("Upload", uploadSchema);
