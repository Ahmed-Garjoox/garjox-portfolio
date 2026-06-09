import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, bypass login page
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!username || !password) {
      setErrorMsg('Please enter both your username and password.');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[70vh]">
      <div className="w-full bg-white dark:bg-dark-900/40 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-dark-800/50 shadow-xl space-y-6 text-left">
        
        {/* Header/Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto">
            <Shield size={24} />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Admin Portal</h2>
          <p className="text-sm text-slate-500">Sign in to manage posts, portfolio items, and view traffic metrics.</p>
        </div>

        {/* Errors */}
        {errorMsg && (
          <div className="flex gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold">
            <AlertTriangle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="e.g. admin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-1 relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-slate-450 hover:text-slate-650 dark:hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-450 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Authenticate'
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-dark-800">
          <p className="text-[11px] text-slate-400">
            Authorized operations only. All connection IPs and activities are logged in the analytics hub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
