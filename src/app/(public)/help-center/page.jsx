"use client";

import React, { useState } from "react";
import { Search, Shield, CreditCard, UserCheck, FileText, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: CreditCard,
      title: "Payments & Escrow",
      desc: "Milestone deposits, Stripe checkout, payouts, and dispute protection.",
      articles: ["How milestone escrow works", "Supported payment gateways", "Requesting a refund"],
    },
    {
      icon: UserCheck,
      title: "Account & Profile",
      desc: "Updating credentials, verifying student status, and avatar setup.",
      articles: ["Verifying campus email", "Updating portfolio skills", "Managing notification settings"],
    },
    {
      icon: FileText,
      title: "Tasks & Proposals",
      desc: "Posting task requirements, submitting pitches, and deliverable review.",
      articles: ["Writing high-converting pitches", "Editing open task details", "Submitting deliverable links"],
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      desc: "Security guidelines, community standards, and arbitration policies.",
      articles: ["Avoiding off-platform scams", "Dispute resolution workflow", "Privacy & data protection"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12 font-sans text-[var(--text)]">
      
      {/* Search Header */}
      <div className="glass-panel rounded-[3rem] p-8 md:p-12 text-center space-y-6 border border-amber-500/30 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-[var(--text)]">
            How Can We <span className="amber-text-gradient">Help You Today?</span>
          </h1>
          <p className="text-sm text-[var(--muted)] font-medium">
            Search our knowledge base or browse help topics below.
          </p>
        </div>

        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-amber-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles (e.g. escrow, payouts, proposals)..."
            className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Help Categories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-[2.5rem] p-8 space-y-4 border border-[var(--border)] hover:border-amber-500/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text)] group-hover:text-amber-400 transition">{cat.title}</h2>
              </div>
              <p className="text-xs text-[var(--muted)] font-medium leading-relaxed">{cat.desc}</p>

              <ul className="space-y-2 pt-2 border-t border-[var(--border)]">
                {cat.articles.map((art, aIdx) => (
                  <li key={aIdx}>
                    <Link href="/faq" className="text-xs font-bold text-[var(--text)] hover:text-amber-400 flex items-center justify-between group/link">
                      <span>{art}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

    </div>
  );
}
