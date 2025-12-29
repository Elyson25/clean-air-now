require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { handleAirQualitySockets } = require('./controllers/airQualityController');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// --- TRUST PROXY SETTING ---
// Required for express-rate-limit to work correctly behind a proxy like Render.
app.set('trust proxy', 1);

// --- PRODUCTION CORS SETUP ---
const allowedOrigins = [
  'https://clean-air-now.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  }
};

// --- MIDDLEWARE ---
app.use(cors(corsOptions)); // Use the specific CORS options for all Express API routes
app.use(express.json());

const server = http.createServer(app);

// --- SOCKET.IO CORS ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

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
});
app.use('/api', limiter);

// --- API ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/history', historyRoutes);

// Socket.IO Connection Handler
const onConnection = (socket) => {
  console.log(`Socket.IO: A user has connected! ID: ${socket.id}`);
  handleAirQualitySockets(socket);
  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected. ID: ${socket.id}`);
  });
};
io.on('connection', onConnection);

// Custom Error Handler
app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});