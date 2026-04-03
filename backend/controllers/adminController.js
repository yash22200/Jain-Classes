const User = require("../models/User");
const Student = require("../models/Student");
const Enquiry = require("../models/Enquiry");
const Result = require("../models/Result");
const Resource = require("../models/Resource");
const Quiz = require("../models/Quiz");

// ─── STUDENTS ──────────────────────────────────────────────

// @desc  Get all students
// @route GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    const studentProfiles = await Student.find().populate("userId", "name email createdAt");

    const merged = studentProfiles.map((sp) => ({
      id: sp.userId._id,
      name: sp.userId.name,
      email: sp.userId.email,
      class: sp.class,
      phone: sp.phone,
      enrolledCourses: sp.enrolledCourses,
      joinDate: sp.joinDate,
      status: sp.status,
      rollNumber: sp.rollNumber,
    }));

    res.json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Add a new student (admin-created, no auth account)
// @route POST /api/admin/students
const addStudent = async (req, res) => {
  try {
    const { name, email, password = "student123", enrolledCourses, phone, class: studentClass } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role: "student", phone: phone || "" });

    const student = await Student.create({
      userId: user._id,
      class: studentClass || "10th",
      phone: phone || "",
      enrolledCourses: enrolledCourses || [],
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: student.class,
        enrolledCourses: student.enrolledCourses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete a student
// @route DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await Student.findOneAndDelete({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ENQUIRIES ─────────────────────────────────────────────

// @desc  Get all enquiries
// @route GET /api/admin/enquiries
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update enquiry status
// @route PUT /api/admin/enquiries/:id
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["new", "reviewed", "responded"];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({ success: true, message: "Status updated", data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESULTS ───────────────────────────────────────────────

// @desc  Get all results (admin view)
// @route GET /api/admin/results
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    const formatted = results.map((r) => ({
      id: r._id,
      studentId: r.studentId?._id,
      studentName: r.studentId?.name || r.studentName,
      subject: r.subject,
      marks: r.marks,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      grade: r.grade,
      date: r.createdAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Add a result
// @route POST /api/admin/results
const addResult = async (req, res) => {
  try {
    const { studentId, subject, marks, totalMarks } = req.body;

    if (!studentId || !subject || marks === undefined || !totalMarks) {
      return res.status(400).json({ success: false, message: "All result fields are required" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const result = await Result.create({
      studentId,
      studentName: student.name,
      subject,
      marks: Number(marks),
      totalMarks: Number(totalMarks),
    });

    res.status(201).json({ success: true, message: "Result added", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── HOMEWORKS ──────────────────────────────────────────────

// @desc  Get all uploaded homeworks
// @route GET /api/admin/homeworks
const getAllHomeworks = async (req, res) => {
  try {
    const Homework = require("../models/Homework");
    // Find all homeworks and populate the basic student info from User
    const homeworks = await Homework.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    // Fetch all Student profiles to cross-reference their "class" / grade
    const studentProfiles = await Student.find().select("userId class");

    // Format the response
    const formatted = homeworks.map((hw) => {
      // Find the corresponding student profile to get the class/grade
      const profile = studentProfiles.find(
        (sp) => sp.userId.toString() === hw.studentId?._id.toString()
      );
      
      return {
        id: hw._id,
        studentName: hw.studentId?.name || "Unknown Student",
        studentEmail: hw.studentId?.email || "",
        grade: profile?.class || "N/A",
        subject: hw.subject,
        fileName: hw.fileName,
        filePath: "uploads/" + hw.filePath.replace(/\\/g, '/').split('/').pop(),
        status: hw.status,
        date: hw.createdAt,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESOURCES ──────────────────────────────────────────────

const addResource = async (req, res) => {
  try {
    const { title, url, description, type, grade } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: "Title and URL are required" });
    }
    const resource = await Resource.create({ title, url, description, type: type || "video", grade });
    res.status(201).json({ success: true, message: "Resource added successfully", data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── QUIZZES ────────────────────────────────────────────────

const addQuiz = async (req, res) => {
  try {
    const { title, description, course, questions } = req.body;
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Title and questions are required" });
    }
    const quiz = await Quiz.create({
      title,
      description,
      course,
      questions,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, message: "Quiz created successfully", data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  deleteStudent,
  getAllEnquiries,
  updateEnquiryStatus,
  getAllResults,
  addResult,
  getAllHomeworks,
  addResource,
  getAllResources,
  deleteResource,
  addQuiz,
  getAllQuizzes,
  deleteQuiz,
};
