export function calculateThreatScore(scanResults) {
  let score = 0;
  
  // Port Scan Factors
  if (scanResults.openPorts && scanResults.openPorts.length > 0) {
    score += scanResults.openPorts.length * 5; // 5 points per open port
    if (scanResults.openPorts.includes(21)) score += 20; // FTP
    if (scanResults.openPorts.includes(23)) score += 30; // Telnet
    if (scanResults.openPorts.includes(3389)) score += 15; // RDP
  }

  // Text Analysis Factors
  if (scanResults.textAnalysis) {
    score += scanResults.textAnalysis.riskScore;
  }

  return Math.min(100, score);
}
