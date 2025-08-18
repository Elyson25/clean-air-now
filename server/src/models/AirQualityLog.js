// src/models/AirQualityLog.js
const mongoose = require('mongoose');

const AirQualityLogSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  aqi: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const AirQualityLog = mongoose.model('AirQualityLog', AirQualityLogSchema);

module.exports = AirQualityLog;