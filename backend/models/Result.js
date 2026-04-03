const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    studentName: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    marks: {
      type: Number,
      required: [true, "Marks are required"],
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: 1,
      default: 100,
    },
    percentage: {
      type: Number,
    },
    grade: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-calculate percentage and grade before saving
ResultSchema.pre("save", function (next) {
  this.percentage = parseFloat(((this.marks / this.totalMarks) * 100).toFixed(2));
  if (this.percentage >= 90) this.grade = "A+";
  else if (this.percentage >= 80) this.grade = "A";
  else if (this.percentage >= 70) this.grade = "B+";
  else if (this.percentage >= 60) this.grade = "B";
  else if (this.percentage >= 50) this.grade = "C";
  else this.grade = "F";
  next();
});

module.exports = mongoose.model("Result", ResultSchema);
