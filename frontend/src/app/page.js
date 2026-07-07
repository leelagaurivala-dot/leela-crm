'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:5000';

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('crm_token');
    const storedUser = localStorage.getItem('crm_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    if (!email || !password) {
      setLoginError('Please enter both email and password');
      setLoginLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store in localStorage
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify({ name: data.name, email: data.email, _id: data._id }));
      
      setToken(data.token);
      setUser({ name: data.name, email: data.email, _id: data._id });
    } catch (err) {
      console.error(err);
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF7F2]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#61191c] rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-slate-500 mt-4">Initializing workspace...</span>
      </div>
    );
  }

  // RENDER DASHBOARD IF LOGGED IN
  if (token && user) {
    return <Dashboard token={token} user={user} onLogout={handleLogout} />;
  }

  // RENDER LOGIN SCREEN IF NOT LOGGED IN
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6">
      <div className="w-full max-w-[450px]">
        {/* CRM logo branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-[#61191c] rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg shadow-[#61191c]/20">
            L
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Leela<span className="text-[#61191c]">CRM</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Sign in to manage Shopify leads, consultant assignments, and inventory.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-100/50 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Welcome Back</h2>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Login Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@leelacrm.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#61191c] transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-500">Secret Password *</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#61191c] transition-all font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#61191c] hover:bg-[#521316] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#61191c]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer mt-4"
            >
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Credentials Helper Box */}
          <div className="mt-6 p-4 bg-[#61191c]/10 border border-[#61191c]/20 rounded-xl text-center">
            <h4 className="text-[11px] font-bold text-[#61191c] uppercase tracking-wider mb-1">
              Pre-seeded Login Details:
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Email: <code className="bg-[#61191c]/10 px-1 py-0.5 rounded font-mono text-[#61191c]">admin@leelacrm.com</code>
            </p>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Pass: <code className="bg-[#61191c]/10 px-1 py-0.5 rounded font-mono text-[#61191c] font-bold">adminpassword</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
