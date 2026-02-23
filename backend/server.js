import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { analyzeText } from '../utils/scanner.js';
import { scanPorts } from '../utils/portScanner.js';
import { scanNetwork } from '../utils/arpScanner.js';
import { startSniffing } from '../utils/packetSniffer.js';
import { checkFirewallRules } from '../utils/firewallChecker.js';
import { calculateThreatScore } from '../utils/threatScore.js';
import { fingerprintDevice } from '../utils/deviceFingerprint.js';
import { encodeLSB, decodeLSB } from '../utils/steganography.js';

// Setup File Uploads (Memory Storage for quick processing)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024 } // 24MB max size
});

const app = express();
const httpServer = createServer(app);

// Environment Constants
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-cyberguard-key";

// Lockdown CORS to specific Frontend Origin
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Security Middleware
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Authentication Middleware
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access Denied: Missing Authentication Bearer Token" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or Expired Token" });
  }
};

// Validation Schemas
const loginSchema = z.object({ username: z.string(), password: z.string() });
const textSchema = z.object({ text: z.string() });
const portScanSchema = z.object({ host: z.string().refine(v => !v.startsWith('10.') && v !== '127.0.0.1', { message: 'Scanning private subnets blocked by policy.' }), startPort: z.number().optional(), endPort: z.number().optional() });
const firewallSchema = z.object({ rules: z.array(z.object({ action: z.string(), port: z.any(), source: z.string() })) });

// ---------------- ROUTES ---------------- //

// 0. Authentication
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    // Hardcoded credentials for Demo
    if (username.toLowerCase() === 'admin_user') {
      const token = jwt.sign({ username, role: 'Security Architect' }, JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token, message: "Authentication Successful" });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 1. Text Analysis (Protected)
app.post('/api/analyze-text', requireAuth, (req, res) => {
  try {
    const { text } = textSchema.parse(req.body);
    const result = analyzeText(text);
    res.json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 2. Port Scanner (Protected)
app.post('/api/scan-ports', requireAuth, async (req, res) => {
  try {
    const { host, startPort, endPort } = portScanSchema.parse(req.body);
    const openPorts = await scanPorts(host, startPort, endPort);
    res.json({ host, openPorts });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 3. ARP Scanner (Mock) (Protected)
app.get('/api/scan-network', requireAuth, async (req, res) => {
  const devices = await scanNetwork();
  res.json({ devices });
});

// 4. Firewall Checker (Protected)
app.post('/api/check-firewall', requireAuth, (req, res) => {
  try {
    const { rules } = firewallSchema.parse(req.body);
    const issues = checkFirewallRules(rules);
    res.json({ issues });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 5. Threat Score (Protected)
app.post('/api/threat-score', requireAuth, (req, res) => {
  const score = calculateThreatScore(req.body);
  res.json({ score });
});

// 6. Device Fingerprinting (Protected)
app.get('/api/fingerprint', requireAuth, (req, res) => {
  const fingerprint = fingerprintDevice(req.headers['user-agent'], req.ip);
  res.json(fingerprint);
});

// 7. Steganography - Encode Secret Message (Protected)
app.post('/api/steganography/encode', [requireAuth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'image/png') return res.status(400).json({ error: 'Only PNG files are supported for LSB encoding.' });
    if (!req.body.message) return res.status(400).json({ error: 'Message payload is required.' });

    const key = req.body.key || '';
    const result = await encodeLSB(req.file.buffer, req.body.message, key);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="encoded_steg_output.png"');
    res.send(result.outBuffer);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 8. Steganography - Decode Hidden Data (Protected)
app.post('/api/steganography/decode', [requireAuth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'image/png') return res.status(400).json({ error: 'Only PNG files are supported for LSB decoding.' });

    const key = req.body.key || '';
    const message = await decodeLSB(req.file.buffer, key);
    
    res.json({ success: true, message });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 9. Live Dashboard (WebSockets)
io.on('connection', (socket) => {
  console.log('Client connected to dashboard');
  
  // Start packet sniffing simulation for this client
  const stopSniffing = startSniffing((packet) => {
    socket.emit('packet', packet);
  });

  socket.on('disconnect', () => {
    stopSniffing();
    console.log('Client disconnected');
  });
});

httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
