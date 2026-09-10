const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createReport,
  getUserReports,
  getPublicReports,
  getAllReports,
  updateReportStatus,
  updateReport, // Imported new dynamic content update controller
  deleteReport, // Imported new secure entity purge controller
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

// Master Administrative Registry Fetch Gateway
router.route('/').get(protect, admin, getAllReports);

// Specific Status Workflow Modification Gateway (Admin Restricted)
router.route('/:id/status').put(protect, admin, updateReportStatus);

// ─── NEW: SECURE SINGLE RECORD OPERATIONS ROUTE VERBS ───
// Handles instance updates and purges shielded by verified identity layers
router.route('/:id')
  .put(protect, updateReport)    // Both Owner & Admins can reach, guarded internally by controller checks
  .delete(protect, deleteReport); // Both Owner & Admins can reach, guarded internally by controller checks

module.exports = router;
