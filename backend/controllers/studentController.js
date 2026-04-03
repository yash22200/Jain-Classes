const User = require("../models/User");
const Student = require("../models/Student");
const Result = require("../models/Result");
const Homework = require("../models/Homework");
const Resource = require("../models/Resource");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const path = require("path");

// @desc  Get student profile
// @route GET /api/student/profile
// @access Private (student)
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const profile = await Student.findOne({ userId: user._id });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || profile?.phone || "",
        class: profile?.class || "10th",
        rollNumber: profile?.rollNumber || "",
        enrolledCourses: profile?.enrolledCourses || [],
        joinDate: profile?.joinDate || user.createdAt,
        status: profile?.status || "active",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get student's own results
// @route GET /api/student/results
// @access Private (student)
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Upload homework
// @route POST /api/student/homework
// @access Private (student)
const uploadHomework = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ success: false, message: "Subject is required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    const homework = await Homework.create({
      studentId: req.user._id,
      subject,
      fileName: req.file.originalname,
      filePath: "uploads/" + req.file.filename,
      status: "pending",
    });

    res.status(201).json({ success: true, message: "Homework uploaded successfully", data: homework });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get student's homework list
// @route GET /api/student/homework
// @access Private (student)
const getMyHomework = async (req, res) => {
  try {
    const homeworks = await Homework.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: homeworks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get student's resources
// @route GET /api/student/resources
// @access Private (student)
const getStudentResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Enroll in a course
// @route POST /api/student/courses/enroll
// @access Private (student)
const enrollCourse = async (req, res) => {
  try {
    const { courseName } = req.body;
    if (!courseName) {
      return res.status(400).json({ success: false, message: "Course name is required" });
    }

    const profile = await Student.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    if (!profile.enrolledCourses.includes(courseName)) {
      profile.enrolledCourses.push(courseName);
      await profile.save();
    }

    res.json({ success: true, message: "Successfully enrolled in course", data: profile.enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── QUIZZES ────────────────────────────────────────────────

// @desc  Get available quizzes
// @route GET /api/student/quizzes
// @access Private (student)
const getAvailableQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select("-questions.correctOption").sort({ createdAt: -1 });
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Submit quiz attempt
// @route POST /api/student/quizzes/:id/attempt
// @access Private (student)
const submitQuizAttempt = async (req, res) => {
  try {
    const { answers } = req.body; // e.g. { "0": 1, "1": 2 } where key is question index, value is selected option
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q, index) => {
      const studentAnswer = answers[index];
      if (studentAnswer !== undefined && studentAnswer === q.correctOption) {
        score++;
      }
    });

    const attempt = await QuizAttempt.create({
      quizId,
      studentId: req.user._id,
      score,
      totalQuestions
    });

    res.status(201).json({ 
      success: true, 
      message: "Quiz submitted successfully", 
      data: { score, totalQuestions, attemptId: attempt._id } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getProfile, 
  getMyResults, 
  uploadHomework, 
  getMyHomework, 
  getStudentResources, 
  enrollCourse,
  getAvailableQuizzes,
  submitQuizAttempt
};
