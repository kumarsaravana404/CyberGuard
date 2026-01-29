require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const scanRoutes = require('./src/routes/scanRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
    res.send('CyberGuard API is running');
});

// Error handling
// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
