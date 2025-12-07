import './style.css';
import { io } from 'socket.io-client';
import Chart from 'chart.js/auto';

// Initialize Socket.io
const socket = io('http://localhost:3000');

// Navigation Logic
const tabs = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view');
const pageTitle = document.getElementById('pageTitle');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class
    tabs.forEach(t => t.classList.remove('active'));
    views.forEach(v => v.classList.add('hidden'));

    // Add active class
    tab.classList.add('active');
    const targetId = tab.getAttribute('data-tab');
    document.getElementById(targetId).classList.remove('hidden');
    
    // Update Title
    pageTitle.textContent = tab.textContent.trim();
  });
});

// Dashboard Logic
const trafficLog = document.getElementById('trafficLog');
const packetRateEl = document.getElementById('packetRate');
let packetCount = 0;

// Chart Setup
const ctx = document.getElementById('trafficChart').getContext('2d');
const trafficChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Network Traffic',
      data: [],
      borderColor: '#3b82f6',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { grid: { display: false } }
    }
  }
});

// Socket Events
socket.on('packet', (packet) => {
  packetCount++;
  packetRateEl.textContent = Math.floor(Math.random() * 50) + 20; // Simulated rate

  // Log Packet
  const logEntry = document.createElement('div');
  logEntry.textContent = `[${packet.timestamp}] ${packet.protocol} ${packet.source} -> ${packet.destination} (${packet.size} bytes)`;
  trafficLog.prepend(logEntry);
  if (trafficLog.children.length > 50) trafficLog.lastChild.remove();

  // Update Chart
  const now = new Date().toLocaleTimeString();
  if (trafficChart.data.labels.length > 20) {
    trafficChart.data.labels.shift();
    trafficChart.data.datasets[0].data.shift();
  }
  trafficChart.data.labels.push(now);
  trafficChart.data.datasets[0].data.push(packet.size);
  trafficChart.update('none');
});

// Port Scanner Logic
document.getElementById('startScanBtn').addEventListener('click', async () => {
  const host = document.getElementById('scanHost').value;
  const resultsDiv = document.getElementById('scanResults');
  resultsDiv.innerHTML = 'Scanning...';

  try {
    const res = await fetch('http://localhost:3000/api/scan-ports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, startPort: 1, endPort: 100 }) // Limit for demo
    });
    const data = await res.json();
    resultsDiv.innerHTML = `Host: ${data.host}\nOpen Ports: ${data.openPorts.join(', ') || 'None found'}`;
  } catch (err) {
    resultsDiv.innerHTML = `Error: ${err.message}`;
  }
});

// Network Scanner Logic
document.getElementById('refreshNetworkBtn').addEventListener('click', async () => {
  const listDiv = document.getElementById('networkList');
  listDiv.innerHTML = 'Scanning network...';
  
  const res = await fetch('http://localhost:3000/api/scan-network');
  const data = await res.json();
  
  listDiv.innerHTML = data.devices.map(d => `
    <div class="card" style="margin-top: 10px; background: rgba(0,0,0,0.2);">
      <strong>${d.ip}</strong> - ${d.mac}<br>
      <small>${d.vendor}</small>
    </div>
  `).join('');
  
  document.getElementById('activeDevices').textContent = data.devices.length;
});

// Text Analysis Logic
document.getElementById('analyzeTextBtn').addEventListener('click', async () => {
  const text = document.getElementById('inputText').value;
  const resDiv = document.getElementById('textResults');
  
  const res = await fetch('http://localhost:3000/api/analyze-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  
  resDiv.innerHTML = `
    <div style="margin-top: 10px;">
      Risk Score: <strong style="color: ${data.riskScore > 50 ? '#ef4444' : '#22c55e'}">${data.riskScore}</strong><br>
      SQL Injection: ${data.containsSQL}<br>
      XSS: ${data.containsXSS}
    </div>
  `;
  
  document.getElementById('threatScore').textContent = data.riskScore;
});
