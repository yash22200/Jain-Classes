/**
 * Comprehensive Seed Script
 * Creates admin, test students, and all configuration data
 * Run once: node seed.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Student = require("./models/Student");
const Config = require("./models/Config");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // ════════════════════════════════════════════════════════════════
    // 1. CREATE ADMIN USER
    // ════════════════════════════════════════════════════════════════
    await User.deleteOne({ email: "admin@jain.com" });

    const adminPassword = "Admin@12345";

    const admin = await User.create({
      name: "Admin User",
      email: "admin@jain.com",
      password: adminPassword,
      role: "admin",
    });

    console.log("🎉 ADMIN ACCOUNT CREATED");
    console.log("═══════════════════════════════════════");
    console.log("   Email   : admin@jain.com");
    console.log("   Password: " + adminPassword);
    console.log("   Role    : Admin");
    console.log("══════════════════════════════════════\n");

    // ════════════════════════════════════════════════════════════════
    // 2. CREATE TEST STUDENT ACCOUNTS
    // ════════════════════════════════════════════════════════════════
    const testStudents = [
      { name: "Aarav Kumar", email: "aarav@student.com", password: "Student@123", class: "8th" },
      { name: "Diya Sharma", email: "diya@student.com", password: "Student@123", class: "9th" },
      { name: "Rohan Verma", email: "rohan@student.com", password: "Student@123", class: "10th" },
    ];

    console.log("👥 CREATING TEST STUDENT ACCOUNTS");
    console.log("═══════════════════════════════════════");

    for (const std of testStudents) {
      // Remove if exists
      await User.deleteOne({ email: std.email });

      // Create user
      const user = await User.create({
        name: std.name,
        email: std.email,
        password: std.password,
        role: "student",
      });

      // Create student profile
      await Student.create({
        userId: user._id,
        class: std.class,
        phone: "+91 9876543210",
        enrolledCourses: [],
      });

      console.log(`   ✓ ${std.email} / ${std.password}`);
    }
    console.log("══════════════════════════════════════\n");

    // ════════════════════════════════════════════════════════════════
    // 3. SEED CONFIGURATION DATA (Courses, Batches, etc.)
    // ════════════════════════════════════════════════════════════════
    console.log("📋 SEEDING CONFIGURATION DATA");
    console.log("═══════════════════════════════════════");

    // Courses
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

    // Batches
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

    // Success Stories
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

    // Marketing Stats
    const marketingStatsData = {
      educators: "50+",
      yearsOfExperience: "15+",
      studentCount: "2000+",
      successRate: "98%",
    };

    // External Links
    const linksData = {
      youtubeChannel: "https://youtube.com/@jainshrineclasses",
      contactEmail: "contact@jainshrine.com",
      phone: "+91 XXXX XXXX XX",
      instagram: "https://instagram.com/jainshrineclasses",
      facebook: "https://facebook.com/jainshrineclasses",
    };

    // Seed all config
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
      } else {
        await Config.create({
          type: configItem.type,
          data: configItem.data,
          lastUpdatedBy: admin._id,
        });
      }
      console.log(`   ✓ ${configItem.type}`);
    }
    console.log("══════════════════════════════════════\n");

    // ════════════════════════════════════════════════════════════════
    // SUCCESS MESSAGE
    // ════════════════════════════════════════════════════════════════
    console.log("✅ SEED COMPLETED SUCCESSFULLY!\n");
    console.log("📊 Summary:");
    console.log("   • 1 Admin account created");
    console.log("   • 3 Student test accounts created");
    console.log("   • 5 Config sections populated");
    console.log("   • 3 Courses, 4 Batches, 4 Success Stories\n");
    console.log("🚀 You can now:");
    console.log("   1. Login as admin:   admin@jain.com / Admin@12345");
    console.log("   2. Login as student: aarav@student.com / Student@123");
    console.log("   3. Visit /api/config/courses to see seeded data\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    console.error(err);
    process.exit(1);
  }
};

seed();
