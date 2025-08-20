const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Define a sub-schema for favorite locations.
// This allows us to have a structured array of objects within the User document.
const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Home", "Work"
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // Stored as [longitude, latitude]
      required: true,
    },
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a name'] },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: { type: String, required: [true, 'Please provide a password'], minlength: 6 },
  isAdmin: { type: Boolean, required: true, default: false },
  
  // This new field will store an array of favorite locations using the schema defined above.
  favoriteLocations: [LocationSchema],

  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });


// --- METHODS ---
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;