const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (Login)
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Handle forgot password request
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('There is no user with that email');
  }
  const resetToken = user.getPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you requested a password reset. Please click the link below to complete the process (link is valid for 10 minutes):\n\n${resetUrl}`;
  try {
    await sendEmail({ email: user.email, subject: 'Password Reset Token - Clean Air Now', message });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset user's password
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    success: true, token: generateToken(user._id), _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
  });
});

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile (name & email)
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin, token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user password
const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.matchPassword(oldPassword))) {
    res.status(401);
    throw new Error('Old password is not correct');
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// @desc    Get all users (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// --- NEW DEBUGGING FUNCTION ---
// @desc    Debug environment variables (Admin Only)
// @route   GET /api/users/debug-env
// @access  Private/Admin
const debugEnvironment = asyncHandler(async (req, res) => {
  console.log('--- ADMIN DEBUG: CHECKING ENVIRONMENT VARIABLES ---');
  console.log(`JWT_SECRET Exists: ${!!process.env.JWT_SECRET}`);
  console.log(`MONGO_URI Exists: ${!!process.env.MONGO_URI}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log('--- END ADMIN DEBUG ---');

  res.status(200).json({
    message: "Debug information has been logged on the server.",
    jwtSecretExists: !!process.env.JWT_SECRET,
    mongoUriExists: !!process.env.MONGO_URI,
    frontendUrl: process.env.FRONTEND_URL,
    emailHost: process.env.EMAIL_HOST,
  });
});

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getAllUsers,
  debugEnvironment, // Export the new function
};