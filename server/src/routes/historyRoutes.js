const express = require('express');
const router = express.Router();
const { getAqiHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

// Define the protected route for fetching AQI history
router.route('/').get(protect, getAqiHistory);

module.exports = router;