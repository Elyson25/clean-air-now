const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// --- NEW PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// --- PROTECTED ROUTES ---
router.route('/profile').get(protect, getUserProfile);

// --- ADMIN ROUTES ---
router.route('/').get(protect, admin, getAllUsers);

module.exports = router;