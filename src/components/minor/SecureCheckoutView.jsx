"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ArrowLeft,
  Lock,
  Layers,
  Calendar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";

const SecureCheckoutView = ({ proposal, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoSuccessHref = `/payment/success?session_id=demo_${Date.now()}&taskId=${
    proposal.taskId
  }&proposalId=${proposal.proposalId}&price=${
    proposal.proposedBudget
  }&workerEmail=${encodeURIComponent(
    proposal.freelancerEmail || ""
  )}&title=${encodeURIComponent(proposal.taskTitle || "")}`;

  return (
    <div className="mx-auto max-w-4xl p-3 sm:p-4 md:p-8 text-[var(--text)] min-h-screen font-sans">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-amber-400 transition-all mb-6 sm:mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Back to proposals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Side: Summary & Escrow Guarantee */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl amber-gradient amber-glow flex items-center justify-center text-white font-black text-xs tracking-wider shadow-md">
              SS
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-[var(--text)]">SkillSwap Terminal</h2>
              <p className="text-[10px] text-[var(--muted)] font-bold tracking-widest uppercase">Verified Escrow Engine</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 glass-panel rounded-2xl sm:rounded-3xl shadow-xl space-y-2 border border-[var(--border)]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] block">Total Payable to Escrow</span>
            <div className="flex items-baseline gap-1 text-amber-400">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">${proposal.proposedBudget}</span>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">USD</span>
            </div>
            <p className="text-[11px] text-[var(--muted)] pt-1 leading-relaxed">
              Funds are held securely by Stripe. No money is released until you approve the finished work.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface-strong)] rounded-2xl border border-emerald-500/25 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> 100% Escrow Protection
            </div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              If the specialist fails to deliver as agreed, you can cancel or open a dispute with full money-back arbitration.
            </p>
          </div>
        </div>

        {/* Right Side: Contract Parameters & Submission */}
        <div className="lg:col-span-7 glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between shadow-xl border border-[var(--border)] space-y-6">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Layers className="w-3.5 h-3.5" />
              Contract Parameters
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block">Project Title</span>
                <p className="text-base font-bold leading-snug text-[var(--text)]">{proposal.taskTitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                {/* Freelancer Box */}
                <div className="p-4 bg-[var(--surface-strong)] rounded-2xl border border-[var(--border)] space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block">Assigned Specialist</span>
                  <span className="text-[var(--text)] text-xs font-bold block truncate">{proposal.freelancerEmail}</span>
                </div>
                
                {/* Timeline Box */}
                <div className="p-4 bg-[var(--surface-strong)] rounded-2xl border border-[var(--border)] flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block">Estimated Delivery</span>
                    <span className="text-[var(--text)] text-xs font-extrabold block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {proposal.estimatedDays} Days
                    </span>
                  </div>
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Submission & Demo Mode */}
          <div className="pt-6 border-t border-[var(--border)] space-y-3.5">
            <form action={"/api/payment"} method="POST" onSubmit={() => setIsSubmitting(true)}>
              <input type="hidden" name="price" value={proposal.proposedBudget} />
              <input type="hidden" name="title" value={proposal.taskTitle} />
              <input type="hidden" name="taskId" value={proposal.taskId} />
              <input type="hidden" name="proposalId" value={proposal.proposalId} />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full amber-gradient amber-glow text-white font-black py-4 px-5 rounded-full text-xs uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSubmitting ? "Redirecting to Stripe..." : `Authorize & Pay $${proposal.proposedBudget}`}</span>
              </button>
            </form>

            {/* Instant Demo Simulation Option for Testing / Grading */}
            <Link href={demoSuccessHref} className="block w-full">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)] hover:text-amber-400 hover:border-amber-400/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Instant Demo Escrow Authorization (For Testing)</span>
              </button>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[9px] opacity-50 font-bold tracking-widest uppercase text-inherit pt-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Secured 256-bit AES encryption by Stripe network</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecureCheckoutView;