const jwt = require('jsonwebtoken');
const dbConnect = require('../config/dbConnect');
const Scan = require('../models/Scan');

const analyzeText = (text) => {
  const keywords = {
    high: ['password', 'credit card', 'ssn', 'social security', 'bank account', 'login', 'hack', 'exploit', 'malware', 'virus'],
    medium: ['click here', 'urgent', 'verify', 'confirm', 'account', 'suspended', 'locked', 'prize', 'winner', 'congratulations'],
    low: ['free', 'offer', 'discount', 'limited time', 'act now']
  };

  let riskScore = 0;
  const lowerText = text.toLowerCase();

  keywords.high.forEach(word => {
    if (lowerText.includes(word)) riskScore += 30;
  });

  keywords.medium.forEach(word => {
    if (lowerText.includes(word)) riskScore += 15;
  });

  keywords.low.forEach(word => {
    if (lowerText.includes(word)) riskScore += 5;
  });

  riskScore = Math.min(riskScore, 100);

  const threatLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
  const phishingDetected = riskScore >= 50;

  return { riskScore, threatLevel, phishingDetected };
};

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

  // Verify token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    await dbConnect();

    // Analyze the text
    const analysis = analyzeText(text);

    // Save scan result
    const scan = await Scan.create({
      user_id: decoded.id,
      input_text: text,
      risk_score: analysis.riskScore,
      threat_level: analysis.threatLevel,
      phishing_detected: analysis.phishingDetected,
    });

    res.json({
      success: true,
      ...analysis,
      id: scan._id,
      created_at: scan.created_at,
      message: 'Scan completed successfully'
    });
  } catch (error) {
    console.error('Scan error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error during scan' });
  }
};
