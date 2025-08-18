// src/controllers/airQualityController.js
const axios = require('axios');
const AirQualityLog = require('../models/AirQualityLog');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

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

const handleAirQualitySockets = (socket) => {
  socket.on('getAirQuality', async (coords) => {
    console.log(`Received request for coordinates:`, coords);
    const airQualityData = await getAirQuality(coords.lat, coords.lon);

    if (airQualityData && airQualityData.list && airQualityData.list.length > 0) {
      try {
        const newLog = new AirQualityLog({
          lat: coords.lat,
          lon: coords.lon,
          aqi: airQualityData.list[0].main.aqi,
        });
        await newLog.save();
        console.log('Air quality search logged to the database.');
      } catch (dbError) {
        console.error('Error saving log to the database:', dbError.message);
      }
    }
    
    socket.emit('airQualityData', airQualityData);
  });
};

module.exports = { handleAirQualitySockets };