import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },                    
  //rawParsed: { type: mongoose.Schema.Types.Mixed, default: [] }, // allows array or text
  parsedData: { type: mongoose.Schema.Types.Mixed, default: [] }, // cleaned, flexible
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Upload", uploadSchema);
