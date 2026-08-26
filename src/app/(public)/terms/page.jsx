"use client";

import React from "react";
import { FileText, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10 font-sans text-[var(--text)]">
      
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--border)] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
          <Scale className="w-4 h-4" /> Legal Terms & Platform Agreement
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Terms of <span className="amber-text-gradient">Service</span>
        </h1>
        <p className="text-xs text-[var(--muted)] font-mono">
          Effective Date: August 26, 2026 • SkillSwap Campus Network Protocol
        </p>
      </div>

      {/* Terms Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)] font-medium">
        
        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the SkillSwap web application, creating an account, or interacting with milestone tasks and escrow payouts, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2. Escrow & Payment Processing
          </h2>
          <p>
            All monetary funds deposited for task hiring are securely processed and held in escrow via Stripe. Funds are released to the freelancer upon successful milestone deliverable confirmation by the client.
          </p>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" /> 3. Code of Conduct & Dispute Resolution
          </h2>
          <p>
            Users must maintain professional conduct. Any harassment, deliberate submission of malicious code, or off-platform payment attempts will result in immediate account restriction. Disputes are arbitrated by SkillSwap&apos;s mediation team.
          </p>
        </section>

      </div>

    </div>
  );
}
