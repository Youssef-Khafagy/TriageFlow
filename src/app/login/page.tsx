"use client";
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    let role = 'patient';
    if (email === 'administrator@gmail.com' && pass === 'triageflowadmin') {
      role = 'staff';
    }
    
    localStorage.setItem('user', JSON.stringify({ email, role }));
    window.location.href = role === 'staff' ? '/staff/dashboard' : '/patient/chat';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <input required type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-4" onChange={e => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-6" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Login</button>
      </form>
    </div>
  );
}