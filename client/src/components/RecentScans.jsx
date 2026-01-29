import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  History,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Terminal,
  Search,
  Filter,
  TrendingDown,
  Trash2,
  Eye,
} from "lucide-react";

const RecentScans = ({ refreshTrigger, limit = 10 }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, dangerous, suspicious, safe
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/scan/history", { params: { limit } });
        if (res.data.success) {
          setScans(res.data.history);
        }
      } catch (err) {
        console.error("History fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshTrigger, limit]);

  // Filter scans based on filter and search
  const filteredScans = scans.filter((scan) => {
    const matchesFilter =
      filter === "all" || scan.level.toLowerCase() === filter.toLowerCase();
    const matchesSearch = scan.input
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getScanStats = () => {
    const dangerous = scans.filter((s) => s.level === "Dangerous").length;
    const suspicious = scans.filter((s) => s.level === "Suspicious").length;
    const safe = scans.filter((s) => s.level === "Safe").length;
    return { dangerous, suspicious, safe, total: scans.length };
  };

  const stats = getScanStats();

  const getScanStyle = (level) => {
    switch (level) {
      case "Dangerous":
        return {
          border: "border-red-500/50",
          bg: "bg-red-950/10",
          text: "text-red-500",
          icon: <AlertTriangle size={16} className="text-red-500" />,
          badge: "bg-red-500 text-black",
        };
      case "Suspicious":
        return {
          border: "border-yellow-500/50",
          bg: "bg-yellow-950/10",
          text: "text-yellow-500",
          icon: <AlertTriangle size={16} className="text-yellow-500" />,
          badge: "bg-yellow-500 text-black",
        };
      default:
        return {
          border: "border-green-500/50",
          bg: "bg-green-950/10",
          text: "text-green-500",
          icon: <CheckCircle size={16} className="text-green-500" />,
          badge: "bg-green-500 text-black",
        };
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all scan history?")) {
      // This would call an API endpoint to clear history
      setScans([]);
    }
  };

  return (
    <div className="card-terminal relative group hover:border-green-600 transition-all duration-300">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-green-900 mb-4">
        <div className="flex items-center gap-3">
          <Terminal size={20} className="text-green-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Audit_Log
            </h3>
            <span className="text-[9px] text-green-700 font-mono">
              Scan History Database
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scans.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-red-700 hover:text-red-500 hover:bg-red-950 transition-all border border-red-900"
              title="Clear History"
            >
              <Trash2 size={12} />
            </button>
          )}
          <span className="text-[10px] text-green-700 font-mono px-2 py-1 bg-green-950/30 border border-green-900">
            TOTAL: {stats.total}
          </span>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-linear-to-br from-red-950/30 to-transparent border border-red-900/50 p-2">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={10} className="text-red-500" />
            <span className="text-[9px] text-red-700 uppercase font-mono">
              Dangerous
            </span>
          </div>
          <div
            className={`text-lg font-bold font-mono ${stats.dangerous > 0 ? "text-red-500" : "text-green-800"}`}
          >
            {stats.dangerous}
          </div>
        </div>
        <div className="bg-linear-to-br from-yellow-950/30 to-transparent border border-yellow-900/50 p-2">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle size={10} className="text-yellow-500" />
            <span className="text-[9px] text-yellow-700 uppercase font-mono">
              Suspicious
            </span>
          </div>
          <div
            className={`text-lg font-bold font-mono ${stats.suspicious > 0 ? "text-yellow-500" : "text-green-800"}`}
          >
            {stats.suspicious}
          </div>
        </div>
        <div className="bg-linear-to-br from-green-950/30 to-transparent border border-green-900/50 p-2">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle size={10} className="text-green-500" />
            <span className="text-[9px] text-green-700 uppercase font-mono">
              Safe
            </span>
          </div>
          <div className="text-lg font-bold text-green-500 font-mono">
            {stats.safe}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-2 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 border border-green-900 bg-black/50 px-2 py-1.5 focus-within:border-green-700 transition-colors">
          <Search size={12} className="text-green-700" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-green-100 placeholder-green-900 focus:outline-none font-mono text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-green-700" />
          <div className="flex gap-1.5 flex-wrap">
            {["all", "dangerous", "suspicious", "safe"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-all ${
                  filter === f
                    ? "bg-green-500 text-black border-green-500"
                    : "text-green-700 border-green-900 hover:border-green-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scans List */}
      <div className="space-y-1">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="animate-spin text-green-500" />
            <span className="text-xs font-mono uppercase text-green-600 animate-pulse">
              Synchronizing_data...
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-green-700 rounded-full"
                  style={{ animation: `pulse 1s infinite ${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <History size={40} strokeWidth={1} className="text-green-900" />
            <span className="text-xs font-mono uppercase text-green-900">
              [ {searchTerm ? "NO_MATCHES_FOUND" : "NO_ACTIVITY_RECORDED"} ]
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-[10px] text-green-700 hover:text-green-500 font-mono"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
            {filteredScans.map((scan, idx) => {
              const style = getScanStyle(scan.level);
              const isSelected = selectedScan === scan._id;

              return (
                <div
                  key={scan._id || idx}
                  onClick={() => setSelectedScan(isSelected ? null : scan._id)}
                  className={`flex items-center justify-between py-2.5 px-3 border ${style.border} ${style.bg} hover:bg-green-950/20 transition-all cursor-pointer group/item ${isSelected ? "bg-green-950/30 border-green-600" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon */}
                    <div className={`p-2 border ${style.border} ${style.bg}`}>
                      {style.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs font-mono text-green-300 truncate mb-1"
                        title={scan.input}
                      >
                        <span className="text-green-600 mr-2">&gt;</span>
                        {scan.input}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide ${style.text} px-1.5 py-0.5 ${style.badge}`}
                        >
                          {scan.level}
                        </span>
                        <span className="text-[9px] text-green-900">|</span>
                        <span className="text-[10px] flex items-center gap-1.5">
                          {scan.phishing ? (
                            <span className="flex items-center gap-1 text-red-500 font-bold">
                              <ShieldAlert size={10} />
                              PHISHING
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600">
                              <ShieldCheck size={10} />
                              VERIFIED
                            </span>
                          )}
                        </span>
                        {scan.score !== undefined && (
                          <>
                            <span className="text-[9px] text-green-900">|</span>
                            <span
                              className={`text-[10px] font-mono font-bold ${style.text}`}
                            >
                              SCORE: {scan.score}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Expanded details */}
                      {isSelected && scan.message && (
                        <div className="mt-2 pt-2 border-t border-green-900/30 animate-in">
                          <p className="text-[10px] text-green-600 font-mono">
                            {scan.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time & Actions */}
                  <div className="flex items-center gap-3 pl-3">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-green-700">
                        <Clock size={11} />
                        <span className="text-[10px] font-mono">
                          {new Date(scan.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span className="text-[9px] text-green-800 font-mono">
                        {new Date(scan.time).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScan(isSelected ? null : scan._id);
                      }}
                      className="p-1.5 text-green-700 hover:text-green-500 opacity-0 group-hover/item:opacity-100 transition-all"
                    >
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && filteredScans.length > 0 && (
        <div className="mt-4 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
          <span>
            SHOWING: {filteredScans.length} of {scans.length}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            <span>DATABASE: ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentScans;
