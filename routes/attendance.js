var express = require("express");
const {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  checkOutAttendance,
  checkNumberCardAvailability,
} = require("../controller/attendanceController");
var router = express.Router();

router.get("/", getAllAttendances);
router.get("/:id", getAttendanceById);
router.post("/", createAttendance);
router.post("/check-number-card", checkNumberCardAvailability);
router.put("/:id", updateAttendance);
router.put("/:id/checkout", checkOutAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;
