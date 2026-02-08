"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, ArrowRight, Lock, Clock } from "lucide-react";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-x-hidden px-6 pt-32 pb-24"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background Decorative Radial Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ background: "var(--color-primary-glow)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]"
          style={{ background: "var(--color-primary-glow)" }}
        />
      </div>

      {/* Background Heartbeat / EKG Lines */}
      <svg
        className="absolute top-[32%] left-0 w-[200%] h-64 opacity-[0.08] pointer-events-none z-0"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="ekg-line"
          d="M0,60 L200,60 L230,60 L250,30 L270,90 L285,20 L300,100 L315,10 L335,60 L360,60 L600,60 L630,60 L650,30 L670,90 L685,20 L700,100 L715,10 L735,60 L760,60 L1000,60 L1030,60 L1050,30 L1070,90 L1085,20 L1100,100 L1115,10 L1135,60 L1160,60 L1400,60 L1430,60 L1450,30 L1470,90 L1485,20 L1500,100 L1515,10 L1535,60 L1560,60 L1800,60 L1830,60 L1850,30 L1870,90 L1885,20 L1900,100 L1915,10 L1935,60 L1960,60 L2400,60"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        className="absolute top-[55%] left-[-10%] w-[220%] h-32 opacity-[0.04] pointer-events-none z-0"
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="ekg-line ekg-line-2"
          d="M0,60 L300,60 L330,60 L350,35 L370,85 L385,15 L400,105 L415,10 L435,60 L460,60 L800,60 L830,60 L850,35 L870,85 L885,15 L900,105 L915,10 L935,60 L960,60 L1300,60 L1330,60 L1350,35 L1370,85 L1385,15 L1400,105 L1415,10 L1435,60 L1460,60 L1800,60 L1830,60 L1850,35 L1870,85 L1885,15 L1900,105 L1915,10 L1935,60 L1960,60 L2400,60"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 1. Logo / Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center z-10 mb-20 max-w-3xl"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black tracking-wide mb-10"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          <Zap size={16} /> Next-Gen ER Intelligence
        </div>

        {/* Animated Logo — original font-black italic style with spring hover */}
        <motion.h1
          className="text-8xl md:text-[11rem] font-black tracking-tighter italic leading-none drop-shadow-2xl cursor-default select-none"
          style={{ color: "var(--text-primary)" }}
          whileHover={{
            scale: 1.05,
            filter:
              "drop-shadow(0 0 14px rgba(59, 130, 246, 0.45)) brightness(1.05)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Triage<span style={{ color: "var(--color-primary)" }}>Flow</span>
        </motion.h1>

        <p
          className="text-xl mt-8 font-medium leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Streamlining emergency department intake with AI-guided assessments
          and real-time clinical prioritization.
        </p>
      </motion.div>

      {/* 2. Action Buttons */}
      <div className="flex flex-col md:flex-row gap-6 mb-32 z-10">
        <Link
          href="/patient/portal"
          className="group relative inline-flex items-center gap-3 text-white px-12 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95"
          style={{ background: "var(--color-primary)" }}
        >
          Patient Portal
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </Link>

        <Link
          href="/staff/login"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl text-xl font-black border transition-all hover:brightness-110"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            background: "var(--bg-surface)",
          }}
        >
          <Lock size={20} /> Staff Access
        </Link>
      </div>

      {/* 3. Mission / Feature Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        {[
          {
            icon: Clock,
            title: "The Zero-Wait Vision",
            desc: "Eliminating manual intake bottlenecks by collecting clinical data before a patient reaches the desk.",
          },
          {
            icon: Activity,
            title: "SBAR Logic",
            desc: "AI-powered clinical scribing that converts patient complaints into formal medical documentation instantly.",
          },
          {
            icon: Shield,
            title: "Provider-First Design",
            desc: "Built to reduce cognitive load and ensure clinicians see the most critical patients first.",
          },
        ].map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="backdrop-blur p-10 rounded-[40px] border group transition-all"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <Icon
              className="mb-6 group-hover:scale-110 transition-transform"
              size={40}
              style={{ color: "var(--color-primary)" }}
            />
            <h3
              className="text-2xl font-black mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h3>
            <p
              className="font-medium leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}