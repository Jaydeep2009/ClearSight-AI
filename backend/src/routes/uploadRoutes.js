import express from "express";
import { handleFileUpload } from "../controllers/uploadController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Multiple files upload
router.post("/upload", upload.array("files", 5), handleFileUpload);

export default router;
