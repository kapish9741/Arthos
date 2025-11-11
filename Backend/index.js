require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT;


app.use(express.json());

app.use('/api/auth', authRoutes);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`https://artshos.onrender.com`);
});