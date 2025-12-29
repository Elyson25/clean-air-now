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
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { handleAirQualitySockets } = require('../controllers/airQualityController');

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.set('trust proxy', 1);

// CORS Configuration
const allowedOrigins = [
  'https://clean-air-now.vercel.app',
  /https:\/\/clean-air-now-.*\.vercel\.app$/,
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from our allowed list.
    if (!origin || allowedOrigins.some(pattern => 
        typeof pattern === 'string' ? pattern === origin : pattern.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/history', historyRoutes);

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