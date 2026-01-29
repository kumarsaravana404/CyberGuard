const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 4) {
        return res.status(400).json({ message: "Password must be at least 4 characters long" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, existingUser) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (existingUser) return res.status(409).json({ message: "Email already registered" });

        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: "Error hashing password" });

            // Insert new user
            db.run(`INSERT INTO users (email, password_hash) VALUES (?, ?)`, [email, hash], function(err) {
                if (err) return res.status(500).json({ message: "Error creating user" });

                // Generate JWT
                const token = jwt.sign(
                    { id: this.lastID, email: email },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '1h' }
                );

                res.status(201).json({
                    success: true,
                    token,
                    user: { id: this.lastID, email: email },
                    message: "Registration successful"
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (err) return res.status(500).json({ message: "Error verifying password" });
            if (!result) return res.status(401).json({ message: "Invalid credentials" });

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' }
            );

            res.json({
                success: true,
                token,
                user: { id: user.id, email: user.email }
            });
        });
    });
};

exports.verify = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};
