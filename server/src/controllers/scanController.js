const { db } = require('../config/db');
const { calculateRisk } = require('../utils/phishingDetector');

exports.scanUrl = (req, res) => {
    const { input } = req.body;
    const userId = req.user.id; // From middleware

    if (!input) {
        return res.status(400).json({ message: "Input is required" });
    }

    const { score, level, phishing, message } = calculateRisk(input);

    // Save to DB
    const stmt = db.prepare(`INSERT INTO scans (user_id, input_text, risk_score, threat_level, phishing_detected) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([userId, input, score, level, phishing ? 1 : 0], function(err) {
        if (err) {
            console.error("Error saving scan:", err);
            // Don't fail the request if saving history fails, just log it? Or maybe fail? 
            // Better to return result anyway but maybe with error note? No, simple.
        }
        
        res.json({
            success: true,
            riskScore: score,
            threatLevel: level,
            phishing,
            message
        });
    });
    stmt.finalize();
};

exports.getHistory = (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5; // Default to 5
    
    db.all(`SELECT input_text, risk_score, threat_level, phishing_detected, created_at FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`, [userId, limit], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        
        const history = rows.map(r => ({
            input: r.input_text, // Send full text, let frontend truncate
            score: r.risk_score,
            level: r.threat_level,
            phishing: !!r.phishing_detected,
            time: r.created_at
        }));

        res.json({ success: true, history });
    });
};
