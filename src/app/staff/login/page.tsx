"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email === 'administrator@gmail.com' && pass === 'triageflowadmin') {
      router.push('/staff/dashboard');
    } else {
      alert("Invalid credentials for demo.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Staff Secure Access</h1>
        <input className="w-full p-3 border rounded-lg mb-4" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded-lg mb-6" type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-700">Access Dashboard</button>
      </div>
    </div>
  );
}