const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createReport,
  getUserReports,
  getPublicReports,
  getAllReports,
  updateReportStatus,
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// --- Validation Rules ---
const reportValidation = [
  body('description', 'Description is required').not().isEmpty().trim().escape(),
  body('latitude', 'Latitude must be a valid number').isFloat({ min: -90, max: 90 }),
  body('longitude', 'Longitude must be a valid number').isFloat({ min: -180, max: 180 }),
  handleValidationErrors,
];

// --- Route Definitions ---
router.route('/public').get(getPublicReports);
router.route('/').post(protect, reportValidation, createReport);
router.route('/myreports').get(protect, getUserReports);
router.route('/').get(protect, admin, getAllReports);
router.route('/:id/status').put(protect, admin, updateReportStatus);

module.exports = router;