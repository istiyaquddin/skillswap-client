"use client";

import React from "react";
import { CreditCard, ArrowLeft, Lock, Layers, Calendar } from "lucide-react";

const SecureCheckoutView = ({ proposal, onBack }) => {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8 text-[var(--text)] min-h-screen font-sans">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-amber-400 transition-all mb-10 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        Back to proposals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশ - Total Payable */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl amber-gradient amber-glow flex items-center justify-center text-white font-black text-xs tracking-wider shadow-md">
              FT
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider uppercase text-[var(--text)]">SkillSwap Terminal</h2>
              <p className="text-[9px] text-[var(--muted)] font-bold tracking-widest uppercase">Secure Escrow System</p>
            </div>
          </div>

          <div className="p-6 glass-panel rounded-2xl shadow-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] block mb-1">Total Payable</span>
            <div className="flex items-baseline gap-1 text-amber-400">
              <span className="text-5xl font-black tracking-tight">${proposal.proposedBudget}</span>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">USD</span>
            </div>
          </div>
        </div>

        {/* ডান পাশ - Parameters & Checkout Form */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 border-b border-[var(--border)] pb-4">
              <Layers className="w-3.5 h-3.5" />
              Contract Parameters
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block">Project Title</span>
                <p className="text-base font-bold leading-snug text-[var(--text)]">{proposal.taskTitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border)] pt-5">
                {/* Freelancer Box */}
                <div className="p-4 bg-[var(--surface-strong)] rounded-xl border border-[var(--border)]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block mb-1">Freelancer</span>
                  <span className="text-[var(--text)] text-xs font-bold block truncate">{proposal.freelancerEmail}</span>
                </div>
                
                {/* Timeline Box */}
                <div className="p-4 bg-[var(--surface-strong)] rounded-xl border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)] block mb-1">Timeline Setup</span>
                    <span className="text-[var(--text)] text-xs font-extrabold block">{proposal.estimatedDays} Days</span>
                  </div>
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Form Submission */}
          <div className="mt-10 pt-6 border-t border-[var(--border)] space-y-4">
            <form action={"/api/payment"} method="POST">
              <input type="hidden" name="price" value={proposal.proposedBudget} />
              <input type="hidden" name="title" value={proposal.taskTitle} />
              <input type="hidden" name="taskId" value={proposal.taskId} />
              <input type="hidden" name="proposalId" value={proposal.proposalId} />
              
              <button
                type="submit"
                className="w-full amber-gradient amber-glow shine-button text-white font-extrabold py-4 px-4 rounded-full text-xs uppercase tracking-widest transition-all active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Authorize & Pay ${proposal.proposedBudget}</span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-[9px] opacity-40 font-bold tracking-widest uppercase text-inherit">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Secured encryption by Stripe network</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecureCheckoutView;