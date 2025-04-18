import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes - use default import with correct extension
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
console.log('Environment loaded, NODE_ENV:', process.env.NODE_ENV);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration with explicit allowed origins
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

console.log('CORS configured with origins:', corsOptions.origin);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // Log request headers to debug CORS issues
  console.log('Request headers:', req.headers);
  next();
});

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// Static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  console.log('Serving static files from:', path.join(__dirname, '../dist'));
}

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
console.log('API routes registered: /api/projects, /api/tasks, /api/auth');

// Handle production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log('To test authentication, make a POST request to http://localhost:5000/api/auth/login');
  console.log('Default credentials: username=admin, password=admin123');
});

export default app; 