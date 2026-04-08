const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/enquiry", require("./routes/enquiryRoutes"));
app.use("/api/config", require("./routes/configRoutes"));

// ─── Health check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Jain Classes API is running 🚀" });
});

// ─── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  // Don't expose implementation details in production
  const message = process.env.NODE_ENV === "production" 
    ? "An error occurred. Please try again later."
    : err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
  });
});

// ─── 404 handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});
