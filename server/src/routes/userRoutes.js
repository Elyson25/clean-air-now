// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Import all functions from the controller
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getAllUsers,
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');

// --- Validation Rule Definitions ---
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

// --- Route Definitions ---
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/forgotpassword', forgotPasswordValidation, forgotPassword);
router.put('/resetpassword/:resettoken', resetPasswordValidation, resetPassword);

router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getAllUsers); // Admin route to get all users

module.exports = router;