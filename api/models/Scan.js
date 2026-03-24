const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  input_text: String,
  risk_score: Number,
  threat_level: String,
  phishing_detected: Boolean,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
