const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// 1. Make JWT token
function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// 2. Check if JWT token is valid
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// 3. Create new user
async function signup(email, password, name) {
  // Check if user exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('User already exists');

  // Create user in database
  const user = await prisma.user.create({
    data: { email, password, name }
  });

  // Return token and user info
  const token = generateToken(email);
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

// 4. Login user
async function login(email, password) {
  // Find user in database
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  if (user.password !== password) throw new Error('Wrong password');

  // Return token and user info
  const token = generateToken(email);
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

// 5. Get user by email
async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  return { id: user.id, email: user.email, name: user.name };
}

module.exports = { generateToken, verifyToken, signup, login, getUserByEmail };
