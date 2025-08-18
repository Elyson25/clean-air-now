// src/controllers/reportController.js
const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const { description, latitude, longitude } = req.body;

  if (!description || !latitude || !longitude) {
    res.status(400);
    throw new Error('Please provide description and coordinates');
  }

  const report = new Report({
    user: req.user._id,
    description,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
  });

  const createdReport = await report.save();

  // --- DEBUGGING LOGS ---
  console.log('Report saved to DB:', createdReport._id);
  if (req.io) {
    console.log('Socket.IO is available. Broadcasting newReport event...');
    
    const publicReportData = {
      _id: createdReport._id,
      description: createdReport.description,
      status: createdReport.status,
      location: createdReport.location,
      createdAt: createdReport.createdAt,
    };

    req.io.emit('newReport', publicReportData);
    
    console.log('Broadcast sent.');
  } else {
    console.error('ERROR: Socket.IO (req.io) is NOT available on the request object.');
  }
  // --- END OF DEBUGGING ---

  res.status(201).json(createdReport);
});

// @desc    Get reports for the logged-in user
// @route   GET /api/reports/myreports
// @access  Private
const getUserReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Update a report's status
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const report = await Report.findById(req.params.id);

  if (report) {
    report.status = status || report.status;
    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Get all submitted reports for public map display
// @route   GET /api/reports/public
// @access  Public
const getPublicReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ status: { $in: ['Submitted', 'In Review'] } })
                              .select('location description status createdAt');
  res.json(reports);
});

module.exports = {
  createReport,
  getUserReports,
  getAllReports,
  updateReportStatus,
  getPublicReports,
};