const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Creates a reference to the User model
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  status: {
    type: String,
    required: true,
    enum: ['Submitted', 'In Review', 'Resolved'],
    default: 'Submitted',
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
}, {
  timestamps: true,
});

// Create a 2dsphere index for geospatial queries
ReportSchema.index({ location: '2dsphere' });

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;