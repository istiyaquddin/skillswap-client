"use client";

import { Sparkles, GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes spinSmooth {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverseFast {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes pulseBeam {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.04);
          }
        }

        @keyframes shimmerFast {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--bg)]/92 backdrop-blur-2xl px-4 overflow-hidden">
        
        {/* Subtle Professional Ambient Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-[pulseBeam_5s_infinite_ease-in-out]" />
        
        <div className="relative w-full max-w-xs mx-auto rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.25)] text-center space-y-5 border-t border-t-amber-500/30">
          
          {/* Executive Orbit Loader */}
          <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
            
            {/* Primary Emerald Ring */}
            <svg
              viewBox="0 0 80 80"
              className="absolute inset-0 h-full w-full animate-[spinSmooth_1.2s_linear_infinite]"
            >
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="rgba(29, 191, 115, 0.12)"
                strokeWidth="3"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#1dbf73"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="50 170"
              />
            </svg>

            {/* Accent Amber Inner Arc */}
            <svg
              viewBox="0 0 60 60"
              className="absolute inset-2.5 h-15 w-15 animate-[spinReverseFast_1.8s_linear_infinite]"
            >
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="30 130"
                opacity="0.85"
              />
            </svg>

            {/* Center Brand Badge */}
            <div className="amber-gradient amber-glow h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md relative">
              <GraduationCap className="h-5 w-5 stroke-[2.2]" />
            </div>
          </div>

          {/* Professional Brand Info */}
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight text-[var(--text)]">
              Skill<span className="amber-text-gradient">Swap</span>
            </h3>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1dbf73]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1dbf73] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1dbf73]"></span>
              </span>
              Optimizing Session...
            </div>
          </div>

          {/* High-Speed Shimmer Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-[var(--surface)] border border-[var(--border)] rounded-full overflow-hidden relative">
              <div className="amber-gradient h-full w-3/4 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 animate-[shimmerFast_1.2s_infinite]" />
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider px-1">
              <span>Encrypted SSL</span>
              <span className="text-[#1dbf73]">Fast Sync</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}