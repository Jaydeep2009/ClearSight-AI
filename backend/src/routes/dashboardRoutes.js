// routes/dashboardRoutes.js
import express from "express";
import Upload from "../models/Upload.js";
import User from "../models/User.js"; 
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
// Manager Dashboard → Team-level uploads
router.get(
  "/manager",
  authMiddleware,
  requireRole("manager"),
  async (req, res) => {
    try {
      const { start, end } = req.query;

      // Find users in the manager's team
      const teamUsers = await User.find({ teamId: req.user.teamId }).select("_id");

      const teamUserIds = teamUsers.map((u) => u._id);

      // Filter uploads only for team members
      const filter = { userId: { $in: teamUserIds } };

      if (start && end) {
        filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
      }

      const uploads = await Upload.find(filter)
        .populate("userId", "name role email teamId")
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
