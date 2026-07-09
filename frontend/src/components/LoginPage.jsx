import React, { useState } from 'react';
import { api } from '../utils/api';
import { Shield, Mail, Lock, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onNavigate, defaultEmail = '' }) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      // Retrieve full user profile
      const user = await api.getMe();
      onLoginSuccess(user, data.access_token);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(
      'Password Help:\n\n' +
      '• If you registered yourself, use the password you set during registration.\n' +
      '• Demo Admin account → admin@agentic.com / adminpassword\n' +
      '• Demo Student account → student@agentic.com / studentpassword\n\n' +
      'If you forgot your password, please contact the workshop coordinator.'
    );
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-glow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[100px] animate-glow pointer-events-none"></div>

      <div className="w-full max-w-md">
        {/* Back to landing link */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition mb-6 group cursor-pointer"
        >
          <CornerDownLeft size={14} className="group-hover:-translate-x-0.5 transition" /> Back to Landing Page
        </button>

        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Shield size={120} className="text-white" />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="ByteXL Logo" className="h-9 w-auto object-contain" />
            <div className="h-6 w-px bg-white/15 mx-1" />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">AGENTIC 003</span>
              <span className="text-[10px] text-accent tracking-widest uppercase font-semibold">LMS Secure Login</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-xs text-slate-400 mb-6">Enter your email credentials to access the course catalog.</p>

          {error && (
            <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 glass-input text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400 font-semibold">Password</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] text-accent hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
                <input 
                  type="password" 
                  required
                  placeholder="Enter account password"
                  className="w-full pl-11 pr-4 py-3 glass-input text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-0 focus:ring-offset-0"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 text-slate-900 font-bold text-sm transition duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? 'Authenticating...' : 'Enter Platform'} <ArrowRight size={16} />
            </button>
          </form>



          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400">Need to create an account? </span>
            <button 
              onClick={() => onNavigate('landing')}
              className="text-accent font-bold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
