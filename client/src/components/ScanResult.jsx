import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Terminal,
  Activity,
  TrendingUp,
  Database,
  Clock,
  FileText,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ScanResult = ({ result = {} }) => {
  const {
    riskScore = 0,
    threatLevel = "Unknown",
    phishing = false,
    message = "Analysis complete.",
    id,
    input,
    timestamp = new Date(),
  } = result;

  const isSafe = threatLevel === "Safe";
  const isHighRisk = threatLevel === "High" || threatLevel === "Dangerous";

  // Determine colors and styles based on risk
  const statusColor = isSafe
    ? "text-green-400"
    : isHighRisk
      ? "text-red-500"
      : "text-yellow-500";
  const borderColor = isSafe
    ? "border-green-500"
    : isHighRisk
      ? "border-red-500"
      : "border-yellow-500";
  const bgGradient = isSafe
    ? "bg-gradient-to-br from-green-950/30 to-black"
    : isHighRisk
      ? "bg-gradient-to-br from-red-950/30 to-black"
      : "bg-gradient-to-br from-yellow-950/30 to-black";

  // Risk level indicator
  const getRiskIcon = () => {
    if (isSafe)
      return (
        <ShieldCheck size={32} className={`${statusColor} animate-pulse`} />
      );
    if (isHighRisk)
      return (
        <ShieldAlert size={32} className={`${statusColor} animate-pulse`} />
      );
    return (
      <AlertTriangle size={32} className={`${statusColor} animate-pulse`} />
    );
  };

  // Risk category
  const getRiskCategory = () => {
    if (riskScore >= 80) return "CRITICAL";
    if (riskScore >= 60) return "HIGH";
    if (riskScore >= 40) return "MODERATE";
    if (riskScore >= 20) return "LOW";
    return "MINIMAL";
  };

  return (
    <div
      className={`${bgGradient} border-2 ${borderColor} p-6 relative font-mono mt-8 group hover:shadow-2xl transition-all duration-300 animate-in`}
    >
      {/* Animated corner markers */}
      <div
        className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${borderColor} transition-all group-hover:w-6 group-hover:h-6`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${borderColor} transition-all group-hover:w-6 group-hover:h-6`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${borderColor} transition-all group-hover:w-6 group-hover:h-6`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${borderColor} transition-all group-hover:w-6 group-hover:h-6`}
      ></div>

      {/* Subtle scan line animation */}
      <div
        className={`absolute top-0 left-0 w-full h-0.5 ${isSafe ? "bg-green-500" : "bg-red-500"} opacity-30`}
      ></div>

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-green-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getRiskIcon()}
          <div>
            <h3
              className={`text-xl font-bold tracking-widest ${statusColor} text-glow uppercase`}
            >
              Scan_Analysis
            </h3>
            <p className="text-[10px] text-green-700 font-mono mt-1">
              Advanced Threat Detection Report
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className={`text-sm font-bold px-3 py-1.5 border-2 ${borderColor} ${statusColor} tracking-widest`}
          >
            [{threatLevel.toUpperCase()}]
          </div>
          <div
            className={`text-[10px] font-bold px-2 py-1 ${isSafe ? "bg-green-900/30 text-green-500" : "bg-red-900/30 text-red-500"}`}
          >
            {getRiskCategory()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Score & Metrics */}
        <div className="space-y-6">
          {/* Risk Score */}
          <div className="bg-black/50 border border-green-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={14} className="text-green-500" />
              <p className="text-xs text-green-600 uppercase font-bold tracking-wide">
                Probabilistic_Risk_Score
              </p>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span
                className={`text-5xl font-bold ${statusColor} tracking-tight`}
              >
                {riskScore}
              </span>
              <span className="text-xl text-green-700 mb-2 font-bold">
                / 100
              </span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full h-6 border-2 border-green-900 bg-black relative overflow-hidden">
              <div className="absolute inset-0 flex gap-0.5 p-1">
                {[...Array(20)].map((_, i) => {
                  const isActive = i < riskScore / 5;
                  let barColor = "bg-transparent";
                  if (isActive) {
                    if (isSafe) barColor = "bg-green-500";
                    else if (isHighRisk) barColor = "bg-red-500";
                    else barColor = "bg-yellow-500";
                  }
                  return (
                    <div
                      key={i}
                      className={`h-full flex-1 ${barColor} transition-all duration-300 ${isActive && "animate-pulse"}`}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Risk percentage */}
            <div className="mt-3 flex justify-between text-[10px] text-green-700 font-mono">
              <span>0%</span>
              <span className={statusColor}>{riskScore}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Scan Target */}
          {input && (
            <div className="bg-black/50 border border-green-900/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-green-500" />
                <p className="text-xs text-green-600 uppercase font-bold">
                  Scan_Target
                </p>
              </div>
              <p className="text-sm text-green-300 font-mono break-all">
                &gt; {input}
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Detection Info */}
        <div className="space-y-6">
          {/* Detection Message */}
          <div className="bg-black/50 border border-green-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={14} className="text-green-500" />
              <p className="text-xs text-green-600 uppercase font-bold">
                Detection_Message
              </p>
            </div>
            <p className="text-sm text-green-300 leading-relaxed">
              <span className="text-green-500 mr-2">&gt;</span>
              {message}
            </p>
          </div>

          {/* Phishing Detection */}
          {phishing && (
            <div className="border-2 border-red-500/70 bg-linear-to-r from-red-950/30 to-transparent p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 animate-pulse"></div>
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle
                  size={20}
                  className="text-red-500 animate-pulse"
                />
                <span className="font-bold text-sm uppercase text-red-400 tracking-widest">
                  Phishing_Detected
                </span>
              </div>
              <p className="text-xs text-red-400 leading-relaxed mb-3">
                Pattern match confirmed against known heuristic vectors. This
                content exhibits characteristics commonly associated with
                phishing attempts.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-red-500 font-mono">
                <XCircle size={12} />
                <span>THREAT_CONFIDENCE: HIGH</span>
              </div>
            </div>
          )}

          {/* Safe badge */}
          {isSafe && !phishing && (
            <div className="border-2 border-green-500/70 bg-linear-to-r from-green-950/30 to-transparent p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="font-bold text-sm uppercase text-green-400 tracking-widest">
                  Verified_Safe
                </span>
              </div>
              <p className="text-xs text-green-500 leading-relaxed">
                No malicious patterns detected. Content appears legitimate and
                safe for interaction.
              </p>
            </div>
          )}

          {/* Threat Indicators */}
          <div className="bg-black/50 border border-green-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-green-500" />
              <p className="text-xs text-green-600 uppercase font-bold">
                Threat_Indicators
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Malware Signature:</span>
                <span className={isSafe ? "text-green-400" : "text-red-500"}>
                  {isSafe ? "CLEAN" : "DETECTED"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Phishing Patterns:</span>
                <span className={phishing ? "text-red-500" : "text-green-400"}>
                  {phishing ? "POSITIVE" : "NEGATIVE"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-700">Heuristic Match:</span>
                <span
                  className={isHighRisk ? "text-red-500" : "text-green-400"}
                >
                  {isHighRisk ? "MATCH" : "NO MATCH"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-green-900 flex items-center justify-between text-[10px] text-green-800 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Database size={10} />
            <span>SCAN_ID: {id || "SYS-AUTO-001"}</span>
          </div>
          <span className="text-green-900">|</span>
          <div className="flex items-center gap-1.5">
            <Clock size={10} />
            <span>TIME: {new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>MODULE: HEURISTIC_v2.4</span>
          <span className="text-green-900">|</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            <span>ENGINE: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
