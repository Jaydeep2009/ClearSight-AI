import express from "express";
import { handleFileUpload } from "../controllers/uploadController.js";
import { upload } from "../middleware/upload.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Employee: Upload files (also allowed for managers/admins)
router.post(
  "/upload",
  authMiddleware,
  requireRole(["employee", "manager", "admin"]),
  upload.array("files", 5),
  handleFileUpload
);

export default router;
