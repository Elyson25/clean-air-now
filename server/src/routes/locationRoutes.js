const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
    addFavoriteLocation, 
    deleteFavoriteLocation,
    getFavoriteLocations,
} = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// Validation rules for adding a new location
const addLocationValidation = [
  body('name', 'Location name is required').not().isEmpty().trim().escape(),
  body('latitude', 'Latitude must be a valid number').isFloat({ min: -90, max: 90 }),
  body('longitude', 'Longitude must be a valid number').isFloat({ min: -180, max: 180 }),
  handleValidationErrors,
];

// Define the protected routes for managing locations
router.route('/')
  .post(protect, addLocationValidation, addFavoriteLocation)
  .get(protect, getFavoriteLocations);

router.route('/:id').delete(protect, deleteFavoriteLocation);

module.exports = router;