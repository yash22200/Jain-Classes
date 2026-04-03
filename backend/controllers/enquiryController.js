const Enquiry = require("../models/Enquiry");

// @desc  Submit an enquiry (public)
// @route POST /api/enquiry
// @access Public
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const enquiry = await Enquiry.create({ name, email, phone, message });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. We will contact you soon!",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitEnquiry };
