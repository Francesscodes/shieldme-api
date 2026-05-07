const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

// --- Security Headers ---
// helmet adds ~15 HTTP headers that protect against common attacks
// like clickjacking, XSS, and sniffing
app.use(helmet());

// --- CORS ---
// Allows your frontend (e.g. a React app) to talk to this API
// Right now it allows all origins — lock this down in production
app.use(cors());

// --- Rate Limiting ---
// Limits each IP to 100 requests per 15 minutes
// Protects against brute force and spam attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Stricter limiter for auth routes specifically
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
});

app.use(express.json());

// --- Routes ---
const authRoutes = require('./routes/auth.routes');
const reportRoutes = require('./routes/report.routes');
const commentRoutes = require('./routes/comment.routes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🛡️ ShieldMe API is running.' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully.');
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 ShieldMe server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();