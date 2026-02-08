"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, ArrowRight, Lock, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden px-6 pt-32 pb-24 bg-white dark:bg-slate-950 dark-theme">
      {/* Background Decorative Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent -z-10" />

      {/* Background Heartbeat / EKG Line */}
      <svg
        className="absolute top-[35%] left-0 w-full h-64 opacity-20 pointer-events-none z-0"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
      >
        <path
          className="animate-ekg"
          d="M0 50 L100 50 L110 30 L130 70 L140 50 L250 50 L260 10 L280 90 L290 50 L500 50 L510 30 L530 70 L540 50 L1000 50"
          stroke="#3b82f6"
          strokeWidth={1.5}
          fill="none"
        />
      </svg>

      {/* 1. Logo / Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center z-10 mb-20 max-w-3xl md:-translate-x-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-black tracking-wide mb-10">
          <Zap size={16} /> Next-Gen ER Intelligence
        </div>

        {/* Animated Logo */}
        <motion.h1
          className="text-8xl md:text-[11rem] font-black tracking-tighter italic text-gray-900 dark:text-white leading-none drop-shadow-2xl cursor-default select-none"
          whileHover={{
            scale: 1.05,
            filter:
              "drop-shadow(0 0 14px rgba(59, 130, 246, 0.45)) brightness(1.05)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Triage<span className="text-blue-500">Flow</span>
        </motion.h1>

        <p className="text-xl text-gray-500 dark:text-slate-400 mt-8 font-medium leading-relaxed">
          Streamlining emergency department intake with AI-guided assessments
          and real-time clinical prioritization.
        </p>
      </motion.div>

      {/* 2. Action Buttons */}
      <div className="flex flex-col md:flex-row gap-8 mb-32 z-10">
        <Link
          href="/patient/portal"
          className="group relative inline-flex items-center gap-3 bg-gray-900 dark:bg-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          Patient Portal
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </Link>

        <Link
          href="/staff/login"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-xl font-black border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
        >
          <Lock size={20} /> Staff Access
        </Link>
      </div>

      {/* 3. Mission / Feature Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur p-10 rounded-[40px] border border-gray-200 dark:border-white/10 group hover:border-blue-500/50 transition-all">
          <Clock
            className="text-blue-600 mb-6 group-hover:scale-110 transition-transform"
            size={40}
          />
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
            The Zero-Wait Vision
          </h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            Eliminating manual intake bottlenecks by collecting clinical data
            before a patient reaches the desk.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur p-10 rounded-[40px] border border-gray-200 dark:border-white/10 group hover:border-blue-500/50 transition-all">
          <Activity
            className="text-blue-600 mb-6 group-hover:scale-110 transition-transform"
            size={40}
          />
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
            SBAR Logic
          </h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            AI-powered clinical scribing that converts patient complaints into
            formal medical documentation instantly.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur p-10 rounded-[40px] border border-gray-200 dark:border-white/10 group hover:border-blue-500/50 transition-all">
          <Shield
            className="text-blue-600 mb-6 group-hover:scale-110 transition-transform"
            size={40}
          />
          <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
            Provider-First Design
          </h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            Built to reduce cognitive load and ensure clinicians see the most
            critical patients first.
          </p>
        </div>
      </div>
    </div>
  );
}
