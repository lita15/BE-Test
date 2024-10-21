const Attendance = require("../model/attendance");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");
const moment = require("moment");

// Create Attendance
const createAttendance = async (req, res) => {
  const {
    fullName,
    checkIn,
    address,
    purpose,
    identity,
    numberCard,
    signature,
    meetWith,
    gender,
    noPhone,
    education,
  } = req.body;

  try {
    const existingCard = await Attendance.findOne({ numberCard });
    if (existingCard) {
      return res
        .status(400)
        .json({ message: "numberCard already exists", status: false });
    }

    const data = await Attendance.create({
      fullName,
      checkIn,
      address,
      purpose,
      identity,
      numberCard,
      signature,
      meetWith,
      gender,
      noPhone,
      education,
    });
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "pdfAttendance.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      fullName,
      // checkIn: new Date(checkIn).toLocaleString(),
      checkIn: moment(checkIn).format("dddd, DD MMMM YYYY, HH:mm"),
      address,
      purpose,
      identity,
      numberCard,
      signature,
      meetWith,
      noPhone,
      education,
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      `pdfAttendance-${fullName}.pdf`
    );
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true, // Include background colors and images
      margin: {
        top: "10px",
        right: "10px",
        bottom: "10px",
        left: "10px",
      },
      height: "auto", // Allow automatic height based on content
    });

    await browser.close();

    // Respond with success and PDF URL
    return res.status(201).json({
      message: "Created Successfully",
      status: true,
      data,
      pdfUrl: `${req.protocol}://${req.get(
        "host"
      )}/public/pdfAttendance-${fullName}.pdf`,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

//get all attendance
const getAllAttendances = async (req, res) => {
  try {
    const filters = {};

    if (req.query.fullName) {
      filters.fullName = { $regex: req.query.fullName, $options: "i" };
    }
    // if (req.query.checkIn) {
    //   filters.checkIn = { $regex: req.query.checkIn, $options: "i" };
    // }

    if (req.query.checkIn) {
      const checkInDate = new Date(req.query.checkIn);
      filters.checkIn = {
        $gte: new Date(checkInDate.setHours(0, 0, 0, 0)),
        $lt: new Date(checkInDate.setHours(23, 59, 59, 999)),
      };
    }

    if (req.query.address) {
      filters.address = { $regex: req.query.address, $options: "i" };
    }
    if (req.query.purpose) {
      filters.purpose = { $regex: req.query.purpose, $options: "i" };
    }
    if (req.query.numberCard) {
      filters.numberCard = { $regex: req.query.numberCard, $options: "i" };
    }

    const data = await Attendance.find(filters);

    return res
      .status(200)
      .json({ message: "Retrieved Successfully", status: true, data });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

// Read Attendance by ID
const getAttendanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Attendance.findById(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Attendance not found", status: false });
    }
    return res
      .status(200)
      .json({ message: "Retrieved Successfully", status: true, data });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

// Update Attendance
const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const data = await Attendance.findByIdAndUpdate(id, updates, { new: true });
    if (!data) {
      return res
        .status(404)
        .json({ message: "Attendance not found", status: false });
    }
    return res
      .status(200)
      .json({ message: "Updated Successfully", status: true, data });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

//checkout attendance
const checkOutAttendance = async (req, res) => {
  const { id } = req.params;
  const { checkOut } = req.body;

  try {
    const attendance = await Attendance.findById(id, { new: true });
    if (!attendance) {
      return res
        .status(404)
        .json({ message: "Attendance not found", status: false });
    }
    attendance.checkOut = checkOut;
    attendance.numberCard = "-";
    await attendance.save();
    return res.status(200).json({
      message: "Check out successfully",
      status: true,
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

//check available numberCard
const checkNumberCardAvailability = async (req, res) => {
  const { numberCard } = req.body;

  try {
    const existingRecord = await Attendance.findOne({ numberCard });
    if (existingRecord && !existingRecord.checkOut) {
      return res
        .status(200)
        .json({ message: "Number card is currently in use.", status: false });
    }
    return res
      .status(200)
      .json({ message: "Number card is available.", status: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

// Delete Attendance
const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Attendance.findByIdAndDelete(id);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Attendance not found", status: false });
    }
    return res
      .status(200)
      .json({ message: "Deleted Successfully", status: true });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: false });
  }
};

module.exports = {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  checkOutAttendance,
  checkNumberCardAvailability,
  deleteAttendance,
};
