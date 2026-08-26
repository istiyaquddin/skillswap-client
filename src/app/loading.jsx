"use client";

import { Sparkles, Zap, User, Briefcase, GraduationCap, ShieldCheck } from "lucide-react";

const STEPS = [
  { label: "Initializing campus network", icon: Zap, color: "text-[#1dbf73]" },
  { label: "Verifying encrypted session tokens", icon: ShieldCheck, color: "text-[#06b6d4]" },
  { label: "Syncing marketplace telemetry", icon: Briefcase, color: "text-[#8b5cf6]" },
  { label: "Preparing interactive workspace", icon: Sparkles, color: "text-amber-400" },
];

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes spinSlow {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverseSlow {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes floatPulse {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
          }
        }

        @keyframes progressSweep {
          0% {
            width: 5%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 98%;
          }
        }

        @keyframes orbGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-grid-pattern px-4 overflow-hidden bg-[var(--bg)]/90 backdrop-blur-xl">
        
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#1dbf73]/15 rounded-full blur-[140px] animate-[orbGlow_6s_infinite_ease-in-out]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-[140px] animate-[orbGlow_8s_infinite_ease-in-out_2s]" />

        <div className="relative w-full max-w-sm mx-auto rounded-[2.5rem] border border-[#1dbf73]/30 bg-[var(--surface-strong)]/90 backdrop-blur-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] animate-[floatPulse_4s_ease-in-out_infinite] glowing-border-card">
          
          {/* Logo & Dual Orbit Neon Spinner */}
          <div className="relative mx-auto mb-6 h-24 w-24 flex items-center justify-center">
            
            {/* Outer Emerald Orbit Circle */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[spinSlow_2s_linear_infinite]"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(29,191,115,0.15)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#1dbf73"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="70 200"
              />
            </svg>

            {/* Inner Cyan Orbit Circle */}
            <svg
              viewBox="0 0 80 80"
              className="absolute inset-2.5 h-19 w-19 animate-[spinReverseSlow_2.5s_linear_infinite]"
            >
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="rgba(6,182,212,0.15)"
                strokeWidth="3"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="40 170"
              />
            </svg>

            {/* Center Brand Icon */}
            <div className="amber-gradient amber-glow h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xl relative group">
              <GraduationCap className="h-6 w-6 stroke-[2.2] animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
            </div>
          </div>

          {/* Header Typography */}
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">
              Skill<span className="amber-text-gradient-vibrant">Swap</span>
            </h2>

            <p className="mt-1.5 text-[11px] font-black tracking-widest text-[#1dbf73] uppercase flex items-center justify-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1dbf73] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1dbf73]"></span>
              </span>
              Loading Campus Telemetry...
            </p>
          </div>

          {/* Steps List */}
          <div className="mt-6 space-y-2.5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 px-3.5 py-2.5 transition duration-200 hover:border-[#1dbf73]/40"
                >
                  <div className="h-2 w-2 rounded-full bg-[#1dbf73] animate-pulse" />
                  <Icon className={`h-4 w-4 ${step.color} shrink-0`} />
                  <span className="text-xs font-bold text-[var(--text)] truncate">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Shimmer Progress Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span className="text-[var(--muted)]">Syncing Data</span>
              <span className="text-[#1dbf73]">Optimal</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)] border border-[var(--border)] relative">
              <div className="amber-gradient h-full rounded-full animate-[progressSweep_2.5s_ease-in-out_infinite] shadow-[0_0_12px_rgba(29,191,115,0.6)]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}