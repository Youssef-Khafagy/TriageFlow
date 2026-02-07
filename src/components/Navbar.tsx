"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, LogOut, UserCircle, Home, Info, Clipboard, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 px-6 h-16 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Activity size={20}/></div>
          <span className="font-bold text-xl tracking-tight">SmartTriage</span>
        </Link>

        {/* Global Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Home size={16}/> Home
          </Link>
          <Link href="/about" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Info size={16}/> About
          </Link>
          {/* Patient Portal Link - Accessible to all to encourage signup */}
          <Link href="/patient/portal" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Clipboard size={16}/> Patient Portal
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Staff specific link */}
            {user.role === 'staff' && (
              <Link href="/staff/dashboard" className="text-sm font-bold text-blue-600 hover:underline mr-2">
                Staff Dashboard
              </Link>
            )}
            
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors p-1">
              <User size={20}/>
            </Link>
            
            <div className="hidden sm:flex flex-col items-end border-l pl-4 ml-2">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Logged In</span>
              <span className="text-sm font-bold text-gray-700">{user.email}</span>
            </div>

            <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2">
              <LogOut size={20}/>
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-bold text-gray-600 px-4 py-2 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}