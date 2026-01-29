import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen selection:bg-green-500 selection:text-black">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-900 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold tracking-widest text-green-500 text-glow">
                    CYBERGUARD
                </span>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-green-500 border border-green-900 hover:bg-green-500 hover:text-black transition-colors"
                >
                    <Menu size={18} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div 
                        className="absolute inset-0 bg-black/80"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                    <div className="absolute left-0 top-0 h-full w-64">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="md:ml-56 min-h-screen pt-16 md:pt-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
