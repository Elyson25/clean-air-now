const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Add a favorite location for the logged-in user
// @route   POST /api/locations
// @access  Private
const addFavoriteLocation = asyncHandler(async (req, res) => {
  const { name, latitude, longitude } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const newLocation = {
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    };

    // Add the new location object to the user's favoriteLocations array
    user.favoriteLocations.push(newLocation);
    await user.save();
    
    // Return the complete, updated list of favorite locations
    res.status(201).json(user.favoriteLocations);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a favorite location for the logged-in user
// @route   DELETE /api/locations/:id
// @access  Private
const deleteFavoriteLocation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Use Mongoose's .pull() method to remove an object from an array by its _id
    user.favoriteLocations.pull({ _id: req.params.id });
    await user.save();
    
    // Return the updated list of favorite locations
    res.json(user.favoriteLocations);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all favorite locations for the logged-in user
// @route   GET /api/locations
// @access  Private
const getFavoriteLocations = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('favoriteLocations');
    if (user) {
        res.json(user.favoriteLocations);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
  addFavoriteLocation,
  deleteFavoriteLocation,
  getFavoriteLocations,
};