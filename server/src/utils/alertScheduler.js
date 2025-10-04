const cron = require('node-cron');
const User = require('../models/User');
const axios = require('axios');
const sendEmail = require('./sendEmail');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const AQI_ALERT_THRESHOLD = parseInt(process.env.AQI_ALERT_THRESHOLD || '4', 10);

// Helper function to get AQI for given coordinates
const getAqiForLocation = async (longitude, latitude) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);
    if (response.data && response.data.list && response.data.list.length > 0) {
      return response.data.list[0].main.aqi;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching AQI for alert check (${latitude}, ${longitude}):`, error.message);
    return null;
  }
};

// The main task to check air quality and send alerts
const checkAirQualityAndSendAlerts = async () => {
  console.log('Running scheduled job: Checking air quality for user alerts...');
  try {
    const users = await User.find({ 'favoriteLocations.0': { $exists: true } });
    if (users.length === 0) {
      console.log('No users with favorite locations. Skipping alert check.');
      return;
    }
    const promises = users.map(async (user) => {
      for (const loc of user.favoriteLocations) {
        const [longitude, latitude] = loc.location.coordinates;
        const currentAqi = await getAqiForLocation(longitude, latitude);
        if (currentAqi && currentAqi >= AQI_ALERT_THRESHOLD) {
          console.log(`ALERT: AQI is ${currentAqi} for user ${user.email} at location "${loc.name}". Sending email.`);
          const message = `This is an alert from Clean Air Now...\n[Your email message content]`;
          await sendEmail({ email: user.email, subject: `💨 Air Quality Alert for ${loc.name}`, message });
        }
      }
    });
    await Promise.all(promises);
    console.log('Finished scheduled job successfully.');
  } catch (error) {
    // We log the error, but we DO NOT let it crash the server.
    console.error('CRITICAL ERROR during scheduled alert check:', error);
  }
};

// The function that initializes the scheduler
const initializeAlertScheduler = () => {
  // Cron expression for "at minute 0 of every hour"
  console.log('Initializing air quality alert scheduler to run hourly...');
  
  cron.schedule('0 * * * *', () => {
    // Wrap the call in a try-catch as an extra layer of safety within the cron job itself.
    try {
      checkAirQualityAndSendAlerts();
    } catch (e) {
      console.error('FATAL ERROR inside cron.schedule callback:', e);
    }
  });

  console.log('✅ Air quality alert scheduler is now running.');
};

module.exports = { initializeAlertScheduler };