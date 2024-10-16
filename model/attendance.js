const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      required: true,
    },
    numberCard: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    meetWith: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
