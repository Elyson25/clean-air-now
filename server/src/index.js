require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
// Importing necessary modules and routes
// Paths should start with './' to look inside the current 'src' directory
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const historyRoutes = require('./routes/historyRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { handleAirQualitySockets } = require('./controllers/airQualityController');
const { initializeAlertScheduler } = require('./utils/alertScheduler');

// Connect to Database
connectDB();

// Start the Alert Scheduler
initializeAlertScheduler();

const PORT = process.env.PORT || 5000;
const app = express();

// --- CORS and other middleware ---
const allowedOrigins = [ 'https://clean-air-now.vercel.app', 'http://localhost:5173' ];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins, methods: ["GET", "POST"] } });
app.use((req, res, next) => { req.io = io; next(); });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api', limiter);

// --- API Routes (unchanged) ---
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/locations', locationRoutes);

// --- Socket.IO, Error Handler, Server Listen (unchanged) ---
const onConnection = (socket) => {
  console.log(`Socket.IO: A user has connected! ID: ${socket.id}`);
  handleAirQualitySockets(socket);
  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected. ID: ${socket.id}`);
  });
};
io.on('connection', onConnection);
app.use(errorHandler);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});