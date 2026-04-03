const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// All admin routes are protected and require admin role
router.use(protect, authorize("admin"));

// Students
router.get("/students", getAllStudents);
router.post("/students", addStudent);
router.delete("/students/:id", deleteStudent);

// Enquiries
router.get("/enquiries", getAllEnquiries);
router.put("/enquiries/:id", updateEnquiryStatus);

// Results
router.get("/results", getAllResults);
router.post("/results", addResult);
// Homeworks
router.get("/homeworks", getAllHomeworks);

// Resources
router.get("/resources", getAllResources);
router.post("/resources", addResource);
router.delete("/resources/:id", deleteResource);

// Quizzes
router.get("/quizzes", getAllQuizzes);
router.post("/quizzes", addQuiz);
router.delete("/quizzes/:id", deleteQuiz);

module.exports = router;
