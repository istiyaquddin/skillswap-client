"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  FileText,
  Briefcase,
} from "lucide-react";
import ThemeToggle from "@/components/minor/ThemeToggle";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Authorization was cancelled by client.";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-4 antialiased font-sans relative selection:bg-amber-500/20 selection:text-amber-500">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[140px]" />
      </div>

      {/* Top Header Row with Theme Toggle */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between z-10">
        <Link href="/">
          <span className="text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition cursor-pointer">
            ← Return to SkillSwap Home
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-9 text-center shadow-2xl relative overflow-hidden space-y-6 z-10 border border-[var(--border)] animate-in fade-in duration-300">
        
        {/* Cancelled Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg">
          <XCircle className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full border border-rose-500/20 mb-2">
            Transaction Incomplete
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
            Escrow Authorization Cancelled
          </h1>
          <p className="text-xs text-[var(--muted)] font-medium max-w-xs mx-auto leading-relaxed">
            No funds have been debited from your card. Your proposal contract remains pending and can be authorized at any time.
          </p>
        </div>

        {/* Reason card */}
        <div className="p-4 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-[var(--muted)] font-bold text-[10px] uppercase tracking-wider">
            <span>Status Notice</span>
            <span className="text-rose-400">Not Charged</span>
          </div>
          <p className="text-[var(--text)] font-semibold text-xs leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <Link href="/dashboard/client/proposals" className="block w-full">
            <button className="w-full py-3.5 px-6 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <RotateCcw size={15} />
              <span>Return to Proposal & Retry</span>
            </button>
          </Link>

          <Link href="/dashboard/client" className="block w-full">
            <button className="w-full py-3 px-6 border border-[var(--border)] bg-[var(--surface-strong)] rounded-full text-xs font-bold text-[var(--muted)] hover:text-amber-400 hover:border-amber-400/40 transition cursor-pointer flex items-center justify-center gap-2">
              <Briefcase size={14} />
              Return to Client Workspace
            </button>
          </Link>
        </div>

        <p className="text-[10px] text-[var(--muted)]">
          Need assistance with Stripe checkout or campus escrow?{" "}
          <Link href="/privacy" className="underline hover:text-amber-400">
            Read Escrow FAQ
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
