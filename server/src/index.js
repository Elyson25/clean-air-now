require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io'); // Import Server from socket.io
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

// --- CORE MIDDLEWARE for Express API ---
app.use(cors()); // This is for regular API routes
app.use(express.json());

const server = http.createServer(app);

// --- MODIFIED: Socket.IO Server Initialization with CORS Configuration ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Explicitly allow your React app's origin
    methods: ["GET", "POST"]      // Allow these HTTP methods
  }
});

// Middleware to make `io` instance available to controllers
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
  console.log(`%cSocket.IO: A user has connected! ID: ${socket.id}`, 'color: green; font-weight: bold;');
  handleAirQualitySockets(socket);
  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected. ID: ${socket.id}`);
  });
};

io.on('connection', onConnection);

// Custom Error Handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});