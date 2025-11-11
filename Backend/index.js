require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');

const app = express();


app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

app.listen(8080, () => {
  console.log('Server running on https://artshos.onrender.com');
});