const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify token and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    // Verify token role matches the actual DB role (prevents stale tokens)
    if (decoded.role && decoded.role !== user.role) {
      return res.status(401).json({
        success: false,
        message: "Token role mismatch. Your role may have changed. Please login again.",
      });
    }

    req.user = user;
    req.tokenRole = decoded.role; // Pass token's role claim for extra validation
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
  }
};

// Restrict to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
