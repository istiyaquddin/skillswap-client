"use client";

import React from "react";
import { GraduationCap, ShieldCheck, Zap, Users, Sparkles, Heart, Globe, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16 font-sans text-[var(--text)]">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-md">
          <Sparkles className="w-4 h-4 animate-pulse" /> Reimagining Campus Talent & Skill Exchange
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text)] leading-tight">
          Empowering Students to <span className="amber-text-gradient">Learn, Earn & Build</span> Together
        </h1>
        
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed font-medium">
          SkillSwap is the premier peer-to-peer campus freelancing platform connecting student developers, designers, and creators with real-world projects and escrow-secured milestone payments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Skills Exchanged", value: "12,400+", sub: "Across 45+ Campuses" },
          { label: "Escrow Vault Security", value: "100%", sub: "Stripe Escrow Protected" },
          { label: "Vetted Freelancers", value: "3,800+", sub: "Verified Students & Alumni" },
          { label: "Community Rating", value: "4.95 / 5.0", sub: "Based on 8,200+ Reviews" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel rounded-[2rem] p-6 text-center space-y-1 border border-[var(--border)] shadow-lg hover:border-amber-500/40 transition">
            <h3 className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">{stat.value}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">{stat.label}</p>
            <p className="text-[10px] text-[var(--muted)] font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Core Mission Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-[var(--text)]">
            Our Core <span className="amber-text-gradient">Pillars</span>
          </h2>
          <p className="text-xs md:text-sm text-[var(--muted)] max-w-lg mx-auto">
            Built by students, for students — creating financial freedom and career portfolios before graduation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-[2.5rem] p-8 space-y-4 border border-[var(--border)] hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">Smart Escrow Protection</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed font-medium">
              Client funds are safely held in escrow before work begins and released instantly upon milestone deliverable approval.
            </p>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-8 space-y-4 border border-[var(--border)] hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">Verified Campus Talent</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed font-medium">
              Every freelancer is peer-reviewed with real portfolio deliverables, skill badges, and campus accreditation.
            </p>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-8 space-y-4 border border-[var(--border)] hover:border-amber-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">Zero Platform Friction</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed font-medium">
              Transparent project pricing, direct client-freelancer messaging, and automated milestone tracking.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-panel rounded-[3rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden border border-amber-500/30">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text)]">Ready to Swap Skills & Elevate Your Portfolio?</h2>
          <p className="text-sm text-[var(--muted)] max-w-lg mx-auto font-medium">
            Join thousands of student creators posting tasks, hiring freelancers, and building the future.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/browse-task"
            className="amber-gradient amber-glow shine-button px-8 py-3.5 rounded-full text-white font-extrabold text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg transition hover:scale-105"
          >
            Explore Open Tasks <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-full border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--text)] hover:bg-[var(--surface-strong)] transition"
          >
            Join as Freelancer
          </Link>
        </div>
      </div>

    </div>
  );
}
