"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === 'administrator@gmail.com' && pass === 'triageflowadmin') {
        localStorage.setItem('user', JSON.stringify({ email, role: 'staff' }));
        router.push('/staff/dashboard');
      } else {
        setError('Invalid credentials. Contact your administrator.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#020617' }}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/15 blur-[100px]" />
      </div>
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Staff Portal</h1>
          <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5"><Shield size={13} /> Secure clinical access</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-7 space-y-5">
          {error && (
            <div className="bg-red-900/30 text-red-400 text-sm font-medium px-4 py-3 rounded-xl border border-red-800/40 animate-fade-up">{error}</div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
            <input required type="email" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors hover:border-slate-600" placeholder="staff@hospital.org" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input required type={showPass ? 'text' : 'password'} className="w-full px-4 py-3 pr-11 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-colors hover:border-slate-600" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Access Dashboard <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-slate-600">
          Patient? <Link href="/login" className="text-slate-400 hover:text-white font-medium transition-colors">Use patient sign in →</Link>
        </p>
      </div>
    </div>
  );
}