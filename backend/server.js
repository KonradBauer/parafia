require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // limit requests per windowMs
  message: { error: 'Zbyt wiele żądań, spróbuj ponownie później' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: { error: 'Zbyt wiele prób logowania, spróbuj ponownie za 15 minut' }
});

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: isProduction ? corsOrigins : true,
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Auth rate limiting
app.use('/api/auth/login', authLimiter);

// API routes
app.use('/api', routes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve admin panel (production build)
const adminPath = isProduction
  ? path.join(__dirname, 'admin-dist')
  : path.join(__dirname, 'admin', 'dist');

app.use('/admin', express.static(adminPath));

// Admin SPA fallback
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// Serve frontend (production)
app.use(express.static(path.join(__dirname, 'public')));

// Frontend SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: isProduction ? 'Wystąpił błąd serwera' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Parafia CMS Server                                    ║
╠════════════════════════════════════════════════════════╣
║  Mode:        ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}                            ║
║  Server:      http://localhost:${PORT}                      ║
║  Admin:       http://localhost:${PORT}/admin                ║
║  API:         http://localhost:${PORT}/api                  ║
╚════════════════════════════════════════════════════════╝
  `);
});
