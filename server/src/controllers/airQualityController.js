const axios = require('axios');
const AirQualityLog = require('../models/AirQualityLog');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Fetches the current air quality data from the OpenWeather API
const getAirQuality = async (lat, lon) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching air quality data:", error.message);
    return null;
  }
};

// Handles the 'getAirQuality' event from a connected client
const handleAirQualitySockets = (socket) => {
  socket.on('getAirQuality', async (coords) => {
    const airQualityData = await getAirQuality(coords.lat, coords.lon);

    // If data is fetched successfully, log it to the database
    if (airQualityData && airQualityData.list && airQualityData.list.length > 0) {
      try {
        // Save the log using the new GeoJSON format
        const newLog = new AirQualityLog({
          location: {
            type: 'Point',
            coordinates: [coords.lon, coords.lat], // GeoJSON is [longitude, latitude]
          },
          aqi: airQualityData.list[0].main.aqi,
        });
        await newLog.save();
        console.log('Air quality search logged to the database.');
      } catch (dbError) {
        console.error('Error saving log to the database:', dbError.message);
      }
    }
    
    // Send the fetched data back to the client that requested it
    socket.emit('airQualityData', airQualityData);
  });
};

module.exports = { handleAirQualitySockets };