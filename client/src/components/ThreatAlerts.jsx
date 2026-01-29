import { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  X,
  CheckCircle,
  Filter,
  TrendingUp,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

const ThreatAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, critical, warning, info
  const [alertPulse, setAlertPulse] = useState(false);

  const generateAlerts = () => {
    return [
      {
        id: 1,
        type: "critical",
        title: "Suspicious SSH Connection",
        message:
          "Unauthorized SSH connection attempt detected from IP 192.168.1.105",
        timestamp: new Date(Date.now() - 300000),
        dismissed: false,
        source: "Network Monitor",
        severity: 9.5,
      },
      {
        id: 2,
        type: "warning",
        title: "Port Scan Detected",
        message: "Sequential port scanning activity detected on ports 21-25",
        timestamp: new Date(Date.now() - 900000),
        dismissed: false,
        source: "IDS Engine",
        severity: 6.8,
      },
      {
        id: 3,
        type: "info",
        title: "Firewall Rule Updated",
        message: "New outbound rule added for application: chrome.exe",
        timestamp: new Date(Date.now() - 1800000),
        dismissed: false,
        source: "Firewall",
        severity: 2.1,
      },
      {
        id: 4,
        type: "warning",
        title: "Unusual Traffic Pattern",
        message: "High volume of DNS queries detected to external resolver",
        timestamp: new Date(Date.now() - 3600000),
        dismissed: false,
        source: "Traffic Analyzer",
        severity: 5.4,
      },
      {
        id: 5,
        type: "critical",
        title: "Malicious Payload Detected",
        message:
          "Potential SQL injection attempt blocked in request to /api/users",
        timestamp: new Date(Date.now() - 600000),
        dismissed: false,
        source: "WAF",
        severity: 8.9,
      },
    ];
  };

  useEffect(() => {
    setTimeout(() => {
      setAlerts(generateAlerts());
      setLoading(false);
    }, 800);

    // Pulse effect for critical alerts
    const interval = setInterval(() => {
      setAlertPulse((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, dismissed: true } : alert,
      ),
    );
  };

  const dismissAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, dismissed: true })));
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case "critical":
        return {
          border: "border-red-500/70",
          borderHover: "hover:border-red-400",
          bg: "bg-gradient-to-r from-red-950/30 to-transparent",
          icon: <ShieldAlert size={18} className="text-red-500" />,
          badge: "bg-red-500 text-black",
          glow: "shadow-glow-red",
        };
      case "warning":
        return {
          border: "border-yellow-500/70",
          borderHover: "hover:border-yellow-400",
          bg: "bg-gradient-to-r from-yellow-950/30 to-transparent",
          icon: <AlertTriangle size={18} className="text-yellow-500" />,
          badge: "bg-yellow-500 text-black",
          glow: "shadow-glow-yellow",
        };
      case "info":
      default:
        return {
          border: "border-blue-500/70",
          borderHover: "hover:border-blue-400",
          bg: "bg-gradient-to-r from-blue-950/30 to-transparent",
          icon: <Info size={18} className="text-blue-400" />,
          badge: "bg-blue-500 text-black",
          glow: "shadow-glow-blue",
        };
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return "text-red-500";
    if (severity >= 5) return "text-yellow-500";
    return "text-blue-400";
  };

  const activeAlerts = alerts.filter((a) => !a.dismissed);
  const filteredAlerts =
    filter === "all"
      ? activeAlerts
      : activeAlerts.filter((a) => a.type === filter);

  const criticalCount = activeAlerts.filter(
    (a) => a.type === "critical",
  ).length;
  const warningCount = activeAlerts.filter((a) => a.type === "warning").length;

  return (
    <div className="card-terminal relative group hover:border-green-600 transition-all duration-300">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

      {/* Critical alert indicator */}
      {criticalCount > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-900">
        <div className="flex items-center gap-3">
          <Bell
            size={20}
            className={
              criticalCount > 0
                ? "text-red-500 animate-pulse"
                : "text-green-500"
            }
          />
          <div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest block">
              Threat_Alerts
            </span>
            <span className="text-[9px] text-green-700 font-mono">
              Real-time Intelligence Feed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span className="px-2 py-1 text-[10px] font-bold bg-red-500 text-black animate-pulse">
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-1 text-[10px] font-bold bg-yellow-500 text-black">
              {warningCount} WARN
            </span>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 text-[10px] text-green-700">
          <Filter size={12} />
          <span className="uppercase font-mono">Filter:</span>
        </div>
        {["all", "critical", "warning", "info"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 text-[10px] font-bold uppercase border transition-all ${
              filter === f
                ? "bg-green-500 text-black border-green-500"
                : "text-green-600 border-green-900 hover:border-green-700 hover:text-green-400"
            }`}
          >
            {f}
          </button>
        ))}
        {activeAlerts.length > 0 && (
          <button
            onClick={dismissAll}
            className="ml-auto px-2.5 py-1 text-[10px] font-bold uppercase border border-red-900 text-red-600 hover:bg-red-950 hover:border-red-700 transition-all"
          >
            Dismiss All
          </button>
        )}
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-mono animate-pulse mb-3">
            <Shield size={16} className="animate-bounce" />
            &gt; FETCHING_THREAT_INTELLIGENCE...
          </div>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-700 rounded-full"
                style={{
                  animation: `pulse 1s infinite ${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-10">
          <CheckCircle
            size={40}
            className="text-green-500 mx-auto mb-3 animate-pulse"
          />
          <div className="text-green-400 text-sm font-mono uppercase font-bold mb-2">
            [ NO_ACTIVE_THREATS ]
          </div>
          <div className="text-green-700 text-[10px] font-mono">
            All systems nominal • Monitoring continues
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-green-800">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span>DEFENSE_STATUS: OPERATIONAL</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2">
          {filteredAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-3 border-2 ${style.border} ${style.borderHover} ${style.bg} relative group/alert transition-all duration-200 hover:scale-[1.01] ${alert.type === "critical" && alertPulse ? style.glow : ""}`}
              >
                {/* Dismiss button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-2 right-2 text-green-700 hover:text-red-500 opacity-0 group-hover/alert:opacity-100 transition-all p-1 hover:bg-red-950 border border-transparent hover:border-red-900"
                >
                  <X size={12} />
                </button>

                {/* Alert Content */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{style.icon}</div>
                  <div className="flex-1 min-w-0">
                    {/* Alert Header */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 ${style.badge}`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-green-700 flex items-center gap-1">
                        <Clock size={10} />
                        {getTimeAgo(alert.timestamp)}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold ${getSeverityColor(alert.severity)}`}
                      >
                        SEV: {alert.severity.toFixed(1)}
                      </span>
                    </div>

                    {/* Alert Title */}
                    <div className="text-xs font-bold text-green-300 mb-2 flex items-center gap-2">
                      <Zap size={12} className="shrink-0" />
                      {alert.title}
                    </div>

                    {/* Alert Message */}
                    <div className="text-[10px] text-green-600 font-mono leading-relaxed mb-2">
                      {alert.message}
                    </div>

                    {/* Alert Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-green-900/30">
                      <div className="text-[9px] text-green-800 font-mono flex items-center gap-1">
                        <TrendingUp size={10} />
                        SOURCE: {alert.source}
                      </div>
                      <div className="text-[9px] text-green-800 font-mono">
                        ID: #{alert.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            ACTIVE: {activeAlerts.length}
          </span>
          <span className="text-green-700">|</span>
          <span>SHOWING: {filteredAlerts.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>THREAT_ENGINE: ACTIVE</span>
          <span className="text-green-700">|</span>
          <span>REFRESH: 30s</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatAlerts;
