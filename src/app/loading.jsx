"use client";

import { Sparkles, Zap, User, Briefcase, Compass } from "lucide-react";

const STEPS = [
  { label: "Initializing workspace", icon: Zap, color: "text-amber-400" },
  { label: "Loading your profile", icon: User, color: "text-emerald-400" },
  { label: "Fetching tasks & proposals", icon: Briefcase, color: "text-amber-400" },
  { label: "Almost there", icon: Sparkles, color: "text-amber-300" },
];

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.65);
            opacity: 0.4;
          }
        }

        @keyframes progress {
          0% {
            width: 10%;
          }
          100% {
            width: 95%;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-grid-pattern px-4">
        <div className="relative w-full max-w-sm mx-auto rounded-[2.5rem] border border-amber-500/20 bg-[var(--surface-strong)]/85 backdrop-blur-2xl p-8 shadow-2xl animate-[fadeUp_.5s_ease]">
          {/* Logo & Ring Spinner */}
          <div className="animate-[float_3s_ease-in-out_infinite]">
            <div className="relative mx-auto mb-6 h-20 w-20 flex items-center justify-center">
              <svg
                viewBox="0 0 80 80"
                className="absolute inset-0 h-full w-full animate-[spin_1.4s_linear_infinite]"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="rgba(245,158,11,.15)"
                  strokeWidth="3"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="55 171"
                />
              </svg>

              <svg
                viewBox="0 0 60 60"
                className="absolute inset-2.5 h-15 w-15 animate-[spinReverse_2s_linear_infinite]"
              >
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="rgba(16,185,129,.15)"
                  strokeWidth="2"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="20 143"
                />
              </svg>

              <div className="amber-gradient amber-glow h-11 w-11 rounded-full flex items-center justify-center text-white shadow-lg">
                <span className="text-xl font-black">S</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">
              Skill<span className="text-amber-400">Swap</span>
            </h2>

            <p className="mt-1.5 text-[11px] font-extrabold tracking-widest text-amber-400/90 uppercase">
              Setting up your workspace...
            </p>
          </div>

          {/* Steps List */}
          <div className="mt-6 space-y-2.5">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 transition duration-200"
                >
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-[pulseDot_.9s_ease-in-out_infinite]" />
                  <Icon className={`h-4 w-4 ${step.color}`} />
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span className="text-[var(--muted)]">Loading</span>
              <span className="text-amber-400">Please wait</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)] border border-[var(--border)]">
              <div className="amber-gradient h-full rounded-full animate-[progress_3s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}