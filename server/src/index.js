// server/src/index.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { handleAirQualitySockets } = require('./controllers/airQualityController');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// --- PRODUCTION CORS SETUP ---
// Define the list of origins that are allowed to connect to our backend.
const allowedOrigins = [
  'https://clean-air-now.vercel.app', // Your live frontend URL
  'http://localhost:5173'           // The URL for your local development frontend
];

// CORS options for Express (for regular API calls like login, register)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests that have an origin found in our allowedOrigins list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions)); // Use the specific CORS options for Express
app.use(express.json());

const server = http.createServer(app);

// --- PRODUCTION Socket.IO CORS ---
// We use the same list of allowed origins for our real-time WebSocket connections.
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware to make the `io` instance available on the `req` object for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api', limiter);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Socket.IO Connection Handler
const onConnection = (socket) => {
  console.log(`Socket.IO: A user has connected! ID: ${socket.id}`);
  handleAirQualitySockets(socket);
  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected. ID: ${socket.id}`);
  });
};

io.on('connection', onConnection);

// Custom Error Handler Middleware
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});