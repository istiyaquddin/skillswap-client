"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Sparkles, ShieldCheck, Zap, Cpu } from "lucide-react";

const MESSAGES = [
  "Initializing SkillSwap...",
  "Preparing your workspace...",
  "Finding the best experience...",
  "Syncing your profile...",
  "Connecting securely...",
  "Optimizing performance...",
  "Loading your dashboard...",
  "Almost Ready...",
  "Welcome Back!"
];

export default function Loading() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [progress, setProgress] = useState(15);

  // Cycle loading messages smoothly
  useEffect(() => {
    const msgInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 250);
    }, 1800);

    return () => clearInterval(msgInterval);
  }, []);

  // Smooth progress counter simulation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) return 96;
        const diff = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + diff, 96);
      });
    }, 280);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes orbitRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbitRotateReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes logoBreathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.06) translateY(-4px); }
        }

        @keyframes rippleExpand {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -25px) scale(1.1); }
        }

        @keyframes floatParticleDrift {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-30px) scale(1.3); opacity: 0.7; }
          100% { transform: translateY(-60px) scale(0.9); opacity: 0; }
        }
      `}</style>

      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/95 dark:bg-[#111315]/95 backdrop-blur-3xl px-4 overflow-hidden font-sans text-[#222325] dark:text-white transition-colors duration-500">
        
        {/* ── Ambient Background Layer ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top-Right Soft Emerald Ambient Orb */}
          <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-[#1DBF73]/12 blur-[140px] animate-[floatBlob_8s_infinite_ease-in-out]" />
          
          {/* Bottom-Left Soft Cyan Glow */}
          <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px] animate-[floatBlob_10s_infinite_ease-in-out]" style={{ animationDelay: '2s' }} />
          
          {/* Subtly textured background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />

          {/* Floating Micro Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { left: "15%", top: "25%", delay: "0s", duration: "6s" },
              { left: "80%", top: "20%", delay: "1.5s", duration: "7s" },
              { left: "25%", top: "75%", delay: "3s", duration: "8s" },
              { left: "75%", top: "80%", delay: "2s", duration: "6.5s" },
              { left: "50%", top: "15%", delay: "4s", duration: "9s" },
            ].map((p, i) => (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-full bg-[#1DBF73]/40 blur-xs"
                style={{
                  left: p.left,
                  top: p.top,
                  animation: `floatParticleDrift ${p.duration} infinite ease-in-out`,
                  animationDelay: p.delay,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Main Centered Floating Card (28px Radius) ── */}
        <div className="relative w-full max-w-md mx-auto rounded-[28px] border border-[#E5E7EB] dark:border-[var(--border)] bg-white/90 dark:bg-[var(--surface-strong)]/90 backdrop-blur-2xl p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.12)] text-center space-y-7 border-t border-t-[#1DBF73]/40 transition-all duration-300">
          
          {/* ── Logo Centerpiece with Dual Orbit & Ripples ── */}
          <div className="relative mx-auto h-24 w-24 flex items-center justify-center">
            
            {/* Soft Green Light Emission Ripple */}
            <span className="absolute inset-0 rounded-full bg-[#1DBF73]/20 animate-[rippleExpand_3s_infinite_ease-out]" />
            <span className="absolute inset-0 rounded-full bg-[#1DBF73]/15 animate-[rippleExpand_3s_infinite_ease-out]" style={{ animationDelay: '1s' }} />

            {/* Primary Orbit Ring */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full animate-[orbitRotate_2.5s_linear_infinite]"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(29, 191, 115, 0.15)"
                strokeWidth="3.5"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#1DBF73"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="70 200"
              />
            </svg>

            {/* Secondary Inner Accent Orbit Ring */}
            <svg
              viewBox="0 0 80 80"
              className="absolute inset-2 h-20 w-20 animate-[orbitRotateReverse_3.5s_linear_infinite]"
            >
              <circle
                cx="40"
                cy="40"
                r="33"
                fill="none"
                stroke="rgba(6, 182, 212, 0.2)"
                strokeWidth="2.5"
              />
              <circle
                cx="40"
                cy="40"
                r="33"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="40 160"
              />
            </svg>

            {/* Center Breathing Logo Badge */}
            <div className="relative h-13 w-13 rounded-2xl bg-gradient-to-tr from-[#1DBF73] to-[#10b981] flex items-center justify-center text-white shadow-[0_10px_25px_rgba(29,191,115,0.45)] animate-[logoBreathe_4s_infinite_ease-in-out]">
              <GraduationCap className="h-7 w-7 stroke-[2.2]" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-white animate-pulse" />
            </div>
          </div>

          {/* ── Brand Title & Cycling Status Messages ── */}
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-[#222325] dark:text-white">
              Skill<span className="amber-text-gradient">Swap</span>
            </h2>

            {/* Animated Loading Text Fade */}
            <div className="h-6 flex items-center justify-center">
              <p
                className={`text-xs font-extrabold uppercase tracking-widest text-[#1DBF73] transition-all duration-300 ${
                  fade ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                }`}
              >
                {MESSAGES[msgIndex]}
              </p>
            </div>
          </div>

          {/* ── Progress Component (Pill Shape with Shimmer & Counter) ── */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs font-bold px-1">
              <span className="text-[#62646A] dark:text-[var(--muted)] tracking-wide">Syncing Workspace</span>
              <span className="text-[#1DBF73] font-mono font-black">{progress}%</span>
            </div>

            {/* Pill Progress Bar */}
            <div className="h-2.5 w-full bg-[#F8FAFC] dark:bg-[var(--surface)] border border-[#E5E7EB] dark:border-[var(--border)] rounded-full overflow-hidden relative shadow-inner p-0.5">
              <div
                className="h-full rounded-full relative overflow-hidden transition-all duration-300 ease-out shadow-sm"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(135deg, #1DBF73 0%, #10b981 100%)",
                }}
              >
                {/* Shimmer Light Sweeper */}
                <div className="absolute inset-0 bg-white/40 animate-[shimmerSweep_1.5s_infinite]" />
              </div>
            </div>
          </div>

          {/* ── 3 Animated Status Items with Icons ── */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[var(--border)]">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[var(--surface)] border border-[#E5E7EB] dark:border-[var(--border)] transition hover:border-[#1DBF73]/40">
              <ShieldCheck className="h-4 w-4 text-[#1DBF73] animate-pulse" />
              <span className="text-[10px] font-bold text-[#62646A] dark:text-[var(--muted)] text-center leading-tight">
                Secure Connection
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[var(--surface)] border border-[#E5E7EB] dark:border-[var(--border)] transition hover:border-[#1DBF73]/40">
              <Zap className="h-4 w-4 text-amber-500 animate-[orbitRotate_4s_linear_infinite]" />
              <span className="text-[10px] font-bold text-[#62646A] dark:text-[var(--muted)] text-center leading-tight">
                Fast Sync
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[var(--surface)] border border-[#E5E7EB] dark:border-[var(--border)] transition hover:border-[#1DBF73]/40">
              <Cpu className="h-4 w-4 text-cyan-500 animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="text-[10px] font-bold text-[#62646A] dark:text-[var(--muted)] text-center leading-tight">
                Smart Optimization
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}