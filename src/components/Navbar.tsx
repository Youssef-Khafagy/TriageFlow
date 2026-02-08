"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  LogOut, 
  User, 
  Home, 
  Info, 
  Clipboard 
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1e293b]/60 backdrop-blur-xl border-b border-white/5 py-4 px-8 flex items-center justify-between no-print">
      
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <Activity className="text-blue-500 group-hover:scale-110 transition-transform" />
        <span className="text-xl font-black text-white tracking-tighter">
          TriageFlow
        </span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-8">

        {/* Global Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-300">
          <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
            <Home size={16} /> Home
          </Link>
          <Link href="/about" className="flex items-center gap-1 hover:text-white transition-colors">
            <Info size={16} /> About
          </Link>
          <Link href="/patient/portal" className="flex items-center gap-1 hover:text-white transition-colors">
            <Clipboard size={16} /> Patient Portal
          </Link>

          {/* Staff Shortcut */}
          {user?.role === "staff" && (
            <Link
              href="/staff/dashboard"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Staff Dashboard
            </Link>
          )}
        </div>

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-slate-300 hover:text-white transition-colors p-1"
            >
              <User size={20} />
            </Link>

            <div className="hidden sm:flex flex-col items-end border-l border-white/10 pl-4">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Logged In
              </span>
              <span className="text-sm font-bold text-slate-300">
                {user.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-white font-bold text-sm px-4 py-2 hover:opacity-70 transition-all"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white font-bold text-sm px-5 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
