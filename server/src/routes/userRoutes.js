const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import all necessary controller functions
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  debugEnvironment, // Import the new function
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// --- Validation Rule Definitions (unchanged) ---
const registerValidation = [
  body('name', 'Name is required').not().isEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  handleValidationErrors,
];
const loginValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
  handleValidationErrors,
];
const forgotPasswordValidation = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  handleValidationErrors,
];
const resetPasswordValidation = [
  body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  handleValidationErrors,
];
const updateProfileValidation = [
  body('name', 'Name is required').not().isEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  handleValidationErrors,
];
const updatePasswordValidation = [
  body('oldPassword', 'Old password is required').not().isEmpty(),
  body('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
  handleValidationErrors,
];

// --- Route Definitions ---

// Public Routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgotpassword', forgotPasswordValidation, forgotPassword);
router.put('/resetpassword/:resettoken', resetPasswordValidation, resetPassword);

// Protected User Routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProfileValidation, updateUserProfile);
router.put('/updatepassword', protect, updatePasswordValidation, updateUserPassword);

// --- NEW DEBUGGING ROUTE ---
// This route is protected and can only be accessed by an admin.
router.get('/debug-env', protect, admin, debugEnvironment);

// Protected Admin Route
router.get('/', protect, admin, getAllUsers);

module.exports = router;