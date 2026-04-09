const { body, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  body("role").optional().isIn(["student", "admin"]).withMessage("Invalid role"),
  handleValidationErrors,
];

// User login validation
const validateLogin = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Enquiry validation
const validateEnquiry = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("phone")
    .trim()
    .matches(/^[+]?[0-9\s\-()]{10,}$/)
    .withMessage("Phone must be a valid phone number"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 5, max: 1000 })
    .withMessage("Message must be between 5 and 1000 characters"),
  handleValidationErrors,
];

// Student profile validation
const validateStudentProfile = [
  body("class")
    .notEmpty()
    .withMessage("Class is required")
    .isIn(["8th", "9th", "10th"])
    .withMessage("Class must be 8th, 9th, or 10th"),
  body("phone")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone must be a valid 10-digit number"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateEnquiry,
  validateStudentProfile,
};
