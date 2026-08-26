"use client";

import React from "react";
import { Briefcase, MapPin, DollarSign, Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full-Stack Engineer",
      dept: "Engineering",
      type: "Full-Time",
      location: "Remote / Boston, MA",
      salary: "$140K - $170K + Equity",
    },
    {
      title: "Lead Product Designer (UI/UX)",
      dept: "Design",
      type: "Full-Time",
      location: "Remote",
      salary: "$120K - $150K + Equity",
    },
    {
      title: "Campus Growth Manager",
      dept: "Marketing",
      type: "Full-Time",
      location: "New York / Remote",
      salary: "$90K - $115K",
    },
    {
      title: "Smart Contract & Security Lead",
      dept: "Engineering",
      type: "Full-Time",
      location: "Remote",
      salary: "$150K - $180K + Equity",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-16 font-sans text-[var(--text)]">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4" /> We Are Hiring Innovators
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--text)]">
          Shape the Future of <span className="amber-text-gradient">Student Work</span>
        </h1>
        <p className="text-base text-[var(--muted)] font-medium leading-relaxed">
          At SkillSwap, we&apos;re building the infrastructure that helps millions of students turn technical skills into thriving freelance careers. Join our high-growth global team.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Remote-First Culture", desc: "Work from anywhere in the world with flexible hours and asynchronous communication." },
          { title: "Competitive Equity & Pay", desc: "Industry-leading salary packages, equity grants, and generous 401(k) matching." },
          { title: "Unlimited Learning Stipend", desc: "$2,500 annual budget for courses, conferences, tech equipment, and books." },
        ].map((perk, idx) => (
          <div key={idx} className="glass-panel rounded-[2.5rem] p-6 space-y-3 border border-[var(--border)]">
            <CheckCircle2 className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-[var(--text)]">{perk.title}</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">{perk.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Positions List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-[var(--text)]">Open Positions ({openPositions.length})</h2>

        <div className="grid gap-4">
          {openPositions.map((job, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--border)] hover:border-amber-500/40 transition group"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {job.dept}
                  </span>
                  <span className="text-xs font-bold text-[var(--muted)]">{job.type}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-amber-400 transition">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {job.salary}</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="amber-gradient amber-glow inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-extrabold text-xs uppercase tracking-widest transition hover:scale-105 shrink-0"
              >
                Apply Now <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
