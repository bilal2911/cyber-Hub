const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Production Security Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading uploaded files in client HTML tags
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // standard Vite port
  'http://localhost:3000', // standard Next.js / Create React App port
  'http://127.0.0.1:5173',
  'https://cyber-hub-mocha.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploaded Document files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Rate Limiting to Protect Against Brute-force/DoS ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 1000, // Limit each IP to 1000 requests per window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// --- Mounting API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/settings', require('./routes/settings'));

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Cyber Hub Services API Portal. Fast, secure, and production ready.',
    version: '1.0.0'
  });
});

// --- Centralized Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(`💥 Unhandled Exception: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server listening
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Cyber Hub API Server running in production on port ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
