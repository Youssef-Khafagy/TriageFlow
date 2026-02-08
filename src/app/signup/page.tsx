"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email, role: 'patient' }));
      const [firstName, ...rest] = name.split(' ');
      localStorage.setItem('userProfile', JSON.stringify({ firstName, lastName: rest.join(' '), age: '', sex: 'Male', phone: '', address: '', healthCard: '', allergies: 'None', disabilities: 'None' }));
      router.push('/patient/portal');
    }, 800);
  };

  const ic = "w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors";
  const is = { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-4" style={{ background: 'var(--color-primary)' }}><Activity size={22} /></div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Create your account</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Join TriageFlow for faster ER intake</p>
        </div>
        <form onSubmit={handleSignup} className="rounded-2xl border p-7 space-y-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Full Name</label><input required className={ic} style={is} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Email</label><input required type="email" className={ic} style={is} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Password</label><div className="relative"><input required type={showPass ? 'text' : 'password'} className={`${ic} pr-11`} style={is} placeholder="••••••••" minLength={6} value={pass} onChange={e => setPass(e.target.value)} /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>Already have an account? <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>Sign in</Link></p>
      </div>
    </div>
  );
}