import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Logs from "./pages/Logs";
import Cloaking from "./pages/Cloaking";
import NetworkDashboard from "./pages/NetworkDashboard";
import DashboardLayout from "./components/DashboardLayout";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-green-500 font-mono text-sm animate-pulse">
          &gt; INITIALIZING_SECURE_ENVIRONMENT...
        </div>
        <div className="w-32 h-1 bg-green-900/30 overflow-hidden">
          <div className="h-full bg-green-500 w-1/2 animate-shimmer"></div>
        </div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="scanlines"></div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Routes wrapped in DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/cloaking" element={<Cloaking />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/network" element={<NetworkDashboard />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
