const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../middleware/validate");
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.get("/me", protect, getMe);

module.exports = router;
