import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },                    
  parsedData: { type: mongoose.Schema.Types.Mixed, default: [] }, // cleaned + structured data
  insights: { type: String }, // AI-generated insights (plain English summary)
  aiMeta: { type: mongoose.Schema.Types.Mixed }, // optional: store raw AI JSON (for debugging/analytics)
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Upload", uploadSchema);
