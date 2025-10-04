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

  // Populate user info to send with the event
  const reportWithUser = await Report.findById(createdReport._id).populate('user', 'name');
  
  // --- IMPORTANT LOG FOR DEBUGGING ---
  console.log('--- Emitting "newReport" event to all clients ---');
  req.io.emit('newReport', reportWithUser);
  
  res.status(201).json(createdReport);
});

// ... (The rest of the file is unchanged) ...
const getUserReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reports);
});

const getPublicReports = asyncHandler(async (req, res) => {
  const expirationHours = process.env.REPORT_EXPIRATION_HOURS || 24;
  const cutoffDate = new Date(Date.now() - expirationHours * 60 * 60 * 1000);
  const reports = await Report.find({ createdAt: { $gte: cutoffDate } })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reports);
});

const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(reports);
});

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

module.exports = {
  createReport,
  getUserReports,
  getPublicReports,
  getAllReports,
  updateReportStatus,
};