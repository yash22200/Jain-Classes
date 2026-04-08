const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["courses", "batches", "success_stories", "marketing_stats", "links"],
      required: true,
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
