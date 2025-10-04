const asyncHandler = require('express-async-handler');
const AirQualityLog = require('../models/AirQualityLog');

// @desc    Get historical AQI data for a given location (last 7 days)
// @route   GET /api/history?lon=...&lat=...
// @access  Private (only for logged-in users)
const getAqiHistory = asyncHandler(async (req, res) => {
  const { lon, lat } = req.query;

  if (!lon || !lat) {
    res.status(400);
    throw new Error('Please provide longitude and latitude query parameters');
  }

  const longitude = parseFloat(lon);
  const latitude = parseFloat(lat);

  // Search radius in meters (e.g., 5 kilometers)
  const searchRadius = 5000;

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Use MongoDB's geospatial query ($near) to find logs within the radius
  // and filter by date.
  const history = await AirQualityLog.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: searchRadius,
      },
    },
    createdAt: { $gte: sevenDaysAgo },
  }).sort({ createdAt: 'asc' }); // Sort ascending for a proper time-series chart

  res.json(history);
});

module.exports = { getAqiHistory };