import { useState } from "react";
import {
  Scan,
  Shield,
  ShieldAlert,
  Lock,
  Unlock,
  Globe,
  Server,
  Database,
  Cloud,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react";

const PortScanner = () => {
  const [targetIp, setTargetIp] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState([]);
  const [scanMode, setScanMode] = useState("quick"); // quick, full, custom
  const [expandedPort, setExpandedPort] = useState(null);

  // Common ports and services
  const commonPorts = [
    { port: 20, service: "FTP Data", protocol: "TCP", risk: "medium" },
    { port: 21, service: "FTP Control", protocol: "TCP", risk: "medium" },
    { port: 22, service: "SSH", protocol: "TCP", risk: "low" },
    { port: 23, service: "Telnet", protocol: "TCP", risk: "high" },
    { port: 25, service: "SMTP", protocol: "TCP", risk: "medium" },
    { port: 53, service: "DNS", protocol: "UDP", risk: "low" },
    { port: 80, service: "HTTP", protocol: "TCP", risk: "medium" },
    { port: 110, service: "POP3", protocol: "TCP", risk: "medium" },
    { port: 143, service: "IMAP", protocol: "TCP", risk: "medium" },
    { port: 443, service: "HTTPS", protocol: "TCP", risk: "low" },
    { port: 445, service: "SMB", protocol: "TCP", risk: "high" },
    { port: 3306, service: "MySQL", protocol: "TCP", risk: "high" },
    { port: 3389, service: "RDP", protocol: "TCP", risk: "high" },
    { port: 5432, service: "PostgreSQL", protocol: "TCP", risk: "high" },
    { port: 8080, service: "HTTP Proxy", protocol: "TCP", risk: "medium" },
    { port: 27017, service: "MongoDB", protocol: "TCP", risk: "high" },
  ];

  const handleScan = async () => {
    if (!targetIp) return;

    setScanning(true);
    setScanProgress(0);
    setScanResults([]);

    // Simulate port scanning
    const portsToScan =
      scanMode === "quick" ? commonPorts.slice(0, 10) : commonPorts;

    const results = [];
    for (let i = 0; i < portsToScan.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const port = portsToScan[i];
      const isOpen = Math.random() > 0.7; // 30% chance port is open

      if (isOpen) {
        results.push({
          ...port,
          state: "open",
          banner: `${port.service} v${(Math.random() * 5 + 1).toFixed(1)}`,
          responseTime: Math.floor(Math.random() * 100) + 10,
        });
      }

      setScanProgress(((i + 1) / portsToScan.length) * 100);
    }

    setScanResults(results.sort((a, b) => a.port - b.port));
    setScanning(false);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getRiskBorder = (risk) => {
    switch (risk) {
      case "high":
        return "border-red-500";
      case "medium":
        return "border-yellow-500";
      case "low":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  const getRiskBg = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-950/20";
      case "medium":
        return "bg-yellow-950/20";
      case "low":
        return "bg-green-950/20";
      default:
        return "bg-gray-950/20";
    }
  };

  const getServiceIcon = (service) => {
    if (service.includes("HTTP")) return <Globe size={14} />;
    if (service.includes("SSH")) return <Lock size={14} />;
    if (service.includes("FTP")) return <Server size={14} />;
    if (
      service.includes("Database") ||
      service.includes("SQL") ||
      service.includes("MongoDB")
    )
      return <Database size={14} />;
    if (service.includes("RDP")) return <Cloud size={14} />;
    return <Server size={14} />;
  };

  const stats = {
    total: scanResults.length,
    high: scanResults.filter((r) => r.risk === "high").length,
    medium: scanResults.filter((r) => r.risk === "medium").length,
    low: scanResults.filter((r) => r.risk === "low").length,
  };

  return (
    <div className="card-terminal relative group hover:border-green-600 transition-all duration-300">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-900">
        <div className="flex items-center gap-3">
          <Scan
            size={20}
            className={`${scanning ? "text-green-500 animate-pulse" : "text-green-500"}`}
          />
          <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Network_Port_Scanner
            </h3>
            <span className="text-[9px] text-green-700 font-mono">
              Service Detection & Enumeration
            </span>
          </div>
        </div>
      </div>

      {/* Scan Configuration */}
      <div className="space-y-3 mb-4">
        {/* Target IP */}
        <div>
          <label className="text-[10px] text-green-700 uppercase mb-2 block font-mono">
            Target_IP_Address
          </label>
          <div className="flex items-center border border-green-900 hover:border-green-700 focus-within:border-green-500 transition-colors bg-black/50 px-3 py-2">
            <span className="text-green-500 font-mono mr-2 text-sm">&gt;</span>
            <input
              type="text"
              value={targetIp}
              onChange={(e) => setTargetIp(e.target.value)}
              placeholder="192.168.1.1 or example.com"
              className="w-full bg-transparent text-green-100 placeholder-green-900/50 focus:outline-none font-mono text-sm"
              disabled={scanning}
            />
          </div>
        </div>

        {/* Scan Mode */}
        <div>
          <label className="text-[10px] text-green-700 uppercase mb-2 block font-mono">
            Scan_Mode
          </label>
          <div className="flex gap-2">
            {["quick", "full", "custom"].map((mode) => (
              <button
                key={mode}
                onClick={() => setScanMode(mode)}
                disabled={scanning}
                className={`flex-1 px-3 py-2 text-[10px] font-bold uppercase border transition-all ${
                  scanMode === mode
                    ? "bg-green-500 text-black border-green-500"
                    : "text-green-700 border-green-900 hover:border-green-700"
                } disabled:opacity-50`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-green-700 font-mono">
            {scanMode === "quick" && "• Scans top 10 common ports (fastest)"}
            {scanMode === "full" &&
              "• Scans all well-known ports (comprehensive)"}
            {scanMode === "custom" && "• Configure custom port range"}
          </div>
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={scanning || !targetIp}
          className="w-full btn-terminal disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {scanning ? (
            <>
              <Square size={16} />
              <span>SCANNING...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>[ START_SCAN ]</span>
            </>
          )}
        </button>
      </div>

      {/* Scan Progress */}
      {scanning && (
        <div className="mb-4 bg-green-950/20 border border-green-900/50 p-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-green-600 font-mono">SCAN_PROGRESS</span>
            <span className="text-green-400 font-mono font-bold">
              {Math.floor(scanProgress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-green-950 border border-green-900 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-green-700 via-green-500 to-green-700 transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Statistics */}
      {scanResults.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-2">
            <div className="text-[9px] text-green-700 uppercase mb-1">
              Total
            </div>
            <div className="text-lg font-bold text-green-400 font-mono">
              {stats.total}
            </div>
          </div>
          <div className="bg-linear-to-br from-red-950/30 to-transparent border border-red-900/50 p-2">
            <div className="text-[9px] text-red-700 uppercase mb-1">High</div>
            <div className="text-lg font-bold text-red-500 font-mono">
              {stats.high}
            </div>
          </div>
          <div className="bg-linear-to-br from-yellow-950/30 to-transparent border border-yellow-900/50 p-2">
            <div className="text-[9px] text-yellow-700 uppercase mb-1">
              Medium
            </div>
            <div className="text-lg font-bold text-yellow-500 font-mono">
              {stats.medium}
            </div>
          </div>
          <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-2">
            <div className="text-[9px] text-green-700 uppercase mb-1">Low</div>
            <div className="text-lg font-bold text-green-500 font-mono">
              {stats.low}
            </div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResults.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-green-500" />
            <span className="text-[10px] text-green-600 uppercase font-bold">
              Open_Ports_Detected
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {scanResults.map((result, idx) => (
              <div
                key={idx}
                className={`border ${getRiskBorder(result.risk)} ${getRiskBg(result.risk)} p-3 cursor-pointer transition-all hover:border-opacity-100`}
                onClick={() =>
                  setExpandedPort(expandedPort === idx ? null : idx)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${getRiskColor(result.risk)}`}>
                      {getServiceIcon(result.service)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-300 font-mono">
                          PORT {result.port}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 ${getRiskColor(result.risk)} border ${getRiskBorder(result.risk)}`}
                        >
                          {result.risk}
                        </span>
                      </div>
                      <div className="text-[10px] text-green-600 font-mono mt-1">
                        {result.service} • {result.protocol}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Unlock size={14} className="text-green-500" />
                    {expandedPort === idx ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedPort === idx && (
                  <div className="mt-3 pt-3 border-t border-green-900/30 space-y-2 animate-in">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-green-700">STATE:</span>
                      <span className="text-green-400 font-mono uppercase">
                        {result.state}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-green-700">BANNER:</span>
                      <span className="text-green-400 font-mono">
                        {result.banner}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-green-700">RESPONSE_TIME:</span>
                      <span className="text-green-400 font-mono">
                        {result.responseTime}ms
                      </span>
                    </div>
                    {result.risk === "high" && (
                      <div className="flex items-start gap-2 mt-2 p-2 bg-red-950/20 border border-red-900/50">
                        <AlertTriangle
                          size={12}
                          className="text-red-500 mt-0.5 shrink-0"
                        />
                        <span className="text-[9px] text-red-400">
                          Security Warning: This port may pose a security risk
                          if exposed to the internet.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!scanning && scanResults.length === 0 && (
        <div className="text-center py-8">
          <Scan
            size={40}
            className="text-green-900 mx-auto mb-3"
            strokeWidth={1}
          />
          <div className="text-xs font-mono uppercase text-green-900">
            [ NO_SCAN_RESULTS ]
          </div>
          <div className="text-[10px] text-green-800 mt-1">
            Enter target IP and start scanning
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 ${scanning ? "bg-green-600 animate-pulse" : "bg-green-900"} rounded-full`}
          ></div>
          <span>SCANNER: {scanning ? "ACTIVE" : "IDLE"}</span>
        </div>
        <span>NMAP_ENGINE: v7.93</span>
      </div>
    </div>
  );
};

export default PortScanner;
