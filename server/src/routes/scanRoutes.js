const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, scanController.scanUrl);
router.get('/history', authenticateToken, scanController.getHistory);

module.exports = router;
