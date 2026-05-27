import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onShowToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      onShowToast('Please enter both username and password details!', 'error');
      return;
    }

    setLoading(true);
    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      onShowToast('Welcome back, Admin!', 'success');
      navigate('/admin');
    } else {
      onShowToast(res.message || 'Invalid administrative credentials!', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-dark-blue to-[#081229] flex items-center justify-center p-6 font-body">
      
      {/* Glow vector vectors */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-premium-lg animate-bounce-subtle">
        
        {/* Banner header */}
        <div className="bg-dark-blue px-8 py-8 flex flex-col items-center border-b border-white/5 text-center">
          <span className="w-12 h-12 bg-gold-accent rounded-xl flex items-center justify-center text-dark-blue font-bold shadow-premium-md mb-4">
            <ShieldCheck className="w-7 h-7 text-dark-blue" />
          </span>
          <h2 className="font-display font-extrabold text-xl tracking-tight text-white leading-none">CYBER HUB OFFICE</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2.5">Administrative Secure Lock</p>
        </div>

        {/* Login credentials form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Username Credentials *</label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-white/5 border border-white/10 focus:border-teal-accent text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Hashed Secure Password *</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-teal-accent text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-3 text-xs focus:outline-none transition-colors"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-accent hover:bg-gold-accent-hover text-dark-blue font-display font-semibold text-xs py-3.5 rounded-lg shadow-premium-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="bg-white/2 border-t border-white/5 py-4 text-center">
          <p className="text-[10px] text-slate-500">Authorized personnel only. Logs are checked regularly.</p>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
