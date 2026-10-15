"use client";

import { useState } from "react";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Users,
  Zap,
  Sparkles,
  CreditCard,
  Send,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState("client");

  const clientSteps = [
    {
      number: "01",
      title: "Post Your Task",
      description:
        "Describe your project requirement, set your budget, select deadline, and publish in under 2 minutes.",
      icon: FileText,
      accent: "from-[#1dbf73] to-[#17a862]",
      badge: "Fast & Free",
    },
    {
      number: "02",
      title: "Review Bids & Fund Escrow",
      description:
        "Compare proposals from verified student talent, review previous portfolios, and lock funds safely in Stripe escrow.",
      icon: CreditCard,
      accent: "from-[#1dbf73] to-blue-500",
      badge: "Stripe Secured",
    },
    {
      number: "03",
      title: "Approve & Complete",
      description:
        "Inspect the completed project deliverable URL or code repository. Release funds once you are 100% satisfied.",
      icon: ShieldCheck,
      accent: "from-blue-500 to-indigo-500",
      badge: "Instant Release",
    },
  ];

  const freelancerSteps = [
    {
      number: "01",
      title: "Browse Campus Tasks",
      description:
        "Explore open bug fixes, design sprints, and marketing gigs matched to your specific tech stack and university timetable.",
      icon: Briefcase,
      accent: "from-emerald-400 to-[#1dbf73]",
      badge: "Tailored Gigs",
    },
    {
      number: "02",
      title: "Submit Proposal",
      description:
        "Place your bid with an estimated turnaround time and deliverable outline. Only verified accounts can apply.",
      icon: Send,
      accent: "from-[#1dbf73] to-cyan-500",
      badge: "Fair Bidding",
    },
    {
      number: "03",
      title: "Deliver & Get Paid",
      description:
        "Submit your work URL directly on the dashboard. Once approved, earnings are credited immediately with 0% platform fee.",
      icon: Zap,
      accent: "from-cyan-500 to-teal-500",
      badge: "0% Commission",
    },
  ];

  const steps = activeRole === "client" ? clientSteps : freelancerSteps;

  return (
    <section className="relative py-16 md:py-24" id="how-it-works">
      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="section-badge mb-3">
            <Zap className="h-3.5 w-3.5 text-[#1dbf73]" />
            Simple 3-Step Process
          </div>
          <h2 className="section-title">
            How <span className="amber-text-gradient">SkillSwap</span> Works
          </h2>
          <p className="section-desc">
            A seamless workflow designed for campus collaboration and guaranteed security.
          </p>

          {/* Dynamic Role Switcher */}
          <div className="mt-6 sm:mt-8 inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[var(--surface-strong)] border border-[var(--border)] shadow-md max-w-full">
            <button
              onClick={() => setActiveRole("client")}
              className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeRole === "client"
                  ? "bg-[#1dbf73] text-white shadow-[0_4px_16px_rgba(29,191,115,0.4)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              For Clients <span className="hidden sm:inline">(Post Tasks)</span>
            </button>
            <button
              onClick={() => setActiveRole("freelancer")}
              className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeRole === "freelancer"
                  ? "bg-[#1dbf73] text-white shadow-[0_4px_16px_rgba(29,191,115,0.4)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              For Freelancers <span className="hidden sm:inline">(Earn Money)</span>
            </button>
          </div>
        </div>

        {/* Step Cards */}
        <div className="relative grid gap-5 sm:gap-8 md:grid-cols-3">
          {/* Connector Line (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px bg-gradient-to-r from-[#1dbf73]/30 via-[#1dbf73]/60 to-[#1dbf73]/30" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#1dbf73]/40 hover:shadow-2xl group block cursor-pointer"
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md`}
                  >
                    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-4xl font-black text-[var(--muted)]/20 group-hover:text-[#1dbf73]/30 transition-colors select-none font-mono">
                    {step.number}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#1dbf73]/10 text-[#1dbf73] border border-[#1dbf73]/20">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--text)] mb-3 group-hover:text-[#1dbf73] transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Action Button */}
        <div className="mt-12 text-center">
          <Link
            href={
              activeRole === "client"
                ? "/dashboard/client/tasks/post-task"
                : "/browse-task"
            }
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1.5 transition-all duration-300 focus-visible:outline-none cursor-pointer bg-gradient-to-r from-[#1dbf73] to-[#10b981] text-white shadow-[0_6px_25px_rgba(29,191,115,0.4)] hover:shadow-[0_10px_35px_rgba(29,191,115,0.6)] hover:scale-105 active:scale-95 pl-7 pr-2 py-2.5 text-sm font-bold"
          >
            <span className="pr-3">
              {activeRole === "client" ? "Post a Task Now" : "Find Open Projects"}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1dbf73] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
