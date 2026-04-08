const express = require("express");
const router = express.Router();
const {
  getAllConfig,
  getConfig,
  getCourses,
  getBatches,
  getSuccessStories,
  getMarketingStats,
  getLinks,
  updateConfig,
  updateCourses,
  updateBatches,
} = require("../controllers/configController");
const { protect, authorize } = require("../middleware/auth");

// ─── PUBLIC routes (no auth required) ───────────────────────

// Get all config
router.get("/", getAllConfig);

// Get specific config section
router.get("/:type", getConfig);

// Aliases for common endpoints
router.get("/courses", getCourses);
router.get("/batches", getBatches);
router.get("/success-stories", getSuccessStories);
router.get("/marketing-stats", getMarketingStats);
router.get("/links", getLinks);

// ─── PROTECTED routes (admin only) ──────────────────────────

// Update config section (admin only)
router.put("/:type", protect, authorize("admin"), updateConfig);

// Update courses
router.put("/courses", protect, authorize("admin"), updateCourses);

// Update batches
router.put("/batches", protect, authorize("admin"), updateBatches);

module.exports = router;
