import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },  
  rawData: { type: Buffer },                   
  rawParsed: { type: Array, default: [] },     // messy first parse
  parsedData: { type: Array, default: [] },    // cleaned JSON
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Upload", uploadSchema);
