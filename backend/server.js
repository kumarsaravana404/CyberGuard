import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { z } from 'zod';

import { analyzeText } from '../utils/scanner.js';
import { scanPorts } from '../utils/portScanner.js';
import { scanNetwork } from '../utils/arpScanner.js';
import { startSniffing } from '../utils/packetSniffer.js';
import { checkFirewallRules } from '../utils/firewallChecker.js';
import { calculateThreatScore } from '../utils/threatScore.js';
import { fingerprintDevice } from '../utils/deviceFingerprint.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for demo
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Validation Schemas
const textSchema = z.object({ text: z.string() });
const portScanSchema = z.object({ host: z.string(), startPort: z.number().optional(), endPort: z.number().optional() });
const firewallSchema = z.object({ rules: z.array(z.object({ action: z.string(), port: z.any(), source: z.string() })) });

// Routes

// 1. Text Analysis
app.post('/api/analyze-text', (req, res) => {
  try {
    const { text } = textSchema.parse(req.body);
    const result = analyzeText(text);
    res.json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 2. Port Scanner
app.post('/api/scan-ports', async (req, res) => {
  try {
    const { host, startPort, endPort } = portScanSchema.parse(req.body);
    const openPorts = await scanPorts(host, startPort, endPort);
    res.json({ host, openPorts });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 3. ARP Scanner (Mock)
app.get('/api/scan-network', async (req, res) => {
  const devices = await scanNetwork();
  res.json({ devices });
});

// 4. Firewall Checker
app.post('/api/check-firewall', (req, res) => {
  try {
    const { rules } = firewallSchema.parse(req.body);
    const issues = checkFirewallRules(rules);
    res.json({ issues });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// 5. Threat Score
app.post('/api/threat-score', (req, res) => {
  const score = calculateThreatScore(req.body);
  res.json({ score });
});

// 6. Device Fingerprinting
app.get('/api/fingerprint', (req, res) => {
  const fingerprint = fingerprintDevice(req.headers['user-agent'], req.ip);
  res.json(fingerprint);
});

// 7. Live Dashboard (WebSockets)
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
