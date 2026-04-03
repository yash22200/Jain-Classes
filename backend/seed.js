/**
 * Seed script – creates a default admin account.
 * Run once: node seed.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Remove existing admin (idempotent)
    await User.deleteOne({ email: "admin@jain.com" });

    // Create admin user (password will be hashed by the model pre-hook)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@jain.com",
      password: "admin123",
      role: "admin",
    });

    console.log("🎉 Admin user created:");
    console.log("   Email   :", admin.email);
    console.log("   Password: admin123");
    console.log("\n💡 You can also register student accounts via /api/auth/register");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
