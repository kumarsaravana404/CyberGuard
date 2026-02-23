import "./style.css";
import { io } from "socket.io-client";
import Chart from "chart.js/auto";

const API_BASE = "http://localhost:3000";
let socket = null;
let authToken = null;

// ==========================================
// 1. AUTHENTICATION LOGIC
// ==========================================
const initSessionBtn = document.getElementById("initSessionBtn");
const authPortal = document.getElementById("auth-portal");
const mainLayout = document.getElementById("main-layout");
const signOutBtn = document.getElementById("signOutBtn");

// Helper to provide headers
function getHeaders(isFormData = false) {
  const headers = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
}

initSessionBtn.addEventListener("click", async () => {
  // We use hardcoded demo login here, but real input vals can be retrieved
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Admin_User", password: "password123" }),
    });
    const data = await res.json();
    if (res.ok) {
      authToken = data.token;
      // Switch UI
      authPortal.classList.add("hidden");
      mainLayout.classList.remove("hidden");
      mainLayout.classList.add("active");
      
      // Initialize Socket connection
      initSocket();
    } else {
      alert("Auth failed: " + data.error);
    }
  } catch (err) {
    alert("API unreachable");
  }
});

signOutBtn?.addEventListener("click", () => {
  authToken = null;
  if (socket) socket.disconnect();
  // Switch UI back
  mainLayout.classList.add("hidden");
  mainLayout.classList.remove("active");
  authPortal.classList.remove("hidden");
});

// ==========================================
// 2. NAVIGATION LOGIC
// ==========================================
const tabs = document.querySelectorAll(".nav-links .nav-item");
const views = document.querySelectorAll(".content-view");
const pageTitle = document.getElementById("pageTitle");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Hide all
    tabs.forEach((t) => t.classList.remove("active"));
    views.forEach((v) => v.classList.add("hidden"));
    
    // Show target
    tab.classList.add("active");
    const targetId = tab.getAttribute("data-tab");
    document.getElementById(targetId)?.classList.remove("hidden");
    
    // Some tabs don't have text we want to show on title directly, or we can use it
    if(pageTitle) pageTitle.textContent = tab.textContent.trim();
  });
});

// ==========================================
// 3. DASHBOARD LOGIC (WebSockets + Chart)
// ==========================================
const trafficLog = document.getElementById("trafficLog");
const packetRateEl = document.getElementById("packetRate");
let packetCount = 0;

let trafficChart = null;

function initSocket() {
  socket = io(API_BASE);
  
  if (document.getElementById("trafficChart")) {
    const ctx = document.getElementById("trafficChart").getContext("2d");
    trafficChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{ label: "Traffic", data: [], borderColor: "#3b82f6", tension: 0.4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  socket.on("packet", (packet) => {
    packetCount++;
    if(packetRateEl) packetRateEl.textContent = Math.floor(Math.random() * 50) + 20;

    if (trafficLog) {
      const logEntry = document.createElement("div");
      logEntry.textContent = `[${packet.timestamp}] ${packet.protocol} ${packet.source} -> ${packet.destination} (${packet.size} bytes)`;
      trafficLog.prepend(logEntry);
      if (trafficLog.children.length > 50) trafficLog.lastChild.remove();
    }

    if (trafficChart) {
      const now = new Date().toLocaleTimeString();
      if (trafficChart.data.labels.length > 20) {
        trafficChart.data.labels.shift();
        trafficChart.data.datasets[0].data.shift();
      }
      trafficChart.data.labels.push(now);
      trafficChart.data.datasets[0].data.push(packet.size);
      trafficChart.update("none");
    }
  });
}

// ==========================================
// 4. API TOOLS (Port, Net, Text)
// ==========================================
const startScanBtn = document.getElementById("startScanBtn");
if (startScanBtn) {
  startScanBtn.addEventListener("click", async () => {
    const host = document.getElementById("scanHost").value;
    const resultsDiv = document.getElementById("scanResults");
    resultsDiv.innerHTML = "Scanning...";
    try {
      const res = await fetch(`${API_BASE}/api/scan-ports`, {
        method: "POST", headers: getHeaders(),
        body: JSON.stringify({ host, startPort: 1, endPort: 100 }),
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      resultsDiv.innerHTML = `Host: ${data.host}\nOpen Ports: ${data.openPorts.join(", ") || "None found"}`;
    } catch (err) { resultsDiv.innerHTML = `Error: ${err.message}`; }
  });
}

const refreshNetworkBtn = document.getElementById("refreshNetworkBtn");
if (refreshNetworkBtn) {
  refreshNetworkBtn.addEventListener("click", async () => {
    const listDiv = document.getElementById("networkList");
    listDiv.innerHTML = "Scanning network...";
    try {
      const res = await fetch(`${API_BASE}/api/scan-network`, { headers: getHeaders() });
      const data = await res.json();
      listDiv.innerHTML = data.devices.map((d) => `
        <div class="card" style="margin-top: 10px; background: rgba(0,0,0,0.2);">
          <strong>${d.ip}</strong> - ${d.mac}<br><small>${d.vendor}</small>
        </div>`
      ).join("");
    } catch(e) { listDiv.innerHTML = "Error loading map"; }
  });
}

const analyzeTextBtn = document.getElementById("analyzeTextBtn");
if (analyzeTextBtn) {
  analyzeTextBtn.addEventListener("click", async () => {
    const text = document.getElementById("inputText").value;
    const resDiv = document.getElementById("textResults");
    try {
      const res = await fetch(`${API_BASE}/api/analyze-text`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify({ text }),
      });
      const data = await res.json();
      resDiv.innerHTML = `
        <div style="margin-top: 10px;">
          Risk Score: <strong style="color: ${data.riskScore > 50 ? "#ef4444" : "#22c55e"}">${data.riskScore}</strong><br>
          SQL Injection: ${data.containsSQL}<br>
          XSS: ${data.containsXSS}
        </div>`;
      
      const threatScoreDisplay = document.getElementById("threatScoreDisplay");
      if(threatScoreDisplay) {
         if(data.riskScore > 75) {
           threatScoreDisplay.textContent = "CRITICAL";
           threatScoreDisplay.className = "dial-main text-red";
         } else if (data.riskScore > 50) {
           threatScoreDisplay.textContent = "HIGH";
           threatScoreDisplay.className = "dial-main text-orange";
         } else if (data.riskScore > 25) {
           threatScoreDisplay.textContent = "MODERATE";
           threatScoreDisplay.className = "dial-main text-blue";
         } else {
           threatScoreDisplay.textContent = "LOW";
           threatScoreDisplay.className = "dial-main text-green";
         }
      }
    } catch(e) { resDiv.innerHTML = "Analysis error."; }
  });
}

const checkFirewallBtn = document.getElementById("checkFirewallBtn");
if (checkFirewallBtn) {
  checkFirewallBtn.addEventListener("click", async () => {
    const rulesStr = document.getElementById("firewallRules").value;
    const resDiv = document.getElementById("firewallResults");
    resDiv.innerHTML = "Analyzing...";
    try {
      const rules = JSON.parse(rulesStr);
      const res = await fetch(`${API_BASE}/api/check-firewall`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify({ rules })
      });
      const data = await res.json();
      if (data.issues && data.issues.length > 0) {
        resDiv.innerHTML = `<div class="text-red">Found ${data.issues.length} Issues:<br>` + 
                           data.issues.map(i => `- [${i.severity}] ${i.message}`).join('<br>') +
                           `</div>`;
      } else {
        resDiv.innerHTML = `<div class="text-green">Rules appear secure.</div>`;
      }
    } catch (e) {
      resDiv.innerHTML = `<div class="text-red">Error: Invalid JSON or Network issue.</div>`;
    }
  });
}

// ==========================================
// 5. STEGANOGRAPHY STUDIO
// ==========================================
let currentStegFile = null;

// UI elements inside Steganography view
const stegDropZone = document.getElementById("stegDropZone");
const stegFileInput = document.createElement("input");
stegFileInput.type = "file"; stegFileInput.accept = "image/png"; stegFileInput.style.display = "none";
document.body.appendChild(stegFileInput);

// Re-using some generic classes/ids we know exist in the new UI HTML
// To select the correct process button, we will just grab the primary button in the 3rd card
const stegCards = document.querySelectorAll("#steganography .steg-card");
let processStegBtn = null;
let stegTextarea = null;
let stegKeyInput = null;

if (stegCards.length >= 3) {
  // Connect file input routing
  const browseBtn = stegDropZone?.querySelector("button");
  if (browseBtn) browseBtn.addEventListener("click", () => stegFileInput.click());

  stegFileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      currentStegFile = e.target.files[0];
      const nameTxt = stegDropZone.querySelector("h4");
      if(nameTxt) nameTxt.textContent = currentStegFile.name;
    }
  });

  stegTextarea = stegCards[1].querySelector("textarea");
  stegKeyInput = stegCards[1].querySelector("input[type='password']");
  processStegBtn = stegCards[2].querySelector("button.btn-primary");
  
  if (processStegBtn) {
    processStegBtn.addEventListener("click", async () => {
      if (!currentStegFile) return alert("Select an image first!");
      const msg = stegTextarea?.value;
      if (!msg) return alert("Enter a message to hide.");

      const formData = new FormData();
      formData.append("image", currentStegFile);
      formData.append("message", msg);
      if (stegKeyInput?.value) formData.append("key", stegKeyInput.value);

      processStegBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

      try {
        const res = await fetch(`${API_BASE}/api/steganography/encode`, {
          method: "POST",
          headers: getHeaders(true), // Content-Type omitted for FormData
          body: formData
        });

        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error);
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `protected_${currentStegFile.name}`;
        a.click();
        
        // Log to terminal
        const log = document.getElementById("stegLogs");
        if(log) log.innerHTML += `<div class="log-line text-green">[SYS] Successfully encoded & downloaded!</div>`;

      } catch(err) {
        alert("Steg Error: " + err.message);
      } finally {
        processStegBtn.innerHTML = '<i class="fa-solid fa-microchip"></i> Process & Download Encoded Image';
      }
    });
  }
}

// ==========================================
// 6. VAULT DECODE LOGIC
// ==========================================
const decodeZone = document.querySelector(".d-zone-decode");
const decodeWrapper = decodeZone?.parentElement;

if (decodeWrapper) {
  const decodeFileInput = document.createElement("input");
  decodeFileInput.type = "file"; decodeFileInput.accept = "image/png"; decodeFileInput.style.display = "none";
  document.body.appendChild(decodeFileInput);
  
  decodeZone.addEventListener("click", () => decodeFileInput.click());
  
  const scanBtn = decodeWrapper.querySelector("button.btn-outline-dark");
  const waitingBox = decodeWrapper.querySelector(".waiting-box");
  
  let currentDecodeFile = null;
  decodeFileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      currentDecodeFile = e.target.files[0];
      decodeZone.querySelector("p").innerHTML = `Selected: <span class="text-blue">${currentDecodeFile.name}</span>`;
    }
  });

  if (scanBtn) {
    scanBtn.addEventListener("click", async () => {
      if (!currentDecodeFile) return alert("Upload an image to scan first.");
      
      const formData = new FormData();
      formData.append("image", currentDecodeFile);
      // Let's assume the user doesn't input a key here for simplicity, or we add a prompt
      const key = prompt("Enter decryption key (leave blank if none):") || "";
      formData.append("key", key);

      scanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
      try {
        const res = await fetch(`${API_BASE}/api/steganography/decode`, {
          method: "POST", headers: getHeaders(true), body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
           waitingBox.classList.remove("text-muted", "italic", "bg-dark-opacity");
           waitingBox.classList.add("text-green", "mono");
           waitingBox.innerHTML = `<strong>PAYLOAD FOUND:</strong><br>${data.message}`;
        } else {
           waitingBox.innerHTML = `<span class="text-red">Error: ${data.error}</span>`;
        }
      } catch(e) {
        waitingBox.innerHTML = "Scan failed due to network error.";
      } finally {
        scanBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Scan for Metadata';
      }
    });
  }
}
