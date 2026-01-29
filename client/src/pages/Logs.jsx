import RecentScans from '../components/RecentScans';
import { FileText } from 'lucide-react';

const Logs = () => {
    // Determine if we need a refresh trigger or if RecentScans handles its own initial fetch.
    // RecentScans fetches on mount.
    
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3 pb-4 border-b border-green-900 border-dashed">
                <div className="p-2 bg-green-900/10 border border-green-900">
                    <FileText size={20} className="text-green-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-green-500 tracking-widest uppercase text-glow">Security Audit Logs</h1>
                    <p className="text-xs text-green-700 font-mono mt-0.5">// Comprehensive history of all scanning activities</p>
                </div>
            </div>

            <RecentScans limit={50} />
        </div>
    );
};

export default Logs;
