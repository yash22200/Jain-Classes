const Config = require("../models/Config");

// ─── GET operations ────────────────────────────────────────

// @desc  Get all config sections
// @route GET /api/config
const getAllConfig = async (req, res) => {
  try {
    const configs = await Config.find();
    const configObj = {};
    configs.forEach((config) => {
      configObj[config.type] = config.data;
    });
    res.json({ success: true, data: configObj });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching configuration",
    });
  }
};

// @desc  Get specific config section
// @route GET /api/config/:type
const getConfig = async (req, res) => {
  try {
    const { type } = req.params;
    const config = await Config.findOne({ type });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: `Configuration for "${type}" not found`,
      });
    }

    res.json({ success: true, data: config.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching configuration",
    });
  }
};

// @desc  Get courses
// @route GET /api/config/courses
const getCourses = async (req, res) => {
  try {
    const config = await Config.findOne({ type: "courses" });
    res.json({
      success: true,
      data: config ? config.data : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
};

// @desc  Get batches
// @route GET /api/config/batches
const getBatches = async (req, res) => {
  try {
    const config = await Config.findOne({ type: "batches" });
    res.json({
      success: true,
      data: config ? config.data : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching batches" });
  }
};

// @desc  Get success stories
// @route GET /api/config/success-stories
const getSuccessStories = async (req, res) => {
  try {
    const config = await Config.findOne({ type: "success_stories" });
    res.json({
      success: true,
      data: config ? config.data : [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching success stories",
    });
  }
};

// @desc  Get marketing statistics
// @route GET /api/config/marketing-stats
const getMarketingStats = async (req, res) => {
  try {
    const config = await Config.findOne({ type: "marketing_stats" });
    res.json({
      success: true,
      data: config ? config.data : {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching marketing statistics",
    });
  }
};

// @desc  Get external links
// @route GET /api/config/links
const getLinks = async (req, res) => {
  try {
    const config = await Config.findOne({ type: "links" });
    res.json({
      success: true,
      data: config ? config.data : {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching links" });
  }
};

// ─── UPDATE operations (Admin only) ─────────────────────────

// @desc  Update config section
// @route PUT /api/config/:type
const updateConfig = async (req, res) => {
  try {
    const { type } = req.params;
    const { data, description } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Data is required",
      });
    }

    let config = await Config.findOne({ type });

    if (config) {
      config.data = data;
      if (description) config.description = description;
      config.lastUpdatedBy = req.user._id;
    } else {
      config = new Config({
        type,
        data,
        description,
        lastUpdatedBy: req.user._id,
      });
    }

    await config.save();

    res.json({
      success: true,
      message: `Configuration "${type}" updated successfully`,
      data: config.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating configuration",
    });
  }
};

// @desc  Update courses
// @route PUT /api/config/courses
const updateCourses = async (req, res) => {
  try {
    const { courses } = req.body;

    if (!Array.isArray(courses)) {
      return res.status(400).json({
        success: false,
        message: "Courses must be an array",
      });
    }

    let config = await Config.findOne({ type: "courses" });

    if (config) {
      config.data = courses;
      config.lastUpdatedBy = req.user._id;
    } else {
      config = new Config({
        type: "courses",
        data: courses,
        lastUpdatedBy: req.user._id,
      });
    }

    await config.save();

    res.json({
      success: true,
      message: "Courses updated successfully",
      data: config.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating courses",
    });
  }
};

// @desc  Update batches
// @route PUT /api/config/batches
const updateBatches = async (req, res) => {
  try {
    const { batches } = req.body;

    if (!Array.isArray(batches)) {
      return res.status(400).json({
        success: false,
        message: "Batches must be an array",
      });
    }

    let config = await Config.findOne({ type: "batches" });

    if (config) {
      config.data = batches;
      config.lastUpdatedBy = req.user._id;
    } else {
      config = new Config({
        type: "batches",
        data: batches,
        lastUpdatedBy: req.user._id,
      });
    }

    await config.save();

    res.json({
      success: true,
      message: "Batches updated successfully",
      data: config.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating batches",
    });
  }
};

module.exports = {
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
};
