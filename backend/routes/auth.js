import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register new user
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, fullName, role, genotype, bio } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        message: 'Email, password, full name, and role are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({
        message: 'Role must be either "patient" or "doctor"'
      });
    }

    if (role === 'patient' && !genotype) {
      return res.status(400).json({
        message: 'Genotype is required for patients'
      });
    }

    if (genotype && !['SS', 'SC', 'SE', 'CC', 'AS', 'AC'].includes(genotype)) {
      return res.status(400).json({
        message: 'Invalid genotype value'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        message: 'Full name must be at least 2 characters long'
      });
    }

    const user = new User({
      email,
      password,
      fullName,
      role,
      genotype: role === 'patient' ? genotype : undefined,
      bio
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Check authentication status
router.get('/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// Update user profile (role changes are NOT allowed)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { genotype, bio, fullName } = req.body;
    const updateData = {};

    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ message: 'Full name must be at least 2 characters' });
      }
      updateData.fullName = fullName.trim();
    }

    if (bio !== undefined) {
      if (typeof bio === 'string' && bio.length > 500) {
        return res.status(400).json({ message: 'Bio must be less than 500 characters' });
      }
      updateData.bio = typeof bio === 'string' ? bio.trim() : '';
    }

    if (genotype) {
      if (!['SS', 'SC', 'SE', 'CC', 'AS', 'AC'].includes(genotype)) {
        return res.status(400).json({ message: 'Invalid genotype value' });
      }
      updateData.genotype = genotype;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed. Please try again.' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
