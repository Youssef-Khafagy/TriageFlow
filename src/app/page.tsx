"use client";
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent -z-10 opacity-70" />

      <div className="text-center space-y-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 text-sm font-bold tracking-wide animate-bounce">
          <Activity size={18} /> Next-Gen ER Intelligence
        </div>
        
        <h1 className="text-8xl md:text-9xl font-black text-gray-900 tracking-tighter italic">
          Triage<span className="text-blue-600">Flow</span>
        </h1>
        
        <p className="text-xl text-gray-500 font-medium leading-relaxed px-4">
          Streamlining emergency department intake with AI-guided assessments 
          and real-time clinical prioritization.
        </p>

        <div className="pt-8">
          <Link href="/patient/portal" className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-blue-600 transition-all shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95">
            Patient Portal
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}