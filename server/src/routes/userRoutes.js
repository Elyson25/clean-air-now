const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  deleteUser,
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

// Protected Admin Routes
router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

module.exports = router;