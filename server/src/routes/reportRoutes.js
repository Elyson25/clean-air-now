// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReport,
  getUserReports,
  getAllReports,
  updateReportStatus,
  getPublicReports, // Imported controller
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for map data - NO 'protect' middleware
router.route('/public').get(getPublicReports);

// User-specific routes (protected)
router.route('/').post(protect, createReport);
router.route('/myreports').get(protect, getUserReports);

// Admin-specific routes (protected and admin only)
router.route('/').get(protect, admin, getAllReports);
router.route('/:id/status').put(protect, admin, updateReportStatus);


module.exports = router;