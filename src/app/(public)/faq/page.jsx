"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ShieldCheck, Zap, DollarSign, Lock } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does SkillSwap Escrow work?",
      a: "When a client hires a freelancer, the project budget is deposited into SkillSwap's automated escrow vault powered by Stripe. Funds remain locked until the freelancer submits project deliverables and the client approves the milestone.",
    },
    {
      q: "Are there platform fees for student freelancers?",
      a: "No! SkillSwap operates on a student-first zero platform fee model. Freelancers keep 100% of their proposed project budget.",
    },
    {
      q: "What happens if a project milestone is disputed?",
      a: "If a dispute arises, our dedicated campus arbitration panel reviews the task requirements, submitted deliverable files, and message logs to resolve the issue fairly within 24-48 hours.",
    },
    {
      q: "How do I get verified as a student freelancer?",
      a: "Complete your profile, connect your campus email or GitHub/portfolio links, and submit at least 2 skill samples for review by our automated verification system.",
    },
    {
      q: "What payment methods are supported for clients?",
      a: "Clients can pay securely using credit cards, debit cards, Apple Pay, Google Pay, or direct ACH bank transfer through Stripe.",
    },
    {
      q: "Can clients edit or cancel task opportunities?",
      a: "Yes! Clients can edit task titles, budgets, and deadlines or cancel open tasks as long as a freelancer proposal has not been accepted into active escrow status.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12 font-sans text-[var(--text)]">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Everything You Need to <span className="amber-text-gradient">Know</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] font-medium">
          Have a question about escrow, freelancing, or client postings? Find quick answers below.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-[2rem] border border-[var(--border)] overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-6 text-left font-bold text-base md:text-lg flex items-center justify-between gap-4 cursor-pointer text-[var(--text)]"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-[var(--muted)] leading-relaxed font-medium border-t border-[var(--border)] pt-4 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="glass-panel rounded-[2.5rem] p-8 text-center space-y-4 border border-amber-500/30">
        <h3 className="text-xl font-bold text-[var(--text)]">Still Have Questions?</h3>
        <p className="text-xs text-[var(--muted)] font-medium max-w-md mx-auto">
          Our support team is available 24/7 to answer any technical or account queries.
        </p>
        <Link
          href="/contact"
          className="amber-gradient amber-glow inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs font-black uppercase tracking-widest transition hover:scale-105"
        >
          Contact Support Desk
        </Link>
      </div>

    </div>
  );
}
