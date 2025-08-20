const cron = require('node-cron');
const User = require('../models/User');
const axios = require('axios');
const sendEmail = require('./sendEmail');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const AQI_ALERT_THRESHOLD = parseInt(process.env.AQI_ALERT_THRESHOLD || '4', 10);

// Helper function to get AQI for a single location
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

// The main task to be scheduled
const checkAirQualityAndSendAlerts = async () => {
  console.log('Running scheduled job: Checking air quality for user alerts...');

  try {
    // Find all users who have at least one favorite location
    const users = await User.find({ 'favoriteLocations.0': { $exists: true } });

    if (users.length === 0) {
      console.log('No users with favorite locations. Skipping alert check.');
      return;
    }

    // Process all users concurrently for efficiency
    const promises = users.map(async (user) => {
      for (const loc of user.favoriteLocations) {
        const [longitude, latitude] = loc.location.coordinates;
        const currentAqi = await getAqiForLocation(longitude, latitude);

        if (currentAqi && currentAqi >= AQI_ALERT_THRESHOLD) {
          console.log(`ALERT: AQI is ${currentAqi} for user ${user.email} at location "${loc.name}". Sending email.`);
          
          const message = `This is an alert from Clean Air Now.
The current Air Quality Index (AQI) at your saved location "${loc.name}" is ${currentAqi}, which is considered Poor or worse.
It is recommended to reduce strenuous activities outdoors.
- 1 = Good
- 2 = Fair
- 3 = Moderate
- 4 = Poor
- 5 = Very Poor`;

          await sendEmail({
            email: user.email,
            subject: `💨 Air Quality Alert for ${loc.name}`,
            message,
          });
        }
      }
    });

    await Promise.all(promises);
    console.log('Finished scheduled job for user alerts.');
  } catch (error) {
    console.error('Error during scheduled alert check:', error);
  }
};

// The function that initializes the scheduler
const initializeAlertScheduler = () => {
  // Cron expression for "at minute 0 of every hour"
  // For testing, you can change this to '* * * * *' to run every minute
  cron.schedule('0 * * * *', checkAirQualityAndSendAlerts);

  console.log('✅ Air quality alert scheduler initialized. Will run at the top of every hour.');
};


module.exports = { initializeAlertScheduler };