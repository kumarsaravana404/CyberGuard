import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Scan,
  EyeOff,
  FileText,
  LogOut,
  Terminal,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  Network,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "DASHBOARD",
      id: "SYS-01",
    },
    { to: "/scan", icon: Scan, label: "SCANNER", id: "SCN-02" },
    { to: "/network", icon: Network, label: "NETWORK_OPS", id: "NET-03" },
    { to: "/cloaking", icon: EyeOff, label: "CLOAKING", id: "CLK-04" },
    { to: "/logs", icon: FileText, label: "LOGS", id: "LOG-05" },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-all border-l-2 ${
      isActive
        ? "bg-green-500/10 text-green-500 border-l-green-500"
        : "text-green-700 border-l-transparent hover:text-green-500 hover:bg-green-900/20 hover:border-l-green-700"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-black border-r border-green-900 flex flex-col z-50 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-green-900 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${collapsed ? "hidden" : ""}`}>
          <Terminal size={20} className="text-green-500" />
          <span className="text-sm font-bold tracking-widest text-green-500 text-glow">
            CYBERGUARD
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-green-700 hover:text-green-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* System Status */}
      <div
        className={`p-4 border-b border-green-900/50 ${collapsed ? "hidden" : ""}`}
      >
        <div className="text-[10px] text-green-700 uppercase mb-2">
          // SYSTEM_STATUS
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-green-600">
              <Activity size={12} /> CORE
            </span>
            <span className="text-green-500 font-bold">[ONLINE]</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-green-600">
              <Shield size={12} /> GUARD
            </span>
            <span className="text-green-500 font-bold">[ACTIVE]</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div
          className={`text-[10px] text-green-700 uppercase px-4 mb-2 ${collapsed ? "hidden" : ""}`}
        >
          // MODULES
        </div>
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={16} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] text-green-900">{item.id}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-green-900 p-4">
        {!collapsed && (
          <div className="mb-3">
            <div className="text-[10px] text-green-700 uppercase mb-1">
              // OPERATOR
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 animate-blink"></div>
              <span className="text-xs font-mono text-green-500 truncate">
                {user?.email || "UNKNOWN"}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider border border-red-900 text-red-500 hover:bg-red-500 hover:text-black transition-all ${collapsed ? "px-2" : ""}`}
          title="Logout"
        >
          <LogOut size={14} />
          {!collapsed && <span>TERMINATE</span>}
        </button>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-green-900/30">
          <div className="text-[9px] text-green-900 font-mono text-center">
            v2.0.4 // ENCRYPTED
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
