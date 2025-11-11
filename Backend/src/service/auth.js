const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

async function signup(email, password, name) {
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error('User already exists');

    const user = await prisma.user.create({
      data: { email, password, name }
    });

    const token = generateToken(email);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    if (error.message === 'User already exists') {
      throw error;
    }
    console.error('Signup error:', error);
    throw new Error('Signup failed. Please try again.');
  }
}

async function login(email, password) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');
    if (user.password !== password) throw new Error('Invalid email or password');

    const token = generateToken(email);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      throw error;
    }
    console.error('Login error:', error);
    throw new Error('Login failed. Please try again.');
  }
}

async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name };
  } catch (error) {
    if (error.message === 'User not found') {
      throw error;
    }
    console.error('Get user error:', error);
    throw new Error('Failed to get user. Please try again.');
  }
}

module.exports = { generateToken, verifyToken, signup, login, getUserByEmail };
