const express = require("express");
const router = express.Router();
const { submitEnquiry } = require("../controllers/enquiryController");

// Public route – no auth needed
router.post("/", submitEnquiry);

module.exports = router;
