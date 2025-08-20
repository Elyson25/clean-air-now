const mongoose = require('mongoose');

const AirQualityLogSchema = new mongoose.Schema({
  // Store location as a GeoJSON Point for geospatial queries
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Stored as [longitude, latitude]
      required: true,
    },
  },
  aqi: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Creates a special 2dsphere index that allows for efficient location-based queries.
AirQualityLogSchema.index({ location: '2dsphere' });

const AirQualityLog = mongoose.model('AirQualityLog', AirQualityLogSchema);

module.exports = AirQualityLog;