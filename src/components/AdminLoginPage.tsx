import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { setAdminToken } from './ProtectedRoute';

interface AdminLoginPageProps {
  isDarkMode?: boolean;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ isDarkMode = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isStandaloneAdmin = typeof window !== 'undefined' && (
    window.location.hostname.startsWith('admin') ||
    window.location.hostname.includes('.admin.') ||
    window.location.search.includes('mode=admin')
  );

  const mainPortalUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname.replace(/^admin[-.]/, '')}${window.location.port ? ':' + window.location.port : ''}`
    : '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Non-JSON server response:', text);
        setError(`Server xatosi (${res.status}). Qayta urinib ko'ring.`);
        return;
      }

      if (res.ok && data.success) {
        setAdminToken(data.token);
        if (isStandaloneAdmin) {
          window.location.reload();
        } else {
          navigate('/admin/panel');
        }
      } else {
        setError(data.message || 'Login yoki parol noto\'g\'ri!');
      }
    } catch (err: any) {
      console.error('Login request failed:', err);
      setError('Server bilan aloqa yo\'q. Qayta urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
    }`}>
      <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Admin Boshqaruv Paneli</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Tizimga kirish uchun ma'lumotlaringizni kiriting
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Admin Login
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              placeholder="admin"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
              Maxfiy Parol
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/25 mt-2 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isLoading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href={isStandaloneAdmin ? mainPortalUrl : "/"}
            className="text-xs font-semibold text-slate-400 hover:text-blue-500 transition-colors"
          >
            ← Maktab rasmiy portaliga o'tish
          </a>
        </div>
      </div>
    </div>
  );
};
