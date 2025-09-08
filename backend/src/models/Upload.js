import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  parsedData: { type: mongoose.Schema.Types.Mixed, default: [] }, // structured data
  stats: { type: Object },  // computed statistics
  uploadedAt: { type: Date, default: Date.now },
  
  // 🔹 Keep placeholders for future AI
  insights: { type: String },            // AI-generated insights (later)
  aiMeta: { type: mongoose.Schema.Types.Mixed }, // raw AI JSON/debug info (later)
});

export default mongoose.model("Upload", uploadSchema);
