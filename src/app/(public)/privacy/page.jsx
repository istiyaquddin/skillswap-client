"use client";

import React from "react";
import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-10 font-sans text-[var(--text)]">
      
      {/* Header */}
      <div className="space-y-4 border-b border-[var(--border)] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <Shield className="w-4 h-4" /> Data Protection & Privacy Standard
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Privacy <span className="amber-text-gradient">Policy</span>
        </h1>
        <p className="text-xs text-[var(--muted)] font-mono">
          Last Updated: August 26, 2026 • Version 2.4 (GDPR & FERPA Compliant)
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-[var(--muted)] font-medium">
        
        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> 1. Information We Collect
          </h2>
          <p>
            When you register an account on SkillSwap, authenticate via Google OAuth or Better-Auth, or post/apply for freelance opportunities, we collect information including your full name, email address, avatar photo, campus affiliation, and transaction records.
          </p>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" /> 2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To verify campus affiliation and student/client credentials.</li>
            <li>To facilitate escrow payments and Stripe payment settlements.</li>
            <li>To enable real-time messaging and deliverable submissions.</li>
            <li>To prevent fraud, platform abuse, and unauthorized access.</li>
          </ul>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> 3. Data Protection & Encryption
          </h2>
          <p>
            SkillSwap uses industry-standard 256-bit SSL encryption, tokenized authentication headers, and zero-knowledge database indexing. We never sell your personal data to third-party advertisers.
          </p>
        </section>

        <section className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-3 border border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4. Your Rights
          </h2>
          <p>
            You have the right to request access to, update, or permanently delete your account data at any time by contacting support@skillswap.edu.
          </p>
        </section>

      </div>

    </div>
  );
}
