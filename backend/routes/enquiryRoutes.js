const express = require("express");
const router = express.Router();
const { submitEnquiry } = require("../controllers/enquiryController");
const { validateEnquiry } = require("../middleware/validate");
const { enquiryLimiter } = require("../middleware/rateLimiter");

// Public route – no auth needed, but with rate limiting and validation
router.post("/", enquiryLimiter, validateEnquiry, submitEnquiry);

module.exports = router;
