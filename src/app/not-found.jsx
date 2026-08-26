"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";

// Floating particles for ambient background
const PARTICLES = [
  { x: 8, y: 12, size: 1.5, opacity: 0.4 },
  { x: 92, y: 18, size: 1, opacity: 0.3 },
  { x: 22, y: 78, size: 2, opacity: 0.25 },
  { x: 78, y: 82, size: 1.5, opacity: 0.35 },
  { x: 45, y: 6, size: 1, opacity: 0.3 },
  { x: 15, y: 45, size: 2.5, opacity: 0.2 },
  { x: 85, y: 52, size: 1.5, opacity: 0.3 },
  { x: 60, y: 90, size: 1, opacity: 0.25 },
  { x: 33, y: 30, size: 1, opacity: 0.2 },
  { x: 72, y: 35, size: 2, opacity: 0.15 },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-[var(--text)] font-sans">

      {/* ── Ambient background glow ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Central amber glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        {/* Secondary orange glow */}
        <div className="absolute left-1/4 top-1/4 w-[300px] h-[300px] rounded-full bg-orange-500/5 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating star particles */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.size * 0.15}
              fill="#f59e0b"
              opacity={p.opacity}
            />
          ))}
        </svg>
      </div>

      {/* ── Double frame border ── */}
      <div className="pointer-events-none absolute inset-4 rounded-[2.5rem] border border-amber-500/15" />
      <div className="pointer-events-none absolute inset-7 rounded-[2rem] border border-amber-500/8" />

      {/* ── Corner coordinate labels ── */}
      <div className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400/30">
        <span className="absolute left-8 top-8">SYS · ERR</span>
        <span className="absolute right-8 top-8">HTTP · 404</span>
        <span className="absolute bottom-8 left-8">ROUTE · LOST</span>
        <span className="absolute bottom-8 right-8">NULL · REF</span>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

        {/* ── Giant "404" with smiley ── */}
        <div className="relative select-none mb-2">
          <div
            className="text-[9rem] sm:text-[13rem] md:text-[15rem] font-black leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 60px rgba(245,158,11,0.3))",
            }}
          >
            4
            {/* Smiley "0" */}
            <span className="relative inline-block">
              <svg
                viewBox="0 0 120 120"
                className="inline-block"
                style={{
                  width: "0.75em",
                  height: "0.9em",
                  verticalAlign: "middle",
                  marginBottom: "0.05em",
                }}
              >
                {/* Outer ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#amberGrad)"
                  strokeWidth="9"
                />
                {/* Smiley face */}
                {/* Left eye */}
                <circle cx="42" cy="48" r="6" fill="#f59e0b" />
                {/* Right eye */}
                <circle cx="78" cy="48" r="6" fill="#f59e0b" />
                {/* Smile arc */}
                <path
                  d="M36 72 Q60 94 84 72"
                  stroke="#f59e0b"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Cheek blush dots */}
                <circle cx="28" cy="66" r="3.5" fill="#f97316" opacity="0.6" />
                <circle cx="92" cy="66" r="3.5" fill="#f97316" opacity="0.6" />
                <defs>
                  <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            4
          </div>

          {/* Ambient glow under the 404 */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3/4 h-8 bg-amber-500/20 blur-2xl rounded-full" />
        </div>

        {/* ── "Page not found" badge ── */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-400 backdrop-blur-sm">
          <AlertCircle className="w-3.5 h-3.5" />
          Page not found
        </div>

        {/* ── Headline ── */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--text)] mb-4">
          Oops! This page{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #f59e0b, #d97706)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            doesn&apos;t exist
          </span>
        </h1>

        {/* ── Description ── */}
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-md leading-relaxed mb-8">
          The page you&apos;re looking for may have been moved, deleted, or never existed.
          Let&apos;s get you back on track.
        </p>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
          <Link
            href="/"
            className="amber-gradient amber-glow inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/browse-task"
            className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-7 py-3.5 text-sm font-bold text-[var(--text)] transition hover:border-amber-400 hover:text-amber-400 active:scale-95"
          >
            <Search className="w-4 h-4" />
            Browse Tasks
          </Link>
        </div>

        {/* ── Quick nav links ── */}
        <div className="flex items-center gap-6 text-xs font-semibold text-[var(--muted)]">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-[var(--muted)] opacity-40" />
          <Link href="/browse-freelancer" className="hover:text-amber-400 transition-colors">Browse Freelancers</Link>
          <span className="w-1 h-1 rounded-full bg-[var(--muted)] opacity-40" />
          <button onClick={() => router.back()} className="hover:text-amber-400 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Go Back
          </button>
        </div>
      </div>

      {/* ── Inline keyframes for smiley float ── */}
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes nf-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>
    </main>
  );
}
