const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    fileName: {
      type: String,
    },
    filePath: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "checked", "graded"],
      default: "pending",
    },
    marks: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", HomeworkSchema);
