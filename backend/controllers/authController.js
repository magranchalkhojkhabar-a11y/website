const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'magranchal_secret_key_2026_super_secure', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Only allow setting 'admin' role if explicitly requested or seeding
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial Admin User if none exists
const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'magranchalkhojkabar.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'magranchal';
      const adminName = process.env.ADMIN_NAME || 'Admin Magranchal';

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed Admin] Admin user created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

// @desc    Authenticate or register user via Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    const { credential, id_token, email, name, googleId, avatar } = req.body;

    let userEmail = email;
    let userName = name;
    let userGoogleId = googleId;
    let userAvatar = avatar;

    const token = credential || id_token;

    // If an ID token was passed from Google GIS SDK, verify with Google API
    if (token) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          userEmail = payload.email || userEmail;
          userName = payload.name || payload.given_name || userName || (userEmail ? userEmail.split('@')[0] : 'Google User');
          userGoogleId = payload.sub || userGoogleId;
          userAvatar = payload.picture || userAvatar;
        }
      } catch (verifyErr) {
        console.warn('Google tokeninfo verification failed, continuing with payload:', verifyErr.message);
      }
    }

    if (!userEmail) {
      return res.status(400).json({ message: 'Google प्रमाणीकरण विफल: ईमेल आवश्यक है (Email is required)' });
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    // Check if user exists by email
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      let shouldSave = false;
      if (!user.googleId && userGoogleId) {
        user.googleId = userGoogleId;
        shouldSave = true;
      }
      if (!user.avatar && userAvatar) {
        user.avatar = userAvatar;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    } else {
      // Create new user via Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: userName || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: hashedPassword,
        googleId: userGoogleId || `google_${Date.now()}`,
        avatar: userAvatar || null,
        role: 'user'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: error.message || 'Google प्रमाणीकरण में सर्वर त्रुटि (Server error)' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  seedAdminUser
};
