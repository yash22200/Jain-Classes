/**
 * Seed script – creates a default admin account and initial configuration.
 * Run once: node seed.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Config = require("./models/Config");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Remove existing admin (idempotent)
    await User.deleteOne({ email: "admin@jain.com" });

    // Create admin user with secure password from environment or generate random
    const crypto = require("crypto");
    const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString("hex");
    
    const admin = await User.create({
      name: "Admin User",
      email: "admin@jain.com",
      password: adminPassword,
      role: "admin",
    });

    console.log("🎉 Admin user created:");
    console.log("   Email   :", admin.email);
    if (process.env.ADMIN_PASSWORD) {
      console.log("   Password: [Set from ADMIN_PASSWORD env var]");
    } else {
      console.log("   Password: (auto-generated)", adminPassword);
      console.log("\n   💾 Save this password securely!");
    }

    // Seed default configuration data
    console.log("\n📋 Seeding configuration data...");

    // Default courses
    const coursesData = [
      {
        id: "course-1",
        name: "8th Standard",
        description: "Build a rock-solid foundation in core subjects for 8th standard students",
        duration: "10 Months",
        icon: "BookOpen",
      },
      {
        id: "course-2",
        name: "9th Standard",
        description: "Strengthen core subjects and prepare for competitive exams with 9th standard curriculum",
        duration: "10 Months",
        icon: "Lightbulb",
      },
      {
        id: "course-3",
        name: "10th Standard (Board Prep)",
        description: "Intensive board exam coaching with mock tests and personalized guidance",
        duration: "10 Months",
        icon: "Target",
      },
    ];

    // Default batches
    const batchesData = [
      {
        id: "batch-1",
        grade: "8th",
        description: "Science & Maths",
        time: "04:00 - 06:00 PM",
        mode: "Offline",
        instructor: "Mr. Sameer Jain",
        capacity: 30,
        enrolled: 25,
        status: "Open",
      },
      {
        id: "batch-2",
        grade: "9th",
        description: "All Subjects",
        time: "06:00 - 08:00 PM",
        mode: "Offline",
        instructor: "Prof. Anjali Shah",
        capacity: 28,
        enrolled: 24,
        status: "Filling Fast",
      },
      {
        id: "batch-3",
        grade: "10th",
        description: "Board Prep",
        time: "08:00 - 11:00 AM",
        mode: "Offline",
        instructor: "Dr. R.K. Mathis",
        capacity: 25,
        enrolled: 20,
        status: "Open",
      },
      {
        id: "batch-4",
        grade: "10th",
        description: "Evening Batch",
        time: "05:00 - 07:30 PM",
        mode: "Online",
        instructor: "Mrs. Kavita Jain",
        capacity: 35,
        enrolled: 28,
        status: "Open",
      },
    ];

    // Default success stories
    const successStoriesData = [
      {
        id: "student-1",
        name: "Aryan Sharma",
        percentage: 99.2,
        year: "2024",
        exam: "10th Board",
        imageUrl: "/assets/student-1.jpg",
      },
      {
        id: "student-2",
        name: "Priya Gupta",
        percentage: 98.1,
        year: "2024",
        exam: "10th Board",
        imageUrl: "/assets/student-2.jpg",
      },
      {
        id: "student-3",
        name: "Rohan Deshmukh",
        percentage: 97.8,
        year: "2024",
        exam: "10th Board",
        imageUrl: "/assets/student-3.jpg",
      },
      {
        id: "student-4",
        name: "Sneha Reddy",
        percentage: 98.5,
        year: "2024",
        exam: "10th Board",
        imageUrl: "/assets/student-4.jpg",
      },
    ];

    // Default marketing statistics
    const marketingStatsData = {
      educators: "50+",
      yearsOfExperience: "15+",
      studentCount: "2000+",
      successRate: "98%",
    };

    // Default external links
    const linksData = {
      youtubeChannel: "https://youtube.com/@jainshrineclasses",
      contactEmail: "contact@jainshrine.com",
      phone: "+91 XXXX XXXX XX",
      instagram: "https://instagram.com/jainshrineclasses",
      facebook: "https://facebook.com/jainshrineclasses",
    };

    // Update or create config entries
    const configTypes = [
      { type: "courses", data: coursesData },
      { type: "batches", data: batchesData },
      { type: "success_stories", data: successStoriesData },
      { type: "marketing_stats", data: marketingStatsData },
      { type: "links", data: linksData },
    ];

    for (const configItem of configTypes) {
      let config = await Config.findOne({ type: configItem.type });
      if (config) {
        config.data = configItem.data;
        config.lastUpdatedBy = admin._id;
        await config.save();
        console.log(`   ✓ Updated ${configItem.type}`);
      } else {
        await Config.create({
          type: configItem.type,
          data: configItem.data,
          lastUpdatedBy: admin._id,
        });
        console.log(`   ✓ Created ${configItem.type}`);
      }
    }

    console.log("\n💡 You can also register student accounts via /api/auth/register");
    console.log("📌 Configuration can be updated via /api/config/* endpoints (admin only)");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();
