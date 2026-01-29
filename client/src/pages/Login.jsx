import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Terminal, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [bootSequence, setBootSequence] = useState(true);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Boot sequence animation
    useEffect(() => {
        const timer = setTimeout(() => setBootSequence(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            if (password !== confirmPassword) {
                setError('PASS_MISMATCH: Verification failed.');
                return;
            }
            if (password.length < 4) {
                setError('PASS_LENGTH: Minimum 4 characters required.');
                return;
            }
        }

        setLocalLoading(true);
        const res = isRegistering 
            ? await register(email, password)
            : await login(email, password);
        setLocalLoading(false);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(`AUTH_ERR: ${res.message}`);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setPassword('');
        setConfirmPassword('');
    };

    if (bootSequence) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
                <div className="font-mono text-green-500 text-sm space-y-2 animate-pulse">
                    <p>&gt; INITIALIZING_SECURE_CHANNEL...</p>
                    <p>&gt; LOADING_ENCRYPTION_MODULES...</p>
                    <p className="text-green-700">&gt; AWAITING_CREDENTIALS_</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Scanlines overlay effect */}
            <div className="scanlines"></div>
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(51,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(51,255,0,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            <div className="w-full max-w-md z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 border border-green-900 bg-green-900/10">
                        <Terminal size={48} className="text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-widest text-green-500 text-glow uppercase">
                            {isRegistering ? 'NEW_USER_REGISTRY' : 'CYBERGUARD_ACCESS'}
                        </h1>
                        <p className="text-xs text-green-700 font-mono">
                            {isRegistering ? '// Create encrypted workspace' : '// Enter credentials to authenticate'}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card-terminal">
                    <div className="flex items-center justify-between text-xs text-green-700 uppercase mb-6 pb-2 border-b border-green-900">
                        <span>// AUTH_MODULE</span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 animate-blink"></div>
                            SECURE
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-xs font-mono text-red-500 bg-red-900/10 border border-red-900 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Mail size={12} /> USER_ID
                                </label>
                                <div className="flex items-center border-b border-green-500 pb-1">
                                    <span className="text-green-500 font-mono mr-2">{'>'}</span>
                                    <input
                                        type="email"
                                        className="w-full bg-transparent text-green-100 placeholder-green-900 focus:outline-none font-mono tracking-wide"
                                        placeholder="user@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={localLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Lock size={12} /> PASSKEY
                                </label>
                                <div className="flex items-center border-b border-green-500 pb-1">
                                    <span className="text-green-500 font-mono mr-2">{'>'}</span>
                                    <input
                                        type="password"
                                        className="w-full bg-transparent text-green-100 placeholder-green-900 focus:outline-none font-mono tracking-wide"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={localLoading}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password (Registration only) */}
                            {isRegistering && (
                                <div className="space-y-2 animate-in fade-in duration-300">
                                    <label className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                        <Lock size={12} /> CONFIRM_PASSKEY
                                    </label>
                                    <div className="flex items-center border-b border-green-500 pb-1">
                                        <span className="text-green-500 font-mono mr-2">{'>'}</span>
                                        <input
                                            type="password"
                                            className="w-full bg-transparent text-green-100 placeholder-green-900 focus:outline-none font-mono tracking-wide"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={localLoading}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={localLoading}
                            className="btn-terminal w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {localLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    AUTHENTICATING...
                                </>
                            ) : (
                                <>
                                    {isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />}
                                    [ {isRegistering ? 'CREATE_ACCOUNT' : 'AUTHENTICATE'} ]
                                    <ArrowRight size={16} className="opacity-70" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Toggle Mode */}
                <div className="text-center">
                    <button
                        onClick={toggleMode}
                        className="text-xs text-green-700 hover:text-green-500 font-mono transition-colors uppercase tracking-wider"
                        disabled={localLoading}
                    >
                        {isRegistering 
                            ? '> EXISTING_USER? [LOGIN]' 
                            : '> NEW_USER? [REGISTER]'}
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t border-green-900/30">
                    <p className="text-[10px] text-green-800 uppercase tracking-widest font-mono">
                        CYBERGUARD_v2.0 // ENCRYPTED_CHANNEL
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
