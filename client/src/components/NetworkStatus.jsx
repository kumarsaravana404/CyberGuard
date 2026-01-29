import { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  Globe,
  Monitor,
  RefreshCw,
  Signal,
  Server,
  Activity,
  MapPin,
  Clock,
} from "lucide-react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [latency, setLatency] = useState(0);
  const [dataStream, setDataStream] = useState([]);

  // Simulated data stream animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDataStream((prev) => {
        const newStream = [...prev, Math.random().toString(16).substr(2, 2)];
        return newStream.slice(-20); // Keep last 20
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const fetchIPInfo = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        setIpInfo({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          isp: data.org,
          timezone: data.timezone,
          latitude: data.latitude,
          longitude: data.longitude,
        });
        setLatency(Date.now() - startTime);
      }
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
      setIpInfo({ ip: "UNABLE_TO_RESOLVE", city: "N/A", country: "N/A" });
      setLatency(0);
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    fetchIPInfo();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="card-terminal group hover:border-green-700 transition-all duration-300">
      {/* Animated corner markers */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-900 relative">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi size={18} className="text-green-500 animate-pulse" />
          ) : (
            <WifiOff size={18} className="text-red-500 animate-pulse" />
          )}
          <div>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest block">
              Network_Analysis
            </span>
            <span className="text-[9px] text-green-700 font-mono">
              Real-time Monitoring
            </span>
          </div>
        </div>
        <button
          onClick={fetchIPInfo}
          disabled={loading}
          className="p-2 text-green-700 hover:text-green-500 hover:bg-green-950 transition-all border border-green-900 hover:border-green-700"
          title="Refresh Network Data"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Connection Status Bar */}
      <div className="mb-4 p-3 bg-linear-to-r from-green-950/30 to-transparent border-l-2 border-green-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Signal size={14} className="text-green-500" />
            <span className="text-xs text-green-600 uppercase font-mono">
              Status
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${isOnline ? "text-green-400" : "text-red-500"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 shadow-glow-green animate-pulse" : "bg-red-500"}`}
            ></div>
            <span className="text-xs font-bold uppercase tracking-wider">
              [{isOnline ? "CONNECTED" : "DISCONNECTED"}]
            </span>
          </div>
        </div>

        {/* Latency indicator */}
        {latency > 0 && (
          <div className="flex items-center gap-2 mt-2 text-[10px]">
            <Activity size={10} className="text-green-600" />
            <span className="text-green-700">Latency:</span>
            <span
              className={`font-mono font-bold ${latency < 200 ? "text-green-400" : latency < 500 ? "text-yellow-500" : "text-red-500"}`}
            >
              {latency}ms
            </span>
          </div>
        )}
      </div>

      {/* IP Information */}
      {loading ? (
        <div className="py-6">
          <div className="text-center mb-3">
            <div className="text-green-600 text-xs font-mono animate-pulse flex items-center justify-center gap-2">
              <Server size={14} className="animate-bounce" />
              &gt; RESOLVING_NETWORK_IDENTITY...
            </div>
          </div>
          {/* Data stream visualization */}
          <div className="flex flex-wrap gap-1 justify-center opacity-50">
            {dataStream.map((hex, idx) => (
              <span
                key={idx}
                className="text-[8px] text-green-800 font-mono animate-in"
              >
                {hex}
              </span>
            ))}
          </div>
        </div>
      ) : (
        ipInfo && (
          <div className="space-y-2.5">
            {/* IP Address */}
            <div className="flex items-center justify-between py-2 px-3 bg-green-950/20 border border-green-900/50 hover:border-green-700 transition-colors group/item">
              <span className="text-green-600 flex items-center gap-2 text-xs">
                <Globe
                  size={13}
                  className="group-hover/item:text-green-500 transition-colors"
                />
                <span className="font-mono">PUBLIC_IP</span>
              </span>
              <span className="text-green-300 font-mono text-xs font-bold tracking-wider">
                {ipInfo.ip}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between py-2 px-3 bg-green-950/20 border border-green-900/50 hover:border-green-700 transition-colors group/item">
              <span className="text-green-600 flex items-center gap-2 text-xs">
                <MapPin
                  size={13}
                  className="group-hover/item:text-green-500 transition-colors"
                />
                <span className="font-mono">LOCATION</span>
              </span>
              <span className="text-green-300 font-mono text-xs">
                {ipInfo.city}, {ipInfo.country}
              </span>
            </div>

            {/* ISP */}
            <div className="flex items-center justify-between py-2 px-3 bg-green-950/20 border border-green-900/50 hover:border-green-700 transition-colors group/item">
              <span className="text-green-600 flex items-center gap-2 text-xs">
                <Monitor
                  size={13}
                  className="group-hover/item:text-green-500 transition-colors"
                />
                <span className="font-mono">ISP_PROVIDER</span>
              </span>
              <span
                className="text-green-300 font-mono text-xs truncate max-w-[150px]"
                title={ipInfo.isp}
              >
                {ipInfo.isp || "N/A"}
              </span>
            </div>

            {/* Timezone */}
            {ipInfo.timezone && (
              <div className="flex items-center justify-between py-2 px-3 bg-green-950/20 border border-green-900/50 hover:border-green-700 transition-colors group/item">
                <span className="text-green-600 flex items-center gap-2 text-xs">
                  <Clock
                    size={13}
                    className="group-hover/item:text-green-500 transition-colors"
                  />
                  <span className="font-mono">TIMEZONE</span>
                </span>
                <span className="text-green-300 font-mono text-xs">
                  {ipInfo.timezone}
                </span>
              </div>
            )}
          </div>
        )
      )}

      {/* Footer with enhanced stats */}
      <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between">
        <div className="text-[9px] text-green-800 font-mono flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
          LAST_CHECK: {lastChecked.toLocaleTimeString()}
        </div>
        <div className="text-[9px] text-green-800 font-mono">
          AUTO_REFRESH: 60s
        </div>
      </div>

      {/* Subtle glow effect for online status */}
      {isOnline && (
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
  );
};

export default NetworkStatus;
