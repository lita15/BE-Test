var express = require('express');
const { getAttendanceStatus } = require('../controller/dashboardController');
var router = express.Router();

router.get('/', getAttendanceStatus);
module.exports = router;
