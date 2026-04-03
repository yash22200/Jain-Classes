const express = require("express");
const router = express.Router();
const { getProfile, getMyResults, uploadHomework, getMyHomework, getStudentResources, enrollCourse, getAvailableQuizzes, submitQuizAttempt } = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All student routes are protected
router.use(protect, authorize("student"));

router.get("/profile", getProfile);
router.get("/results", getMyResults);
router.post("/homework", upload.single("file"), uploadHomework);
router.get("/homework", getMyHomework);
router.get("/resources", getStudentResources);
router.post("/courses/enroll", enrollCourse);
router.get("/quizzes", getAvailableQuizzes);
router.post("/quizzes/:id/attempt", submitQuizAttempt);

module.exports = router;
