import { useState, useEffect, useRef, useMemo } from "react";
import {
  Activity,
  BarChart3,
  Wifi,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Database,
  AlertCircle,
} from "lucide-react";

// Protocol breakdown data (static, defined outside component)
const PROTOCOL_BREAKDOWN = [
  { name: "HTTPS", percentage: 45, color: "bg-green-500" },
  { name: "HTTP", percentage: 25, color: "bg-blue-500" },
  { name: "DNS", percentage: 15, color: "bg-purple-500" },
  { name: "SSH", percentage: 8, color: "bg-yellow-500" },
  { name: "OTHER", percentage: 7, color: "bg-gray-500" },
];

const NetworkTrafficMonitor = () => {
  const [metrics, setMetrics] = useState({
    uploadSpeed: 0,
    downloadSpeed: 0,
    totalUploaded: 0,
    totalDownloaded: 0,
    activeStreams: 0,
    packetLoss: 0,
    latency: 0,
    jitter: 0,
  });

  const [trafficHistory, setTrafficHistory] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Use refs for cumulative values to avoid dependency issues
  const totalUploadedRef = useRef(0);
  const totalDownloadedRef = useRef(0);

  // Simulate real-time traffic data
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const uploadSpeed = Math.random() * 1024 + 512;
      const downloadSpeed = Math.random() * 2048 + 1024;

      // Update refs
      totalUploadedRef.current += Math.random() * 100;
      totalDownloadedRef.current += Math.random() * 200;

      const newMetrics = {
        uploadSpeed,
        downloadSpeed,
        totalUploaded: totalUploadedRef.current,
        totalDownloaded: totalDownloadedRef.current,
        activeStreams: Math.floor(Math.random() * 15) + 5,
        packetLoss: Math.random() * 2,
        latency: Math.floor(Math.random() * 50) + 10,
        jitter: Math.random() * 10,
      };

      setMetrics(newMetrics);

      // Update traffic history
      setTrafficHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            upload: uploadSpeed,
            download: downloadSpeed,
          },
        ];
        return newHistory.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes.toFixed(2)} KB`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} GB`;
  };

  const formatSpeed = (kbps) => {
    if (kbps < 1024) return `${kbps.toFixed(1)} KB/s`;
    return `${(kbps / 1024).toFixed(2)} MB/s`;
  };

  const getLatencyColor = (latency) => {
    if (latency < 20) return "text-green-500";
    if (latency < 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getPacketLossColor = (loss) => {
    if (loss < 1) return "text-green-500";
    if (loss < 3) return "text-yellow-500";
    return "text-red-500";
  };

  // Memoize max speed calculation
  const maxSpeed = useMemo(() => {
    if (trafficHistory.length === 0) return 1;
    return Math.max(
      ...trafficHistory.map((d) => Math.max(d.upload, d.download)),
    );
  }, [trafficHistory]);

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
          <Activity
            size={20}
            className={`${isMonitoring ? "text-green-500 animate-pulse" : "text-green-700"}`}
          />
          <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Network_Traffic_Monitor
            </h3>
            <span className="text-[9px] text-green-700 font-mono">
              Real-time Bandwidth Analysis
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase border transition-all ${
            isMonitoring
              ? "bg-green-500 text-black border-green-500"
              : "text-green-700 border-green-900 hover:border-green-700"
          }`}
        >
          {isMonitoring ? "MONITORING" : "PAUSED"}
        </button>
      </div>

      {/* Real-time Speed Meters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Download Speed */}
        <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft size={14} className="text-blue-400" />
            <span className="text-[10px] text-green-700 uppercase font-mono">
              Download
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono mb-1">
            {formatSpeed(metrics.downloadSpeed)}
          </div>
          <div className="text-[9px] text-green-700 font-mono">
            Total: {formatBytes(metrics.totalDownloaded)}
          </div>
        </div>

        {/* Upload Speed */}
        <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={14} className="text-green-400" />
            <span className="text-[10px] text-green-700 uppercase font-mono">
              Upload
            </span>
          </div>
          <div className="text-2xl font-bold text-green-400 font-mono mb-1">
            {formatSpeed(metrics.uploadSpeed)}
          </div>
          <div className="text-[9px] text-green-700 font-mono">
            Total: {formatBytes(metrics.totalUploaded)}
          </div>
        </div>
      </div>

      {/* Network Quality Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-black/50 border border-green-900/50 p-2">
          <div className="text-[9px] text-green-700 uppercase mb-1 flex items-center gap-1">
            <Zap size={10} />
            Latency
          </div>
          <div
            className={`text-sm font-bold font-mono ${getLatencyColor(metrics.latency)}`}
          >
            {metrics.latency}ms
          </div>
        </div>

        <div className="bg-black/50 border border-green-900/50 p-2">
          <div className="text-[9px] text-green-700 uppercase mb-1 flex items-center gap-1">
            <Activity size={10} />
            Jitter
          </div>
          <div className="text-sm font-bold text-green-400 font-mono">
            {metrics.jitter.toFixed(1)}ms
          </div>
        </div>

        <div className="bg-black/50 border border-green-900/50 p-2">
          <div className="text-[9px] text-green-700 uppercase mb-1 flex items-center gap-1">
            <AlertCircle size={10} />
            Loss
          </div>
          <div
            className={`text-sm font-bold font-mono ${getPacketLossColor(metrics.packetLoss)}`}
          >
            {metrics.packetLoss.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Traffic History Graph */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={14} className="text-green-500" />
          <span className="text-[10px] text-green-600 uppercase font-bold">
            Traffic_History
          </span>
        </div>
        <div className="h-24 bg-black/50 border border-green-900/50 p-2 flex items-end gap-0.5">
          {trafficHistory.map((data, idx) => {
            const downloadHeight = (data.download / maxSpeed) * 100;
            const uploadHeight = (data.upload / maxSpeed) * 100;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col gap-0.5 items-center"
              >
                <div
                  className="w-full bg-blue-500/70 transition-all duration-300"
                  style={{ height: `${downloadHeight}%` }}
                  title={`Down: ${formatSpeed(data.download)}`}
                ></div>
                <div
                  className="w-full bg-green-500/70 transition-all duration-300"
                  style={{ height: `${uploadHeight}%` }}
                  title={`Up: ${formatSpeed(data.upload)}`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[9px] text-green-700">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500/70"></div>
            <span>Download</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500/70"></div>
            <span>Upload</span>
          </div>
        </div>
      </div>

      {/* Protocol Breakdown */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Database size={14} className="text-green-500" />
          <span className="text-[10px] text-green-600 uppercase font-bold">
            Protocol_Distribution
          </span>
        </div>
        <div className="space-y-2">
          {PROTOCOL_BREAKDOWN.map((protocol, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-green-700 font-mono">
                  {protocol.name}
                </span>
                <span className="text-green-400 font-bold">
                  {protocol.percentage}%
                </span>
              </div>
              <div className="h-2 bg-black border border-green-900/50 overflow-hidden">
                <div
                  className={`h-full ${protocol.color} transition-all duration-500`}
                  style={{ width: `${protocol.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Streams */}
      <div className="bg-linear-to-r from-green-950/20 to-transparent border-l-2 border-green-500 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-green-500" />
            <span className="text-xs text-green-600 font-mono">
              ACTIVE_STREAMS
            </span>
          </div>
          <span className="text-lg font-bold text-green-400 font-mono">
            {metrics.activeStreams}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 ${isMonitoring ? "bg-green-600 animate-pulse" : "bg-green-900"} rounded-full`}
          ></div>
          <span>REFRESH: 1s</span>
        </div>
        <span>CAPTURE_ENGINE: v3.2.1</span>
      </div>
    </div>
  );
};

export default NetworkTrafficMonitor;
