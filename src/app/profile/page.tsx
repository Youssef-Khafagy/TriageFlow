"use client";
import { useState, useEffect } from 'react';
import { User, Save, MapPin, Phone, Calendar, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', age: '', sex: 'Male', phone: '', address: '', healthCard: '', allergies: 'None', disabilities: 'None' });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) { const p = JSON.parse(u); if (p.role === 'staff') { router.replace('/staff/dashboard'); return; } setUser(p); }
    const sp = localStorage.getItem('userProfile');
    if (sp) setProfile(JSON.parse(sp));
  }, [router]);

  const saveProfile = () => { localStorage.setItem('userProfile', JSON.stringify(profile)); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  if (!user) return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}><p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Please sign in to manage your health profile.</p></div>;

  const ic = "w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors";
  const is = { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-3xl mx-auto animate-fade-up">
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
          <div className="p-6 text-white flex items-center gap-4" style={{ background: 'var(--color-primary)' }}>
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center"><User size={22} /></div>
            <div><h1 className="text-lg font-bold">Health Profile</h1><p className="text-white/70 text-xs">Shared automatically with the AI Nurse during intake</p></div>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>First Name</label><input className={ic} style={is} value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} placeholder="John" /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Last Name</label><input className={ic} style={is} value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} placeholder="Doe" /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Age</label><div className="relative"><Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} /><input type="number" className={`${ic} pl-10`} style={is} value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} placeholder="25" /></div></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Biological Sex</label><select className={`${ic} cursor-pointer`} style={is} value={profile.sex} onChange={e => setProfile({...profile, sex: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Phone</label><div className="relative"><Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} /><input className={`${ic} pl-10`} style={is} value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="(555) 000-0000" /></div></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Healthcard</label><input className={`${ic} font-mono`} style={is} value={profile.healthCard} onChange={e => setProfile({...profile, healthCard: e.target.value})} placeholder="0000-000-000-XX" /></div>
            <div className="md:col-span-2"><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Address</label><div className="relative"><MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} /><input className={`${ic} pl-10`} style={is} value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="123 Clinical Way, Toronto, ON" /></div></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-red-400">Allergies</label><select className={`${ic} cursor-pointer`} style={is} value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})}><option>None</option><option>Peanuts</option><option>Penicillin</option><option>Latex</option><option>Dairy</option></select></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-primary)' }}>Disabilities</label><select className={`${ic} cursor-pointer`} style={is} value={profile.disabilities} onChange={e => setProfile({...profile, disabilities: e.target.value})}><option>None</option><option>Visual Impairment</option><option>Hearing Impairment</option><option>Mobility Issues</option><option>Cognitive</option></select></div>
          </div>
          <div className="px-6 md:px-8 py-5 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--border-color)' }}>
            {saved && <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-500 animate-fade-up"><CheckCircle size={15} /> Saved</span>}
            <button onClick={saveProfile} className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]" style={{ background: 'var(--color-primary)' }}><Save size={16} /> Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}