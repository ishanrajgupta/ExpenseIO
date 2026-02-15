const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Google ID are required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user with Google info
      user.googleId = googleId;
      user.profilePicture = picture || user.profilePicture;
      user.authProvider = 'google';
      if (name && !user.name) user.name = name;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        profilePicture: picture || '',
        authProvider: 'google',
        password: Math.random().toString(36).slice(-8) + 'Temp!' // Temporary password
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        token
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
});

module.exports = router;
