import { useState, useEffect } from "react";
import {
  Network,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  AlertTriangle,
  Activity,
  Cpu,
  Database,
  RefreshCw,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";

const ActiveConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    inbound: 0,
    outbound: 0,
    suspicious: 0,
  });
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const generateConnections = () => {
    const sampleConnections = [
      {
        id: 1,
        localPort: 443,
        remoteIp: "142.250.190.78",
        remotePort: 443,
        protocol: "HTTPS",
        status: "ESTABLISHED",
        direction: "outbound",
        process: "chrome.exe",
        safe: true,
        bandwidth: "2.4 KB/s",
        packets: 1247,
        duration: "00:12:34",
      },
      {
        id: 2,
        localPort: 5173,
        remoteIp: "127.0.0.1",
        remotePort: 5173,
        protocol: "HTTP",
        status: "LISTENING",
        direction: "inbound",
        process: "node.exe",
        safe: true,
        bandwidth: "0.8 KB/s",
        packets: 453,
        duration: "01:45:12",
      },
      {
        id: 3,
        localPort: 27017,
        remoteIp: "127.0.0.1",
        remotePort: 27017,
        protocol: "TCP",
        status: "ESTABLISHED",
        direction: "inbound",
        process: "mongod.exe",
        safe: true,
        bandwidth: "1.2 KB/s",
        packets: 892,
        duration: "02:15:06",
      },
      {
        id: 4,
        localPort: 53,
        remoteIp: "8.8.8.8",
        remotePort: 53,
        protocol: "DNS",
        status: "ESTABLISHED",
        direction: "outbound",
        process: "svchost.exe",
        safe: true,
        bandwidth: "0.3 KB/s",
        packets: 234,
        duration: "00:05:42",
      },
      {
        id: 5,
        localPort: 22,
        remoteIp: "192.168.1.105",
        remotePort: 54321,
        protocol: "SSH",
        status: "SYN_SENT",
        direction: "inbound",
        process: "sshd.exe",
        safe: false,
        bandwidth: "0.0 KB/s",
        packets: 12,
        duration: "00:00:08",
      },
      {
        id: 6,
        localPort: 3000,
        remoteIp: "192.168.1.1",
        remotePort: 3000,
        protocol: "HTTP",
        status: "ESTABLISHED",
        direction: "outbound",
        process: "node.exe",
        safe: true,
        bandwidth: "3.1 KB/s",
        packets: 2104,
        duration: "00:42:19",
      },
    ];

    return sampleConnections;
  };

  const updateStats = (conns) => {
    const inbound = conns.filter((c) => c.direction === "inbound").length;
    const outbound = conns.filter((c) => c.direction === "outbound").length;
    const suspicious = conns.filter((c) => !c.safe).length;
    setStats({ inbound, outbound, suspicious });
  };

  useEffect(() => {
    setTimeout(() => {
      const conns = generateConnections();
      setConnections(conns);
      updateStats(conns);
      setLoading(false);
    }, 1000);

    if (autoRefresh) {
      const interval = setInterval(() => {
        const conns = generateConnections();
        setConnections(conns);
        updateStats(conns);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case "ESTABLISHED":
        return "text-green-400";
      case "LISTENING":
        return "text-blue-400";
      case "TIME_WAIT":
        return "text-yellow-500";
      case "SYN_SENT":
        return "text-orange-500";
      default:
        return "text-green-700";
    }
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      HTTPS: "text-green-400",
      HTTP: "text-blue-400",
      TCP: "text-purple-400",
      UDP: "text-cyan-400",
      SSH: "text-yellow-400",
      DNS: "text-pink-400",
    };
    return colors[protocol] || "text-green-400";
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
          <Network size={20} className="text-green-500 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest block">
              Active_Connections
            </span>
            <span className="text-[9px] text-green-700 font-mono">
              Live Network Monitor
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 text-green-700 hover:text-green-500 hover:bg-green-950 transition-all border border-green-900"
            title={showDetails ? "Hide Details" : "Show Details"}
          >
            {showDetails ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                const conns = generateConnections();
                setConnections(conns);
                updateStats(conns);
                setLoading(false);
              }, 500);
            }}
            className="p-1.5 text-green-700 hover:text-green-500 hover:bg-green-950 transition-all border border-green-900"
            title="Refresh"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-linear-to-br from-green-950/40 to-transparent border border-green-900/50 p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownLeft size={12} className="text-blue-400" />
            <span className="text-[9px] text-green-700 uppercase font-mono">
              Inbound
            </span>
          </div>
          <div className="text-lg font-bold text-blue-400 font-mono">
            {stats.inbound}
          </div>
        </div>
        <div className="bg-linear-to-br from-green-950/40 to-transparent border border-green-900/50 p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight size={12} className="text-green-400" />
            <span className="text-[9px] text-green-700 uppercase font-mono">
              Outbound
            </span>
          </div>
          <div className="text-lg font-bold text-green-400 font-mono">
            {stats.outbound}
          </div>
        </div>
        <div className="bg-linear-to-br from-red-950/40 to-transparent border border-red-900/50 p-2.5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle
              size={12}
              className={`${stats.suspicious > 0 ? "text-red-500 animate-pulse" : "text-green-700"}`}
            />
            <span className="text-[9px] text-green-700 uppercase font-mono">
              Suspicious
            </span>
          </div>
          <div
            className={`text-lg font-bold font-mono ${stats.suspicious > 0 ? "text-red-500" : "text-green-700"}`}
          >
            {stats.suspicious}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-green-600 text-xs font-mono animate-pulse mb-3">
            <Activity size={16} className="animate-bounce" />
            &gt; SCANNING_NETWORK_SOCKETS...
          </div>
          <div className="flex justify-center gap-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-8 bg-green-700"
                style={{
                  animation: `pulse 1.5s infinite ${i * 0.1}s`,
                  opacity: 0.3,
                }}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {connections.map((conn) => (
            <div
              key={conn.id}
              onClick={() =>
                setSelectedConnection(
                  selectedConnection === conn.id ? null : conn.id,
                )
              }
              className={`p-3 border cursor-pointer transition-all duration-200 ${
                conn.safe
                  ? "border-green-900/50 hover:border-green-700 hover:bg-green-950/20"
                  : "border-red-900/50 bg-red-950/10 hover:border-red-700"
              } ${selectedConnection === conn.id ? "bg-green-950/30 border-green-600" : ""}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {conn.direction === "inbound" ? (
                    <ArrowDownLeft size={14} className="text-blue-400" />
                  ) : (
                    <ArrowUpRight size={14} className="text-green-400" />
                  )}
                  <span
                    className={`text-xs font-bold ${getProtocolColor(conn.protocol)}`}
                  >
                    {conn.protocol}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 border ${getStatusColor(conn.status)}`}
                  >
                    {conn.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {conn.safe ? (
                    <Shield size={13} className="text-green-500" />
                  ) : (
                    <AlertTriangle
                      size={13}
                      className="text-red-500 animate-pulse"
                    />
                  )}
                </div>
              </div>

              {/* Connection Info */}
              <div className="text-[10px] font-mono text-green-600 flex items-center gap-2 mb-2">
                <span className="text-green-700">LOCAL:</span>
                <span className="text-green-400 font-bold">
                  :{conn.localPort}
                </span>
                <span className="text-green-800">→</span>
                <span className="text-green-700">REMOTE:</span>
                <span className="text-green-400">
                  {conn.remoteIp}:{conn.remotePort}
                </span>
              </div>

              {/* Process */}
              <div className="flex items-center gap-2 text-[9px] text-green-700 mb-1">
                <Cpu size={10} />
                <span>PROC:</span>
                <span className="text-green-500">{conn.process}</span>
              </div>

              {/* Expanded Details */}
              {(showDetails || selectedConnection === conn.id) && (
                <div className="mt-3 pt-3 border-t border-green-900/40 space-y-1.5 animate-in">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-green-700 flex items-center gap-1">
                      <TrendingUp size={10} />
                      BANDWIDTH:
                    </span>
                    <span className="text-green-400 font-mono">
                      {conn.bandwidth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-green-700 flex items-center gap-1">
                      <Database size={10} />
                      PACKETS:
                    </span>
                    <span className="text-green-400 font-mono">
                      {conn.packets}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-green-700 flex items-center gap-1">
                      <Activity size={10} />
                      DURATION:
                    </span>
                    <span className="text-green-400 font-mono">
                      {conn.duration}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div
              className={`w-1.5 h-1.5 ${autoRefresh ? "bg-green-600 animate-pulse" : "bg-green-900"} rounded-full`}
            ></div>
            TOTAL: {connections.length}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="text-green-700 hover:text-green-500 transition-colors"
          >
            AUTO_REFRESH: {autoRefresh ? "ON" : "OFF"}
          </button>
        </div>
        <span className="text-green-700">INTERVAL: 30s</span>
      </div>
    </div>
  );
};

export default ActiveConnections;
