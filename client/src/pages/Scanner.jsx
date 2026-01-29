import { useState } from 'react';
import ThreatScanner from '../components/ThreatScanner';
import ScanResult from '../components/ScanResult';
import { Scan } from 'lucide-react';

const Scanner = () => {
    const [lastScanResult, setLastScanResult] = useState(null);

    const handleScanComplete = (result) => {
        setLastScanResult(result);
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 pb-4 border-b border-green-900 border-dashed">
                <div className="p-2 bg-green-900/10 border border-green-900">
                    <Scan size={20} className="text-green-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-green-500 tracking-widest uppercase text-glow">Threat Intelligence Scanner</h1>
                    <p className="text-xs text-green-700 font-mono mt-0.5">Deep inspection of URLs and text payloads.</p>
                </div>
            </div>

            <ThreatScanner onScanComplete={handleScanComplete} />
            
            <div className={`transition-all duration-500 ease-out origin-top ${lastScanResult ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
                {lastScanResult && <ScanResult result={lastScanResult} />}
            </div>
        </div>
    );
};

export default Scanner;
