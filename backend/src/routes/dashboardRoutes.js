import express from "express";
import Upload from "../models/Upload.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Employee Dashboard → See only their uploads
router.get(
  "/employee",
  authMiddleware,
  requireRole("employee"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({ userId: req.user.id });
      res.json(uploads);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Manager Dashboard → See all employees' uploads (not other managers/admins)
router.get(
  "/manager",
  authMiddleware,
  requireRole("manager"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({}); // later: filter by team
      res.json(uploads);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin Dashboard → See everything
router.get(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const uploads = await Upload.find({});
      res.json(uploads);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
