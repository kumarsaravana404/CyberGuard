const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This will be replaced with MongoDB in production
// For now, we'll use a temporary in-memory store (not persistent)
// You MUST replace this with MongoDB Atlas or another cloud database
let users = [];

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters long' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  try {
    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password_hash: hash,
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, email: newUser.email },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};
