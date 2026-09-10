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
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
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

// @desc    Get logged-in user's reports
// @route   GET /api/reports/myreports
// @access  Private
const getUserReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Get active public reports within time threshold
// @route   GET /api/reports/public
// @access  Public
const getPublicReports = asyncHandler(async (req, res) => {
  const expirationHours = process.env.REPORT_EXPIRATION_HOURS || 24;
  const cutoffDate = new Date(Date.now() - expirationHours * 60 * 60 * 1000);
  const reports = await Report.find({ createdAt: { $gte: cutoffDate } })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Get all system reports
// @route   GET /api/reports
// @access  Private/Admin
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Update an incident status
// @route   PUT /api/reports/:id/status
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const report = await Report.findById(req.params.id);
  if (report) {
    report.status = status || report.status;
    const updatedReport = await report.save();
    
    // Broadcast status change across active WebSocket connections
    req.io.emit('reportStatusUpdated', updatedReport);
    
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// ─── NEW: SECURE USER CONTENT UPDATE PRIVILEGE GATEWAY ───
// @desc    Update report details (User owner or Admin override)
// @route   PUT /api/reports/:id
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report instance not found in directory');
  }

  // 1. Role Check: If not admin, verify explicit record ownership properties
  const isOwner = report.user.toString() === req.user._id.toString();
  const isAdminOverride = req.user.isAdmin;

  if (!isOwner && !isAdminOverride) {
    res.status(401);
    throw new Error('Action blocked: Profile unauthorized to update this entity node');
  }

  // 2. Smart Status Lock: Prevent user updates once investigation workflows begin
  if (!isAdminOverride && report.status !== 'Submitted') {
    res.status(400);
    throw new Error(`Changes restricted: Incident is currently locked under phase: "${report.status}"`);
  }

  report.description = description || report.description;
  const updatedReport = await report.save();
  
  // Real-time synchronization broadcast across client nodes
  req.io.emit('reportUpdated', updatedReport);
  
  res.json(updatedReport);
});

// ─── NEW: SECURE ENTITY PURGE PRIVILEGE GATEWAY ───
// @desc    Remove report entirely (User owner or Admin override)
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report instance not found in directory');
  }

  const isOwner = report.user.toString() === req.user._id.toString();
  const isAdminOverride = req.user.isAdmin;

  if (!isOwner && !isAdminOverride) {
    res.status(401);
    throw new Error('Action blocked: Profile unauthorized to delete this entry log');
  }

  if (!isAdminOverride && report.status !== 'Submitted') {
    res.status(400);
    throw new Error('Purge restricted: Secure logs cannot be deleted once marked under official review review');
  }

  await report.deleteOne();
  
  // Broadcast deletion across WebSockets to clear markers instantly on client maps
  req.io.emit('reportDeleted', req.params.id);
  
  res.json({ id: req.params.id, message: 'Incident log successfully expunged from primary registries' });
});

module.exports = {
  createReport,
  getUserReports,
  getPublicReports,
  getAllReports,
  updateReportStatus,
  updateReport, // Expose to routing engine
  deleteReport, // Expose to routing engine
};
