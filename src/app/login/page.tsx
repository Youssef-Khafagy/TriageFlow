"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email === 'administrator@gmail.com') {
      setError('Staff members should use the Staff Access portal.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email, role: 'patient' }));
      window.location.href = '/patient/portal';
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-4" style={{ background: 'var(--color-primary)' }}>
            <Activity size={22} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to access your patient portal</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl border p-7 space-y-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm font-medium px-4 py-3 rounded-xl border border-red-500/20 animate-fade-up">{error}</div>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
            <input required type="email" className="w-full px-4 py-3 rounded-xl text-sm border transition-colors outline-none" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
            <div className="relative">
              <input required type={showPass ? 'text' : 'password'} className="w-full px-4 py-3 pr-11 rounded-xl text-sm border transition-colors outline-none" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          New patient? <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Create an account</Link>
        </p>
        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Staff member? <Link href="/staff/login" className="font-semibold hover:underline" style={{ color: 'var(--text-secondary)' }}>Use staff sign in →</Link>
        </p>
      </div>
    </div>
  );
}