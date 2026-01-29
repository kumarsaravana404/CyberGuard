import { useState, useEffect } from "react";
import api from "../lib/api";
import {
  Search,
  Loader2,
  Terminal,
  AlertCircle,
  Zap,
  ShieldOff,
  Lock,
} from "lucide-react";

const ThreatScanner = ({ onScanComplete }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalText, setTerminalText] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);

  // Simulated scan progress
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [loading]);

  // Terminal typing effect
  useEffect(() => {
    if (loading) {
      const messages = [
        "Initializing threat detection engine...",
        "Analyzing payload structure...",
        "Cross-referencing threat database...",
        "Running heuristic analysis...",
        "Calculating risk score...",
      ];

      let index = 0;
      const interval = setInterval(() => {
        setTerminalText(messages[index % messages.length]);
        index++;
      }, 800);

      return () => clearInterval(interval);
    } else {
      setTerminalText("");
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setScanProgress(0);

    // Add to command history
    setCommandHistory((prev) => [...prev.slice(-4), input]);

    try {
      const res = await api.post("/api/scan", { input });
      setScanProgress(100);
      setTimeout(() => {
        onScanComplete(res.data);
        setInput("");
      }, 300);
    } catch (err) {
      setError(
        err.response?.data?.message || "Connection Refused: Target Unreachable",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-terminal relative overflow-hidden group hover:border-green-600 transition-all duration-300">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

      {/* Animated scan line */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500 opacity-50 animate-pulse"></div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-green-900">
        <div className="flex items-center gap-3">
          <Terminal
            size={20}
            className={`${loading ? "text-green-400 animate-pulse" : "text-green-500"}`}
          />
          <div>
            <h2 className="text-sm font-bold text-green-400 tracking-widest uppercase">
              Threat_Scanner
            </h2>
            <p className="text-[9px] text-green-700 font-mono mt-0.5">
              Advanced Payload Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-green-600 animate-pulse" />
          <span className="text-[9px] text-green-600 font-mono uppercase">
            {loading ? "SCANNING" : "READY"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Command Input */}
        <div className="relative">
          <label className="flex items-center gap-2 text-xs text-green-600 uppercase mb-3 font-bold tracking-wide">
            <ShieldOff size={12} />
            Target_Parameter
          </label>
          <div className="relative">
            <div className="flex items-center border-2 border-green-900 hover:border-green-700 focus-within:border-green-500 transition-colors bg-black/50 px-3 py-2">
              <span className="text-green-500 font-mono mr-2 text-sm font-bold select-none">
                {">"}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter URL or text to analyze..."
                className="w-full bg-transparent text-green-100 placeholder-green-900/50 focus:outline-none font-mono tracking-wide text-sm"
                disabled={loading}
              />
              {input && !loading && (
                <Lock size={14} className="text-green-700 ml-2" />
              )}
            </div>

            {/* Input character count */}
            {input && (
              <div className="absolute -bottom-5 right-0 text-[9px] text-green-800 font-mono">
                LENGTH: {input.length} chars
              </div>
            )}
          </div>
        </div>

        {/* Scan Progress */}
        {loading && (
          <div className="space-y-2 py-4 px-3 bg-green-950/20 border border-green-900/50">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-green-600 font-mono">
                ANALYSIS_PROGRESS
              </span>
              <span className="text-green-400 font-mono font-bold">
                {Math.floor(scanProgress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-green-950 border border-green-900 relative overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-green-700 via-green-500 to-green-700 transition-all duration-300 relative"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute inset-0 bg-green-400/30 animate-pulse"></div>
              </div>
            </div>
            <div className="text-[10px] text-green-600 font-mono animate-pulse mt-2">
              &gt; {terminalText}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 text-red-500 text-xs font-mono bg-red-950/20 p-3 border-l-4 border-red-500 animate-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <div className="font-bold uppercase mb-1">SYSTEM_ERROR</div>
              <div className="text-red-400">{error}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 items-center">
          {commandHistory.length > 0 && !loading && (
            <div className="flex-1 text-[9px] text-green-800 font-mono">
              HISTORY: {commandHistory.length} scan(s)
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-terminal disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group/btn"
          >
            <div className="flex items-center gap-2 relative z-10">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>[ EXECUTE_SCAN ]</span>
                </>
              )}
            </div>
            {!loading && (
              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
            )}
          </button>
        </div>
      </form>

      {/* Footer Stats */}
      <div className="mt-6 pt-3 border-t border-green-900/50 flex items-center justify-between text-[9px] text-green-800 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            ENGINE: v2.4.1
          </span>
          <span className="text-green-700">|</span>
          <span>LATENCY: 42ms</span>
        </div>
        <span className="text-green-700">ML_HEURISTICS: ACTIVE</span>
      </div>

      {/* Command history display */}
      {commandHistory.length > 0 && !loading && (
        <div className="mt-4 pt-3 border-t border-green-900/30">
          <div className="text-[9px] text-green-700 font-mono mb-2 uppercase">
            Recent Scans:
          </div>
          <div className="space-y-1">
            {commandHistory
              .slice(-3)
              .reverse()
              .map((cmd, idx) => (
                <div
                  key={idx}
                  className="text-[9px] text-green-800 font-mono truncate opacity-60"
                >
                  &gt; {cmd}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatScanner;
