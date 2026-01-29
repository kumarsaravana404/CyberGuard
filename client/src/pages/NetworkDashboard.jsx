import { useState } from "react";
import NetworkStatus from "../components/NetworkStatus";
import ActiveConnections from "../components/ActiveConnections";
import NetworkTrafficMonitor from "../components/NetworkTrafficMonitor";
import PortScanner from "../components/PortScanner";
import PacketAnalyzer from "../components/PacketAnalyzer";
import { Network, Shield, Activity, Layers } from "lucide-react";

const NetworkDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview"); // overview, analysis, security

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: Network },
    { id: "analysis", label: "ANALYSIS", icon: Activity },
    { id: "security", label: "SECURITY", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-black text-green-500 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Layers size={32} className="text-green-500 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-green-400 uppercase tracking-widest text-glow">
              Network_Operations_Center
            </h1>
            <p className="text-xs text-green-700 font-mono mt-1">
              Advanced Network Monitoring & Analysis Platform
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase border transition-all ${
                activeTab === tab.id
                  ? "bg-green-500 text-black border-green-500"
                  : "text-green-700 border-green-900 hover:border-green-700 hover:text-green-500"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NetworkStatus />
          <ActiveConnections />
          <NetworkTrafficMonitor />
          <div className="card-terminal relative group hover:border-green-600 transition-all duration-300">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-green-500" />
              <div>
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">
                  Network_Status_Summary
                </h3>
                <span className="text-[9px] text-green-700 font-mono">
                  Real-time System Overview
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-linear-to-r from-green-950/20 to-transparent border-l-2 border-green-500 p-3">
                <div className="text-[10px] text-green-700 uppercase mb-2">
                  System Health
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600">
                    Network Availability
                  </span>
                  <span className="text-lg font-bold text-green-400 font-mono">
                    99.9%
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-950/20 to-transparent border-l-2 border-blue-500 p-3">
                <div className="text-[10px] text-blue-700 uppercase mb-2">
                  Performance
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600">Average Latency</span>
                  <span className="text-lg font-bold text-blue-400 font-mono">
                    28ms
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-yellow-950/20 to-transparent border-l-2 border-yellow-500 p-3">
                <div className="text-[10px] text-yellow-700 uppercase mb-2">
                  Security
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-600">
                    Threats Blocked
                  </span>
                  <span className="text-lg font-bold text-yellow-400 font-mono">
                    127
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 gap-6">
          <PacketAnalyzer />
          <NetworkTrafficMonitor />
        </div>
      )}

      {activeTab === "security" && (
        <div className="grid grid-cols-1 gap-6">
          <PortScanner />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetworkStatus />
            <ActiveConnections />
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-green-900/50 flex items-center justify-between text-[10px] text-green-800 font-mono">
        <div className="flex items-center gap-4">
          <span>NOC_VERSION: 3.2.1</span>
          <span className="text-green-900">|</span>
          <span>UPTIME: 47d 12h 34m</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          <span>ALL_SYSTEMS_OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkDashboard;
