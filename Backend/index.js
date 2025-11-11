require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Middleware - MUST be before routes
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://artshos.vercel.app/',
  ], 
  credentials: true 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on https://artshos.onrender.com`);
});