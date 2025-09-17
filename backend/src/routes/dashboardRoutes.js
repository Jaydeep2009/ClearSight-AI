// routes/dashboardRoutes.js
import express from "express";
import Upload from "../models/Upload.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * Employee Dashboard → Only their uploads
 * Supports optional query filters: ?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
router.get(
  "/employee",
  authMiddleware,
  requireRole("employee"),
  async (req, res) => {
    try {
      const { start, end } = req.query;
      const filter = { userId: req.user.id };

      if (start && end) {
        filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
      }

      const uploads = await Upload.find(filter)
        .populate("userId", "name role email")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: uploads });
    } catch (err) {
      console.error("Employee Dashboard Error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

/**
 * Manager Dashboard → Team-level uploads
 * (Assumes User schema has teamId)
 */
router.get(
  "/manager",
  authMiddleware,
  requireRole("manager"),
  async (req, res) => {
    try {
      const { start, end } = req.query;
      const filter = { teamId: req.user.teamId };

      if (start && end) {
        filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
      }

      const uploads = await Upload.find(filter)
        .populate("userId", "name role email")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: uploads });
    } catch (err) {
      console.error("Manager Dashboard Error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

/**
 * Admin Dashboard → See everything
 */
router.get(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { start, end } = req.query;
      const filter = {};

      if (start && end) {
        filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
      }

      const uploads = await Upload.find(filter)
        .populate("userId", "name role email")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: uploads });
    } catch (err) {
      console.error("Admin Dashboard Error:", err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

export default router;
