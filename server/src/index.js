// src/index.js
require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const connectDB = require('./config/db');
const { handleAirQualitySockets } = require('./controllers/airQualityController');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your client's URL
    methods: ["GET", "POST"]
  }
});


// --- THIS IS THE CRITICAL FIX ---
// This custom middleware MUST come BEFORE the API routes are defined.
// It attaches the `io` instance to every single request object (`req`).
app.use((req, res, next) => {
  req.io = io;
  next();
});


// --- API Routes ---
// Now, when a request hits '/api/reports', the `req` object will already have `req.io`.
app.get('/', (req, res) => {
  res.send('<h1>Clean Air Now Server</h1>');
});
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);


// --- Socket.IO Connection Handler for other real-time features ---
const onConnection = (socket) => {
  console.log('A user has connected via WebSocket:', socket.id);
  handleAirQualitySockets(socket);
  socket.on('disconnect', () => {
    console.log('User has disconnected via WebSocket:', socket.id);
  });
};
io.on('connection', onConnection);


// --- Error Handling Middleware (must be last) ---
app.use(errorHandler);


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});