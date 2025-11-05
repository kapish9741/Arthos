const express = require('express');
const router = express.Router();
const { signup, login, getUserByEmail } = require('../service/auth');
const { authenticateToken } = require('../middleware/auth');

// SIGNUP - Create account
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const result = await signup(email, password, name);
    res.status(201).json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// LOGIN - Sign in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const result = await login(email, password);
    res.status(200).json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// GET PROFILE - Protected route
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByEmail(req.user.email);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

// LOGOUT
router.post('/logout', authenticateToken, (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out' });
});

module.exports = router;
