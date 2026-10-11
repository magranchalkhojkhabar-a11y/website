const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { seedAdminUser } = require('./controllers/authController');

// Initialize Express
const app = express();

// Connect Database
connectDB().then(() => {
  // Seed initial Admin Account
  seedAdminUser();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve local static upload directory fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/newspapers', require('./routes/newspaperRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Magranchal Khoj Khabar API',
    time: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error Stack:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Magranchal Khoj Khabar Server running on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
