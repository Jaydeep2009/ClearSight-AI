import express from "express";
import { handleFileUpload } from "../controllers/uploadController.js";
import { upload } from "../middleware/upload.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { refreshInsights } from "../controllers/refreshInsights.js";
import { refreshAllInsights } from "../controllers/refreshAllInsights.js";
import Upload from "../models/Upload.js";

const router = express.Router();

/**
 * Upload files → employees, managers, and admins can upload
 */
router.post(
  "/",
  authMiddleware,
  requireRole(["employee", "manager", "admin"]),
  upload.array("files", 5),
  handleFileUpload
);

//regenerates insights
router.post("/:id/refresh-insights", refreshInsights);
router.post("/refresh-all", refreshAllInsights);  // ✅ batch refresh
/**
 * Employee Dashboard → see only their own uploads
 */
router.get(
  "/employee",
  authMiddleware,
  requireRole("employee"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
      res.json(uploads);
    } catch (err) {
      console.error("Employee fetch error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * Manager Dashboard → see all employee uploads
 */
router.get(
  "/manager",
  authMiddleware,
  requireRole("manager"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({}).sort({ uploadedAt: -1 });
      res.json(uploads);
    } catch (err) {
      console.error("Manager fetch error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * Admin Dashboard → see everything
 */
router.get(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({}).sort({ uploadedAt: -1 });
      res.json(uploads);
    } catch (err) {
      console.error("Admin fetch error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


/**
 * Get details of a single upload by ID
 * Employees → only their own file
 * Managers/Admins → can see all
 */
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const upload = await Upload.findById(id);

      if (!upload) {
        return res.status(404).json({ error: "Upload not found" });
      }

      // Role check
      if (
        req.user.role === "employee" &&
        upload.userId.toString() !== req.user.id
      ) {
        return res.status(403).json({ error: "Forbidden: not your file" });
      }

      res.json(upload);
    } catch (err) {
      console.error("File details error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


export default router;
