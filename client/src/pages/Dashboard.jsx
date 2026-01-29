import { Link } from "react-router-dom";
import RecentScans from "../components/RecentScans";
import NetworkStatus from "../components/NetworkStatus";
import ActiveConnections from "../components/ActiveConnections";
import ThreatAlerts from "../components/ThreatAlerts";
import { Activity, ShieldAlert, Cpu, Terminal } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header / Banner */}
      <div className="border-b border-dashed border-green-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-glow uppercase">
            {">"} SYSTEM_OVERVIEW
          </h1>
          <p className="text-xs text-green-700 font-mono mt-1">
            /var/log/security_monitor :: v2.0.4
          </p>
        </div>
        <Link to="/scan" className="btn-terminal group">
          <span className="group-hover:animate-blink mr-2">{">"}</span>
          INITIATE_SCAN
        </Link>
      </div>

      {/* Top Row: Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="card-terminal">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 border border-green-900 bg-green-900/10">
              <Activity size={20} className="text-green-500" />
            </div>
            <span className="text-[10px] text-green-700 uppercase">
              ID: STS-01
            </span>
          </div>
          <div className="text-xs text-green-600 uppercase mb-1">
            System Status
          </div>
          <div className="text-xl font-bold text-green-500 tracking-wider">
            [ ONLINE ]
          </div>
          <div className="mt-4 w-full h-1 bg-green-900/30">
            <div className="h-full bg-green-500 w-full animate-pulse"></div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="card-terminal">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 border border-green-900 bg-green-900/10">
              <ShieldAlert size={20} className="text-green-500" />
            </div>
            <span className="text-[10px] text-green-700 uppercase">
              ID: THR-99
            </span>
          </div>
          <div className="text-xs text-green-600 uppercase mb-1">
            Threat Level
          </div>
          <div className="text-xl font-bold text-green-500 tracking-wider">
            [ STABLE ]
          </div>
          <div className="mt-4 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-full ${i < 2 ? "bg-green-500" : "bg-green-900/30"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="card-terminal group cursor-pointer hover:border-green-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 border border-green-900 bg-green-900/10 group-hover:bg-green-500 group-hover:text-black transition-colors">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] text-green-700 uppercase">
              ID: ACT-00
            </span>
          </div>
          <div className="text-xs text-green-600 uppercase mb-1">
            Active Modules
          </div>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-xs text-green-400">
              <span>PHISHING_DETECT</span>
              <span>[OK]</span>
            </div>
            <div className="flex justify-between text-xs text-green-400">
              <span>BRUTE_GUARD</span>
              <span>[OK]</span>
            </div>
            <div className="flex justify-between text-xs text-green-400">
              <span>SQL_INJECT</span>
              <span>[OK]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Awareness Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkStatus />
        <ThreatAlerts />
      </div>

      {/* Active Connections - Full Width */}
      <ActiveConnections />

      {/* Console Output / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-green-600 uppercase tracking-wider">
            <span>// RECENT_ACTIVITY_LOG</span>
            <span>MODE: READ_ONLY</span>
          </div>
          <RecentScans />
        </div>

        {/* Advisory Pane */}
        <div className="card-terminal lg:col-span-1 border-l-4 border-l-green-500">
          <h3 className="text-sm font-bold text-green-500 uppercase tracking-widest mb-4 border-b border-green-900 pb-2">
            ! ADVISORY_NOTICE
          </h3>
          <div className="font-mono text-xs text-green-400 leading-relaxed space-y-4">
            <p>
              <span className="text-green-700">{">"}</span> ALERT: Phishing
              vector signature detected in sector 7G.
            </p>
            <p>
              <span className="text-green-700">{">"}</span> RECOM: Update
              heuristic definitions immediately.
            </p>
            <p>
              <span className="text-green-700">{">"}</span> TIP: Monitor active
              connections for unusual patterns.
            </p>
            <p className="opacity-50">... END OF TRANSMISSION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
