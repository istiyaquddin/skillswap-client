"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Users,
  Percent,
  Check,
  X,
  Sparkles,
  HelpCircle,
  GraduationCap,
  Award,
} from "lucide-react";

export default function WhyChooseUs() {
  const [selectedPillar, setSelectedPillar] = useState(0);

  const pillars = [
    {
      title: "0% Freelancer Cuts",
      badge: "Fair Pay",
      icon: Percent,
      description:
        "Unlike commercial platforms that take 10% to 20% of student earnings, SkillSwap delivers 100% of your agreed price straight to your wallet.",
      metric: "100%",
      metricLabel: "Payout to Freelancer",
    },
    {
      title: "Stripe Escrow Security",
      badge: "Guaranteed Pay",
      icon: ShieldCheck,
      description:
        "Clients deposit funds upfront with Stripe. Money is safely held in escrow and released only when the deliverable is reviewed and approved.",
      metric: "$0",
      metricLabel: "Risk of Unpaid Invoices",
    },
    {
      title: "Campus Verified Talent",
      badge: "Peer Trust",
      icon: GraduationCap,
      description:
        "Every freelancer is linked to authenticated university student credentials and github/portfolio track records. No anonymous spam accounts.",
      metric: "100%",
      metricLabel: "Student Peer Verified",
    },
    {
      title: "Fast 48-Hour Gigs",
      badge: "Agile Delivery",
      icon: Zap,
      description:
        "Designed specifically for high-velocity tasks like bug fixes, slide decks, landing pages, and content sprints without bureaucratic delays.",
      metric: "48h",
      metricLabel: "Average Completion",
    },
  ];

  const comparison = [
    {
      feature: "Platform Service Fees",
      skillswap: "0% for student earners",
      others: "Up to 20% commission fee",
      advantage: true,
    },
    {
      feature: "Identity & Academic Verification",
      skillswap: "Verified campus student badges",
      others: "Unverified anonymous profiles",
      advantage: true,
    },
    {
      feature: "Payment Escrow Mechanism",
      skillswap: "Automated Stripe Escrow protection",
      others: "Manual or delayed 14-day holds",
      advantage: true,
    },
    {
      feature: "Task Turnaround Speed",
      skillswap: "Optimized for 24-48h agile gigs",
      others: "Long weeks of proposal review",
      advantage: true,
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="about">
      <div className="relative mx-auto w-[95%] lg:w-[78%] space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="section-badge mb-3">
            <Award className="h-3.5 w-3.5 text-[#1dbf73]" />
            Why Choose SkillSwap
          </div>
          <h2 className="section-title">
            Built by Students, <span className="amber-text-gradient">For Students</span>
          </h2>
          <p className="section-desc">
            Learn why hundreds of campus developers, designers, and clients rely on SkillSwap.
          </p>
        </div>

        {/* Interactive Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedPillar(index)}
                className={`glass-panel rounded-[2rem] p-6 text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? "border-[#1dbf73] shadow-[0_12px_32px_rgba(29,191,115,0.22)] -translate-y-2 scale-[1.02]"
                    : "hover:border-[#1dbf73]/40 hover:-translate-y-1"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isSelected
                        ? "bg-[#1dbf73] text-white"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[#1dbf73]"
                    } shadow-md transition-colors`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1dbf73]/10 text-[#1dbf73] border border-[#1dbf73]/20">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[var(--text)] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                  {pillar.description}
                </p>

                <div className="pt-3 border-t border-[var(--border)] flex justify-between items-baseline relative z-10">
                  <span className="text-xl font-black text-[#1dbf73] font-mono">
                    {pillar.metric}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--muted)]">
                    {pillar.metricLabel}
                  </span>
                </div>

                {/* Credosis-style oversized watermark number */}
                <span className="absolute -bottom-3 -right-1 text-6xl font-black font-mono text-[var(--muted)]/10 select-none pointer-events-none">
                  0{index + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Comparison Matrix */}
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-strong)]/80 backdrop-blur-xl p-6 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-[var(--text)]">
              SkillSwap vs. Commercial Platforms
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              See how we provide a better, safer, and cheaper experience for universities.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] uppercase tracking-wider text-[11px]">
                  <th className="pb-4 font-bold">Key Capability</th>
                  <th className="pb-4 font-black text-[#1dbf73]">SkillSwap Campus</th>
                  <th className="pb-4 font-bold text-[var(--muted)]">Legacy Freelance Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {comparison.map((item, i) => (
                  <tr key={i} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="py-4 font-semibold text-[var(--text)]">
                      {item.feature}
                    </td>
                    <td className="py-4 font-bold text-[#1dbf73] flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#1dbf73] shrink-0" />
                      {item.skillswap}
                    </td>
                    <td className="py-4 text-[var(--muted)]">
                      {item.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
