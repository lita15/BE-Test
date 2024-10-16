const Attendance = require("../model/attendance")

// get All Attendance
const getAttendanceStatus = async (req, res) => {
    try {
        const attendances = await Attendance.find();
        const activeUsers = attendances.filter(user => user.numberCard && typeof user.numberCard === 'string' && !user.numberCard.includes('-'));
        const nonActiveUsers = attendances.filter(user => user.numberCard && typeof user.numberCard === 'string' && user.numberCard.includes('-'));

        return res.status(200).json({
            message: "Retrieved Successfully",
            status: true,
            data : {
                "allAttendance":attendances.length,
                "activeCount":activeUsers.length,
                "nonActiveCount":nonActiveUsers.length,
            }
        });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};

module.exports = {
    getAttendanceStatus
}