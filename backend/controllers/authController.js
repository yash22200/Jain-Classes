const User = require("../models/User");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

// Generate JWT with both id AND role for security
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc  Register new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, phone: phone || "" });

    // Create student profile automatically
    await Student.create({ userId: user._id });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // If the frontend sends an expectedRole, validate it matches the user's actual role
    // This prevents a student from accidentally logging into the admin panel or vice versa
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a ${user.role}. Please select the correct role tab.`,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get current logged-in user (validate token)
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware after verifying the token
    // Double-check that the token's role claim matches the DB role
    const tokenRole = req.tokenRole; // Set by updated protect middleware
    if (tokenRole && tokenRole !== req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Token role mismatch. Please login again.",
      });
    }

    res.json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Logout user (clear session tracking)
// @route POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
  try {
    // With JWT, logout is primarily client-side (discard the token).
    // This endpoint exists for frontend consistency and future token blacklisting.
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, logout };
