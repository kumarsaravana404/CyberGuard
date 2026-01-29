import { ShieldCheck, Terminal } from "lucide-react";

const Logo = ({ size = 32, className = "", animated = true }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Background Glow */}
      {animated && (
        <div className="absolute inset-0 bg-green-500 opacity-20 blur-xl animate-pulse"></div>
      )}

      {/* Main Shield Icon */}
      <div className="relative">
        <ShieldCheck
          size={size}
          className="text-green-500 text-glow drop-shadow-lg relative z-10"
          strokeWidth={2}
        />

        {/* Corner Accents */}
        {animated && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-green-400 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-green-400 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-green-400 animate-pulse"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-green-400 animate-pulse"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Logo;
